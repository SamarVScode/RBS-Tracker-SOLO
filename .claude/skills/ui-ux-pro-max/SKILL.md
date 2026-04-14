---
name: ui-ux-pro-max
description: Industry-grade UI/UX rules. 10-category priority system covering accessibility, touch, performance, style, layout, typography, animation, forms, navigation, charts. Load for any UI design, review, or polish task.
---

# UI/UX Pro Max — Design Intelligence

10-category rule system. Follow priority 1→10. Load this skill when building or reviewing any UI.

**Skip when:** pure backend, API/DB design, infra, non-visual scripts.

## Priority Table

| P | Category | Impact | Key Checks | Anti-Patterns |
|---|----------|--------|------------|---------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, alt text, keyboard nav, aria-labels | Removing focus rings, icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | Min 44×44px targets, 8px spacing, loading feedback | Hover-only, instant state changes 0ms |
| 3 | Performance | HIGH | WebP/AVIF, lazy load, reserve space (CLS < 0.1) | Layout thrashing, CLS |
| 4 | Style Selection | HIGH | Match product type, consistent, SVG icons | Mixing flat + skeuomorphic, emoji as icons |
| 5 | Layout & Responsive | HIGH | Mobile-first 375/768/1024/1440, no horizontal scroll | Fixed px widths, disable zoom |
| 6 | Typography & Color | MEDIUM | Base 16px, line-height 1.5, semantic color tokens | Text < 12px, gray-on-gray, raw hex in components |
| 7 | Animation | MEDIUM | 150–300ms, transform/opacity only, reduced-motion | Width/height animation, decorative-only, no reduced-motion |
| 8 | Forms & Feedback | MEDIUM | Visible labels, error near field, helper text | Placeholder-only label, errors at top only |
| 9 | Navigation | HIGH | Predictable back, bottom nav ≤5, deep linking | Overloaded nav, broken back, no deep links |
| 10 | Charts & Data | LOW | Legends, tooltips, accessible colors | Color-only meaning |

---

## 1. Accessibility (CRITICAL)
- Contrast ≥ 4.5:1 normal text, ≥ 3:1 large text
- Visible focus rings 2–4px on all interactive elements
- Descriptive alt text for meaningful images
- `aria-label` on icon-only buttons; `accessibilityLabel` in RN
- Tab order matches visual order; full keyboard support
- `label[for]` on every form input
- Skip-to-main-content link for keyboard users
- Sequential h1→h6, no level skips
- Never convey info by color alone — add icon/text
- Support system text scaling, no truncation
- `prefers-reduced-motion` respected on all animations
- Logical reading order for VoiceOver/TalkBack
- Escape route in every modal and multi-step flow

## 2. Touch & Interaction (CRITICAL)
- Min 44×44pt (iOS) / 48×48dp (Android) touch targets
- 8px+ gap between adjacent touch targets
- Click/tap for primary; never hover-only
- Disable button + spinner during async operations
- `cursor: pointer` on clickable web elements
- `touch-action: manipulation` to remove 300ms tap delay
- Never block system gestures (back swipe, Control Center)
- Haptic feedback for confirmations; avoid overuse
- Swipe actions show clear affordance (chevron, label)
- Keep primary targets away from notch, Dynamic Island, gesture bar

## 3. Performance (HIGH)
- WebP/AVIF with `srcset/sizes`; declare width/height to prevent CLS
- `font-display: swap/optional`; preload only critical fonts
- Inline critical CSS; lazy load non-hero components
- Route/feature code splitting (React Suspense, Next.js dynamic)
- Load third-party scripts async/defer
- Virtualize lists with 50+ items
- Skeleton screens for >300ms loads
- Debounce/throttle scroll, resize, input events
- Input latency < 100ms; tap feedback < 100ms

## 4. Style Selection (HIGH)
- Match style to product type (SaaS → clean minimal, finance → trust/serif, social → vibrant)
- One consistent style across all pages — never mix flat + skeuomorphic
- SVG icons (Heroicons, Lucide) — never emoji
- Choose color palette from product/industry context
- One icon set with consistent stroke width + corner radius
- Primary CTA per screen — secondary actions visually subordinate
- Use blur only for background dismissal (modals/sheets), not decoration
- Native/system controls preferred; only customize when brand requires

## 5. Layout & Responsive (HIGH)
- `<meta name="viewport" content="width=device-width, initial-scale=1">` — never disable zoom
- Mobile-first: design 375px → scale to 768 → 1024 → 1440
- No horizontal scroll on mobile
- Body text min 16px mobile (prevents iOS auto-zoom)
- Line length: 35–60 chars mobile, 60–75 chars desktop
- 4pt/8dp spacing increment system
- Consistent max-width desktop (max-w-6xl/7xl)
- `min-h-dvh` over `100vh` on mobile
- `z-index` layered scale: 0 / 10 / 20 / 40 / 100 / 1000

## 6. Typography & Color (MEDIUM)
- Line-height 1.5–1.75 for body text
- Consistent type scale: 12 / 14 / 16 / 18 / 24 / 32
- Bold headings 600–700, Regular body 400, Medium labels 500
- Semantic color tokens (primary, error, surface, on-surface) — never raw hex in components
- Dark mode: desaturated/lighter tonal variants, not inverted; test contrast separately
- All foreground/background pairs ≥ 4.5:1 (AA)
- Tabular figures for prices, data columns, timers
- Intentional whitespace to group related items

## 7. Animation (MEDIUM)
- Micro-interactions: 150–300ms; complex transitions ≤ 400ms
- Only animate `transform` and `opacity` — never width/height/top/left
- Ease-out entering, ease-in exiting; never linear for UI
- Exit animations 60–70% of enter duration
- Stagger list items 30–50ms per item
- Every animation has `prefers-reduced-motion` fallback
- Animations must be interruptible; never block input
- Shared element transitions for screen-to-screen continuity
- No decorative animation — every motion expresses cause/effect
- Scale feedback 0.95–1.05 on tappable cards/buttons

## 8. Forms & Feedback (MEDIUM)
- Visible label per input — never placeholder-only
- Error message directly below the related field
- Loading → success/error state on submit
- Mark required fields (asterisk)
- Helpful empty state with action
- Auto-dismiss toasts 3–5s; `aria-live="polite"` for screen readers
- Confirm before destructive actions
- Validate on blur, not keystroke
- `autocomplete` / `textContentType` for autofill
- Error messages state cause + recovery path
- `focus` first invalid field after submit error
- Multi-step flows show step indicator; allow back navigation

## 9. Navigation (HIGH)
- Bottom nav max 5 items with icon + text label
- Drawer/sidebar for secondary nav only
- Back navigation predictable; restore scroll/state
- All key screens reachable via deep link / URL
- iOS: Tab Bar at bottom; Android: Top App Bar
- Active nav item visually highlighted
- Modals/sheets: clear close affordance; swipe-down dismiss
- Breadcrumbs on web for 3+ hierarchy levels
- Never silently reset navigation stack
- Core nav accessible from all deep pages
- Danger actions (delete account, logout) spatially separated

## 10. Charts & Data (LOW)
- Match chart type to data: trend → line, comparison → bar, proportion → donut
- Never rely on color alone; add pattern/texture/shape
- Always show legend near chart
- Tooltips on hover (web) / tap (mobile) with exact values
- Label axes with units; readable scale
- Skeleton/shimmer while data loads
- Responsive: reflow or simplify on small screens
- ≥ 44pt tap area on chart elements (mobile)
- Avoid pie/donut for > 5 categories — use bar
- Provide text summary / aria-label for screen readers
- Data lines/bars vs background ≥ 3:1 contrast
