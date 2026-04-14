# React Data Fetching

## TanStack Query Setup
```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } }
})
<QueryClientProvider client={queryClient}><App /></QueryClientProvider>
```

## useQuery Pattern
```typescript
export const useFeature = (userId: string) =>
  useQuery({
    queryKey: featureKeys.all(userId),
    queryFn: () => featureService.getAll(userId),
    enabled: !!userId,
  })
```

## Service Layer Pattern
All Firebase calls go through services — never directly in components or hooks.
```typescript
// src/services/featureService.ts
export const featureService = { getAll, getById, create, update, delete: deleteFeature }
```
