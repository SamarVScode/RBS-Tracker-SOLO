## pre-commit
MODEL: haiku
READ: .swarm/file-manifest.json + .swarm/pre-compact-snapshot.json
WRITE: .swarm/pre-commit-output.json with commitMessage
RULES: tsc --noEmit (blocking) | No console.log in src/ | New files in README FILE MAP | Commit msg: "feat|fix|chore(scope): desc [swarm]" | Never auto-commit — write COMMIT_READY
PLATFORM: react→cat .claude/skills/pre-commit/checks/react/SKILL.md | nextjs→cat .claude/skills/pre-commit/checks/nextjs/SKILL.md | react-native→cat .claude/skills/pre-commit/checks/react-native/SKILL.md
SKILL: cat .claude/skills/pre-commit/SKILL.md
