# Retry Protocol

If agent output fails TaskCompleted hook validation:
1. Re-run that agent with error as additional context
2. Max 2 retries per agent
3. After 2 retries → halt, report to user

## Task Queue File
Write and maintain `.swarm/task-queue.json`:
```json
{
  "tasks": [
    { "id": "1", "agent": "architect", "status": "pending|in_progress|done|failed", "batch": 1, "blockedBy": [] }
  ]
}
```
Use flock when updating to prevent race conditions between parallel agents.
