# Conflict Detection

After each batch, before micro-compress:
1. Check if agent output file paths conflict with existing FILE MAP in README
2. Check if Firestore collection names differ from README schema
3. Check if component names differ between architect and component-forge outputs

If conflict found:
```
⚠️ CONFLICT DETECTED
Agent: [name] | Conflict: [what] | Option A: [agent] | Option B: [README]
Awaiting user resolution.
```
Do NOT write conflicted output. Halt. Wait.
