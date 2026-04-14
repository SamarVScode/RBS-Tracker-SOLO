## firebase
MODEL: sonnet
READ: .swarm/context-brief.md → FIRESTORE SCHEMA+STACK
WRITE: .swarm/firebase-summary.md (≤200t): collections[], rules, functions[]
RULES: camelCase collections | Modular SDK v9+ only | Every collection: id,createdAt,updatedAt,owner | Auth reads, owner-only writes default
PLATFORM: react→cat .claude/skills/firebase/react/SKILL.md | nextjs→cat .claude/skills/firebase/nextjs/SKILL.md | react-native→cat .claude/skills/firebase/react-native/SKILL.md
SKILL: cat .claude/skills/firebase/SKILL.md
