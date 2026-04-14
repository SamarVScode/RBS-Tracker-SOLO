# State — React Native

Server data via TanStack Query wrapping Firebase services. Zustand for shared UI state only.
Files: `src/stores/{feature}Store.ts` | `src/hooks/use{Feature}.ts`

## Zustand Persistence — AsyncStorage (default)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist, createJSONStorage } from 'zustand/middleware'
storage: createJSONStorage(() => AsyncStorage)
```

## Zustand Persistence — MMKV (hot path: frequent reads, app launch)
```typescript
import { MMKV } from 'react-native-mmkv'
const mmkv = new MMKV()
const mmkvStorage = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.delete(name),
}
storage: createJSONStorage(() => mmkvStorage)
```
Rule: AsyncStorage = infrequent (settings, onboarding). MMKV = every-render or app launch.

## TanStack Query — focusManager
```typescript
import { AppState } from 'react-native'
import { focusManager } from '@tanstack/react-query'
focusManager.setEventListener((handleFocus) => {
  const sub = AppState.addEventListener('change', (s) => handleFocus(s === 'active'))
  return () => sub.remove()
})
```
Wire in app entry — without it queries never refetch on foreground.

## gcTime
```typescript
defaultOptions: { queries: { gcTime: 1000*60*30, staleTime: 1000*60*5 } }
```
Default 5min gcTime causes data loss on background/foreground. Use 30min.

## Offline-First
`networkMode: 'offlineFirst'` — serve cache immediately, revalidate when online.

## Nav State — NEVER in Zustand
React Navigation manages own state. Storing in Zustand → double source of truth, deep link breakage, back button bugs. Use `linking` config + `useNavigation()`.
