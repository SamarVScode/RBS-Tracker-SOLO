# Cache Components — Reference

## PPR (Partial Prerendering)
```ts
// next.config.ts
experimental: {
  cacheComponents: true,
  ppr: true,  // or 'incremental' for page-by-page adoption
}

// Per-page opt-in (incremental mode)
export const experimental_ppr = true
```
PPR renders static shell instantly (from CDN), streams dynamic parts. Requires `cacheComponents: true`.

## Custom Cache Profiles (global config)
```ts
// next.config.ts
const config = {
  experimental: {
    cacheComponents: true,
    cacheLife: {
      blog: {
        stale: 3600,        // serve stale for 1hr
        revalidate: 900,    // revalidate every 15min
        expire: 86400,      // hard expire after 1day
      },
    },
  },
}

// Usage:
cacheLife('blog')
```

## updateTag() — Server-Side Cache Busting
```ts
import { unstable_updateTag as updateTag } from 'next/cache'

// From Route Handler or Server Action
updateTag('products')  // invalidates without triggering revalidation immediately
```
vs `revalidateTag` — triggers background revalidation on next request.

## Nesting Cached Components
```tsx
// Parent cache wraps child — child inherits parent's cache profile
async function Page() {
  'use cache'
  cacheLife('days')
  return (
    <div>
      <CachedHeader />   {/* can have its own cacheLife */}
      <DynamicSection /> {/* opt out by NOT having 'use cache' */}
    </div>
  )
}
```

## What Can Be Cached
- Async Server Components ✅
- Async functions called from Server Components ✅
- Route Handlers ✅
- Client components ❌ (they're client-side)
- Functions with non-serializable args ❌

## Cache Invalidation Patterns
```ts
// By path
revalidatePath('/products', 'page')        // specific page
revalidatePath('/products/[id]', 'page')   // all pages matching segment
revalidatePath('/', 'layout')              // all pages using root layout

// By tag (preferred — more precise)
revalidateTag('products')
revalidateTag(`product-${id}`)
```
