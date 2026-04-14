# Security — Firestore Rules

## Checklist
- Every collection has explicit rules (no implicit allow all)
- `request.auth != null` on ALL read/write rules
- `request.auth.uid == userId` for user-owned data
- No `allow read, write: if true` anywhere
- Field-level validation on write
- Admin gated on custom claims not client field

## Critical Patterns
```javascript
// WRONG — allows anyone
match /users/{userId}/data/{docId} { allow read, write; }

// RIGHT
match /users/{userId}/data/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// WRONG — privilege escalation via client field
allow write: if request.resource.data.role == 'admin';

// RIGHT — custom claim set server-side only
allow write: if request.auth.token.admin == true;
```
