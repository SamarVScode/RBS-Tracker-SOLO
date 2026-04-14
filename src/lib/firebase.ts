/**
 * Firebase configuration
 *
 * HOW TO CONFIGURE:
 * 1. Go to https://console.firebase.google.com/ and open your project.
 * 2. Click the gear icon → Project Settings → Your apps → Web app.
 * 3. Copy the firebaseConfig object values.
 * 4. Replace each placeholder string below with the real values.
 *
 * Example:
 *   apiKey: "AIzaSyAbc123..."
 *   authDomain: "my-project.firebaseapp.com"
 *   projectId: "my-project"
 *   ...
 *
 * After replacing all placeholders, set firebaseConfigured = true manually
 * or rely on the auto-detection logic below.
 */

import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBCjjSfcANLFT2ZjOjAMSGl1Mg2DJjxLyE',
  authDomain: 'rbs-tracker-ee969.firebaseapp.com',
  projectId: 'rbs-tracker-ee969',
  storageBucket: 'rbs-tracker-ee969.firebasestorage.app',
  messagingSenderId: '396140583055',
  appId: '1:396140583055:web:5bcce021cc95b5fb27b8fa',
  measurementId: 'G-3HE72WTG47',
}

const PLACEHOLDER_VALUES = [
  'YOUR_API_KEY',
  'YOUR_AUTH_DOMAIN',
  'YOUR_PROJECT_ID',
  'YOUR_STORAGE_BUCKET',
  'YOUR_MESSAGING_SENDER_ID',
  'YOUR_APP_ID',
]

const hasRealConfig = !Object.values(firebaseConfig).some((v) =>
  PLACEHOLDER_VALUES.includes(v),
)

let app: FirebaseApp | null = null
let db: Firestore | null = null
let firebaseConfigured = false

try {
  if (hasRealConfig) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    firebaseConfigured = true
  } else {
    console.warn(
      '[RBS Tracker] Firebase is not configured. ' +
        'Replace the placeholder values in src/lib/firebase.ts with your real Firebase config.',
    )
    firebaseConfigured = false
  }
} catch (error) {
  console.error('[RBS Tracker] Firebase initialization failed:', error)
  firebaseConfigured = false
}

// Typed exports — consumers must check firebaseConfigured before using db.
export { db, firebaseConfigured }
