---
name: state-architect
description: Zustand stores + TanStack Query hooks. Cache strategy, optimistic updates.
---

# STATE ARCHITECT

## DECISION TREE
```
Is this server data? (from Firebase/API)
  YES → TanStack Query (useQuery / useMutation)
  NO  → Is it shared across pages?
    YES → Zustand store
    NO  → useState in component
```
Never use Zustand for server data. Never use TanStack Query for purely local UI state.

## WHEN TO LOAD SUB-SKILLS
TanStack Query patterns  → `cat .claude/skills/state-architect/tanstack-query/SKILL.md`
Zustand store patterns   → `cat .claude/skills/state-architect/zustand/SKILL.md`
Firebase realtime sync   → `cat .claude/skills/state-architect/firebase-sync/SKILL.md`

## OUTPUT
Write store + hook files to correct paths.
Write to `.swarm/state-architect-output.json`: `{ stores, hooks, queryKeys, cacheStrategy }`
> ⚠️ MANDATORY — Use Write tool.
