# State — Firebase Realtime Sync

## onSnapshot + TanStack Query Bridge
```typescript
export const useFeatureLive = (userId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `users/${userId}/features`),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        queryClient.setQueryData(featureKeys.all(userId), data)
      }
    )
    return unsub // cleanup on unmount
  }, [userId, queryClient])

  return useQuery({
    queryKey: featureKeys.all(userId),
    queryFn: () => featureService.getAll(userId),
    staleTime: Infinity, // onSnapshot keeps it fresh
  })
}
```

## Rules
- Always return unsubscribe from useEffect
- Set staleTime: Infinity when using onSnapshot — snapshot handles freshness
- queryClient.setQueryData updates cache without triggering refetch
