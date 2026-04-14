# State — Next.js

## Server vs Client State Split
- **Server data mutations** → Server Actions (not TanStack Query mutations)
- **Client-side caching/optimistic UI** → TanStack Query useQuery + SWR
- **Global UI state** → Zustand (same as React)
- **Form state** → Server Actions with useFormState / useActionState

## Server Action replaces useMutation
```typescript
// Instead of useMutation → featureService.create()
// Use Server Action directly in form:
<form action={createFeature}>
  <input name="title" />
  <button type="submit">Save</button>
</form>
// Server Action handles DB write + revalidatePath
```

## TanStack Query in Next.js
Use only for client-side data that needs realtime updates or complex caching.
Hydrate from Server Component using `dehydrate/HydrationBoundary` for SSR.

## File locations
- `src/actions/{feature}Actions.ts` — Server Actions
- `src/stores/{feature}Store.ts` — Zustand (client only)
- `src/hooks/use{Feature}.ts` — TanStack Query (client only, 'use client')

## Extended Skills
Async data patterns → `cat .claude/skills/next-skills/async-data/SKILL.md`
