---
name: next-rsc-boundaries
description: Load when writing, reviewing, or debugging Server vs Client component splits in Next.js. Covers 'use client', 'use server', prop serialization rules, and Server Action patterns.
user-invocable: false
ref: REF.md
---

# RSC Boundaries

## Hard Rules
- Client components **cannot** be `async` — only Server Components can
- Non-serializable values (functions, class instances, `undefined` in some cases) **cannot cross** the RSC→client boundary as props
- Server-only APIs (`cookies`, `headers`, `db`, `fs`) must stay in Server Components or Server Actions
- `'use client'` propagates down — all imports in a client file become client too
- Push `'use client'` to **leaf** components, not layouts/wrappers

## Directives
| Directive | Scope | Use For |
|---|---|---|
| `'use client'` | file | Opt into client bundle (hooks, events, browser APIs) |
| `'use server'` | file or function | Mark as Server Action (can be passed as prop) |

## Prop Serialization Rules
- Pass only fields the client **actually uses** — every prop is serialized to HTML
- Do transforms (`.sort()`, `.filter()`, `.map()`) in the **client**, not server — same reference = serialized once
- Functions: **cannot** pass as props **except** Server Actions (marked `'use server'`)

## Pattern: Pass RSC as children
```tsx
// ❌ Wrong — forces ServerComp into client bundle
'use client'
import ServerComp from './ServerComp'

// ✅ Right — keep boundary clean
'use client'
export function ClientShell({ children }) { return <div>{children}</div> }

// In parent (server):
<ClientShell><ServerComp /></ClientShell>
```

> For non-serializable prop patterns and full interop examples → see REF.md
