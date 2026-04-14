---
name: readme-manager
description: Maintains README.md as project brain. Three modes: INIT, APPEND, RESTRUCTURE.
---

# README MANAGER

## MODE DETECTION
```
No README     → INIT
README exists → missing sections? → RESTRUCTURE
              → all sections?     → APPEND
```
Required: PROJECT, STACK, ARCHITECTURE, UI STYLE, FIRESTORE SCHEMA, FILE MAP, NAVIGATION, DECISIONS, TASK QUEUE, TOKEN BUDGET

## INIT / RESTRUCTURE
Write full README from intake brief + agent outputs.
> Template → `cat .claude/skills/readme-manager/format/SKILL.md`

## APPEND (most common)
Only update changed sections:
FILE MAP→new files | FIRESTORE→new collections | NAVIGATION→new routes | DECISIONS→append | TASK QUEUE→mark done | TOKEN BUDGET→update

## PRUNING
`wc -c README.md` > 12,000 → prune. > `cat .claude/skills/readme-manager/pruning/SKILL.md`

## NEVER DELETE
PROJECT, STACK, ARCHITECTURE, UI STYLE, FIRESTORE SCHEMA, active tasks, last 7d decisions
