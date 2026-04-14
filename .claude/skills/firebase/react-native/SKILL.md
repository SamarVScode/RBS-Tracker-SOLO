# Firebase — React Native

Client SDK only. All Firebase calls through service layer. TanStack Query wraps every service call.

## Auth Persistence
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
```
Never `getAuth()` in RN — defaults to browser persistence, crashes.

## Firestore Realtime
```typescript
useEffect(() => {
  const unsub = onSnapshot(doc(db, 'col', id), (snap) => setData(snap.data()))
  return () => unsub() // REQUIRED — memory leak prevention
}, [id])
```

## Offline Persistence
Enabled by default on RN. Do NOT call `enableIndexedDbPersistence()` (web-only).
```typescript
// WRONG: initializeFirestore(app, { experimentalForceLongPolling: true })
// RIGHT: getFirestore(app)
```

## FCM Push Notifications
```typescript
import messaging from '@react-native-firebase/messaging'
const status = await messaging().requestPermission()
const token = await messaging().getToken()
await setDoc(doc(db, 'users', uid, 'tokens', token), {
  token, platform: Platform.OS, updatedAt: serverTimestamp(),
})
messaging().onTokenRefresh(async (newToken) => {
  await setDoc(doc(db, 'users', uid, 'tokens', newToken), {
    token: newToken, platform: Platform.OS, updatedAt: serverTimestamp(),
  })
})
```

## Storage Uploads
```typescript
import * as FileSystem from 'expo-file-system'
import { ref, uploadBytes } from 'firebase/storage'
const fileInfo = await FileSystem.getInfoAsync(localUri)
if (!fileInfo.exists) throw new Error('File not found')
const blob = await fetch(localUri).then((r) => r.blob())
await uploadBytes(ref(storage, `uploads/${fileName}`), blob)
```

## Common RN Firebase Errors
- `auth/operation-not-supported-in-this-environment` → use `initializeAuth` not `getAuth()`
- `firestore/failed-precondition` → `enableIndexedDbPersistence` is web-only
- `messaging/permission-blocked` → request iOS permission before `getToken()`
- `storage/unauthorized` → check rules `request.auth != null`
- Metro stale cache → `npx expo start --clear` after adding `@react-native-firebase/*`
