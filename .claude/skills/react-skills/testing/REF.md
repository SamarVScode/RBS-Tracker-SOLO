# React Testing — Extended Reference

## Mocking Firebase in Tests
```typescript
// src/test/mocks/firebase.ts
vi.mock('@/lib/firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-uid' } }
}))
vi.mock('@/services/featureService', () => ({
  featureService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 'new-id' }),
  }
}))
```

## Testing a Hook
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useFeature } from '@/hooks/useFeature'
import { createWrapper } from './setup'

test('loads features', async () => {
  const { result } = renderHook(() => useFeature('user-1'), { wrapper: createWrapper() })
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toEqual([])
})
```

## Testing a Component with User Events
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('submits form', async () => {
  const user = userEvent.setup()
  render(<FeatureForm onSubmit={vi.fn()} />)
  await user.type(screen.getByLabelText('Name'), 'Test Feature')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(screen.getByText('Saved')).toBeInTheDocument()
})
```
