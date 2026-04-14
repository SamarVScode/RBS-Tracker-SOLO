# Design System — Variants

## Button Variants
```json
{
  "variants": ["primary", "secondary", "ghost", "danger"],
  "sizes": ["sm", "md", "lg"],
  "states": ["default", "hover", "active", "disabled", "loading"],
  "a11y": ["aria-disabled on loading", "aria-label on icon-only"]
}
```

## Input Variants
```json
{
  "variants": ["default", "error", "success", "disabled"],
  "sizes": ["sm", "md"],
  "states": ["empty", "focused", "filled", "error", "disabled"],
  "a11y": ["label required", "aria-describedby on error", "aria-invalid on error"]
}
```

## Card Variants
```json
{
  "variants": ["default", "interactive", "selected"],
  "states": ["default", "hover", "selected", "loading"],
  "a11y": ["role=article or button depending on interactive", "aria-selected on selectable"]
}
```

## Modal
```json
{
  "sizes": ["sm", "md", "lg", "full"],
  "a11y": ["role=dialog", "aria-modal=true", "aria-labelledby", "focus trap", "Esc closes"]
}
```

component-forge must implement ALL variants. No skipping.
