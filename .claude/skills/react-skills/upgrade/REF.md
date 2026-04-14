# React Upgrade — Extended Reference

## React 19 ref as prop (replaces forwardRef)
```typescript
// Before (React 18)
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
))

// After (React 19)
function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

## React 19 use() for async data
```typescript
import { use, Suspense } from 'react'
function FeatureView({ promise }: { promise: Promise<Feature> }) {
  const feature = use(promise)  // suspends until resolved
  return <div>{feature.name}</div>
}
// Wrap in <Suspense fallback={<Skeleton />}>
```

## TanStack Query v5 migration checklist
- [ ] Replace `cacheTime` with `gcTime`
- [ ] Replace `isLoading` with `isPending` for mutations
- [ ] Remove `onSuccess`/`onError` from `useQuery` — move to `useEffect`
- [ ] Replace `remove()` calls with `invalidateQueries`
- [ ] Update `useInfiniteQuery` — `getNextPageParam` now required
