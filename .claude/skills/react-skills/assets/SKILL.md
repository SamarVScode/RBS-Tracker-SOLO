# React Assets (Vite)

## Env Vars
```typescript
// .env.local
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...

// Access in code
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
```
Never use `process.env` in Vite — always `import.meta.env`.

## SVG Imports
```typescript
import { ReactComponent as Logo } from './logo.svg' // as component
import logoUrl from './logo.svg'                     // as URL string
```

## Static Files
Files in `public/` are served as-is. Reference as `/filename.ext`.
Files in `src/assets/` are processed by Vite (hashed filenames in build).

## Image Optimization
Vite handles images automatically. For external URLs, no optimization — use explicit width/height.
