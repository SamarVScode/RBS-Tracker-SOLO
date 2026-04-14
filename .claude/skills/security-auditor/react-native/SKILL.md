# Security — React Native

### AsyncStorage — Unencrypted
🔴 CRITICAL — Plain text on device. Flag: auth tokens, API keys, PII, secrets in AsyncStorage.
FIX: `expo-secure-store` → Keychain (iOS) / EncryptedSharedPreferences (Android)
```typescript
await SecureStore.setItemAsync('authToken', token)
const token = await SecureStore.getItemAsync('authToken')
```

### Deep Link Params
🟠 HIGH — Attacker-controlled input. Validate against auth state:
```typescript
const { userId } = route.params
if (userId !== auth.currentUser?.uid) { navigation.replace('Home'); return }
```

### Certificate Pinning
🟠 HIGH — Required for finance/health apps. Use `react-native-ssl-pinning`. Pin leaf cert hash, rotate via CI/CD.

### Permissions
🟡 MEDIUM — Request at point of use only, never at launch. Upfront requests get denied + trigger store flags.

### Auth Token Logging
🔴 CRITICAL — Strip ALL token logs before prod. Grep: `getIdToken`, `stsTokenManager`, `refreshToken` near console.log.

### Jailbreak/Root Detection
🟡 MEDIUM — Required for payments/health/MDM. Use `jail-monkey` or `expo-device`. Warn user + disable sensitive features.

## Checklist
```
🔴 AsyncStorage sensitive data    → SecureStore
🔴 Token logging                  → strip before prod
🟠 Deep link params unvalidated   → validate vs auth
🟠 No cert pinning (finance/health) → SSL pinning
🟡 Permissions at launch          → point of use
🟡 No jailbreak detection         → add detection
🟢 OTA without signing            → expo-updates signing
```
