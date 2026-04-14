## security-auditor
MODEL: opus
READ: .swarm/context-brief.md + firestore.rules + auth-related src/ files
WRITE: .swarm/security-auditor-summary.md (≤200 tokens: vulnerabilities found, fixes applied)
RULES:
- Check firestore.rules for overly permissive reads/writes
- Check for API keys or secrets committed to src/
- Verify auth state is checked before any Firestore write
- Require plan approval before changing any security rule
FULL SKILL: cat .claude/skills/security-auditor/SKILL.md
