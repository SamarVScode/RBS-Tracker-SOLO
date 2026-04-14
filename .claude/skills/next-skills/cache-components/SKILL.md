# Cache Components (Next.js 16+)

## Enable
```ts
// next.config.ts
experimental: { cacheComponents: true }
```

## `'use cache'` Directive
```ts
// File-level
'use cache'
export async function getCachedData() { return await db.query() }

// Function-level
export async function getData() {
  'use cache'
  return await fetch('/api/data').then(r => r.json())
}

// Component-level
async function CachedComponent() {
  'use cache'
  const data = await fetchData()
  return <div>{data.title}</div>
}
```

## Cache Profiles — `cacheLife()`
```ts
import { unstable_cacheLife as cacheLife } from 'next/cache'
async function getData() {
  'use cache'
  cacheLife('hours')
  return await fetch('/api/data')
}
```

| Profile | Stale | Revalidate | Expire |
|---|---|---|---|
| `seconds` | 0s | 1s | 1min |
| `minutes` | 0s | 1min | 1hr |
| `hours` | 0s | 1hr | 1day |
| `days` | 0s | 1day | 1week |
| `weeks` | 0s | 1week | 1month |
| `max` | 0s | 1month | 1year |

Custom: `cacheLife({ stale: 30, revalidate: 60, expire: 3600 })`

## Tagging & Invalidation
```ts
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { revalidateTag } from 'next/cache'

async function getPost(id: string) {
  'use cache'
  cacheTag(`post-${id}`, 'posts')
  return await db.posts.findById(id)
}

async function updatePost(id: string, data: FormData) {
  'use server'
  await db.posts.update(id, data)
  revalidateTag(`post-${id}`)
}
```
