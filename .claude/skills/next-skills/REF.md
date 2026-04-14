# RSC Boundaries — Reference

## Common Invalid Patterns

```tsx
// ❌ Async client component — invalid
'use client'
export async function MyComponent() { ... }

// ❌ Passing class instance across boundary
<ClientComp user={new User(data)} />  // User class not serializable

// ❌ Passing function (not a Server Action)
<ClientComp onClick={() => doThing()} />  // breaks
```

## Server Action as Prop (valid exception)
```tsx
// server-actions.ts
'use server'
export async function save(data: FormData) { ... }

// page.tsx (server)
import { save } from './server-actions'
<ClientForm action={save} />  // ✅ valid — Server Actions are serializable
```

## Minimize Serialization — Pass Only Used Fields
```tsx
// ❌ Sends 50 fields to client
async function Page() {
  const user = await fetchUser()
  return <Profile user={user} />
}

// ✅ Send 1 field
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}
```

## RSC Deduplication Gotcha
```tsx
// ❌ Same data, new reference — serialized twice (6 strings)
<ClientList usernames={usernames} sorted={usernames.toSorted()} />

// ✅ Send once, transform in client (3 strings)
<ClientList usernames={usernames} />
// 'use client'
// const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

## Context Not Available in Server Components
- `useContext`, `useState`, `useEffect`, `useRef` — client only
- For shared server data: pass as props or use a server-only module singleton
