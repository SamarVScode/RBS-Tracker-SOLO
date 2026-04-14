#!/bin/bash
# setup-swarm.sh — Run once per machine. Portable, no hardcoded paths.
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── VERSION CHECK ──────────────────────────────────────────────────────────────
if command -v claude &> /dev/null; then
  CLAUDE_VERSION=$(claude --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
  REQUIRED="2.1.32"
  if [ -n "$CLAUDE_VERSION" ]; then
    python -c "
import sys
v = tuple(int(x) for x in '$CLAUDE_VERSION'.split('.'))
r = tuple(int(x) for x in '$REQUIRED'.split('.'))
if v < r:
    print('❌ Claude Code $CLAUDE_VERSION detected. Requires v$REQUIRED+')
    print('   Upgrade: npm install -g @anthropic-ai/claude-code')
    sys.exit(1)
else:
    print('✅ Claude Code $CLAUDE_VERSION — version OK')
" || exit 1
  else
    echo "⚠️  Could not detect Claude Code version — proceeding anyway"
  fi
else
  echo "⚠️  claude not found — install Claude Code first"
fi
# ───────────────────────────────────────────────────────────────────────────────

mkdir -p "$PROJECT_ROOT/.swarm"
chmod +x "$PROJECT_ROOT/.claude/hooks/"*.sh 2>/dev/null

# ── .gitignore ─────────────────────────────────────────────────────────────────
GITIGNORE="$PROJECT_ROOT/.gitignore"
if [ -f "$GITIGNORE" ]; then
  if ! grep -q "^\.swarm/$" "$GITIGNORE"; then
    echo ".swarm/" >> "$GITIGNORE"
    echo "✅ Added .swarm/ to .gitignore"
  else
    echo "ℹ️  .swarm/ already in .gitignore"
  fi
else
  echo ".swarm/" > "$GITIGNORE"
  echo "✅ Created .gitignore with .swarm/"
fi

# ── MERGE INTO GLOBAL SETTINGS ─────────────────────────────────────────────────
# Use Python's expanduser for cross-platform home directory
python - << 'PYEOF'
import json, os

# expanduser works on both Windows (Git Bash) and Mac/Linux
settings_dir = os.path.expanduser("~/.claude")
os.makedirs(settings_dir, exist_ok=True)
path = os.path.join(settings_dir, "settings.json")

# Load existing or start fresh
try:
    with open(path, "r") as f:
        data = json.load(f)
except Exception:
    data = {}

# Write correct hooks format (array with matcher)
data["hooks"] = {
    "PreToolUse":    [{"matcher": ".*", "hooks": [{"type": "command", "command": "bash .claude/hooks/PreToolUse.sh"}]}],
    "PostToolUse":   [{"matcher": ".*", "hooks": [{"type": "command", "command": "bash .claude/hooks/PostToolUse.sh"}]}],
    "PreCompact":    [{"matcher": "",   "hooks": [{"type": "command", "command": "bash .claude/hooks/PreCompact.sh"}]}],
    "TeammateIdle":  [{"matcher": "",   "hooks": [{"type": "command", "command": "bash .claude/hooks/TeammateIdle.sh"}]}],
    "TaskCompleted": [{"matcher": "",   "hooks": [{"type": "command", "command": "bash .claude/hooks/TaskCompleted.sh"}]}],
}
data.setdefault("env", {})["CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"] = "1"
data.setdefault("env", {})["DISABLE_NON_ESSENTIAL_MODEL_CALLS"] = "1"
data["teammateMode"] = "in-process"

with open(path, "w") as f:
    json.dump(data, f, indent=2)

print("✅ Settings written to", path)
PYEOF

echo "✅ Swarm ready. Run: claude"
