#!/bin/bash
# TeammateIdle — reassign idle agents to pending tasks in task-queue.json
# Exit 0 = no work. Exit 2 = claimed a task (agent should act on it).

set -o pipefail 2>/dev/null || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || exit 0
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || exit 0
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || exit 0

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }

HOOK_DATA=$(cat 2>/dev/null) || HOOK_DATA=""

AGENT_ID="${CLAUDE_TEAMMATE_ID:-}"
if [ -z "$AGENT_ID" ]; then
  AGENT_ID=$(printf '%s' "$HOOK_DATA" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
    print(d.get('teammate_id',d.get('agent_id','unknown')))
except Exception:
    print('unknown')
" 2>/dev/null) || AGENT_ID="unknown"
fi

TASK_FILE="$SWARM_DIR/task-queue.json"
[ ! -f "$TASK_FILE" ] && exit 0

TASK_FILE_PY=$(to_pypath "$TASK_FILE")

# Check if any pending tasks exist
PENDING=$(SWARM_TASKFILE="$TASK_FILE_PY" python << 'PYEOF'
import json, os, sys
try:
    with open(os.environ["SWARM_TASKFILE"], encoding="utf-8") as f:
        d = json.load(f)
    tasks = d if isinstance(d, list) else d.get("tasks", [])
    print(sum(1 for t in tasks if t.get("status") == "pending"))
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TeammateIdle: task queue read failed: {e}\n")
    print(0)
PYEOF
) || PENDING=0
PENDING=$(echo "$PENDING" | tr -d '[:space:]')
PENDING=${PENDING:-0}

if [ "$PENDING" -gt 0 ] 2>/dev/null; then
  CLAIMED=$(SWARM_TASKFILE="$TASK_FILE_PY" SWARM_AGENT="$AGENT_ID" python << 'PYEOF'
import json, os, time, sys

task_file = os.environ.get("SWARM_TASKFILE", "")
agent = os.environ.get("SWARM_AGENT", "unknown")
lock = task_file + ".lock"

# Acquire lock with stale detection
acquired = False
for attempt in range(10):
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.close(fd)
        acquired = True
        break
    except FileExistsError:
        # Stale lock detection (older than 10 seconds)
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
    # Last resort: force remove stale lock
    try:
        os.remove(lock)
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.close(fd)
        acquired = True
    except Exception:
        print("none")
        sys.exit(0)

try:
    with open(task_file, encoding="utf-8") as f:
        d = json.load(f)
    tasks = d if isinstance(d, list) else d.get("tasks", [])
    for t in tasks:
        if t.get("status") == "pending" and not t.get("blockedBy"):
            t["status"] = "in_progress"
            t["claimedBy"] = agent
            with open(task_file, "w", encoding="utf-8") as f:
                json.dump(d, f, indent=2)
            print(str(t.get("id", "unknown")) + "|" + str(t.get("agent", "unknown")))
            sys.exit(0)
    print("none")
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] TeammateIdle: task claim failed: {e}\n")
    print("none")
finally:
    try:
        os.remove(lock)
    except Exception:
        pass
PYEOF
  ) || CLAIMED="none"

  CLAIMED=$(echo "$CLAIMED" | tr -d '[:space:]')
  if [ "$CLAIMED" != "none" ] && [ -n "$CLAIMED" ]; then
    TASK_ID=$(echo "$CLAIMED" | cut -d'|' -f1)
    TASK_AGENT=$(echo "$CLAIMED" | cut -d'|' -f2)
    echo "Claimed task $TASK_ID. You are now acting as $TASK_AGENT. Read .claude/ops/${TASK_AGENT}.md and proceed."
    exit 2
  fi
fi

exit 0
