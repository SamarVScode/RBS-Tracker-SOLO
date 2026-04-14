# Animation — Emil Design Engineering + Framer Motion

## Should It Animate?
| Frequency | Decision |
|---|---|
| 100+/day (keyboard, typing) | NO animation |
| Tens/day (hover, list nav) | Remove or reduce |
| Occasional (modals, toasts) | Standard animation |
| Rare/first-time (onboarding) | Can add delight |

## Easing (never ease-in on UI)
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

## Duration
| Element | Duration |
|---|---|
| Button press | 100–160ms |
| Tooltips, popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |

Never exceed 300ms on interactive elements.

## Component Rules
- Buttons: `scale(0.97)` on `:active`, `transition: transform 160ms ease-out`
- Never `scale(0)` → use `scale(0.95) + opacity: 0`
- Popovers: `transform-origin` = trigger location
- Exit faster than enter (150ms vs 200ms)
- Prefer CSS `transition` over `@keyframes` for interruptible UI

## Framer Motion
```typescript
const prefersReduced = useReducedMotion() // always check first
// AnimatePresence required for exit animations
// Never animate width/height — use layout prop
// Under load: style={{ transform: `translateX(${x}px)` }} not animate={{ x }}
```

## Stagger Lists
```css
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms ease-out forwards; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; } /* +50ms/item, max 80ms */
```

## Accessibility
```css
@media (prefers-reduced-motion: reduce) { /* fade only, no movement */ }
@media (hover: hover) and (pointer: fine) { .el:hover { transform: scale(1.05); } }
```

## Performance
Only animate `transform` and `opacity` (GPU, no layout/paint). CSS > JS under load.

## Full spec → `cat .claude/ANIMATION_SPEC.md`
