# Forms

## Validation Rules
- Never validate on first keystroke
- Validate on blur only
- Debounce async validation: 300ms delay
- Show errors only after first submit attempt OR after field blur

## Error Linking Pattern
```typescript
<input
  id="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <span id="email-error" role="alert">{errors.email}</span>
)}
```

## Submit State
```typescript
<button disabled={isPending} aria-disabled={isPending}>
  {isPending ? <Skeleton width={60} /> : 'Save'}
</button>
```

## Never
- Never use `<form>` in React artifacts (use onSubmit on div)
- Never validate on every keystroke
- Never show all errors at once before any interaction
