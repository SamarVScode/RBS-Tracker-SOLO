# Component Forge — React Native

## Styling Rules
- `StyleSheet.create` only — never inline style objects in JSX
- No web CSS properties: `margin: '0 auto'`, `display: 'block'`, `float`
- Use flexbox for all layouts
- Shadow requires both iOS and Android properties:
```typescript
shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08, shadowRadius: 8,
elevation: 4, // Android
```

## Touch Targets
All interactive elements: minimum 44×44px
Use `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` for small elements

## Safe Area
Always wrap screen content with `useSafeAreaInsets()` or `<SafeAreaView>`

## Text Rules
Every string must be inside `<Text>` — raw strings in `<View>` crash

## FlatList (performance critical)
```typescript
<FlatList
  data={data}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}           // extracted + useCallback
  getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

## Images
Use `expo-image` not `react-native Image`:
```typescript
import { Image } from 'expo-image'
<Image source={{ uri }} placeholder={blurhash} contentFit="cover" transition={200} />
```
