# Perf — React Native

## FlatList (most common RN perf issue)
```typescript
<FlatList
  data={data}
  keyExtractor={item => item.id}
  renderItem={renderItem}           // extracted + useCallback — CRITICAL
  getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  removeClippedSubviews={true}
/>
const renderItem = useCallback(({ item }) => <FeatureCard item={item} />, [])
```

## Animations — use Reanimated (UI thread, 60fps)
```typescript
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
```
Never use Animated from react-native for complex animations — blocked by JS thread.

## Images — use expo-image
```typescript
import { Image } from 'expo-image'
<Image source={{ uri }} placeholder={blurhash} contentFit="cover" transition={200} />
```

## Hermes — verify enabled
```json
// app.json
{ "expo": { "jsEngine": "hermes" } }
```

## Anonymous Functions in JSX — avoid
```typescript
// WRONG — new function every render, breaks memo
<TouchableOpacity onPress={() => navigate('Detail', { id: item.id })}>
// RIGHT
const handlePress = useCallback(() => navigate('Detail', { id: item.id }), [item.id])
```
