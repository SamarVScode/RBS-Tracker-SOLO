#!/bin/bash
# PreToolUse — RTK flagging for verbose Bash commands + agent/skill tracking
# MUST exit 0 always — non-zero blocks tool execution

set -o pipefail 2>/dev/null || true

# Safe exit: never block a tool call
trap 'exit 0' ERR

HOOK_DATA=$(cat 2>/dev/null) || { exit 0; }
[ -z "$HOOK_DATA" ] && exit 0

# Parse tool name — use printf to avoid echo mangling special chars
TOOL_NAME=$(printf '%s' "$HOOK_DATA" | python -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null) || TOOL_NAME=""
[ "$TOOL_NAME" != "Bash" ] && exit 0

# Only Bash reaches here
# BASH_SOURCE[0] is reliable on Windows Git Bash even when $0 is a backslash path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || exit 0
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || exit 0
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || exit 0

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }

INPUT=$(printf '%s' "$HOOK_DATA" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
    inp=d.get('tool_input',{})
    print(inp.get('command','') if isinstance(inp,dict) else '')
except Exception:
    print('')
" 2>/dev/null) || INPUT=""

AGENT_ID="${CLAUDE_TEAMMATE_ID:-}"
SKILL_NAME="${CLAUDE_SKILL_NAME:-}"
TIMESTAMP="$(date '+%H:%M:%S' 2>/dev/null || echo '00:00:00')"

# Agent tracking
if [ -n "$AGENT_ID" ]; then
  INIT_FLAG="$SWARM_DIR/.initiated-${AGENT_ID}"
  if [ ! -f "$INIT_FLAG" ]; then
    touch "$INIT_FLAG" 2>/dev/null || true
    echo "[SWARM $TIMESTAMP] ▶ INITIATED: $AGENT_ID" >&2
  fi
fi

# Skill tracking
if [ -n "$SKILL_NAME" ]; then
  SKILL_FLAG="$SWARM_DIR/.initiated-skill-${SKILL_NAME}"
  if [ ! -f "$SKILL_FLAG" ]; then
    touch "$SKILL_FLAG" 2>/dev/null || true
    echo "[SWARM $TIMESTAMP] SKILL FIRED: $SKILL_NAME" >&2
  fi
fi

# RTK — flag verbose commands so PostToolUse can truncate output
RTK_FLAG="$SWARM_DIR/.rtk-active"
write_rtk() { echo "$1" > "$RTK_FLAG" 2>/dev/null || true; }

if echo "$INPUT" | grep -qE "eslint|tsc --noEmit|prettier|\.lint" 2>/dev/null; then
  write_rtk "RTK:lint"
elif echo "$INPUT" | grep -qE "npm test|vitest|jest|playwright" 2>/dev/null; then
  write_rtk "RTK:test"
elif echo "$INPUT" | grep -qE "git log|git diff|git status" 2>/dev/null; then
  write_rtk "RTK:git"
elif echo "$INPUT" | grep -qE "npm install|yarn install|pnpm install" 2>/dev/null; then
  write_rtk "RTK:install"
elif echo "$INPUT" | grep -qE "find \.|find src|ls -[lRa]|cat .*/.*output" 2>/dev/null; then
  write_rtk "RTK:dir"
elif echo "$INPUT" | grep -qE "npm run build|next build|expo export" 2>/dev/null; then
  write_rtk "RTK:build"
else
  rm -f "$RTK_FLAG" 2>/dev/null || true
fi

exit 0
