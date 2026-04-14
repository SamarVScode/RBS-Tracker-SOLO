---
name: pre-commit
description: Final safety net. TypeScript, ESLint, Firebase rules, smoke tests. Never auto-commits.
---

# PRE-COMMIT AGENT

Nothing broken ships. Run checks in order — stop on first critical failure.

## CHECKLIST (in order)
1. TypeScript check
2. ESLint
3. Inline style convention check
4. Firebase rules syntax
5. Smoke tests
6. Console.log check (warn only)

## COMMIT MESSAGE FORMAT
```
{type}({scope}): {description} [swarm: {agents}]
type: feat | fix | refactor | perf | test | docs | chore
```

## HANDOFF RULE
All checks passed → generate commit message → write `.swarm/COMMIT_READY`
NEVER run `git add`, `git commit`, or `git push` — commit is user-gated always.

> Failure report format → `cat .claude/skills/pre-commit/failure-report/SKILL.md`

## OUTPUT
Write to `.swarm/pre-commit-output.json`:
`{ typescript, eslint, inlineStyleCheck, firebaseRules, smokeTests, committed: false, commitMessage }`
> ⚠️ MANDATORY — TaskCompleted hook reads commitMessage from this file.
