# Test — React Native Components

## Setup (jest.config.js)
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterFramework: ['./src/test/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*)',
  ],
}
```

## Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native'
describe('FeatureCard', () => {
  it('renders title', () => {
    render(<FeatureCard item={{ id: '1', title: 'Test' }} onPress={vi.fn()} />)
    expect(screen.getByText('Test')).toBeTruthy()
  })
  it('calls onPress when tapped', () => {
    const onPress = vi.fn()
    render(<FeatureCard item={{ id: '1', title: 'Test' }} onPress={onPress} />)
    fireEvent.press(screen.getByTestId('feature-card'))
    expect(onPress).toHaveBeenCalledWith('1')
  })
})
```
