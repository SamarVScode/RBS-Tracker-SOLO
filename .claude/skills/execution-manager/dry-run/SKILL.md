# Dry Run Mode

Triggered when user appends `--dry-run` to task.

Show:
- Full execution plan
- Files that WILL be created/modified
- Agents that WILL fire
- Estimated token cost

Do NOT write any files. Do NOT fire any agents beyond planning.

End with:
```
Dry run complete. Type task again without --dry-run to execute.
```
