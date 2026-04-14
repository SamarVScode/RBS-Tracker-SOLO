# API Contract — Next.js

## Route Handler Types
```typescript
// app/api/feature/route.ts
export type GetFeaturesResponse = { features: Feature[]; total: number }
export type CreateFeatureBody = { title: string; status?: 'active' | 'archived' }
```

## Server Action Signatures
```typescript
// src/actions/featureActions.ts
export type CreateFeatureAction = (formData: FormData) => Promise<{ success: boolean; error?: string }>
export type DeleteFeatureAction = (id: string) => Promise<void>
```

Server Actions accept FormData or plain args — never return non-serializable values.
