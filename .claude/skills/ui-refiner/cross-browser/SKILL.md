# UI Refiner — Cross-Browser

## Safari
```tsx
backdropFilter: 'blur(8px)',
WebkitBackdropFilter: 'blur(8px)', // always add alongside
```

## iOS
```tsx
fontSize: 16, // minimum for inputs — below 16 triggers Safari zoom on focus
WebkitOverflowScrolling: 'touch',
WebkitTapHighlightColor: 'transparent',
```

## Android (React Native)
```tsx
elevation: 4,       // always alongside shadow props
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
android_ripple={{ color: 'rgba(0,0,0,0.08)' }} // on Pressable
```

## Touch Targets
Any interactive element smaller than 44×44px:
```tsx
// Web: minHeight 44, minWidth 44
// RN: hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
```
