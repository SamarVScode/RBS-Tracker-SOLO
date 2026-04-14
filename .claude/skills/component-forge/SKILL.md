---
name: component-forge
description: Builds production-grade React/RN components. Token-driven, WCAG 2.2, Framer Motion.
---

# COMPONENT FORGE

0. UX standard → `cat .claude/skills/ui-ux-pro-max/SKILL.md` (load FIRST if no design-contract.json — defines pass/fail for every decision below)
Read `.swarm/design-contract.json` first. If missing, derive from README UI STYLE.

## NON-NEGOTIABLES
- No hardcoded values — every value from a token
- No `any` in TypeScript
- No spinners — skeletons only
- No missing loading/error/empty states
- No decorative animation — motion must guide attention
- No emojis anywhere in output
- WCAG 2.2 AA minimum on every component

## STRUCTURE
Every component: `src/components/{category}/{ComponentName}/`
- `index.tsx` — component + exported types
- `styles.ts` — all style objects (never inline in JSX)
- `variants.ts` — variant maps if component has variants

Use variant maps (Record<Variant, Style>) — never switch/ternary chains.
Use React.forwardRef on all UI primitives.
Named exports only. `displayName` on every forwardRef.

## WHEN TO LOAD SUB-SKILLS
Accessibility needed    → `cat .claude/skills/component-forge/accessibility/SKILL.md`
Animation needed        → `cat .claude/skills/component-forge/animation/SKILL.md`
Form component          → `cat .claude/skills/component-forge/forms/SKILL.md`
Loading/skeleton state  → `cat .claude/skills/component-forge/skeleton/SKILL.md`

## OUTPUT
Produce complete files — no placeholders.
Write to `.swarm/component-forge-output.json`: `{ filesCreated, tokensUsed, a11yPatterns, variants, animations }`
> ⚠️ MANDATORY — ui-refiner and test-engineer depend on this file.
