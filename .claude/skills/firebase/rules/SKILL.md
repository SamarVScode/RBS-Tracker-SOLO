# Firebase — Security Rules

## Template
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }
    match /users/{userId}/features/{docId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

## Critical Rules
- Every collection needs explicit rules — no implicit allow all
- NEVER `allow read, write: if true`
- Admin gated on custom claims (`request.auth.token.admin == true`) — never client field
- Field-level validation: `request.resource.data.keys().hasAll(['title', 'userId'])`
