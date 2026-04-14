#!/bin/bash
# PostToolUse — RTK output truncation (Bash) + file manifest (Write|Edit)
# MUST exit 0 always — non-zero blocks tool response

set -o pipefail 2>/dev/null || true

# Safe exit: never block a tool response
trap 'exit 0' ERR

HOOK_DATA=$(cat 2>/dev/null) || { exit 0; }
[ -z "$HOOK_DATA" ] && exit 0

# Parse tool name — printf avoids echo mangling
TOOL_NAME=$(printf '%s' "$HOOK_DATA" | python -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null) || TOOL_NAME=""
[ "$TOOL_NAME" != "Bash" ] && [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ] && [ "$TOOL_NAME" != "MultiEdit" ] && exit 0

# Only Bash, Write, or Edit reaches here
# BASH_SOURCE[0] is reliable on Windows Git Bash even when $0 is a backslash path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || exit 0
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || exit 0
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || exit 0

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }
SWARM_DIR_PY=$(to_pypath "$SWARM_DIR")

AGENT_ID="${CLAUDE_TEAMMATE_ID:-orchestrator}"
TIMESTAMP="$(date '+%H:%M:%S' 2>/dev/null || echo '00:00:00')"

# ─── RTK truncation — Bash only ───
# NOTE: PostToolUse stdout is interpreted by Claude Code as a JSON control response.
# NEVER print plain text to stdout. RTK writes truncated output to .swarm/rtk-output.txt
# which the orchestrator reads as context (not as a hook response).
RTK_FLAG="$SWARM_DIR/.rtk-active"
if [ "$TOOL_NAME" = "Bash" ] && [ -f "$RTK_FLAG" ]; then
  RTK_TYPE=$(cat "$RTK_FLAG" 2>/dev/null) || RTK_TYPE=""
  rm -f "$RTK_FLAG" 2>/dev/null || true

  if [ -n "$RTK_TYPE" ]; then
    RTK_TMPFILE="$SWARM_DIR/.rtk-input-$$.json"
    RTK_OUTPUT="$SWARM_DIR/rtk-output.txt"
    printf '%s' "$HOOK_DATA" > "$RTK_TMPFILE" 2>/dev/null || { rm -f "$RTK_TMPFILE" 2>/dev/null; exit 0; }

    # Convert POSIX paths to Windows format for native Python on Windows
    RTK_TMPFILE_PY=$(to_pypath "$RTK_TMPFILE")
    RTK_OUTPUT_PY=$(to_pypath "$RTK_OUTPUT")

    HOOK_DATA_FILE="$RTK_TMPFILE_PY" RTK_TYPE_ENV="$RTK_TYPE" RTK_OUT="$RTK_OUTPUT_PY" python << 'PYEOF'
import json, os, sys

try:
    hook_file = os.environ.get('HOOK_DATA_FILE', '')
    rtk_type = os.environ.get('RTK_TYPE_ENV', '')
    rtk_out = os.environ.get('RTK_OUT', '')

    with open(hook_file, 'r', encoding='utf-8', errors='replace') as f:
        d = json.load(f)

    out = str(d.get('tool_response', ''))
    original_len = len(out)

    if rtk_type == 'RTK:lint':
        lines = [l for l in out.split('\n') if any(k in l.lower() for k in ['error', 'warning'])]
        out = '\n'.join(lines[:50]) or 'No errors.'
    elif rtk_type == 'RTK:test':
        lines = out.split('\n')
        fail = [l for l in lines if any(k in l for k in ['FAIL', 'Error', 'failed'])]
        if fail:
            summary = [l for l in lines[-15:] if l not in fail]
            out = '\n'.join(fail + ['---'] + summary)
        else:
            out = 'Tests passed.\n' + '\n'.join(lines[-10:])
    elif rtk_type == 'RTK:git':
        out = '\n'.join(out.split('\n')[:20])
    elif rtk_type == 'RTK:install':
        lines = [l for l in out.split('\n') if any(k in l.lower() for k in ['error', 'warn', 'ERR'])]
        out = '\n'.join(lines[:20]) or 'Install complete.'
    elif rtk_type == 'RTK:dir':
        out = '\n'.join(out.split('\n')[:30])
    elif rtk_type == 'RTK:build':
        lines = out.split('\n')
        errs = [l for l in lines if any(k in l.lower() for k in ['error', 'failed', 'warn'])]
        if errs:
            out = '\n'.join(errs[:30])
        else:
            out = '\n'.join(lines[-15:]) or 'Build complete.'

    if original_len > len(out) and rtk_out:
        # Write truncated output to file — orchestrator reads this, not stdout
        with open(rtk_out, 'w', encoding='utf-8') as f:
            f.write(out)
        sys.stderr.write(f'[SWARM RTK] {rtk_type}: {original_len}->{len(out)} chars → {rtk_out}\n')
