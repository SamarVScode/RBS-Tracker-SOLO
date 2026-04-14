# Bug Hunter — TypeScript

- **Undefined is not X**: missing null check → add `?.` or explicit guard
- **Type narrowing fail**: using typeof on object → use instanceof or discriminated unions
- **Generic inference fail**: explicit type param needed → `fn<Type>(arg)` not `fn(arg)`
- **any escape**: type widens to any silently → enable noImplicitAny in tsconfig
- **Enum misuse**: string enum not matching → check exact value, use const assertions instead
