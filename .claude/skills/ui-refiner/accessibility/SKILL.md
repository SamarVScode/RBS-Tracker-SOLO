# UI Refiner — Accessibility

Work through `design-contract.a11yChecklist`. Fix every failure directly in file.

## Checklist
- Tab order logical — no tabindex > 0
- All buttons: aria-label OR descriptive text
- All inputs: visible `<label htmlFor>` (not just placeholder)
- Error messages: `aria-describedby` linking input to error
- Images/icons: alt text OR `aria-hidden="true"`
- Color contrast: text ≥ 4.5:1, large text ≥ 3:1
- Focus ring: never `outline:none` without `:focus-visible` replacement
- Modal: focusTrap active, Esc closes, focus returns to trigger
- Loading: `aria-live="polite"` or `role="status"`
- No info by color alone — errors need icon + text
- Touch targets: ≥ 44×44px (check padding + minHeight)
- Keyboard: Tab through entire feature without mouse

## Full patterns → `cat .claude/A11Y_PATTERNS.md`
