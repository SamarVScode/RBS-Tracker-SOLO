# Bug Hunter — Next.js

- **Hydration mismatch**: localStorage/window in render → move to useEffect or check `typeof window !== 'undefined'`
- **Async params not awaited**: `params.id` throws in v15+ → `const { id } = await params`
- **Server component with hooks**: useState/useEffect in server component → add 'use client'
- **Client imports server module**: fs/crypto in client bundle → move to server-only file
- **fetch cached unexpectedly**: v14→v15 default changed to no-store → add `cache: 'force-cache'` explicitly
- **Server Action not authenticated**: missing auth check → always call auth() first inside action
- **Middleware not running**: wrong matcher pattern → check config.matcher
- **Route conflict**: GET in same segment as page.tsx → move route handler to sub-path
- **useSearchParams CSR bailout**: missing Suspense wrapper → wrap component in `<Suspense>`
- **redirect() in try/catch**: redirect throws internally → use unstable_rethrow() first
