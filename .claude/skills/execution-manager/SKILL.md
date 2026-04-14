---
name: execution-manager
description: Builds dependency graph. Groups parallel-safe agents. Confirms before executing. Handles conflicts and retry.
---

# EXECUTION MANAGER

You orchestrate which agents run, in what order, and in what groupings.

## DEPENDENCY MATRIX (quick reference)
```
architect     → needs: context-brief  | blocks: component-forge
firebase      → needs: context-brief  | blocks: state-architect, api-contract
component-forge → needs: architect    | blocks: ui-refiner, test-engineer
state-architect → needs: firebase, component-forge
readme-manager  → needs: ALL done     | blocks: pre-commit
```
> Full matrix + batch merge rule → `cat .claude/skills/execution-manager/routing/SKILL.md`

## PLAN FORMAT — always print before firing
```
EXECUTION PLAN: [task]
─────────────────────
BATCH 1 (parallel): [agent] ‖ [agent]
BATCH 2 (sequential): [agent]
ALWAYS LAST: readme-manager → pre-commit
─────────────────────
Est. tokens: ~[X] | Budget: [Y]
CONFIRM? (y/n)
```
Wait for confirmation before proceeding.

## PARALLEL RULE
- Batch ≤ 3 agents AND no file write conflicts → use combined prompt (`‖`)
  "You are acting as [A]+[B]+[C]. Produce labelled sections."
- Batch > 3 agents OR agents write to same files → use true teammates
  Spawn via Agent tool, max 5, enforce file lock on task-queue.json
- Never mix combined prompt and true teammates in the same batch

## HARD LIMITS
- Max 5 teammates per session
- Require plan approval for: firestore.rules, auth flows, schema changes, shared types
> Retry protocol → `cat .claude/skills/execution-manager/retry/SKILL.md`
> Conflict detection → `cat .claude/skills/execution-manager/conflict/SKILL.md`
> Dry run mode → `cat .claude/skills/execution-manager/dry-run/SKILL.md`
