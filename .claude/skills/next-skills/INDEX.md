# next-skills — Skill Index

7 skills. Each has a SKILL.md (always-load rules) + REF.md (lazy-load details).
Load only what the current task needs.

## Skill Map

| Skill | Load When | Path |
|---|---|---|
| `next-rsc-boundaries` | Writing/reviewing Server vs Client components, prop passing, `'use client'`/`'use server'` | `./SKILL.md` (top-level) |
| `next-async-data` | Data fetching, Server Actions, mutations, async params/cookies/headers, waterfall fixes | `async-data/` |
| `next-routing` | Creating pages/layouts/error boundaries, route handlers, modals, parallel/intercepting routes | `routing/` |
| `next-assets` | Images, fonts, scripts, SEO metadata, OG images, bundling errors, hydration errors | `assets/` |
| `next-runtime-infra` | Edge vs Node runtime choice, Docker self-hosting, multi-instance ISR, build debugging | `runtime-infra/` |
| `next-cache-components` | `'use cache'`, PPR, `cacheLife()`, `cacheTag()`, `revalidateTag()` — Next.js 16+ | `cache-components/` |
| `next-upgrade` | Upgrading between Next.js major versions | `upgrade/` |

## Load Combinations by Task

| Task | Skills to Load |
|---|---|
| Build a new page | `next-routing` + `next-rsc-boundaries` |
| Add data fetching | `next-async-data` + `next-rsc-boundaries` |
| Add a modal | `next-routing` (parallel/intercepting routes) |
| Fix hydration error | `next-assets` |
| Add SEO / OG image | `next-assets` |
| Optimize images/fonts | `next-assets` |
| Fix bundle size | `next-assets` |
| Set up caching (v16) | `next-cache-components` |
| Self-host / Docker | `next-runtime-infra` |
| Upgrade Next.js | `next-upgrade` |
| Full feature (page + data + UI) | `next-routing` + `next-async-data` + `next-rsc-boundaries` |

## REF.md Policy
Only load `REF.md` when:
- The SKILL.md rules don't cover the specific pattern needed
- Agent explicitly needs a code example for an edge case
- Debugging a non-obvious issue

## Token Budget (approximate)
| File | ~Tokens |
|---|---|
| Each SKILL.md | 250–350 |
| Each REF.md | 200–300 |
| This index | ~120 |
