# State — TanStack Query

## Query Key Factory
```typescript
export const featureKeys = {
  all: (userId: string) => ['features', userId] as const,
  detail: (userId: string, id: string) => ['features', userId, id] as const,
}
```

## staleTime Rules
- User data: `staleTime: 5 * 60 * 1000` (5 min)
- Reference data (settings, templates): `staleTime: Infinity`
- Always use `onSettled` → `invalidateQueries` (not just onSuccess)

## Optimistic Update Template
```typescript
const mutation = useMutation({
  mutationFn: (data: Input) => service.create(userId, data),
  onMutate: async (data) => {
    await queryClient.cancelQueries({ queryKey: featureKeys.all(userId) })
    const previous = queryClient.getQueryData(featureKeys.all(userId))
    queryClient.setQueryData(featureKeys.all(userId), (old: Feature[] = []) => [
      { ...data, id: crypto.randomUUID(), createdAt: new Date() }, ...old,
    ])
    return { previous }
  },
  onError: (_err, _data, ctx) => {
    if (ctx?.previous) queryClient.setQueryData(featureKeys.all(userId), ctx.previous)
    toast.error('Failed. Changes reverted.')
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: featureKeys.all(userId) }),
})
```
