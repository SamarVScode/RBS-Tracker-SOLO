# Architect — Next.js

## File Tree Format
```
app/
├── (auth)/
│   ├── login/page.tsx             ← NEW
│   └── layout.tsx                 ← NEW
├── (app)/
│   ├── layout.tsx                 ← NEW (main app shell)
│   ├── feature/
│   │   ├── page.tsx               ← NEW (Server Component by default)
│   │   ├── loading.tsx            ← NEW
│   │   └── error.tsx              ← NEW ('use client' required)
│   └── feature/[id]/page.tsx      ← NEW
├── api/feature/route.ts           ← NEW (Route Handler)
src/
├── components/feature/
├── services/featureService.ts
├── actions/featureActions.ts      ← NEW (Server Actions)
└── types/feature.types.ts
```

## Rendering Strategy Decision
```
Is data static / changes rarely (blog, docs, marketing)?
  YES → known paths at build? → SSG: generateStaticParams + no revalidate
        paths unknown/too many? → SSG + fallback: generateStaticParams partial + dynamicParams: true
  
Does data change periodically (product catalog, CMS)?
  YES → ISR: export const revalidate = 60 (tune per page)
        Need instant updates? → On-demand ISR: revalidateTag/revalidatePath from Server Action

Is data per-request / user-specific (dashboard, cart, auth-gated)?
  YES → SSR: default Server Component (no cache directive, no revalidate)
        Need realtime? → SSR shell + client SWR/TanStack for live data

Is it highly interactive / no SEO needed (admin panel, settings)?
  YES → CSR: 'use client' + SWR/TanStack Query + loading.tsx skeleton

Next.js 16+ with cacheComponents?
  → PPR: static shell from CDN + dynamic holes stream in
  → Best of SSG + SSR: export const experimental_ppr = true
```

| Strategy | Config | When |
|---|---|---|
| SSG | `generateStaticParams` | Blog, docs, marketing, known paths |
| ISR | `export const revalidate = N` | CMS, catalog, changes hourly/daily |
| On-demand ISR | `revalidateTag()` in Server Action | After mutation, instant cache bust |
| SSR | Default (no cache config) | Auth-gated, per-user, request-time data |
| CSR | `'use client'` + SWR | Realtime, no SEO, interactive |
| PPR (v16+) | `experimental: { ppr: true }` | Mix static shell + dynamic content |

## Key Rules
- Pages are Server Components by default — only add `'use client'` when needed
- Push `'use client'` to leaf components, not layouts
- Server Actions in `src/actions/` — always authenticate inside
- Route Handlers in `app/api/` — no JSX, plain Response
- `error.tsx` must be `'use client'`
- Middleware in `middleware.ts` (v15) / `proxy.ts` (v16)
- All params/searchParams/cookies/headers are async in v15+

## RSC Boundary Rule
Server data → Server Component → pass serializable props to Client Component
Never import Server-only modules in Client Components

## Extended Skills
Routing patterns   → `cat .claude/skills/next-skills/routing/SKILL.md`
Runtime infra      → `cat .claude/skills/next-skills/runtime-infra/SKILL.md`
