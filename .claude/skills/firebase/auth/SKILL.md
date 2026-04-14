# Firebase — Auth

## onAuthStateChanged (always use — never currentUser directly)
```typescript
import { onAuthStateChanged } from 'firebase/auth'
onAuthStateChanged(auth, (user) => {
  if (user) { /* signed in */ } else { /* signed out */ }
})
```

## Secondary App (create user without signing out admin)
```typescript
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const tempApp = initializeApp(firebaseConfig, 'tempUserCreation')
const tempAuth = getAuth(tempApp)
try {
  await createUserWithEmailAndPassword(tempAuth, email, password)
} finally {
  await deleteApp(tempApp) // always clean up
}
```

## Session Persistence
```typescript
import { setPersistence, browserLocalPersistence } from 'firebase/auth'
await setPersistence(auth, browserLocalPersistence) // persists across tabs
```

## Auth Race Fix
Never check `auth.currentUser` synchronously on load — it's null until onAuthStateChanged fires.
Always await the auth ready state via onAuthStateChanged before routing decisions.
