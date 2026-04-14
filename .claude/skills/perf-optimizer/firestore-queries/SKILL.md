# Perf — Firestore Queries

## Pagination (never fetch all docs)
```typescript
const q = query(
  collection(db, `users/${userId}/items`),
  orderBy('createdAt', 'desc'),
  limit(20),
  ...(lastDoc ? [startAfter(lastDoc)] : [])
)
```

## Avoid N+1
```typescript
// WRONG
const details = await Promise.all(items.map(i => getDetail(i.id)))
// RIGHT — batch with where-in (max 30 ids)
const details = await getDocs(query(
  collection(db, 'details'),
  where('itemId', 'in', itemIds.slice(0, 30))
))
```

## Indexes
Every composite query needs a Firestore index.
Firebase console error message contains direct link to create it — always include that link in output.

## Denormalize for Read-Heavy
Store display name in child doc instead of joining on userId.
One extra write on update, but eliminates N+1 on reads.
