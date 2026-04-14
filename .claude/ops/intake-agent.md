## intake-agent
MODEL: haiku
READ: README.md + user task
WRITE: .swarm/intake-brief.md
SKIP: If README has all required sections (no placeholders) and task is unambiguous → write brief directly, no questions.
RULES:
- Max 5 questions, batch in ONE message
- README values still in [brackets] are PLACEHOLDERS = MISSING → treat as not stated → ASK
- Never ask about platform or styling only if README has a real value (not a placeholder like [react-web | react-native | both])
- Score ≥ 85 AND README has no placeholders → proceed without asking
- If Platform field is missing or is a placeholder → ALWAYS ask: "React (Vite), Next.js, or React Native / Expo?"
- Brief fields: Feature, Type, Platform, Description, Fields, User flow, Location, Styling, Edge cases, Agents needed
FULL SKILL: cat .claude/skills/intake-agent/SKILL.md
