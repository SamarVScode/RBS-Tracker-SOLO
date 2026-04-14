# Next.js Upgrade — Reference

## v13 → v14
- `next/font` is now `next/font/google` and `next/font/local` (auto-migrated by codemod)
- App Router stable — no longer experimental
- Turbopack dev (alpha): `next dev --turbopack`
- `<Link>` no longer needs a child `<a>` tag

```bash
npx @next/codemod@latest upgrade 14
```

## v14 → v15 (full codemod list)
```bash
# All v15 codemods in one:
npx @next/codemod@canary upgrade 15

# Individual:
npx @next/codemod@canary next-async-request-api .    # params/searchParams/cookies/headers
npx @next/codemod@canary next-og-import .            # next/server → next/og
npx @next/codemod@canary metadata-to-viewport-export . # viewport in metadata → separate export
```

## Page Router → App Router (manual steps)
1. Create `app/` directory alongside `pages/`
2. Migrate layout: `pages/_app.tsx` → `app/layout.tsx`
3. Migrate `pages/_document.tsx` → `app/layout.tsx` (html, body attrs)
4. Move pages one by one: `pages/about.tsx` → `app/about/page.tsx`
5. Data fetching: `getServerSideProps` → async Server Component; `getStaticProps` → Server Component + `generateStaticParams`
6. API routes: `pages/api/` → `app/api/route.ts`
7. Remove `pages/` once fully migrated

## Incremental App Router Adoption
Both `pages/` and `app/` can coexist. `app/` takes precedence when paths overlap. Migrate route by route.

## fetch Cache Default Change (v14 → v15)
```ts
// v14: fetch cached by default
fetch('/api/data')  // was: force-cache

// v15: not cached by default
fetch('/api/data')                          // now: no-store
fetch('/api/data', { cache: 'force-cache' }) // explicit opt-in to cache
```
