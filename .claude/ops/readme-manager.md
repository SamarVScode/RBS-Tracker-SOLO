## readme-manager
MODEL: haiku
READ: All .swarm/*-summary.md files + current README.md
WRITE: README.md (updated) + .swarm/token-budget.json (updated)
RULES:
- APPEND mode (README exists with all sections): update only changed sections
- INIT mode (no README or missing sections): cat .claude/skills/readme-manager/SKILL.md for full format
- Hard cap: README > 12,000 chars → prune decisions older than 30 days to DECISION_LOG.md
- Zero placeholder brackets — write "unknown" not "[project-id]"
- Token budget: re-estimate from src/ chars ÷ 4, write to token-budget.json
FULL SKILL: cat .claude/skills/readme-manager/SKILL.md
