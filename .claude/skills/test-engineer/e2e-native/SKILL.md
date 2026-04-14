# E2E — Detox (React Native)

```typescript
describe('Feature flow', () => {
  beforeAll(async () => { await device.launchApp({ newInstance: true }) })

  it('shows feature screen after login', async () => {
    await element(by.id('email-input')).typeText('admin@app.com')
    await element(by.id('password-input')).typeText('Admin@1234')
    await element(by.id('login-button')).tap()
    await expect(element(by.id('feature-screen'))).toBeVisible()
  })

  it('creates a new feature', async () => {
    await element(by.id('add-button')).tap()
    await element(by.id('title-input')).typeText('My Feature')
    await element(by.id('save-button')).tap()
    await expect(element(by.text('My Feature'))).toBeVisible()
  })
})
```
