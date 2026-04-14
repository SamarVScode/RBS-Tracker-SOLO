# Pre-commit Checks — Next.js

```bash
# 1. TypeScript
npx tsc --noEmit
# FAIL → halt

# 2. Next.js lint (includes ESLint)
npx next lint
# FAIL → halt

# 3. Next.js build check (catches RSC errors, missing exports)
npx next build
# FAIL → halt

# 4. Firebase rules syntax
firebase --project YOUR_PROJECT_ID firestore:rules --dry-run
# FAIL → halt

# 5. Smoke tests
npx vitest run --reporter=verbose --testTimeout=10000
# FAIL → halt

# 6. Server Action auth check
grep -r "use server" src/actions/ --include="*.ts" -l | xargs grep -L "auth()"
# Found (Server Actions without auth()) → warn

# 7. Console.log (warn only)
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "// debug"
# Found → warn, don't block
```
