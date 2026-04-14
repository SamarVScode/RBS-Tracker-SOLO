# Skeleton / Loading States

## Rule
Skeletons only — never spinners.

## Shimmer Pattern (web)
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg,
    var(--color-background-secondary) 25%,
    var(--color-background-tertiary) 50%,
    var(--color-background-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-md);
}
```

## Shimmer Pattern (React Native)
```typescript
import { Animated } from 'react-native'
// Use Reanimated for 60fps off JS thread:
import Animated, { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
```

## Skeleton Component Structure
Match the exact shape of the real content — same height, same layout, same spacing. Never generic grey boxes that don't match the loaded state.
