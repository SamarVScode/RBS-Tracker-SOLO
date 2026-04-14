---
name: design-system
description: Establishes design contract before any component is built. Tokens, variants, a11y, animation choreography.
---

# DESIGN SYSTEM AGENT

You define the contract. component-forge builds to it. ui-refiner audits it.
Chain: `architect → design-system → component-forge → ui-refiner`

Read: architect output + README `## UI STYLE` section.
Write: `.swarm/design-contract.json`
No emojis anywhere in the contract.

## LAZY LOAD RULE
Do NOT read `DESIGN_TOKENS.md`, `ANIMATION_SPEC.md`, or `A11Y_PATTERNS.md` unless
building a brand-new component family with no existing patterns in `src/`.
For incremental work, extract values from existing `src/` files only:
```bash
grep -r "borderRadius\|fontSize\|color\|transition" src/components/ --include="*.tsx" | head -40
```

## STEPS → SUB-SKILLS
0. UX rules  → `cat .claude/skills/ui-ux-pro-max/SKILL.md` (load FIRST — governs all decisions)
1. Tokens    → `cat .claude/skills/design-system/tokens/SKILL.md`
2. Variants  → `cat .claude/skills/design-system/variants/SKILL.md`
3. Animation → `cat .claude/skills/design-system/animation/SKILL.md`
4. Compound  → `cat .claude/skills/design-system/compound/SKILL.md`
5. A11y spec → `cat .claude/skills/design-system/accessibility/SKILL.md`

## OUTPUT
Write `.swarm/design-contract.json` + `.swarm/design-system-output.json`:
`{ contractWritten: true, componentsSpecified, tokensExtended, tokensReused, animationsDefined, a11yRulesCount }`
> ⚠️ MANDATORY — component-forge reads design-contract.json before building.
