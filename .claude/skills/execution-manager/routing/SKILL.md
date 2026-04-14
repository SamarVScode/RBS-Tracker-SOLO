# Routing — Full Dependency Matrix

## Matrix
| Agent | Depends On | Blocks |
|---|---|---|
| architect | context-brief | component-forge |
| firebase | context-brief | state-architect, api-contract |
| api-contract | context-brief | firebase, state-architect |
| component-forge | architect | ui-refiner, test-engineer |
| state-architect | firebase, component-forge | — |
| ui-refiner | component-forge | — |
| perf-optimizer | component-forge | — |
| test-engineer | component-forge | — |
| security-auditor | firebase | — |
| bug-hunter | context-brief | — (solo) |
| readme-manager | ALL done | pre-commit |
| pre-commit | readme-manager | commit |

## Agent Chains
| Task type | Chain |
|---|---|
| New full feature | `architect` ‖ `firebase` ‖ `api-contract` → `design-system` → `component-forge` → `state-architect` ‖ `ui-refiner` → `test-engineer` |
| New component + state | `design-system` → `component-forge` → `state-architect` |
| Bug fix | `bug-hunter` → affected agent |
| Security review | `security-auditor` → `firebase` |
| API change | `api-contract` → `firebase` → `state-architect` |

`‖` = one combined LLM call (~66% token savings per batch) | `→` = sequential

## Batch 1 Merge Rule
Combine architect+firebase+api-contract into ONE prompt with labelled sections: `## ARCHITECT`, `## FIREBASE`, `## API-CONTRACT`. Saves ~6,000 tokens.

## Team Size
\> 5 agents → split into phases, ask which to run first.
