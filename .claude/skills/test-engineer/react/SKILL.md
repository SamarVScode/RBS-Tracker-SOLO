# Test — React Components (RTL)

```typescript
describe('FeatureForm', () => {
  it('shows validation error when submitted empty', async () => {
    render(<FeatureForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with correct data', async () => {
    const onSubmit = vi.fn()
    render(<FeatureForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/title/i), 'My Feature')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'My Feature' }))
  })
})
```

## Extended Skills
Testing patterns → `cat .claude/skills/react-skills/testing/SKILL.md`
