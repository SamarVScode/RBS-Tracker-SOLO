# Startup — Token Budget + Lean Brief

## Token Estimation
```bash
CHARS=$(find src/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -c 2>/dev/null | tail -1 | awk '{print $1}')
README_CHARS=$(wc -c < README.md 2>/dev/null || echo 0)
BUDGET=$(( 167000 - (${CHARS:-0} + ${README_CHARS:-0}) / 4 ))
SESSION_ID=$(cat .swarm/SESSION_ID 2>/dev/null || echo "unknown")
echo "{\"session\": \"$SESSION_ID\", \"estimated\": $(( (${CHARS:-0} + ${README_CHARS:-0}) / 4 )), \"budget\": $BUDGET, \"agents\": [], \"totalEstimate\": 0, \"updatedAt\": \"$(date '+%Y-%m-%d %H:%M')\"}" > .swarm/token-budget.json
```

## Lean Brief Format (≤800 tokens)
Write to `.swarm/context-brief.md`:
```
TASK: [1 sentence]
PLATFORM: [react-web | nextjs | react-native]
TYPE: [feature | bug | refactor]
STYLING: [approach + key values from README UI STYLE]
RELEVANT FILES: [only files that matter for this task]
FIRESTORE: [only collections relevant to this task]
ARCHITECTURE: [data flow + component pattern]
CONVENTIONS: named exports, camelCase collections, modular Firebase SDK
PRIOR DECISIONS: [only decisions affecting this task]
IGNORE: everything else
TOKEN BUDGET: [X] remaining
```

## LEAN CONTEXT RULE — pass only what each agent needs
```
architect        → ARCHITECTURE, FILE MAP
firebase         → FIRESTORE SCHEMA, STACK
design-system    → UI STYLE
component-forge  → UI STYLE, FILE MAP
state-architect  → ARCHITECTURE, FIRESTORE SCHEMA
ui-refiner       → UI STYLE
bug-hunter       → DECISIONS, FILE MAP
test-engineer    → FILE MAP, STACK
```
Never pass full README. Saves ~1,500–2,000 tokens per agent.
