# Firebase — Cloud Functions

## Callable Function Template
```typescript
import { onCall, HttpsError } from 'firebase-functions/v2/https'

export const createFeature = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Must be signed in')
  const { title } = request.data
  if (!title) throw new HttpsError('invalid-argument', 'title required')
  // write to Firestore
  return { success: true, featureId: docRef.id }
})
```

## Rules
- Always check `request.auth` first
- Validate all inputs server-side — never trust client
- Return serializable values only
- Use HttpsError with correct status codes

## Triggers
```typescript
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
export const onFeatureCreated = onDocumentCreated(
  'users/{userId}/features/{featureId}',
  async (event) => { /* ... */ }
)
```
