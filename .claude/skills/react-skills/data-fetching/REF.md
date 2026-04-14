# React Data Fetching — Extended Reference

## Query Key Factory
```typescript
// src/hooks/queryKeys.ts
export const featureKeys = {
  all: (userId: string) => ['features', userId] as const,
  detail: (userId: string, id: string) => ['features', userId, id] as const,
}
```

## Mutation with Optimistic Update
```typescript
const mutation = useMutation({
  mutationFn: featureService.update,
  onMutate: async (updated) => {
    await queryClient.cancelQueries({ queryKey: featureKeys.all(userId) })
    const prev = queryClient.getQueryData(featureKeys.all(userId))
    queryClient.setQueryData(featureKeys.all(userId), (old: Feature[]) =>
      old.map(f => f.id === updated.id ? { ...f, ...updated } : f)
    )
    return { prev }
  },
  onError: (_err, _vars, ctx) => {
    queryClient.setQueryData(featureKeys.all(userId), ctx?.prev)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: featureKeys.all(userId) })
})
```

## Infinite Query
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: featureKeys.all(userId),
  queryFn: ({ pageParam = null }) => featureService.getPaged(userId, pageParam),
  getNextPageParam: (last) => last.nextCursor ?? undefined,
})
```
