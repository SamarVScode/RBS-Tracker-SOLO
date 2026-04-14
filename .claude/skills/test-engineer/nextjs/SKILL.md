# Test — Next.js

## Server Action Test
```typescript
import { createFeature } from '@/actions/featureActions'
import { adminDb } from '@/lib/firebase-admin'

describe('createFeature', () => {
  it('creates feature for authenticated user', async () => {
    // mock auth
    vi.mock('@/lib/auth', () => ({ auth: () => ({ user: { id: 'user-1' } }) }))
    const formData = new FormData()
    formData.set('title', 'Test Feature')
    await createFeature(formData)
    const docs = await adminDb.collection('features').get()
    expect(docs.size).toBe(1)
  })

  it('throws for unauthenticated request', async () => {
    vi.mock('@/lib/auth', () => ({ auth: () => null }))
    await expect(createFeature(new FormData())).rejects.toThrow('Unauthorized')
  })
})
```

## Route Handler Test
```typescript
import { GET } from '@/app/api/feature/route'
describe('GET /api/feature', () => {
  it('returns features list', async () => {
    const request = new Request('http://localhost/api/feature')
    const response = await GET(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(Array.isArray(data.features)).toBe(true)
  })
})
```
