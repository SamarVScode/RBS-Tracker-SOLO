# React / Vite Upgrade

## React 18 → 19
```bash
npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19
```
Key changes:
- `ref` is now a prop — no more `forwardRef` wrapper needed
- `use()` hook for reading promises and context
- Actions: async functions in transitions
- `useFormStatus` and `useOptimistic` built-in

## Vite 5 → 6
```bash
npm install vite@6 @vitejs/plugin-react@4
```
- `define` values must be valid JSON — no more `JSON.stringify` needed
- `resolve.conditions` changes — check custom conditions

## TanStack Query v4 → v5
- `cacheTime` renamed to `gcTime`
- `isLoading` split into `isLoading` and `isPending`
- `remove()` removed — use `invalidateQueries` instead
- Callbacks (onSuccess/onError/onSettled) removed from useQuery — use `useEffect` or mutation callbacks
