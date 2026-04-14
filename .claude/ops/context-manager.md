## context-manager
MODEL: haiku
READ: README.md + .swarm/intake-brief.md
WRITE: .swarm/context-brief.md (≤800 tokens) + .swarm/token-budget.json
RULES:
- Extract ONLY what is relevant to this task from README
- Lean brief: TASK, PLATFORM, TYPE, STYLING, RELEVANT FILES, FIRESTORE, ARCHITECTURE, CONVENTIONS, TOKEN BUDGET
- Token estimate: (src/ total chars + README chars) ÷ 4. Write to token-budget.json.
- Budget < 20,000 → warn. Budget < 10,000 → halt, suggest /compact.
FULL SKILL: cat .claude/skills/context-manager/SKILL.md
