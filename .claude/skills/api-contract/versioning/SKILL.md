# API Contract — Versioning

```typescript
// Version old type, don't delete it
export interface FeatureV1 { ... } // @deprecated Use Feature. Remove after 2026-09-01.
export interface Feature { ... }   // current
```

Never delete interfaces that may still be in use. Always add removal date.
