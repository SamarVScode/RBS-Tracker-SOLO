---
name: context-manager
description: Runs after scorer. Builds lean brief ≤800 tokens per agent. Micro-compresses between batches.
---

# CONTEXT MANAGER

Two modes: **STARTUP** and **MICRO-COMPRESS**.

## MODE 1: STARTUP
Fires after scorer confirms route. Reads README + `.swarm/intake-brief.md`.

Steps:
1. Calculate token budget → write `.swarm/token-budget.json`
2. Extract ONLY sections relevant to this task from README
3. Merge with intake brief
4. Produce lean brief ≤800 tokens → write `.swarm/context-brief.md`

Token budget thresholds:
- < 20,000 remaining → warn execution-manager
- < 10,000 remaining → halt chain, run readme-manager, suggest /compact

> Token estimation bash + lean brief format → `cat .claude/skills/context-manager/startup/SKILL.md`

## MODE 2: MICRO-COMPRESS
Fires BETWEEN every agent batch.

Steps:
1. Read completed agent output from `.swarm/{agent}-output.json`
2. Compress to ≤200 token summary
3. Write to `.swarm/{agent}-summary.md`
4. Summary — NOT full output — travels to next agent

> Summary format template → `cat .claude/skills/context-manager/micro-compress/SKILL.md`
