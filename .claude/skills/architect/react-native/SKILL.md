# Architect — React Native

## File Tree Format
```
src/
├── screens/
│   └── FeatureScreen.tsx          ← NEW
├── components/featureName/
│   ├── FeatureCard.tsx            ← NEW
│   └── FeatureList.tsx            ← NEW
├── navigation/
│   ├── types.ts                   ← MODIFY (add new params)
│   └── FeatureStack.tsx           ← NEW (if new stack needed)
├── services/featureService.ts     ← NEW (no RN imports)
└── hooks/useFeature.ts            ← NEW (no RN imports)
```

## Navigator Template
```typescript
// navigation/types.ts
export type RootStackParamList = {
  Home: undefined
  Feature: { userId: string }
  FeatureDetail: { id: string; userId: string }
}

// navigation/FeatureStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator<RootStackParamList>()
export const FeatureStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feature" component={FeatureScreen} />
  </Stack.Navigator>
)
```

## Navigation Rules
- Stack for drill-down flows
- Tab for main app sections (5 tabs max)
- Drawer for settings/secondary
- Always type: `NativeStackScreenProps<RootStackParamList, 'FeatureName'>`
- Deep linking config alongside navigator
- Services and hooks shared with web — no RN-specific imports inside them
