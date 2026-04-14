# Test — Unit (Vitest)

## Config
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], globals: true }
})
```

## Service Test Template
```typescript
describe('featureService', () => {
  beforeEach(async () => { await clearFirestoreData() })

  it('creates a feature and returns it with id', async () => {
    const created = await featureService.create('user-1', { title: 'Test', status: 'active' })
    expect(created.id).toBeDefined()
    expect(created.title).toBe('Test')
  })

  it('upserts without duplicate on same id', async () => {
    await featureService.upsert('user-1', { id: 'doc-1', value: 10 })
    await featureService.upsert('user-1', { id: 'doc-1', value: 20 })
    const all = await featureService.getAll('user-1')
    expect(all).toHaveLength(1)
    expect(all[0].value).toBe(20)
  })
})
```

## Hook Test Template
```typescript
const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)
describe('useFeature', () => {
  it('returns empty array initially', async () => {
    const { result } = renderHook(() => useFeature('user-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})
```
