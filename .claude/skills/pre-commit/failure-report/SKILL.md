# Pre-commit — Failure Report

## Format
```
🚨 PRE-COMMIT FAILED
─────────────────────
Check: [TypeScript | ESLint | Firebase Rules | Tests]
Status: ❌ FAILED
Errors:
  [file:line — error message]
─────────────────────
Action: [what to fix]
Agent to re-run: [agent name and why]
```

## Agent Re-run Map
| Failure | Re-run |
|---|---|
| TypeScript type error in component | component-forge |
| TypeScript type error in service/hook | state-architect |
| TypeScript type error in types file | api-contract |
| ESLint in component | component-forge |
| Firebase rules invalid | firebase |
| Test failure in service test | state-architect |
| Test failure in component test | component-forge |
