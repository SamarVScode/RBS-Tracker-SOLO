# Bug Hunter — Zustand

- **Direct mutation**: `state.array.push(x)` → use `[...state.array, x]` or immer middleware
- **Selector not memoized**: new object every render → use useShallow or primitive selector
- **Missing persist**: store resets on refresh → add persist middleware
- **Store subscribed in loop**: multiple useStore calls without selectors → extract primitive selectors
- **Devtools not named**: hard to debug → add `{ name: 'store-name' }` to devtools()
