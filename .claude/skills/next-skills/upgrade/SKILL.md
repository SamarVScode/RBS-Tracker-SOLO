# Next.js Upgrade Guide

## Always Start With the Codemod
```bash
npx @next/codemod@latest upgrade latest
```
This handles the majority of mechanical changes automatically.

## v14 → v15 Breaking Changes
| Change | Action |
|---|---|
| `params`, `searchParams` now async | Await them: `const { id } = await params` |
| `cookies()`, `headers()` now async | Await them: `const c = await cookies()` |
| `fetch` cache default changed to `no-store` | Add `cache: 'force-cache'` where caching needed |
| `next/headers` re-export removed | Import directly from `next/headers` |
| Turbopack stable | `next dev --turbopack` (optional) |

Codemod for async APIs:
```bash
npx @next/codemod@canary next-async-request-api .
```

## v15 → v16 Breaking Changes
| Change | Action |
|---|---|
| `middleware.ts` renamed to `proxy.ts` | Rename file |
| `cacheComponents` moved to stable | Remove `experimental:` wrapper if using |

> For v13→v14, custom server migration, and Page Router → App Router migration → see REF.md
