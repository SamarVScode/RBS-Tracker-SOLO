#!/bin/bash
# Scores task complexity → writes .swarm/complexity.json → routes to Simple/Medium/Complex
# Can exit non-zero on critical failure (acceptable — scorer is retryable)

set -o pipefail 2>/dev/null || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || { echo "[SWARM ERROR] complexity-score: cannot resolve script dir" >&2; exit 1; }
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || { echo "[SWARM ERROR] complexity-score: cannot resolve project root" >&2; exit 1; }
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || { echo "[SWARM ERROR] complexity-score: cannot create $SWARM_DIR" >&2; exit 1; }

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }
SWARM_DIR_PY=$(to_pypath "$SWARM_DIR")

# Accept task from CLI arg or stdin
if [ -n "$1" ]; then
  TASK="$1"
else
  HOOK_DATA=$(cat 2>/dev/null) || HOOK_DATA=""
  TASK=$(printf '%s' "$HOOK_DATA" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
    print(d.get('prompt',d.get('message','')))
except Exception:
    print('')
" 2>/dev/null) || TASK=""
  [ -z "$TASK" ] && TASK="$HOOK_DATA"
fi

# Build scorer input — use intake-brief if exists, else inject task into minimal template
INTAKE_BRIEF="$SWARM_DIR/intake-brief.md"

# If TASK still empty but intake-brief exists, extract User Prompt
if [ -z "$TASK" ] && [ -f "$INTAKE_BRIEF" ] && [ -s "$INTAKE_BRIEF" ]; then
  TASK=$(awk '/^## User Prompt/{found=1; next} found && /^## /{exit} found{printf "%s ", $0}' "$INTAKE_BRIEF" 2>/dev/null | sed 's/^[[:space:]]*//' 2>/dev/null) || TASK=""
fi

if [ -f "$INTAKE_BRIEF" ] && [ -s "$INTAKE_BRIEF" ]; then
  SCORER_INPUT=$(cat "$INTAKE_BRIEF" 2>/dev/null) || SCORER_INPUT=""
else
  README_CONTENT=$(cat "$PROJECT_ROOT/README.md" 2>/dev/null) || README_CONTENT=""
  SCORER_INPUT="${README_CONTENT}

## User Prompt
${TASK}"
fi

# Run Python scorer — write input to temp file to avoid pipe size limits
SCORER_TMPFILE="$SWARM_DIR/.scorer-input-$$.txt"
printf '%s' "$SCORER_INPUT" > "$SCORER_TMPFILE" 2>/dev/null || { echo "[SWARM ERROR] complexity-score: cannot write scorer input" >&2; exit 1; }

SCORER_PY=$(to_pypath "$SCRIPT_DIR/prompt_complexity_scorer.py")
RAW_OUTPUT=$(ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}" python "$SCORER_PY" < "$SCORER_TMPFILE" 2>/dev/null) || RAW_OUTPUT=""
SCORER_EXIT=$?
rm -f "$SCORER_TMPFILE" 2>/dev/null || true

if [ $SCORER_EXIT -ne 0 ] || [ -z "$RAW_OUTPUT" ]; then
  echo "[SWARM WARN] complexity-score: scorer failed (exit $SCORER_EXIT), using keyword fallback" >&2
  RAW_OUTPUT='{"complexity_level":"Medium","source":"fallback"}'
fi

# Extract complexity level and score — all via env vars, no injection
PARSED=$(SWARM_RAW="$RAW_OUTPUT" python << 'PYEOF'
import json, os, sys
try:
    d = json.loads(os.environ.get('SWARM_RAW', '{}'))
    level = d.get('complexity_level', 'Medium')
    score = d.get('score', 0)
    is_cosmetic = d.get('is_cosmetic', False)
    print(json.dumps({"level": level, "score": score, "is_cosmetic": bool(is_cosmetic)}))
except Exception as e:
    sys.stderr.write(f'[SWARM ERROR] complexity-score parse: {e}\n')
    print(json.dumps({"level": "Medium", "score": 0, "is_cosmetic": False}))
PYEOF
) || PARSED='{"level":"Medium","score":0,"is_cosmetic":false}'

LEVEL=$(printf '%s' "$PARSED" | python -c "import json,sys; print(json.load(sys.stdin).get('level','Medium'))" 2>/dev/null) || LEVEL="Medium"
SCORE=$(printf '%s' "$PARSED" | python -c "import json,sys; print(json.load(sys.stdin).get('score',0))" 2>/dev/null) || SCORE=0
IS_COSMETIC=$(printf '%s' "$PARSED" | python -c "import json,sys; print('true' if json.load(sys.stdin).get('is_cosmetic') else 'false')" 2>/dev/null) || IS_COSMETIC="false"

# Map level → route + skip + suggested_agents
ROUTE_DATA=$(SWARM_LEVEL="$LEVEL" SWARM_TASK="$TASK" python << 'PYEOF'
import os, json
level = os.environ.get("SWARM_LEVEL", "Medium")
task = os.environ.get("SWARM_TASK", "").lower()

if level == "Simple":
    route = "simple"
    skip = "execution-manager,architect,firebase,api-contract,test-engineer"
    if any(w in task for w in ['test','testing','spec','coverage','e2e','playwright','vitest']):
        suggested = "test-engineer"
    elif any(w in task for w in ['security','vulnerability','xss','csrf','rules','permission']):
        suggested = "security-auditor"
    elif any(w in task for w in ['slow','bundle','lazy','performance','lighthouse','optimize']):
        suggested = "perf-optimizer"
    elif any(w in task for w in ['state','store','zustand','cache','query','mutation']):
        suggested = "state-architect"
    elif any(w in task for w in ['firebase','firestore','database','auth rule','cloud function']):
        suggested = "firebase"
    elif any(w in task for w in ['api','endpoint','schema','contract','graphql','webhook']):
        suggested = "api-contract"
    elif any(w in task for w in ['bug','fix','crash','broken','error','exception','undefined','null']):
        suggested = "bug-hunter"
    elif any(w in task for w in ['color','colour','icon','font','spacing','style','animation','polish']):
        suggested = "ui-refiner"
    else:
        suggested = "component-forge"
elif level == "Complex":
    route = "complex"
    skip = ""
    suggested = "context-manager,execution-manager"
else:
    route = "medium"
    skip = "execution-manager"
    suggested = "context-manager"

print(json.dumps({"route": route, "skip": skip, "suggested": suggested}))
PYEOF
) || ROUTE_DATA='{"route":"medium","skip":"execution-manager","suggested":"context-manager"}'

ROUTE=$(printf '%s' "$ROUTE_DATA" | python -c "import json,sys; print(json.load(sys.stdin).get('route','medium'))" 2>/dev/null) || ROUTE="medium"
SKIP=$(printf '%s' "$ROUTE_DATA" | python -c "import json,sys; print(json.load(sys.stdin).get('skip','execution-manager'))" 2>/dev/null) || SKIP="execution-manager"
SUGGESTED=$(printf '%s' "$ROUTE_DATA" | python -c "import json,sys; print(json.load(sys.stdin).get('suggested','context-manager'))" 2>/dev/null) || SUGGESTED="context-manager"

# Conditional flags
README_UPDATE="true"
PRE_COMMIT="true"
FORCE_HAIKU="false"
[ "$IS_COSMETIC" = "true" ] && README_UPDATE="false" && PRE_COMMIT="false"
# Haiku only for: (1) cosmetic tasks, (2) low-confidence fallback — never for general Simple/Medium/Complex
SOURCE=$(printf '%s' "$RAW_OUTPUT" | python -c "import json,sys; print(json.load(sys.stdin).get('source','rule_based'))" 2>/dev/null) || SOURCE="rule_based"
[ "$IS_COSMETIC" = "true" ] && FORCE_HAIKU="true"
[ "$SOURCE" = "keyword_fallback" ] && FORCE_HAIKU="true"

# Write complexity.json — all values via env vars
SWARM_SCORE="$SCORE" SWARM_ROUTE="$ROUTE" SWARM_SKIP="$SKIP" SWARM_SUGGESTED="$SUGGESTED" \
SWARM_LEVEL="$LEVEL" SWARM_README="$README_UPDATE" SWARM_PRECOMMIT="$PRE_COMMIT" \
SWARM_HAIKU="$FORCE_HAIKU" SWARM_OUTPATH="$SWARM_DIR_PY/complexity.json" python << 'PYEOF'
import json, os, sys
try:
    data = {
        "score": round(float(os.environ.get("SWARM_SCORE", 0) or 0), 3),
        "route": os.environ.get("SWARM_ROUTE", "medium"),
        "skip": os.environ.get("SWARM_SKIP", ""),
        "suggested_agents": os.environ.get("SWARM_SUGGESTED", ""),
        "complexity_level": os.environ.get("SWARM_LEVEL", "Medium"),
        "readme_update_needed": os.environ.get("SWARM_README", "true") == "true",
        "pre_commit_needed": os.environ.get("SWARM_PRECOMMIT", "true") == "true",
        "force_haiku": os.environ.get("SWARM_HAIKU", "false") == "true"
    }
    with open(os.environ["SWARM_OUTPATH"], "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] complexity-score: failed to write complexity.json: {e}\n")
    sys.exit(1)
PYEOF
[ $? -ne 0 ] && echo "[SWARM ERROR] complexity-score: failed to write complexity.json" >&2 && exit 1

echo "[SWARM ORCHESTRATOR] Complexity: $LEVEL → $ROUTE route | Spawn: $SUGGESTED | Skip: $SKIP"
echo "Before responding, follow ORCHESTRATOR_DETAIL.md routing rules. Do NOT do the work directly — spawn the suggested agent(s) using the Agent tool."
