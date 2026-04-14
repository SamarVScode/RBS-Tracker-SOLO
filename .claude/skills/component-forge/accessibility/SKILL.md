# Accessibility — WCAG 2.2 AA

## Mandatory Checklist
- Touch targets ≥ 44×44px
- Contrast ≥ 4.5:1 text / ≥ 3:1 UI elements
- Visible focus ring always — never `outline:none` without `:focus-visible` replacement
- Buttons need `aria-label` if icon-only
- Forms need `<label htmlFor>` + `aria-describedby` on errors
- Images/icons: `alt` text OR `aria-hidden="true"`
- No information by color alone — always icon + text for errors

## Modal Pattern
```typescript
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  // focus trap active
  // Escape closes
  // focus returns to trigger on close
</div>
```

## Live Regions
```typescript
<div aria-live="polite">   // status updates
<div role="alert">         // critical errors only
```

## Focus Visible Pattern
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

## Full patterns → `cat .claude/A11Y_PATTERNS.md`
