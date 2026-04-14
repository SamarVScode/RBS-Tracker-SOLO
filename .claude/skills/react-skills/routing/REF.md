# React Routing — Extended Reference

## Nested Routes with Layout
```typescript
// Layout wrapper for authenticated section
<Route element={<AppLayout />}>
  <Route path={ROUTES.HOME} element={<HomePage />} />
  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
</Route>
```

## Typed useNavigate
```typescript
import { useNavigate, NavigateOptions } from 'react-router-dom'
const navigate = useNavigate()
navigate(ROUTES.FEATURE_DETAIL.replace(':id', id))
```

## Typed useParams
```typescript
import { useParams } from 'react-router-dom'
const { id } = useParams<{ id: string }>()
```

## Scroll Restoration
```typescript
// In App.tsx, inside BrowserRouter:
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
```
