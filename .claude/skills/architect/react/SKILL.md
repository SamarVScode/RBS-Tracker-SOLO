# Architect — React / Vite

## File Tree Format
```
src/
├── pages/FeatureName.tsx          ← NEW
├── components/featureName/
│   ├── FeatureCard.tsx            ← NEW
│   ├── FeatureForm.tsx            ← NEW
│   └── FeatureList.tsx            ← NEW
├── services/featureService.ts     ← NEW
├── hooks/useFeature.ts            ← NEW
└── constants/routes.ts            ← MODIFY
```

## Routing Rules
- All routes in `constants/routes.ts` as typed constants
- All routes except `/login` and `*` → `<ProtectedRoute>`
- Dynamic segments via `useParams`
- Lazy load all pages: `const Page = lazy(() => import('./pages/Page'))`

## Route Constant Format
```typescript
export const ROUTES = {
  HOME: '/',
  FEATURE: '/feature',
  FEATURE_DETAIL: '/feature/:id',
} as const
```

## Extended Skills
Routing patterns → `cat .claude/skills/react-skills/routing/SKILL.md`
