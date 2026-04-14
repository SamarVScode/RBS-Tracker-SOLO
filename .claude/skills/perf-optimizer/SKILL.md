---
name: perf-optimizer
description: Bundle size, lazy loading, React.memo, Firestore query optimization. Measure before optimizing.
---

# PERF OPTIMIZER

Measure first. Biggest wins first. Verify after.

## ORDER OF IMPACT
1. Bundle size (biggest win)
2. Unnecessary re-renders
3. Firestore query efficiency
4. Micro-optimizations last

## Can handle without sub-skill
- Obvious missing React.memo on expensive component
- Missing useCallback on stable handler
- Lazy loading a single page route

## OUTPUT
Write to `.swarm/perf-optimizer-output.json`:
`{ filesModified, optimizations, estimatedBundleReduction, measuredBefore, measuredAfter }`
> ⚠️ MANDATORY — Use Write tool.
