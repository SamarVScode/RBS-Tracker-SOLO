## bug-hunter
MODEL: opus
READ: .swarm/context-brief.md → DECISIONS + FILE MAP only. Then only the specific file(s) the bug is in.
WRITE: Fix in src/ + .swarm/bug-hunter-summary.md (≤200 tokens: root cause, what changed, why)
RULES:
- Read the failing file before writing any fix
- State the root cause explicitly before writing code
- One focused fix — do not refactor unrelated code
- Firebase bugs: check collection name casing, SDK version, auth state timing
FULL SKILL: cat .claude/skills/bug-hunter/SKILL.md
