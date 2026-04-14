# Firebase Emulator Setup

## src/test/setup.ts
```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { app } from '../config/firebase'

beforeAll(() => {
  connectFirestoreEmulator(getFirestore(app), 'localhost', 8080)
  connectAuthEmulator(getAuth(app), 'http://localhost:9099')
})
afterEach(() => cleanup())
```

## clearFirestoreData helper
```typescript
export async function clearFirestoreData() {
  const response = await fetch(
    'http://localhost:8080/emulator/v1/projects/demo-test/databases/(default)/documents',
    { method: 'DELETE' }
  )
  if (!response.ok) throw new Error('Failed to clear Firestore data')
}
```

## Running
```bash
firebase emulators:start --only firestore,auth
npx vitest run
```
