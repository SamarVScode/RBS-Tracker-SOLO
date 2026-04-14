# Perf — React Re-renders

## React.memo — only when all three are true
1. Parent re-renders often
2. This component is expensive to render
3. Props are stable (primitives or memoized)

```typescript
export const FeatureCard = React.memo(({ feature }: Props) => <div>...</div>,
  (prev, next) => prev.feature.id === next.feature.id && prev.feature.updatedAt === next.feature.updatedAt
)
```

## Zustand Selectors
```typescript
// WRONG — new object every render, breaks memo
const { name, email } = useUserStore()
// RIGHT — primitive selectors
const name = useUserStore(s => s.name)
const email = useUserStore(s => s.email)
// OR for objects
import { useShallow } from 'zustand/react/shallow'
const { name, email } = useUserStore(useShallow(s => ({ name: s.name, email: s.email })))
```

## useMemo / useCallback Rules
- useMemo: expensive computations OR stable object ref passed to memo'd child
- useCallback: functions passed to memo'd children OR in useEffect deps
- Neither: for primitives, simple calculations, or non-memo'd children
