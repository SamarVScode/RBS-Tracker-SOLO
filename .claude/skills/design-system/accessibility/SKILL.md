# Design System — Accessibility Spec

Generate a 12-item feature-specific checklist. ui-refiner will verify every item.

## Standard 12-Item Template
1. Tab order is logical — no tabindex > 0
2. All interactive elements have visible labels
3. All form inputs have visible `<label>` with `htmlFor`
4. Error messages linked via `aria-describedby`
5. Images have alt text OR aria-hidden="true"
6. Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI
7. Focus ring visible on all interactive elements
8. Modal has focus trap + Escape closes + focus returns
9. Loading states use aria-live="polite"
10. Errors use icon + text (not color alone)
11. Touch targets ≥ 44×44px
12. Full keyboard navigation without mouse

Customize items 8-12 to be feature-specific. Generic checklist is not enough.

## Full patterns → `cat .claude/A11Y_PATTERNS.md`
