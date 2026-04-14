# UI Refiner — Animation

## Verification Checklist
Check every animation in `design-contract.animations` is actually implemented:
- pageEnter → CSS animation or useEffect on mount
- listItemEnter → stagger delay on list items
- cardHover → onMouseEnter/onMouseLeave handlers
- buttonPress → scale transform on mousedown/active
- skeleton → shimmer animation on loading state
- modalEnter → animation on modal container
- errorShake → shake animation on error state

If any missing — add it.

## Emil Rules (apply during verification)
- Never animate from scale(0) → must be scale(0.95) + opacity: 0
- Exit faster than enter (150ms vs 200ms)
- ease-in on UI → fix to ease-out
- Popover transform-origin → must be trigger location not center
- Duration > 300ms on interactive → reduce
- Hover without `@media (hover: hover) and (pointer: fine)` → add query
- Animation on keyboard action → remove entirely
- Framer x/y props under load → use `transform: "translateX()"` string

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) { /* fade only, no movement */ }
```
Every animation must have this fallback.
