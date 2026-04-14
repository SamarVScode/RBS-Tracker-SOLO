# A11Y — WCAG 2.2 AA
> Read by: component-forge, design-system, ui-refiner

## RULES
- Touch targets ≥ 44x44px | Contrast: ≥ 4.5:1 text, ≥ 3:1 UI
- Never info by color alone — add icon/text | Visible focus ring on all interactives
- Never `outline:none` without `:focus-visible` replacement

## BUTTONS
```tsx
<button type="button" aria-label="Close" aria-pressed={toggled} aria-expanded={open} aria-controls="panel-id">
  <Icon aria-hidden="true" />
</button>
```

## FORMS
```tsx
<label htmlFor="email">Email <span style={srOnly}>(required)</span></label>
<input id="email" type="email" aria-required="true" aria-invalid={!!error} aria-describedby={error ? 'email-error' : 'email-hint'} autoComplete="email" />
{error && <p id="email-error" role="alert" aria-live="polite">{error}</p>}
```

## MODALS
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Title</h2>
</div>
// Focus trap inside, Tab cycles within, Esc closes, restore focus to trigger
```

## NAV
```tsx
<nav aria-label="Main"><ul role="list"><li><a aria-current={active ? 'page' : undefined}>Home</a></li></ul></nav>
```

## LIVE REGIONS
```tsx
<div aria-live="polite" aria-atomic="true" style={srOnly}>{status}</div>
<div role="alert" aria-live="assertive">{criticalError}</div>
```

## srOnly UTILITY
```typescript
export const srOnly: CSSProperties = { position:'absolute',width:'1px',height:'1px',padding:0,margin:'-1px',overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:0 };
```

## AUDIT CHECKLIST
- Tab order logical (no tabindex>0) | All buttons: aria-label or text
- All inputs: visible label (not placeholder-only) | Errors: aria-describedby
- Icons: alt or aria-hidden | Contrast met | Focus ring present
- Modal: trap+Esc+restore | Loading: aria-live | Touch ≥ 44px | Keyboard-complete
