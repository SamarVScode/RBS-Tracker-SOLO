# Perf — Bundle (React/Vite)

## Analyze First
```bash
npx vite-bundle-visualizer
# Look for: large deps, duplicate packages, untree-shaken libs
```

## Lazy Load Routes
```typescript
const UserProfile = lazy(() => import('./pages/UserProfile'))
const Reports = lazy(() => import('./pages/Reports'))
<Suspense fallback={<PageSkeleton />}><UserProfile /></Suspense>
```

## Tree-shake Firebase
```typescript
// WRONG — imports entire SDK
import firebase from 'firebase/app'
// RIGHT — modular
import { getFirestore, doc, getDoc } from 'firebase/firestore'
```

## Barrel Import Bloat
```typescript
// WRONG
import { Button, Card, Input } from '@/components'
// RIGHT — direct imports
import { Button } from '@/components/ui/Button'
```
