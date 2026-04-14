# Security — Firebase Auth

- No credentials hardcoded in source files
- `.env.local` in `.gitignore`
- Firebase config keys are PUBLIC (ok) — but API key restrictions set in Firebase Console
- Secondary app instances cleaned up with `deleteApp()`
- `onAuthStateChanged` used — never `currentUser` which can be null on load
- Session persistence appropriate for use case
