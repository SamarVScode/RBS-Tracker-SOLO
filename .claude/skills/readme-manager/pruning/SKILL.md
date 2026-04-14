# README Manager — Pruning

Trigger: `wc -c README.md` > 12,000 chars (~3000 tokens)

## Steps
1. Move DECISIONS older than 30 days → `DECISION_LOG.md`
2. Move `[x]` task queue items older than 7 days → `DECISION_LOG.md`
3. Collapse unchanged FILE MAP entries to one-liners
4. Keep: active files, full schema, last 10 decisions, all pending tasks
5. Append: `<!-- Pruned YYYY-MM-DD. Archived entries in DECISION_LOG.md -->`

## Never Delete
- ## PROJECT, ## STACK, ## ARCHITECTURE
- ## UI STYLE — every UI agent reads this
- ## FIRESTORE SCHEMA — Firebase + API Contract agents read this
- Active task queue items
- Decisions from last 7 days
