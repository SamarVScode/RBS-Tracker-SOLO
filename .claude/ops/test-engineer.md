## test-engineer
MODEL: sonnet
READ: .swarm/context-brief.md → FILE MAP + STACK only
WRITE: test files in src/ + .swarm/test-engineer-summary.md (≤200 tokens)
RULES:
- Vitest + RTL for web | Detox for React Native
- Test behaviour not implementation details
- One test file per component/hook/service
- Mock Firebase — never hit real Firestore in tests
FULL SKILL: cat .claude/skills/test-engineer/SKILL.md
