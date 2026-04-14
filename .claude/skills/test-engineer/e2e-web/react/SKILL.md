# E2E — Playwright (React/Vite)

```typescript
test.describe('Feature flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name=email]', 'admin@app.com')
    await page.fill('[name=password]', 'Admin@1234')
    await page.click('button[type=submit]')
    await page.waitForURL('/dashboard')
  })

  test('user can create and see a feature', async ({ page }) => {
    await page.goto('/feature')
    await page.click('text=Add New')
    await page.fill('[placeholder=Title]', 'Test Feature')
    await page.click('text=Save')
    await expect(page.locator('text=Test Feature')).toBeVisible()
  })
})
```
