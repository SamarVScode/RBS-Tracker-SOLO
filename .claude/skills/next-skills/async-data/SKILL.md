# Async Data Patterns

## Next.js 15+ — Everything Async
```ts
const { id } = await params
const { q } = await searchParams
const cookieStore = await cookies()
const headersList = await headers()
```
Migration: `npx @next/codemod@canary next-async-request-api .`

## When to Use What
| Need | Use |
|---|---|
| Read data, no user input | Server Component (`async function Page()`) |
| Form/button mutation | Server Action (`'use server'`) |
| Webhook / custom HTTP response | Route Handler (`route.ts`) |
| Client-side caching/revalidation | SWR or TanStack Query |

## Waterfall Prevention
```ts
// ❌ Sequential
const a = await fetchA(); const b = await fetchB()
// ✅ Parallel
const [a, b] = await Promise.all([fetchA(), fetchB()])
// ✅ Preload pattern
const userPromise = fetchUser(); const postsPromise = fetchPosts()
const [user, posts] = await Promise.all([userPromise, postsPromise])
```

## Suspense Streaming
```tsx
// ✅ Layout renders instantly, data streams in
function Page() {
  return <Layout><Suspense fallback={<Skeleton />}><DataView /></Suspense></Layout>
}
async function DataView() {
  const data = await fetchData()
  return <div>{data.content}</div>
}
```

## SSG / ISR Data Patterns
```ts
// SSG — build-time static (blog, docs)
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ slug: p.slug }))
}
// No revalidate export = fully static, rebuilt only on deploy

// ISR — time-based revalidation (catalog, CMS)
export const revalidate = 3600 // revalidate every hour

// On-demand ISR — instant cache bust after mutation
'use server'
import { revalidateTag, revalidatePath } from 'next/cache'
revalidateTag('posts')                    // tag-based (preferred)
revalidatePath('/blog/[slug]', 'page')    // path-based
```

## Dynamic Route Behavior
```ts
// Force dynamic (SSR) — never cache
export const dynamic = 'force-dynamic'

// Force static — error if dynamic APIs used
export const dynamic = 'force-static'

// Default: auto-detected by Next.js based on API usage
// cookies()/headers()/searchParams → auto-SSR
// No dynamic APIs → auto-SSG
```

## Server Action Rules
- Must be `async` with `'use server'` (file-level or inline)
- Authenticate like API routes — never trust caller
- Return serializable values only
- Can be passed as props to client components
