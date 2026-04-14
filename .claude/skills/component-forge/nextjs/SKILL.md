# Component Forge — Next.js

## Server vs Client Decision
```
Does it use: useState, useEffect, onClick, browser APIs?
  YES → 'use client'
  NO  → Server Component (default, no directive needed)
```

Push `'use client'` to leaf components — never to layouts or wrappers.

## Prop Serialization Rules
- Pass only fields the client actually uses — every prop is serialized to HTML
- Functions: cannot pass as props EXCEPT Server Actions (`'use server'`)
- Class instances: not serializable — convert to plain objects first
- Do transforms (.sort, .filter, .map) in the client component

## Server Action as Prop (valid pattern)
```typescript
// actions/featureActions.ts
'use server'
export async function createFeature(data: FormData) {
  const session = await auth() // always authenticate
  if (!session) throw new Error('Unauthorized')
  // ... write to DB
}

// In Server Component:
<ClientForm action={createFeature} /> // ✓ valid — Server Actions are serializable
```

## Data Fetching in Components
```typescript
// Server Component — fetch directly
async function FeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await featureService.getById(id)
  return <FeatureView data={data} />
}
```

## Client Component with SWR (when realtime needed)
```typescript
'use client'
import useSWR from 'swr'
const { data, isLoading } = useSWR(`/api/feature/${id}`, fetcher)
```

## Rendering Strategy (set by architect — respect it)
- SSG page → no `cookies()`/`headers()` in component, use `generateStaticParams`
- ISR page → respect `revalidate` export, mutations call `revalidateTag()`
- SSR page → Server Component default, no cache directives
- CSR section → `'use client'` + SWR/TanStack, wrap in `<Suspense>`

## Extended Skills
Asset handling     → `cat .claude/skills/next-skills/assets/SKILL.md`
Cache components   → `cat .claude/skills/next-skills/cache-components/SKILL.md`
