# React Routing

## Route Setup (App.tsx)
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants/routes'

<BrowserRouter>
  <Routes>
    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.FEATURE} element={<FeaturePage />} />
      <Route path={ROUTES.FEATURE_DETAIL} element={<FeatureDetailPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

## ProtectedRoute
```typescript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export const ProtectedRoute = () => {
  const user = useAuthStore(s => s.user)
  const loading = useAuthStore(s => s.loading)
  if (loading) return <PageSkeleton />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
```

## Route Constants
```typescript
// src/constants/routes.ts
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  FEATURE: '/feature',
  FEATURE_DETAIL: '/feature/:id',
} as const
export type RouteKey = keyof typeof ROUTES
```

## Lazy Load Pages
```typescript
const FeaturePage = lazy(() => import('./pages/FeaturePage'))
<Suspense fallback={<PageSkeleton />}><FeaturePage /></Suspense>
```
