# E2E — Playwright (Next.js)

Same as React/Vite Playwright setup with these additions:

```typescript
// Test Server Action via form submission
test('server action creates feature', async ({ page }) => {
  await page.goto('/feature/new')
  await page.fill('[name=title]', 'Test Feature')
  await page.click('button[type=submit]')
  // Server Action runs, revalidatePath fires, page updates
  await expect(page.locator('text=Test Feature')).toBeVisible()
})

// Test middleware redirect
test('unauthenticated redirects to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})
```
