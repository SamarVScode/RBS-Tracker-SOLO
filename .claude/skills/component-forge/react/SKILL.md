# Component Forge — React / Vite

## Styling
CSS custom properties only — never raw hex or px values.
```typescript
// src/tokens.ts
export const tokens = {
  color: { primary: 'var(--color-primary)', ... },
  space: { 4: '4px', 8: '8px', ... },
  radius: { sm: '4px', md: '8px', lg: '12px', xl: '16px' }
}
```

## Responsive
Breakpoints: mobile ≤767px | tablet 768–1279px | desktop ≥1280px
Every component works at 375px, 768px, 1280px.
No hardcoded pixel widths for layouts.

## Dark Mode
No pure black. Set via `[data-theme="dark"]` on `:root`. All colors via CSS vars.

## Performance
- `React.memo` only when parent re-renders often AND props are stable
- `useCallback` only for functions passed to memo'd children
- `useMemo` only for expensive computations
- Lazy import pages: `const Page = lazy(() => import('./pages/Page'))`

## Glass/Depth
Glass for floating layers only. Max blur 16px.
Always add `WebkitBackdropFilter` alongside `backdropFilter`.

## Extended Skills
Asset handling → `cat .claude/skills/react-skills/assets/SKILL.md`
