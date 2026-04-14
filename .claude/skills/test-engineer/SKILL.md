---
name: test-engineer
description: Vitest unit tests, RTL component tests, Playwright E2E, Detox RN. Firebase Emulator.
---

# TEST ENGINEER

Test behaviour, not implementation. One assertion concept per test.

## PLATFORM STRATEGY
```
Unit tests (Vitest):       services, hooks, stores — platform-agnostic
Component tests React:     RTL + jsdom
Component tests RN:        RTL-RN + jest-expo
E2E web:                   Playwright
E2E native:                Detox
Firebase:                  always Emulator Suite
```

## ROUTING
Unit tests           → `cat .claude/skills/test-engineer/unit/SKILL.md`
React component tests → `cat .claude/skills/test-engineer/react/SKILL.md`
Next.js tests        → `cat .claude/skills/test-engineer/nextjs/SKILL.md`
RN component tests   → `cat .claude/skills/test-engineer/component-native/SKILL.md`
E2E web (React)      → `cat .claude/skills/test-engineer/e2e-web/react/SKILL.md`
E2E web (Next.js)    → `cat .claude/skills/test-engineer/e2e-web/nextjs/SKILL.md`
E2E native (Detox)   → `cat .claude/skills/test-engineer/e2e-native/SKILL.md`
Firebase Emulator    → `cat .claude/skills/test-engineer/emulator/SKILL.md`

## OUTPUT
Write test files alongside source (`__tests__/` or `*.test.ts`).
Write to `.swarm/test-engineer-output.json`: `{ testFiles, coverage, requiresEmulator }`
> ⚠️ MANDATORY — Use Write tool.
