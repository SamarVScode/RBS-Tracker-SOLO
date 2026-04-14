# Firebase — Firestore

## Service File Template
```typescript
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
         query, orderBy, limit, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

export const featureService = {
  async getAll(userId: string): Promise<Feature[]> {
    const q = query(collection(db, `users/${userId}/features`),
                    orderBy('createdAt', 'desc'), limit(50))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Feature))
  },
  async upsert(userId: string, data: Omit<Feature, 'createdAt' | 'updatedAt'>): Promise<void> {
    const ref = doc(db, `users/${userId}/features`, data.id)
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
  },
  async delete(userId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, `users/${userId}/features`, id))
  },
}
```

## Indexes
Always declare required indexes:
```
Collection: users/{userId}/features
Composite: status ASC + createdAt DESC (if filtering by status)
```

## Avoid N+1
```typescript
// WRONG — one fetch per list item
const details = await Promise.all(items.map(i => getDetail(i.id)))
// RIGHT — batch fetch
const details = await getDocs(query(collection(db, 'details'),
                              where('itemId', 'in', itemIds)))
```
