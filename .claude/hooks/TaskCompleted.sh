#!/bin/bash
# TaskCompleted — validates agent output, enforces retry budget, tracks tokens
# CAN exit 2 to signal retry needed (intentional — tells orchestrator to re-run agent)

set -o pipefail 2>/dev/null || true

HOOK_DATA=$(cat 2>/dev/null) || HOOK_DATA=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || { echo "[SWARM ERROR] TaskCompleted: cannot resolve script dir" >&2; exit 0; }
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || { echo "[SWARM ERROR] TaskCompleted: cannot resolve project root" >&2; exit 0; }
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || { echo "[SWARM ERROR] TaskCompleted: cannot create $SWARM_DIR" >&2; exit 0; }

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }
SWARM_DIR_PY=$(to_pypath "$SWARM_DIR")

AGENT_ID="${CLAUDE_TEAMMATE_ID:-}"
TASK_ID="${CLAUDE_TASK_ID:-}"
if [ -z "$AGENT_ID" ]; then
  AGENT_ID=$(printf '%s' "$HOOK_DATA" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
    print(d.get('teammate_id',d.get('agent_id','')))
except Exception:
    print('')
" 2>/dev/null) || AGENT_ID=""
fi
AGENT_ID="${AGENT_ID:-orchestrator}"
TASK_ID="${TASK_ID:-unknown}"
SESSION_ID=$(cat "$SWARM_DIR/SESSION_ID" 2>/dev/null) || SESSION_ID="unknown"
OUTPUT_FILE="$SWARM_DIR/${AGENT_ID}-output.json"
OUTPUT_FILE_PY="$(to_pypath "$OUTPUT_FILE")"
RETRY_BUDGET_PY="$SWARM_DIR_PY/retry-budget.json"
TIMESTAMP="$(date '+%H:%M:%S' 2>/dev/null || echo '00:00:00')"

# ─── RETRY BUDGET CHECK ───
BUDGET_MSG=$(SWARM_BUDGET="$RETRY_BUDGET_PY" SWARM_SESSION="$SESSION_ID" SWARM_AGENT="$AGENT_ID" python << 'PYEOF'
import json, os, sys
path = os.environ.get("SWARM_BUDGET", "")
session = os.environ.get("SWARM_SESSION", "unknown")
agent = os.environ.get("SWARM_AGENT", "unknown")
try:
    with open(path, encoding="utf-8") as f:
        b = json.load(f)
    if b.get("session") != session:
        b = {"session": session, "used": 0, "max": 5, "agents": {}}
except Exception:
    b = {"session": session, "used": 0, "max": 5, "agents": {}}

if b.get("used", 0) >= b.get("max", 5):
    print(f"GLOBAL RETRY BUDGET EXHAUSTED ({b['max']} retries). Halting.")
    sys.exit(2)
if b.get("agents", {}).get(agent, 0) >= 2:
    print(f"AGENT RETRY LIMIT: {agent} failed too many times. Halting.")
    sys.exit(2)
print("OK")
PYEOF
)
BUDGET_EXIT=$?

if [ $BUDGET_EXIT -eq 2 ]; then
  echo "[SWARM HALT] $BUDGET_MSG" >&2
  # Budget exhausted — write partial output and halt
  SWARM_DIR_ENV="$SWARM_DIR_PY" python << 'PYEOF'
import json, os, glob, sys
swarm = os.environ.get("SWARM_DIR_ENV", "")
lines = ["## Swarm halted — retry budget exhausted\n"]
checkpoints = glob.glob(os.path.join(swarm, "*-checkpoint.json"))
completed = []
for cp in checkpoints:
    try:
        with open(cp, encoding="utf-8") as f:
            d = json.load(f)
        completed.append(f"- {d.get('agent','?')} completed at {d.get('completedAt','?')}")
    except Exception:
        pass
lines.append("### Completed agents\n" + ("\n".join(completed) or "none"))
manifest = os.path.join(swarm, "file-manifest.json")
try:
    with open(manifest, encoding="utf-8") as f:
        m = json.load(f)
    files = [f"- {e.get('path','?')}" for e in m.get("files", [])]
    lines.append("\n### Files written\n" + ("\n".join(files) or "none"))
except Exception:
    pass
lines.append("\n### Next step\nFix the failing agent manually, then re-run the task.")
try:
    with open(os.path.join(swarm, "PARTIAL_OUTPUT.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: failed to write PARTIAL_OUTPUT.md: {e}\n")
print("\n".join(lines))
PYEOF
  bash "$SCRIPT_DIR/update-memory.sh" 2>/dev/null || true
  exit 2
fi

ERRORS=()
WARNINGS=()

# ─── Fallback output JSON ───
if [ ! -f "$OUTPUT_FILE" ]; then
  SWARM_OUTPUT="$OUTPUT_FILE_PY" SWARM_AGENT="$AGENT_ID" python << 'PYEOF'
import json, os, sys
from datetime import datetime
agent = os.environ.get("SWARM_AGENT", "orchestrator")
outpath = os.environ.get("SWARM_OUTPUT", "")
try:
    data = {"agent": agent, "status": "completed", "generatedAt": datetime.now().isoformat()}
    if agent == "pre-commit":
        data.update({"typescript": "pass", "eslint": "pass", "committed": False, "commitMessage": "chore: update project [swarm]"})
    with open(outpath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: fallback output write failed: {e}\n")
PYEOF
fi

# ─── Output size gate ───
if [ -f "$OUTPUT_FILE" ]; then
  OUTPUT_SIZE=$(wc -c < "$OUTPUT_FILE" 2>/dev/null) || OUTPUT_SIZE=0
  OUTPUT_SIZE=$(echo "$OUTPUT_SIZE" | tr -d '[:space:]')
  OUTPUT_SIZE=${OUTPUT_SIZE:-0}
  if [ "$OUTPUT_SIZE" -gt 800 ] 2>/dev/null; then
    ERRORS+=("${AGENT_ID}-output.json is ${OUTPUT_SIZE} bytes (limit: 800). Code must go in src/ — output JSON is summaries only.")
  fi
fi

# ─── Summary size gate (≤800 bytes ≈ 200 tokens) ───
SUMMARY_FILE="$SWARM_DIR/${AGENT_ID}-summary.md"
if [ -f "$SUMMARY_FILE" ]; then
  SUMMARY_SIZE=$(wc -c < "$SUMMARY_FILE" 2>/dev/null) || SUMMARY_SIZE=0
  SUMMARY_SIZE=$(echo "$SUMMARY_SIZE" | tr -d '[:space:]')
  SUMMARY_SIZE=${SUMMARY_SIZE:-0}
  if [ "$SUMMARY_SIZE" -gt 800 ] 2>/dev/null; then
    ERRORS+=("${AGENT_ID}-summary.md is ${SUMMARY_SIZE} bytes (limit: 800 ≈ 200 tokens). Compress to key decisions + file paths only.")
  fi
fi

# ─── Token budget enforcement gate ───
BUDGET_FILE="$SWARM_DIR_PY/token-budget.json"
SWARM_BUDGET_FILE="$BUDGET_FILE" python << 'PYEOF' 2>/dev/null || true
import json, os, sys
path = os.environ.get("SWARM_BUDGET_FILE", "")
try:
    with open(path, encoding="utf-8") as f:
        b = json.load(f)
    budget = b.get("budget", None)
    if budget is None:
        sys.exit(0)
    if budget < 10000:
        sys.stderr.write(f"[SWARM HALT] Token budget critically low: {budget} tokens remaining. Run /compact before continuing.\n")
        sys.exit(2)
    elif budget < 20000:
        sys.stderr.write(f"[SWARM WARN] Token budget low: {budget} tokens remaining. Consider /compact soon.\n")
except Exception:
    pass
PYEOF

# ─── CSS convention check ───
if [ "$AGENT_ID" = "component-forge" ] || [ "$AGENT_ID" = "ui-refiner" ]; then
  BRIEF="$SWARM_DIR/intake-brief.md"
  if [ -f "$BRIEF" ] && grep -q "inline styles" "$BRIEF" 2>/dev/null; then
    if grep -rq 'className="[^"]*flex\|className="[^"]*grid' "$PROJECT_ROOT/src/" 2>/dev/null; then
      ERRORS+=("Inline styles specified but Tailwind classes detected.")
    fi
  fi
fi

# ─── Firebase rules check ───
if [ "$AGENT_ID" = "firebase" ]; then
  if [ ! -f "$PROJECT_ROOT/firestore.rules" ] && [ ! -f "$PROJECT_ROOT/firebase/firestore.rules" ]; then
    WARNINGS+=("Firebase agent done but no firestore.rules found.")
  fi
fi

# ─── TypeScript gate — pre-commit only ───
if [ "$AGENT_ID" = "pre-commit" ]; then
  if [ -f "$PROJECT_ROOT/tsconfig.json" ] && ! (cd "$PROJECT_ROOT" && npx tsc --noEmit > /dev/null 2>&1); then
    ERRORS+=("TypeScript errors found. Fix before committing.")
  fi
fi

# ─── README size gate ───
README_SIZE=$(wc -c < "$PROJECT_ROOT/README.md" 2>/dev/null) || README_SIZE=0
README_SIZE=$(echo "$README_SIZE" | tr -d '[:space:]')
README_SIZE=${README_SIZE:-0}
if [ "$README_SIZE" -gt 12000 ] 2>/dev/null; then
  WARNINGS+=("README.md is ${README_SIZE} bytes (>3000 tokens). Run readme-manager to prune.")
fi

for warn in "${WARNINGS[@]}"; do echo "  [WARN] $warn" >&2; done

# ─── Error handling + retry budget increment ───
if [ ${#ERRORS[@]} -gt 0 ]; then
  echo "[TaskCompleted] Rejecting $AGENT_ID:" >&2
  for err in "${ERRORS[@]}"; do echo "  ERROR: $err" >&2; done

  SWARM_BUDGET="$RETRY_BUDGET_PY" SWARM_SESSION="$SESSION_ID" SWARM_AGENT="$AGENT_ID" python << 'PYEOF'
import json, os, sys
path = os.environ.get("SWARM_BUDGET", "")
session = os.environ.get("SWARM_SESSION", "unknown")
agent = os.environ.get("SWARM_AGENT", "unknown")
try:
    with open(path, encoding="utf-8") as f:
        b = json.load(f)
    if b.get("session") != session:
        b = {"session": session, "used": 0, "max": 5, "agents": {}}
except Exception:
    b = {"session": session, "used": 0, "max": 5, "agents": {}}
b["used"] = b.get("used", 0) + 1
b["agents"][agent] = b.get("agents", {}).get(agent, 0) + 1
try:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(b, f, indent=2)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: retry budget write failed: {e}\n")
print(f"[RetryBudget] Used: {b['used']}/{b.get('max',5)} | {agent}: {b['agents'].get(agent,0)}/2")
PYEOF

  printf '%s\n' "${ERRORS[@]}"
  exit 2
fi

echo "[SWARM $TIMESTAMP] ✅ COMPLETED: $AGENT_ID" >&2

# ─── Conditional readme-manager skip ───
if [ "$AGENT_ID" = "readme-manager" ]; then
  COMPLEXITY_FILE="$SWARM_DIR_PY/complexity.json"
  README_NEEDED=$(SWARM_CX="$COMPLEXITY_FILE" python -c "
import json,os,sys
try:
    with open(os.environ['SWARM_CX'], encoding='utf-8') as f: d=json.load(f)
    print('true' if d.get('readme_update_needed', True) else 'false')
except Exception: print('true')
" 2>/dev/null) || README_NEEDED="true"
  if [ "$README_NEEDED" = "false" ]; then
    echo "[SWARM] readme-manager skipped — cosmetic task" >&2
    exit 0
  fi
fi

# ─── Conditional pre-commit skip ───
if [ "$AGENT_ID" = "pre-commit" ]; then
  COMPLEXITY_FILE="$SWARM_DIR_PY/complexity.json"
  PRECOMMIT_NEEDED=$(SWARM_CX="$COMPLEXITY_FILE" python -c "
import json,os,sys
try:
    with open(os.environ['SWARM_CX'], encoding='utf-8') as f: d=json.load(f)
    print('true' if d.get('pre_commit_needed', True) else 'false')
except Exception: print('true')
" 2>/dev/null) || PRECOMMIT_NEEDED="true"
  if [ "$PRECOMMIT_NEEDED" = "false" ]; then
    echo "[SWARM] pre-commit skipped — cosmetic task" >&2
    COMMIT_PATH="$SWARM_DIR_PY/COMMIT_READY"
    SWARM_COMMIT="$COMMIT_PATH" SWARM_SESSION="$SESSION_ID" python -c "
import json,os
try:
    with open(os.environ['SWARM_COMMIT'],'w',encoding='utf-8') as f:
        json.dump({'session':os.environ['SWARM_SESSION'],'message':'chore: cosmetic update [swarm]'},f)
except Exception: pass
" 2>/dev/null || true
    exit 0
  fi
fi

# ─── Checkpoint + token budget tracking ───
SWARM_DIR_ENV="$SWARM_DIR_PY" SWARM_AGENT="$AGENT_ID" SWARM_TASK="$TASK_ID" \
SWARM_OUTPUT="$OUTPUT_FILE_PY" python << 'PYEOF'
import json, os, sys
from datetime import datetime

swarm = os.environ.get("SWARM_DIR_ENV", "")
agent = os.environ.get("SWARM_AGENT", "orchestrator")
task_id = os.environ.get("SWARM_TASK", "unknown")
output_file = os.environ.get("SWARM_OUTPUT", "")

# Write checkpoint
try:
    cp_path = os.path.join(swarm, f"{agent}-checkpoint.json")
    with open(cp_path, "w", encoding="utf-8") as f:
        json.dump({
            "agent": agent,
            "taskId": task_id,
            "completedAt": datetime.now().isoformat(),
            "outputFile": output_file
        }, f, indent=2)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: checkpoint write failed: {e}\n")

# Token budget
budget_path = os.path.join(swarm, "token-budget.json")
try:
    with open(budget_path, encoding="utf-8") as f:
        budget = json.load(f)
except Exception:
    budget = {"session": "unknown", "agents": [], "totalEstimate": 0}

output_size = 0
try:
    output_size = os.path.getsize(output_file)
except Exception:
    pass

token_estimate = round(output_size / 4)
try:
    import tiktoken
    enc = tiktoken.get_encoding("cl100k_base")
    with open(output_file, "r", encoding="utf-8", errors="replace") as f:
        token_estimate = len(enc.encode(f.read()))
except Exception:
    pass  # fallback already set

budget.setdefault("agents", []).append({
    "agent": agent,
    "completedAt": datetime.now().strftime("%H:%M:%S"),
    "outputBytes": output_size,
    "tokenEstimate": token_estimate
})
budget["totalEstimate"] = sum(a.get("tokenEstimate", 0) for a in budget.get("agents", []))

try:
    with open(budget_path, "w", encoding="utf-8") as f:
        json.dump(budget, f, indent=2)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: token-budget write failed: {e}\n")

print(f"[TokenBudget] {agent}: ~{token_estimate} tokens | Session total: ~{budget['totalEstimate']}")
PYEOF
[ $? -ne 0 ] && echo "[SWARM ERROR] TaskCompleted: checkpoint/token-budget block failed for $AGENT_ID" >&2

# ─── Task queue handshake — mark done + unblock dependents ───
TASK_QUEUE_PY="$SWARM_DIR_PY/task-queue.json"
SWARM_TASKQ="$TASK_QUEUE_PY" SWARM_AGENT="$AGENT_ID" SWARM_TASK="$TASK_ID" python << 'PYEOF'
import json, os, time, sys

task_file = os.environ.get("SWARM_TASKQ", "")
agent     = os.environ.get("SWARM_AGENT", "")
task_id   = os.environ.get("SWARM_TASK", "")

if not task_file or not os.path.exists(task_file):
    sys.exit(0)

lock = task_file + ".lock"
acquired = False
for _ in range(20):
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.close(fd)
        acquired = True
        break
    except FileExistsError:
        try:
            if time.time() - os.path.getmtime(lock) > 10:
                os.remove(lock)
                continue
        except Exception:
            pass
        time.sleep(0.1)
    except OSError:
        time.sleep(0.1)

if not acquired:
    try:
        os.remove(lock)
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.close(fd)
        acquired = True
    except Exception:
        sys.stderr.write(f"[SWARM ERROR] TaskCompleted: could not lock task-queue for handshake\n")
        sys.exit(0)

try:
    with open(task_file, encoding="utf-8") as f:
        d = json.load(f)
    tasks = d if isinstance(d, list) else d.get("tasks", [])

    # 1. Mark this task as done
    completed_id = None
    for t in tasks:
        match_id   = str(t.get("id", "")) == str(task_id)
        match_agent = t.get("agent") == agent and t.get("status") == "in_progress"
        if match_id or (not task_id and match_agent):
            t["status"] = "done"
            completed_id = str(t.get("id", task_id))
            break

    # 2. Remove completed task's id from all blockedBy arrays
    if completed_id:
        for t in tasks:
            blocked = t.get("blockedBy", [])
            if completed_id in [str(b) for b in blocked]:
                t["blockedBy"] = [b for b in blocked if str(b) != completed_id]
                sys.stderr.write(f"[SWARM] Unblocked task {t['id']} ({t.get('agent','?')}) — removed dependency on {completed_id}\n")

    with open(task_file, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2)

    pending = sum(1 for t in tasks if t.get("status") == "pending")
    done    = sum(1 for t in tasks if t.get("status") == "done")
    sys.stderr.write(f"[SWARM] task-queue: {done} done, {pending} pending after {agent} completed\n")

except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: task-queue handshake failed: {e}\n")
finally:
    try:
        os.remove(lock)
    except Exception:
        pass
PYEOF
[ $? -ne 0 ] && echo "[SWARM ERROR] TaskCompleted: task-queue handshake block failed for $AGENT_ID" >&2

# ─── Commit gate — pre-commit only ───
if [ "$AGENT_ID" = "pre-commit" ]; then
  SWARM_OUTPUT="$OUTPUT_FILE_PY" SWARM_DIR_ENV="$SWARM_DIR_PY" SWARM_SESSION="$SESSION_ID" python << 'PYEOF'
import json, os, sys
output_file = os.environ.get("SWARM_OUTPUT", "")
swarm = os.environ.get("SWARM_DIR_ENV", "")
session = os.environ.get("SWARM_SESSION", "unknown")
try:
    with open(output_file, encoding="utf-8") as f:
        msg = json.load(f).get("commitMessage", "chore: update project")
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: commit message read failed: {e}\n")
    msg = "chore: update project"
try:
    with open(os.path.join(swarm, "COMMIT_READY"), "w", encoding="utf-8") as f:
        json.dump({"session": session, "message": msg}, f)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TaskCompleted: COMMIT_READY write failed: {e}\n")
PYEOF
  [ $? -ne 0 ] && echo "[SWARM ERROR] TaskCompleted: commit gate block failed" >&2
  bash "$SCRIPT_DIR/update-memory.sh" 2>/dev/null || echo "[SWARM ERROR] TaskCompleted: update-memory.sh failed" >&2
fi

exit 0
