# Design System — Animation (Emil Design Engineering)

## Choreography Contract
Specify exact animation per interaction. component-forge implements these — no guesswork.

```json
{
  "animations": {
    "pageEnter": { "from": "opacity:0 translateY(8px)", "to": "opacity:1 translateY(0)", "duration": "200ms", "easing": "ease-out" },
    "listItemEnter": { "from": "opacity:0 translateY(8px)", "to": "opacity:1 translateY(0)", "duration": "300ms", "stagger": "50ms", "easing": "ease-out" },
    "cardHover": { "transform": "translateY(-2px)", "duration": "160ms", "easing": "ease-out", "mediaQuery": "(hover: hover) and (pointer: fine)" },
    "buttonPress": { "transform": "scale(0.97)", "duration": "100ms", "easing": "ease-out" },
    "modalEnter": { "from": "opacity:0 scale(0.95)", "to": "opacity:1 scale(1)", "duration": "200ms", "easing": "ease-out", "origin": "center" },
    "skeleton": { "type": "shimmer", "duration": "1500ms", "easing": "linear" },
    "errorShake": { "keyframes": "shake 300ms ease-out", "reducedMotion": "none" },
    "successPulse": { "transform": "scale(1) → scale(1.05) → scale(1)", "duration": "300ms" }
  }
}
```

## Emil Frequency Gate (apply before specifying any animation)
- Used 100+/day → specify NO animation
- Used tens/day → specify minimal or none
- Occasional → standard animation above
- Rare/first-time → can add delight

## Easing Tokens (from Emil)
```
ease-out:    cubic-bezier(0.23, 1, 0.32, 1)      — entering/exiting
ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)     — moving on screen
ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)      — drawers/sheets
```
Never specify ease-in for UI elements.

## Full spec → `cat .claude/ANIMATION_SPEC.md`
