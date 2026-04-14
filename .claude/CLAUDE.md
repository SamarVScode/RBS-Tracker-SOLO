---
# ORCHESTRATOR CORE
> Loaded by every agent. Target: ≤300 tokens. Full playbook: read ORCHESTRATOR_DETAIL.md (lead only).

## FLOW
User Prompt → intake-agent (verify + enrich) → complexity-score.sh (score brief) → route

## STACK
Web:    React 18+Vite+TS strict | Firebase Auth+Firestore+Functions | Zustand v4 | TanStack Query v5 | react-router-dom v6
Next:   Next.js 15+TS strict | Firebase Auth+Firestore+Admin SDK | Zustand v4 | Server Actions | App Router
Mobile: RN+Expo+TS strict | Firebase Auth+Firestore | Zustand v4 | TanStack Query v5 | React Navigation v6
Shared: Firebase project, Zustand stores, TanStack hooks, service layer, TS types

## PLATFORM
Platform is locked in README ## PROJECT → Name, Platform fields.
If empty → intake-agent asks ONCE → locks permanently.
Platform determines which sub-skills every agent loads.

## SPAWN RULES
`‖` = ONE prompt "You are [A]+[B]+[C]. Produce labelled sections." | context_inheritance: minimal
Output JSON: ≤200 token summary only — code in src/ | Pass ONLY relevant README sections to each agent.

## LEAN CONTEXT RULE
architect→ARCHITECTURE,FILE MAP | firebase→FIRESTORE,STACK | design-system→UI STYLE
component-forge→UI STYLE,FILE MAP | state-architect→ARCHITECTURE,FIRESTORE
ui-refiner→UI STYLE | bug-hunter→DECISIONS,FILE MAP | test-engineer→FILE MAP,STACK

## HARD RULES
Web: inline styles | RN: StyleSheet.create | Responsive: 375/768/1280px
Named exports | TS strict, no `any` | camelCase Firestore | Firebase v9+ modular only
Complete files | Loading+error+empty states | No emojis in output

## CONVENTIONS
Routes: constants/routes.ts | All except /login→ProtectedRoute
Services: {f}Service.ts | Hooks: use{F}.ts | Stores: {f}Store.ts
RN: screens/{F}Screen.tsx | navigation/{T}Navigator.tsx
Actions (Next.js): src/actions/{f}Actions.ts
