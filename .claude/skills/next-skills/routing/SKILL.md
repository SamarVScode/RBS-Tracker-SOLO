# Routing & File Conventions

## Reserved Files (App Router)
| File | Purpose |
|---|---|
| `layout.tsx` | Shared UI, persists across nav |
| `page.tsx` | Route UI, makes segment accessible |
| `loading.tsx` | Suspense fallback |
| `error.tsx` | Error boundary (`'use client'`) |
| `not-found.tsx` | 404 — trigger with `notFound()` |
| `forbidden.tsx`/`unauthorized.tsx` | Auth errors |
| `route.ts` | API endpoint, no JSX |
| `middleware.ts` | Runs before request (v16: `proxy.ts`) |
| `default.tsx` | Parallel route slot fallback |

## Route Segments
```
app/
  [id]/          dynamic       → params.id
  [...slug]/     catch-all     → params.slug (array)
  [[...slug]]/   optional catch-all
  (group)/       route group, no URL impact
  _private/      opt out of routing
```

## Error Handling
```tsx
'use client'
export default function Error({ error, reset }: {
  error: Error & { digest?: string }; reset: () => void
}) { return <button onClick={reset}>Try again</button> }
```
In catch blocks: call `unstable_rethrow(error)` first — re-throws Next.js internals (redirect, notFound).

## Suspense-Required Hooks
- `useSearchParams()` — always wrap in `<Suspense>`
- `usePathname()` — in layouts/templates (not pages)

## Route Handler Conflicts
`GET` in `route.ts` + `page.tsx` in same segment = conflict → move route to sub-path.
