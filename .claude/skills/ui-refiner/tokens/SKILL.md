# UI Refiner — Tokens

## Audit Commands
```bash
grep -r "border-radius\|borderRadius" src/components/ --include="*.tsx" | grep -v "\.swarm"
grep -r "font-size\|fontSize" src/components/ --include="*.tsx" | grep -v "\.swarm"
grep -r "padding\|margin" src/components/ --include="*.tsx" | grep -v "\.swarm"
```

## Fix Drift
- `borderRadius: 14` → `borderRadius: 12` (closest token)
- `fontSize: 15` → `fontSize: 14` or `fontSize: 16`
- `padding: '13px'` → `padding: '12px'`

## Valid Spacing Scale
4, 8, 12, 16, 20, 24, 32, 40, 48, 64 — no other values

## Valid Radius Scale
sm: 4 | md: 8 | lg: 12 | xl: 16 | full: 9999

## Never
- Hardcoded hex colors in components
- Raw px values not on the spacing scale
- Inline style objects defined inside JSX (must be in styles.ts)
