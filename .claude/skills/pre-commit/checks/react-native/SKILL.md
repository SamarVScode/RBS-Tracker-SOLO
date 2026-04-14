# Pre-commit Checks — React Native / Expo

```bash
# 1. TypeScript
npx tsc --noEmit
# FAIL → halt

# 2. ESLint
npx eslint src/ --ext .ts,.tsx --max-warnings 0
# FAIL on errors → halt | FAIL on warnings only → continue

# 3. StyleSheet convention (no inline style objects in JSX)
grep -rn "style={{" src/components/ src/screens/ --include="*.tsx" | grep -v "// allow" | grep -v "__tests__"
# Found → halt (use StyleSheet.create — inline style objects break memoization)

# 4. Firebase rules syntax
firebase --project YOUR_PROJECT_ID firestore:rules --dry-run
# FAIL → halt

# 5. Smoke tests (jest-expo)
npx jest --testTimeout=10000 --passWithNoTests
# FAIL → halt

# 6. Navigation type check (warn only)
grep -rn "useNavigation()" src/ --include="*.tsx" | grep -v "// typed"
# Found untyped useNavigation → warn (use useNavigation<NavigationProp<RootStackParamList>>())

# 7. Console.log (warn only)
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | grep -v "// debug" | grep -v "__tests__"
# Found → warn, don't block
```
