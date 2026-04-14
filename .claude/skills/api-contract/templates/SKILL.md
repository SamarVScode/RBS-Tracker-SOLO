# API Contract — Templates

```typescript
// src/types/feature.types.ts
import type { Timestamp } from 'firebase/firestore'

export interface FeatureDoc {
  id: string; userId: string; title: string
  status: 'active' | 'archived'
  createdAt: Timestamp; updatedAt: Timestamp
}

export interface Feature extends Omit<FeatureDoc, 'createdAt' | 'updatedAt'> {
  createdAt: string; updatedAt: string // ISO after .toDate().toISOString()
}

export type CreateFeatureInput = Pick<Feature, 'title'> & { status?: Feature['status'] }
export type UpdateFeatureInput = Partial<Pick<Feature, 'title' | 'status'>>

export interface CreateFeatureRequest { title: string; status?: 'active' | 'archived' }
export interface CreateFeatureResponse { success: boolean; featureId: string; error?: string }

export interface FeatureService {
  getAll(userId: string): Promise<Feature[]>
  getById(userId: string, id: string): Promise<Feature | null>
  create(userId: string, input: CreateFeatureInput): Promise<Feature>
  update(userId: string, id: string, input: UpdateFeatureInput): Promise<void>
  delete(userId: string, id: string): Promise<void>
}
```
