# Pre-commit Checks — React / Vite

```bash
# 1. TypeScript
npx tsc --noEmit
# FAIL → halt

# 2. ESLint
npx eslint src/ --ext .ts,.tsx --max-warnings 0
# FAIL on errors → halt | FAIL on warnings only → continue

# 3. Inline style convention (no Tailwind classes)
grep -rq 'className="[^"]*\(flex\|grid\|p-\|m-\|w-\|h-\|text-\|bg-\|border-\|rounded\|gap-\|space-\)' src/components/ src/pages/ --include="*.tsx" 2>/dev/null
# Found Tailwind utility classes → halt (project uses inline styles / CSS vars)

# 4. Firebase rules syntax
firebase --project YOUR_PROJECT_ID firestore:rules --dry-run
# FAIL → halt

# 5. Smoke tests
npx vitest run --reporter=verbose --testTimeout=10000
# FAIL → halt

# 6. Console.log (warn only)
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "// debug" | grep -v "__tests__"
# Found → warn, don't block
```