except Exception as e:
    sys.stderr.write(f'[SWARM ERROR] PostToolUse RTK: {e}\n')
PYEOF

    rm -f "$RTK_TMPFILE" 2>/dev/null || true
  fi
fi

# ─── File manifest — Write, Edit, MultiEdit only ───
if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ] || [ "$TOOL_NAME" = "MultiEdit" ]; then
  FILE_PATH=$(printf '%s' "$HOOK_DATA" | python -c "
import json,sys
try:
    d=json.load(sys.stdin)
    inp=d.get('tool_input',{})
    print(inp.get('file_path',inp.get('path','')) if isinstance(inp,dict) else '')
except Exception:
    print('')
" 2>/dev/null) || FILE_PATH=""

  [ -z "$FILE_PATH" ] && exit 0

  # Make path relative to PROJECT_ROOT for portability
  REL_PATH="${FILE_PATH#$PROJECT_ROOT/}"
  FILE_PATH_PY=$(to_pypath "$REL_PATH")
  MANIFEST_PY="$SWARM_DIR_PY/file-manifest.json"

  # All values passed via env vars — safe from path injection
  MANIFEST_FILE="$MANIFEST_PY" ENTRY_PATH="$FILE_PATH_PY" ENTRY_AGENT="$AGENT_ID" ENTRY_TS="$TIMESTAMP" python << 'PYEOF'
import json, os, time, sys

try:
    manifest_path = os.environ.get('MANIFEST_FILE', '')
    file_path = os.environ.get('ENTRY_PATH', '')
    agent = os.environ.get('ENTRY_AGENT', 'orchestrator')
    ts = os.environ.get('ENTRY_TS', '')

    if not manifest_path or not file_path:
        sys.exit(0)

    def locked_update(path, default_fn, updater):
        lock = path + ".lock"
        acquired = False
        for attempt in range(10):
            try:
                fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.close(fd)
                acquired = True
                break
            except FileExistsError:
                # Check for stale lock (older than 10 seconds)
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
            # Force remove stale lock as last resort
            try:
                os.remove(lock)
            except Exception:
                pass
            try:
                fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.close(fd)
                acquired = True
            except Exception:
                sys.stderr.write(f'[SWARM ERROR] PostToolUse: could not acquire lock for {path}\n')
                return

        try:
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError, ValueError):
                data = default_fn()
            updater(data)
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
        finally:
            try:
                os.remove(lock)
            except Exception:
                pass

    def update_manifest(data):
        if "files" not in data or not isinstance(data["files"], list):
            data["files"] = []
        existing = next((e for e in data["files"] if e.get("path") == file_path), None)
        if existing:
            existing["lastModified"] = ts
            existing["agent"] = agent
        else:
            data["files"].append({"path": file_path, "agent": agent, "lastModified": ts})

    locked_update(manifest_path, lambda: {"files": []}, update_manifest)

except Exception as e:
    sys.stderr.write(f'[SWARM ERROR] PostToolUse manifest: {e}\n')
PYEOF

  echo "[SWARM $TIMESTAMP] FILE WRITTEN: $REL_PATH by $AGENT_ID" >&2
fi

exit 0
