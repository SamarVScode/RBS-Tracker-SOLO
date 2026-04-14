# Design System — Tokens

## Token Map Structure
```json
{
  "colors": {
    "primary": "#6366f1",
    "primaryHover": "#4f46e5",
    "background": "#ffffff",
    "surface": "#f9fafb",
    "error": "#e53935",
    "success": "#43a047",
    "text": { "primary": "#111827", "secondary": "#6b7280", "hint": "#9ca3af" },
    "border": "#e5e7eb"
  },
  "spacing": { "4": "4px", "8": "8px", "12": "12px", "16": "16px", "20": "20px", "24": "24px", "32": "32px", "40": "40px", "48": "48px", "64": "64px" },
  "radius": { "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px" },
  "shadow": { "sm": "0 1px 3px rgba(0,0,0,0.08)", "md": "0 4px 12px rgba(0,0,0,0.08)", "lg": "0 8px 24px rgba(0,0,0,0.12)" },
  "typography": {
    "family": "Inter, system-ui, sans-serif",
    "sizes": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px" },
    "weights": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 }
  },
  "duration": { "fast": "100ms", "normal": "200ms", "slow": "300ms" },
  "easing": {
    "out": "cubic-bezier(0.23, 1, 0.32, 1)",
    "inOut": "cubic-bezier(0.77, 0, 0.175, 1)",
    "drawer": "cubic-bezier(0.32, 0.72, 0, 1)"
  }
}
```
Lock in from README UI STYLE: primary, background, font, radius, spacing.
Never reinvent what already exists. Extend only what is missing.

## Three-Layer Architecture (for Tailwind/CSS projects)
```css
/* Layer 1 — Primitive (raw values, never used directly in components) */
--color-blue-600: #2563EB;
--color-gray-900: #111827;

/* Layer 2 — Semantic (purpose aliases, use these everywhere) */
--color-primary: var(--color-blue-600);
--color-text-primary: var(--color-gray-900);
--color-background: #ffffff;
--color-surface: #f9fafb;
--color-error: #dc2626;
--color-success: #16a34a;

/* Layer 3 — Component (scoped overrides, only when semantics don't cover it) */
--button-bg: var(--color-primary);
--card-bg: var(--color-surface);
```
Rule: components must only reference Layer 2 (semantic) or Layer 3 tokens. Never Layer 1 or raw hex.

## Full values → `cat .claude/DESIGN_TOKENS.md`
