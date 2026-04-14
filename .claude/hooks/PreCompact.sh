#!/bin/bash
# PreCompact — saves swarm state snapshot before context compaction
# MUST exit 0 always — non-zero could break compaction

set -o pipefail 2>/dev/null || true
trap 'exit 0' ERR

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || exit 0
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || exit 0
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || exit 0

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }
SWARM_DIR_PY=$(to_pypath "$SWARM_DIR")

TIMESTAMP=$(date '+%Y-%m-%d %H:%M' 2>/dev/null || echo "unknown")
echo "[PreCompact] Saving state at $TIMESTAMP" >&2

# Clean stale RTK flag
rm -f "$SWARM_DIR/.rtk-active" 2>/dev/null || true

SWARM_DIR_ENV="$SWARM_DIR_PY" python << 'PYEOF'
import json, os, glob, sys

swarm = os.environ.get("SWARM_DIR_ENV", "")
if not swarm:
    sys.exit(0)

snapshot = {}

# Collect state files
state_files = {
    "taskQueue": "task-queue.json",
    "complexity": "complexity.json",
    "projectSize": "project-size.json",
    "fileManifest": "file-manifest.json"
}

for key, filename in state_files.items():
    path = os.path.join(swarm, filename)
    try:
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                snapshot[key] = json.load(f)
    except Exception as e:
        sys.stderr.write(f"[SWARM ERROR] PreCompact: failed to read {filename}: {e}\n")

# Checkpoints
try:
    for cp in glob.glob(os.path.join(swarm, "*-checkpoint.json")):
        agent = os.path.basename(cp).replace("-checkpoint.json", "")
        with open(cp, encoding="utf-8") as f:
            snapshot.setdefault("checkpoints", {})[agent] = json.load(f)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] PreCompact: checkpoint read failed: {e}\n")

# Session ID
try:
    sid_path = os.path.join(swarm, "SESSION_ID")
    if os.path.exists(sid_path):
        with open(sid_path, encoding="utf-8") as f:
            snapshot["sessionId"] = f.read().strip()
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] PreCompact: SESSION_ID read failed: {e}\n")

# Write snapshot
try:
    with open(os.path.join(swarm, "pre-compact-snapshot.json"), "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2)
    sys.stderr.write("[SWARM] Pre-compact snapshot saved\n")
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] PreCompact: snapshot write failed: {e}\n")
PYEOF

echo "$TIMESTAMP compaction" >> "$SWARM_DIR/compactions.log" 2>/dev/null || true
exit 0
