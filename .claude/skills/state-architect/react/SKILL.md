# State — React / Vite

Everything is client-side. All server data goes through TanStack Query wrapping Firebase service calls. Zustand for shared UI state only.

No Server Actions. No server-side data fetching. Firebase client SDK is the only data source.

File locations:
- `src/stores/{feature}Store.ts`
- `src/hooks/use{Feature}.ts`

## Extended Skills
Data fetching patterns → `cat .claude/skills/react-skills/data-fetching/SKILL.md`
