# UI Refiner — Polish

## Emil — Unseen Details
Taste = trained instinct. Invisible correctness creates interfaces people love without knowing why.
Beauty is leverage. Good defaults are real differentiators.

## Typography
```tsx
letterSpacing: '0.05em', // ALL_CAPS and label text
lineHeight: 1.5,          // body text
lineHeight: 1.2,          // headings
```

## Interaction
```tsx
cursor: 'pointer',         // all clickable elements (web)
userSelect: 'none',        // non-text interactive elements
WebkitUserSelect: 'none',  // buttons
```

## Empty States
Must have: icon (40px+) + heading + subtext + optional CTA
Min padding: 48px vertical. Text centered, max-width 280px.

## Error States
Must have: icon + message text — never just color change.
Animation: errorShake on the field.

## Emil — Sonner Principles
1. Zero friction to adopt — no setup required
2. Ship beautiful defaults — most users never customize
3. Handle edge cases invisibly (pause timers on hidden tab)
4. Use transitions not keyframes for rapidly-triggered elements
5. Animation cohesion — easing/duration match component personality

## Blur Trick
`filter: blur(2px)` during crossfade to mask imperfect transitions
