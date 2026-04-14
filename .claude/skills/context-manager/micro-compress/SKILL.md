# Micro-Compress — Between Batch Summary

## Steps
1. Read `.swarm/{agent}-output.json`
2. Code already written to files — do NOT re-read project files
3. Compress to ≤200 token summary
4. Write to `.swarm/{agent}-summary.md`

## Summary Format
```
{AGENT} DONE:
- Files created/modified: [paths]
- Key decisions: [1-2 lines]
- Interfaces/types defined: [names only]
- Collections touched: [names only]
- Next agent needs: [what specifically to reference]
```

## Token Budget Check
Read `.swarm/token-budget.json` before each batch.
- < 20,000 → warn execution-manager immediately
- < 10,000 → halt, run readme-manager, tell user to /compact
