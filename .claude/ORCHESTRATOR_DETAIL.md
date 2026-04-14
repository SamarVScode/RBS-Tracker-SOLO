# ORCHESTRATOR DETAIL
> Lead only. Agents never load this file.

## STARTUP
1. `mkdir -p .swarm && date '+%Y%m%d-%H%M%S' > .swarm/SESSION_ID`
2. Load `.swarm/project-memory.json` if exists
3. Resume from `.swarm/*-checkpoint.json` if found
4. **README cache**: `md5sum README.md` → compare `.swarm/readme-hash`
   - Match + `.swarm/context-cache.md` exists + README mtime ≤ hash mtime → cache hit, skip 5
   - Miss → read README, write hash + cache
5. READ `README.md` → project name, platform, stack, task queue
6. **intake-agent** → `.claude/ops/intake-agent.md` → `.swarm/intake-brief.md`
7. **Score**: `cat .swarm/intake-brief.md | bash .claude/hooks/complexity-score.sh` → `.swarm/complexity.json`
8. Route by `complexity_level`

## ROUTING
```
Simple  → .claude/ops/{suggested_agents}.md → spawn direct | FORCE HAIKU on all agents
Medium  → context-manager → 2-3 agents via ops cards | skip execution-manager
Complex → context-manager → execution-manager → full chain via ops cards
```
Always read `.claude/ops/{agent}.md` before spawning.

## NEW PROJECT
Platform unfilled → intake-agent asks ONCE → locks in README → score minimum Medium

## MODELS
```
haiku:  intake-agent, context-manager, ui-refiner, readme-manager, pre-commit
sonnet: execution-manager, design-system, component-forge, firebase, state-architect, perf-optimizer, test-engineer, api-contract
opus:   architect, bug-hunter, security-auditor
```

## KEYWORD → AGENT
| Keywords | Agent | Route |
|---|---|---|
| fix,bug,crash,error,undefined | bug-hunter | simple |
| slow,bundle,performance,optimize | perf-optimizer | simple |
| color,style,spacing,font,polish | ui-refiner | simple |
| structure,route,architecture | architect | med/complex |
| component,hook,form,modal,page | component-forge | med/complex |
| firestore,auth,firebase,rules | firebase | med/complex |
| store,zustand,state,query,cache | state-architect | med/complex |
| tokens,a11y,design contract | design-system | med/complex |
| test,spec,vitest,playwright | test-engineer | med/complex |
| security,XSS,injection | security-auditor | med/complex |
| API,contract,schema,endpoint | api-contract | med/complex |

## CHAINING
| Task | Chain |
|---|---|
| Full feature | architect ‖ firebase ‖ api-contract → design-system → component-forge → state-architect ‖ ui-refiner → test-engineer |
| Component+state | design-system → component-forge → state-architect |
| Bug fix | bug-hunter → affected agent |
| Security | security-auditor → firebase |
| API change | api-contract → firebase → state-architect |

`‖` = combined prompt | `→` = sequential

## CONFLICT
After each batch: check file paths, Firestore names, component names vs README.
Conflict → print `CONFLICT DETECTED: Agent | What | Option A | Option B` → halt, wait.

## DRY RUN
`--dry-run` → show plan + files → do NOT write → print "Dry run complete."

## ROLLBACK
Before writes: `git stash push -m "swarm-rollback-$(cat .swarm/SESSION_ID)"` or `cp -r src/ .swarm/rollback/src-backup`

## CONDITIONAL SKIP
Read `.swarm/complexity.json` after coding agents:
- `readme_update_needed: false` → skip readme-manager
- `pre_commit_needed: false` → skip pre-commit, write minimal COMMIT_READY
- `force_haiku: true` → all agents use haiku

## POST-EXECUTION
After COMMIT_READY exists:
1. Validate session ID, show files changed
2. Ask: `Commit to GitHub? (y/n)` with proposed message
3. y → `git add -A && git commit && git push` | n → "Changes saved locally."
4. `rm -f .swarm/COMMIT_READY`
Never auto-commit.

## TEAMS
- Max 5 teammates, fresh context each, include all task context in spawn
- `‖` (combined prompt): batch ≤ 3 agents, no file conflicts → one LLM call
- True teammates: batch > 3 OR file conflicts → Agent tool spawns
- Never mix both in same batch

## COMPACTION
Preserve: SESSION_ID, active agent+task, file paths, Firestore names, errors+fixes, task queue, complexity flags.
Discard: code in files, planning, diagnostics, hook logs, retries.
After: re-read `.swarm/pre-compact-snapshot.json`
