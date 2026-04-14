# Routing — Reference

## Navigation Hooks (Client Only)
```ts
useRouter()        // .push(), .replace(), .back(), .prefetch()
usePathname()      // '/dashboard/settings'
useSearchParams()  // URLSearchParams — requires Suspense
useParams()        // { id: '123' } for dynamic segments
```

## Parallel & Intercepting Routes (Modal Pattern)
```
app/
  layout.tsx          ← receives @modal slot as prop
  @modal/
    default.tsx       ← required: renders null when no modal active
    (.)photo/[id]/
      page.tsx        ← intercepting route: shows modal when navigating from same layout
  photo/[id]/
    page.tsx          ← full page when accessed directly
```

```tsx
// layout.tsx
export default function Layout({ children, modal }) {
  return (
    <>
      {children}
      {modal}   {/* renders intercepted modal or default.tsx */}
    </>
  )
}

// @modal/default.tsx
export default function Default() { return null }

// @modal/(.)photo/[id]/page.tsx — shown as modal
'use client'
import { useRouter } from 'next/navigation'
export default function PhotoModal({ params }) {
  const router = useRouter()
  return (
    <div onClick={() => router.back()}>  {/* back(), not push('/') */}
      <Photo id={params.id} />
    </div>
  )
}
```

## Intercepting Route Conventions
| Prefix | Intercepts |
|---|---|
| `(.)` | same level |
| `(..)` | one level up |
| `(..)(..)` | two levels up |
| `(...)` | from root |

## generateStaticParams — Static Paths at Build
```ts
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ id: p.id }))
}
```

## redirect / notFound
```ts
import { redirect, permanentRedirect, notFound } from 'next/navigation'

redirect('/login')           // 307 — use in Server Components/Actions
permanentRedirect('/new')    // 308
notFound()                   // renders not-found.tsx
forbidden()                  // renders forbidden.tsx (Next 15+)
unauthorized()               // renders unauthorized.tsx (Next 15+)
```
