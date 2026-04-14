## ui-refiner
MODEL: haiku
READ: .swarm/design-contract.json only
WRITE: Edits to existing src/ files + .swarm/ui-refiner-summary.md (≤200 tokens)
RULES:
- Polish only — no new components, no logic changes
- Spacing, color, animation, responsive fixes only
- StyleSheet.create (RN) | inline styles (web)
- Check design-contract.json tokens before hardcoding any value
FULL SKILL: cat .claude/skills/ui-refiner/SKILL.md
