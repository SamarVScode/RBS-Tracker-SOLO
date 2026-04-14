#!/bin/bash
# update-memory — record session in project-memory.json (called by TaskCompleted on pre-commit)

set -o pipefail 2>/dev/null || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd)" || { echo "[SWARM ERROR] update-memory: cannot resolve script dir" >&2; exit 1; }
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || { echo "[SWARM ERROR] update-memory: cannot resolve project root" >&2; exit 1; }
SWARM_DIR="$PROJECT_ROOT/.swarm"
mkdir -p "$SWARM_DIR" 2>/dev/null || { echo "[SWARM ERROR] update-memory: cannot create $SWARM_DIR" >&2; exit 1; }

to_pypath() { if command -v cygpath &>/dev/null; then cygpath -m "$1" 2>/dev/null; else echo "$1"; fi; }
SWARM_DIR_PY=$(to_pypath "$SWARM_DIR")

SWARM_DIR_ENV="$SWARM_DIR_PY" python << 'PYEOF'
import json, os, glob, sys
from datetime import datetime

swarm = os.environ.get("SWARM_DIR_ENV", "")
if not swarm:
    sys.stderr.write("[SWARM ERROR] update-memory: SWARM_DIR_ENV not set\n")
    sys.exit(1)

memory_path = os.path.join(swarm, "project-memory.json")
session_id_path = os.path.join(swarm, "SESSION_ID")

try:
    with open(session_id_path, encoding="utf-8") as f:
        session_id = f.read().strip()
except Exception:
    session_id = "unknown"

try:
    with open(memory_path, encoding="utf-8") as f:
        memory = json.load(f)
except Exception:
    memory = {"sessions": [], "decisions": [], "patterns": []}

# Collect files changed this session
files_changed = []
manifest_path = os.path.join(swarm, "file-manifest.json")
try:
    with open(manifest_path, encoding="utf-8") as f:
        manifest = json.load(f)
    files_changed = [e.get("path", "") for e in manifest.get("files", []) if e.get("path")]
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] update-memory: manifest read failed: {e}\n")

# Read retry budget for failed agents
failed_agents = []
retry_path = os.path.join(swarm, "retry-budget.json")
try:
    with open(retry_path, encoding="utf-8") as f:
        rb = json.load(f)
    failed_agents = [a for a, count in rb.get("agents", {}).items() if count >= 2]
except Exception:
    pass

entry = {
    "id": session_id,
    "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
    "filesChanged": files_changed,
    "failedAgents": failed_agents,
    "status": "failed" if failed_agents else "completed"
}

# Collect decisions from agent outputs
decisions_added = []
for output_file in glob.glob(os.path.join(swarm, "*-output.json")):
    try:
        with open(output_file, encoding="utf-8") as f:
            data = json.load(f)
        agent = data.get("agent", "")
        for key in ["decision", "decisions", "keyDecision", "pattern"]:
            val = data.get(key)
            if val and isinstance(val, str) and len(val) < 200:
                decisions_added.append(f"{datetime.now().strftime('%Y-%m-%d')} | {val} | {agent}")
    except Exception as e:
        sys.stderr.write(f"[SWARM ERROR] update-memory: failed to read {output_file}: {e}\n")

sessions = [entry] + memory.get("sessions", [])

# Keep full detail for last 10, strip filesChanged from older
kept = sessions[:10]
dropped = sessions[10:]
for s in dropped:
    s.pop("filesChanged", None)

memory["sessions"] = kept + dropped[:20]  # cap at 30 total
if decisions_added:
    memory["decisions"] = (decisions_added + memory.get("decisions", []))[:20]

try:
    with open(memory_path, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=2)
except Exception as e:
    sys.stderr.write(f"[SWARM ERROR] update-memory: memory write failed: {e}\n")
    sys.exit(1)
PYEOF
[ $? -ne 0 ] && echo "[SWARM ERROR] update-memory: memory update failed" >&2
