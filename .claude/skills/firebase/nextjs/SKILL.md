# Firebase — Next.js

## Two SDKs, Two Boundaries
- **Server Components / Server Actions / Route Handlers** → Firebase Admin SDK
- **Client Components** → Firebase client SDK (same as React/Vite)

## Admin SDK Setup
```typescript
// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)) })
}
export const adminDb = getFirestore()
```

## Server Action with Admin SDK
```typescript
'use server'
import { adminDb } from '@/lib/firebase-admin'
import { auth } from '@/lib/auth' // NextAuth or similar

export async function createFeature(data: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  await adminDb.collection('features').add({ ... })
}
```

## Never
- Never import firebase-admin in Client Components
- Never expose service account credentials to client
- Never use `NEXT_PUBLIC_` prefix for Admin SDK credentials
