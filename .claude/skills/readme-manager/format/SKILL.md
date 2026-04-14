# README Format Template

```markdown
# PROJECT BRAIN
> Single source of truth. Maintained by readme-manager after every task.

## PROJECT
Name: [app name] | Platform: [react-web|nextjs|react-native|both]
Firebase ID: [id] | Admin: [admin@app.com/password]
Repo: [url] | Updated: [YYYY-MM-DD]

## STACK
Web: React 18+Vite+TS | react-router-dom v6 | react-hot-toast
Mobile: RN+Expo+TS | React Navigation v6
Next.js: Next.js 15+TS | App Router
Shared: Zustand v4 | TanStack Query v5 | Firebase Auth+Firestore+Functions
Styling: [inline|Tailwind|StyleSheet.create|CSS modules]
Testing: Vitest+RTL | Playwright (web) | Detox (RN)

## ARCHITECTURE
Pattern: [feature-based|domain-driven|atomic]
State: Zustand→UI | TanStack Query→server data
Data flow: Component→useHook→Service→Firestore
Auth: Firebase Auth→onAuthStateChanged→authStore

Component hierarchy:
[App]
  ├── [AuthNavigator] → Login
  └── [MainNavigator] └── [pages/screens]

## UI STYLE
Approach: [inline|Tailwind|StyleSheet.create] | Font: [Inter|system]
Primary: [#hex] | Background: [#hex] | Border radius: [12]
Spacing: 4,8,12,16,20,24,32,40,48,64
Shadow: [value] | Card: [desc] | Loading: [skeleton|shimmer]

## FIRESTORE SCHEMA
[collections as created]

## FILE MAP
### Web (src/) | ### Mobile | ### Firebase Functions (functions/src/)
[files as created]

## NAVIGATION
### Web Routes | ### React Native Screens
[routes/screens as created]

## DECISIONS
[YYYY-MM-DD] | [decision] | [reason]

## TASK QUEUE
[ ] Initial setup | all agents | pending

## TOKEN BUDGET
[tokens used] | [budget remaining] | [last updated]
```
