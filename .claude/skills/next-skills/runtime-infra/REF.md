# Runtime & Infra — Reference

## Minimal Cache Handler (Redis)
```js
// cache-handler.js
const { createClient } = require('redis')
const client = createClient({ url: process.env.REDIS_URL })
client.connect()

module.exports = class CacheHandler {
  async get(key) {
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  }
  async set(key, data, ctx) {
    const ttl = ctx.revalidate ?? 3600
    await client.setEx(key, ttl, JSON.stringify(data))
  }
  async revalidateTag(tag) {
    // iterate keys with tag and delete
  }
}
```

## Edge Runtime Constraints
Cannot use in Edge:
- `fs`, `path`, `crypto` (Node built-ins)
- Most npm packages that use Node APIs
- Long-running processes

Can use in Edge:
- `fetch`, `Request`, `Response`
- `TextEncoder`, `TextDecoder`
- Web Crypto API
- `@vercel/edge` helpers

## Middleware (proxy.ts in Next.js 16+)
```ts
// middleware.ts (v15) / proxy.ts (v16)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Auth check, geo-redirect, A/B, etc.
  if (!request.cookies.get('token')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],  // only run on these routes
}
```

## Environment Variables
```ts
// Accessible server-side only (default)
PRIVATE_KEY=...

// Exposed to client (prefix NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=...
```
Never put secrets in `NEXT_PUBLIC_*` — they ship to browser.

## ISR Patterns
```ts
// Time-based revalidation
export const revalidate = 60  // seconds — file-level

// On-demand revalidation (Server Action or Route Handler)
import { revalidatePath, revalidateTag } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
revalidateTag('posts')
```
