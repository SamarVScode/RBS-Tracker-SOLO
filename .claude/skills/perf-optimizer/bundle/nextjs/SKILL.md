# Perf — Bundle (Next.js)

## Analyze
```bash
npm install @next/bundle-analyzer
ANALYZE=true next build
```

## Key Wins
- Ensure `'use client'` components are as small as possible — move logic to server
- Use `next/dynamic` for heavy client components: `const Chart = dynamic(() => import('./Chart'), { ssr: false })`
- Images: always `next/image` with `sizes` prop
- Fonts: always `next/font` — never @import in CSS
- PPR (v16+): static shell instant, dynamic content streams — `experimental: { ppr: true }`
- ISR: `export const revalidate = 60` for time-based revalidation

## Extended Skills
Cache components   → `cat .claude/skills/next-skills/cache-components/SKILL.md`
Runtime infra      → `cat .claude/skills/next-skills/runtime-infra/SKILL.md`
