# Security — Next.js

- Every Server Action authenticates with `auth()` before any DB operation
- No secrets in `NEXT_PUBLIC_*` env vars — they ship to browser
- Middleware matcher is specific — not running on static assets
- `headers()` used for CSRF validation on sensitive mutations
- Admin SDK credentials in server-only env vars, never `NEXT_PUBLIC_`
- Route Handlers validate auth same as Server Actions
