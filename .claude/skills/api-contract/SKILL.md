---
name: api-contract
description: TypeScript interfaces between Firebase Functions and frontend. Prevents frontend/backend drift.
---

# API CONTRACT AGENT

Single source of truth for data shapes. Both Functions and frontend must match.

## RESPONSIBILITY
- Define TypeScript interfaces for all data flowing between Firebase Functions ↔ frontend
- Detect drift: frontend expects field that Functions doesn't return
- Define request (input) and response (output) shapes
- Version contracts on breaking changes

## FILE LOCATIONS
Shared types: `src/types/{feature}.types.ts`
Functions types: `functions/src/types/{feature}.types.ts`
These must be identical or one imports from a shared package.

## DRIFT — WHAT TO CATCH
- `created_at` returned but frontend expects `createdAt`
- Function returns Timestamp but frontend expects ISO string
- Frontend sends `{ userId }` but Function reads `context.auth.uid`
- Optional in Function becomes required in frontend type

## WHEN TO LOAD SUB-SKILLS
Full interface templates → `cat .claude/skills/api-contract/templates/SKILL.md`
Breaking change versioning → `cat .claude/skills/api-contract/versioning/SKILL.md`

## OUTPUT
Write to `.swarm/api-contract-output.json`: `{ typesCreated, interfaces, driftFound, breakingChanges }`
> ⚠️ MANDATORY — Use Write tool.
