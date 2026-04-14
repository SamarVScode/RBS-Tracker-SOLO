# React Assets — Extended Reference

## Path Aliases (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
```
Also add to tsconfig.json:
```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

## Env Var Typing
```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
```

## Bundle Analysis
```bash
npx vite-bundle-visualizer
# or
npx rollup-plugin-visualizer
```
