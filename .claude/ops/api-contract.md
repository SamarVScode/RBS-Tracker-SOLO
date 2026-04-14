## api-contract
MODEL: sonnet
READ: .swarm/context-brief.md + .swarm/firebase-summary.md
WRITE: .swarm/api-contract-summary.md (≤200t): TypeScript interfaces
RULES: Match Firestore names exactly | Nullable: T|null, never optional | Export all from single types file
PLATFORM: react→cat .claude/skills/api-contract/react/SKILL.md | nextjs→cat .claude/skills/api-contract/nextjs/SKILL.md
SKILL: cat .claude/skills/api-contract/SKILL.md
