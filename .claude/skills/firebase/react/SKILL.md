# Firebase — React / Vite

Client SDK only. No Admin SDK ever in browser code.
All Firebase calls go through service layer — never directly in components.
Use TanStack Query to wrap all Firebase service calls.

## Config
```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```
