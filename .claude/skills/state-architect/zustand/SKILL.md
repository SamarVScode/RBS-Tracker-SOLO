# State — Zustand

## Store Template
```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface FeatureState {
  selectedId: string | null
  filter: 'all' | 'active' | 'archived'
  setSelected: (id: string | null) => void
  setFilter: (filter: FeatureState['filter']) => void
}

export const useFeatureStore = create<FeatureState>()(
  devtools(
    immer((set) => ({
      selectedId: null,
      filter: 'all',
      setSelected: (id) => set((s) => { s.selectedId = id }),
      setFilter: (filter) => set((s) => { s.filter = filter }),
    })),
    { name: 'feature-store' }
  )
)

// Primitive selectors — prevent re-renders
export const useSelectedId = () => useFeatureStore(s => s.selectedId)
```

## Rules
- Use immer for nested state updates — never mutate directly
- One store per feature domain
- Persist only what must survive page refresh
- Auth store always uses persist middleware
