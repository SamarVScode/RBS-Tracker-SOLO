#!/bin/bash
# Fires on every user prompt — clears stale intake brief and directs orchestrator
# MUST exit 0 always — non-zero blocks user prompt

set -o pipefail 2>/dev/null || true
trap 'exit 0' ERR

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || exit 0
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || exit 0
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || exit 0

# Extract prompt from UserPromptSubmit JSON
HOOK_DATA=$(cat 2>/dev/null) || exit 0
[ -z "$HOOK_DATA" ] && exit 0

TASK=$(printf '%s' "$HOOK_DATA" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
    print(d.get('prompt',d.get('message','')))
except Exception:
    print('')
" 2>/dev/null) || TASK=""
[ -z "$TASK" ] && TASK="$HOOK_DATA"

# Skip trivial / conversational messages (< 4 words)
WORD_COUNT=$(echo "$TASK" | wc -w 2>/dev/null) || WORD_COUNT=0
WORD_COUNT=$(echo "$WORD_COUNT" | tr -d '[:space:]')
WORD_COUNT=${WORD_COUNT:-0}
[ "$WORD_COUNT" -lt 4 ] 2>/dev/null && exit 0

# Clear stale intake brief + agent summaries — forces fresh context for every new task
rm -f "$SWARM_DIR/intake-brief.md" 2>/dev/null || true
rm -f "$SWARM_DIR"/*-summary.md 2>/dev/null || true
rm -f "$SWARM_DIR/context-brief.md" "$SWARM_DIR/design-contract.json" 2>/dev/null || true

# Project size detection — count files in README FILE MAP section
FILE_COUNT=0
if [ -f "$PROJECT_ROOT/README.md" ]; then
  FILE_COUNT=$(awk '/^## FILE MAP/,/^## /' "$PROJECT_ROOT/README.md" 2>/dev/null | grep -cE '^\s*[-│├└|].*\.(ts|tsx|js|jsx|json|css|md|html|rules)' 2>/dev/null) || FILE_COUNT=0
  FILE_COUNT=$(echo "$FILE_COUNT" | tr -d '[:space:]')
fi
FILE_COUNT=${FILE_COUNT:-0}

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }
SWARM_DIR_PY=$(to_pypath "$SWARM_DIR")

if [ "$FILE_COUNT" -lt 20 ] 2>/dev/null; then
  echo '{"small": true}' > "$SWARM_DIR/project-size.json" 2>/dev/null || true
else
  echo '{"small": false}' > "$SWARM_DIR/project-size.json" 2>/dev/null || true
fi

# Inject protocol directive into Claude context before it responds
echo "[SWARM] New task received. Follow ORCHESTRATOR_DETAIL.md startup protocol:"
echo "1. Read .claude/ops/intake-agent.md → spawn intake-agent → writes .swarm/intake-brief.md"
echo "2. cat .swarm/intake-brief.md | bash .claude/hooks/complexity-score.sh"
echo "3. cat .swarm/complexity.json → route by complexity_level"
echo "Do NOT respond or do the work directly. Spawn intake-agent first."
