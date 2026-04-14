# Bug Hunter — React Native

- **Text outside Text**: `<View>raw string</View>` crashes → wrap in `<Text>`
- **Web CSS in RN**: `margin: '0 auto'`, `display: 'block'` don't exist → use flexbox
- **FlatList re-renders**: renderItem inline → extract + memoize with useCallback
- **Keyboard covers input**: missing KeyboardAvoidingView + `behavior="padding"` on iOS
- **Safe area overflow**: content behind status bar → use useSafeAreaInsets()
- **Android back**: missing BackHandler → app exits unexpectedly
- **Nav type error**: wrong param type in navigate() → check RootStackParamList
- **Metro cache**: stale transform → `npx expo start --clear`
- **Android elevation**: shadowColor doesn't work → add `elevation` property
- **Expo Go vs build**: module not in Expo Go → check Expo SDK compatibility
- **Optimistic rollback missing**: no onError handler → add rollback from ctx.previous
