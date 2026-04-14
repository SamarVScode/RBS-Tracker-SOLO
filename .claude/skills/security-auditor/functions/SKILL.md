# Security — Functions / API

- Callable functions verify auth: `request.auth` checked first
- Input validated server-side before Firestore write
- Rate limiting on expensive operations
- CORS configured correctly (not `*` in production)
- Secrets in environment variables, not source code
