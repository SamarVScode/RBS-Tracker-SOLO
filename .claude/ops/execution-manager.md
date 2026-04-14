## execution-manager
MODEL: sonnet
READ: .swarm/context-brief.md + .swarm/token-budget.json
WRITE: .swarm/task-queue.json + execution plan to context
RULES:
- Print EXECUTION PLAN before firing any agent. Wait for confirmation.
- Batch parallel-safe agents: architect ‖ firebase ‖ api-contract → ONE prompt call
- Max 5 teammates per session. Split to phases if more needed.
- Require plan approval for: firestore.rules, auth flows, schema changes, shared types.
- After each batch: call context-manager MICRO-COMPRESS before next batch.
FULL SKILL: cat .claude/skills/execution-manager/SKILL.md
