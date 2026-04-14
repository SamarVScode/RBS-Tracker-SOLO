---
description: Initialize swarm session — startup protocol, intake gate, complexity scoring, routing
---

## STEP 1 — Read orchestrator detail
```bash
cat .claude/ORCHESTRATOR_DETAIL.md
```

## STEP 2 — Init session
```bash
mkdir -p .swarm
date '+%Y%m%d-%H%M%S' > .swarm/SESSION_ID
rm -f .swarm/.initiated-* .swarm/.rtk-active .swarm/intake-brief.md
python -c "import json; sid=open('.swarm/SESSION_ID').read().strip(); open('.swarm/retry-budget.json','w').write(json.dumps({'session':sid,'used':0,'max':5,'agents':{}}))"
cat .swarm/SESSION_ID
```

## STEP 3 — Load project memory and snapshot
```bash
cat .swarm/project-memory.json 2>/dev/null || echo "No prior memory."
cat .swarm/pre-compact-snapshot.json 2>/dev/null && echo "Snapshot found — restore task queue."
```

## STEP 4 — Check incomplete checkpoints
```bash
ls .swarm/*-checkpoint.json 2>/dev/null || echo "none"
```
If found: read each, report completed vs pending. Resume from last incomplete agent.

## STEP 5 — Read README.md
Extract: project name, platform, stack, active task queue.
If platform is unfilled placeholder `[react-web | react-native | both]` → flag for intake to ask.

## STEP 6 — Run intake-agent FIRST
Always run intake-agent before scoring. No exceptions.

Read `.claude/ops/intake-agent.md`, then spawn intake-agent with:
- The user's task: `$ARGUMENTS`
- Current README platform status
- Instruction to write `.swarm/intake-brief.md`

Wait for `.swarm/intake-brief.md` to be written before proceeding.

## STEP 7 — Score complexity from enriched intake brief
```bash
cat .swarm/intake-brief.md | bash .claude/hooks/complexity-score.sh
cat .swarm/complexity.json
```
The scorer reads the enriched brief — not the raw prompt. This is what makes v2 scoring precise.

## STEP 8 — Orchestrator routes by complexity_level

**Simple** (complexity_level = Simple):
- Read `.claude/ops/{suggested_agents}.md`
- Spawn that agent directly — skip context-manager

**Medium** (complexity_level = Medium):
- Read `.claude/ops/context-manager.md` → spawn context-manager
- context-manager produces `.swarm/context-brief.md`
- Then spawn 2-3 agents via their ops cards

**Complex** (complexity_level = Complex):
- Read `.claude/ops/context-manager.md` → spawn context-manager
- Read `.claude/ops/execution-manager.md` → spawn execution-manager
- execution-manager builds task queue and fires full agent chain via ops cards

**Ops cards:** `.claude/ops/{agent}.md` — read before spawning every agent.
The ops card states: model, what to read, what to write, rules, and path to the full skill file.

## STEP 9 — Print dashboard
```
SESSION: {SESSION_ID} | PROJECT: {name} | PLATFORM: {platform} | SCORE: {level}
CHECKPOINTS: {list or none} | MEMORY: {n} sessions
TASK QUEUE: {active items from README}
```
If $ARGUMENTS is empty: dashboard only, ready for tasks.
If $ARGUMENTS is non-empty: proceed with routing immediately.
