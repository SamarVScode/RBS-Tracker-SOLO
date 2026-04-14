# Async Data — Reference

## React.cache() — Per-Request Deduplication
```ts
import { cache } from 'react'
export const getUser = cache(async (id: string) => {
  return db.users.findById(id)
})
// Called 5× in one render = 1 DB hit
```

## after() — Post-Response Work
```ts
import { after } from 'next/server'
export async function POST(req) {
  const data = await req.json()
  after(async () => {
    await analytics.track('form_submitted', data) // runs after response sent
  })
  return Response.json({ ok: true })
}
```

## Route Handler Basics
```ts
// app/api/items/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  return Response.json({ items: await getItems(searchParams.get('q')) })
}
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ id: await createItem(body) }, { status: 201 })
}
```
- GET in same segment as `page.tsx` = conflict — move to sub-path
- No React DOM available — plain `Response`, not JSX

## Server Action — Full Pattern
```ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const session = await auth() // always authenticate
  if (!session) throw new Error('Unauthorized')

  const post = await db.posts.create({
    title: formData.get('title') as string,
    userId: session.user.id,
  })
  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}
```

## Client-Side with SWR
```tsx
'use client'
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then(r => r.json())

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)
  if (isLoading) return <Skeleton />
  if (error) return <Error />
  return <div>{data.name}</div>
}
```

## Mutation with SWR
```tsx
import useSWRMutation from 'swr/mutation'
async function updateUser(url: string, { arg }: { arg: { name: string } }) {
  return fetch(url, { method: 'PATCH', body: JSON.stringify(arg) }).then(r => r.json())
}
const { trigger } = useSWRMutation('/api/user', updateUser)
trigger({ name: 'Samar' })
```
