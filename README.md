# RBS Tracker

## PROJECT
Name: RBS Tracker
Platform: react-web
Description: Daily Random Blood Sugar tracker. Captures fasting, post-meal, and night readings. Dashboard with Recharts line/bar charts, filterable history table, light/dark theme.
Status: Active

## STACK
Frontend: React 18 + Vite + TypeScript strict
Database: Firebase Firestore (v9+ modular)
State: Zustand v4 (UI state) + TanStack Query v5 (server state)
Router: react-router-dom v6
Charts: Recharts
Styling: Inline styles + CSS variables (no Tailwind, no CSS modules)

## ARCHITECTURE
```
src/
├── constants/routes.ts          — Route path constants
├── types/index.ts               — All TypeScript interfaces
├── lib/firebase.ts              — Firebase init (placeholder config)
├── services/readingsService.ts  — Firestore CRUD
├── stores/themeStore.ts         — Zustand: light/dark theme
├── hooks/useReadings.ts         — TanStack Query hooks
├── components/
│   ├── Layout.tsx               — Nav + theme toggle + mobile bottom bar
│   ├── SummaryCard.tsx          — Dashboard metric card
│   ├── LineChartRBS.tsx         — Recharts line chart (3 series)
│   ├── BarChartRBS.tsx          — Recharts bar chart (grouped)
│   ├── ReadingsTable.tsx        — Paginated table with filters
│   ├── AddReadingForm.tsx       — Controlled form: date + 3 RBS inputs
│   └── EmptyState.tsx           — No-data CTA component
└── pages/
    ├── DashboardPage.tsx        — Charts + summary cards
    ├── AddReadingPage.tsx       — Add reading form page
    └── HistoryPage.tsx          — History table + filters
```

## UI STYLE
Inline styles only. CSS variables in src/theme.css for all tokens.
Light theme: :root | Dark theme: [data-theme="dark"]
Breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)
Theme toggle: Zustand useThemeStore + document.documentElement.setAttribute

## FIRESTORE SCHEMA
Collection: readings
```
  id:           string       (auto-generated docId)
  patientId:    string       "patient-001" (hardcoded, no auth v1)
  date:         string       YYYY-MM-DD
  fastingRBS:   number|null  mg/dL, morning before food
  postMealRBS:  number|null  mg/dL, after food
  nightRBS:     number|null  mg/dL, at night
  notes:        string       optional, default ""
  createdAt:    Timestamp
```
Indexes: patientId + date (asc) composite

## NAVIGATION
```
/         → DashboardPage (charts + summary cards)
/add      → AddReadingPage (add reading form)
/history  → HistoryPage (table + date/type filters)
```
No auth routes in v1. Layout wraps all routes.

## DECISIONS
- 2026-04-13: No authentication in v1 — single patient "patient-001" hardcoded. Multi-patient auth deferred.
- 2026-04-13: Inline styles chosen over Tailwind — follows HARD RULE for web platform in CLAUDE.md.
- 2026-04-13: Recharts chosen for charts — good React 18 support, declarative API, responsive containers.
- 2026-04-13: Firebase config uses placeholder strings — app detects unconfigured state and shows warning banner without crashing.
- 2026-04-13: Partial readings allowed — any of the 3 daily values may be null.

## TASK QUEUE
- [x] Scaffold Vite + TypeScript project
- [x] Firebase service layer
- [x] TypeScript types
- [x] Theme CSS variables (light/dark)
- [x] Zustand theme store
- [x] TanStack Query hooks
- [x] Layout + navigation
- [x] Dashboard page (line + bar charts + summary cards)
- [x] Add Reading form
- [x] History page (table + filters)
- [ ] Add Firebase project + replace config placeholders (user task)
- [ ] Optional: multi-patient auth

## TOKEN BUDGET
Estimated: ~12,000 | Remaining: ~116,000 | Warning: false
