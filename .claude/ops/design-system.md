## design-system
MODEL: sonnet
READ: .swarm/context-brief.md → STYLING field only. Then grep src/ for tokens already in use.
WRITE: .swarm/design-contract.json
RULES:
- Extract existing tokens from src/ FIRST — never reinvent what exists
- Only define tokens missing from current codebase
- No emojis anywhere in the contract
- Do NOT read DESIGN_TOKENS.md, ANIMATION_SPEC.md, or A11Y_PATTERNS.md unless building a brand-new component family with zero prior patterns in src/
FULL SKILL: cat .claude/skills/design-system/SKILL.md
