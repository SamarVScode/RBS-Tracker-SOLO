import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore'
import { db, firebaseConfigured } from '../lib/firebase'
import type { Reading, AddReadingInput } from '../types'

const COLLECTION = 'readings'

/**
 * Guard: throws a descriptive error if Firebase is not yet configured.
 * This prevents cryptic Firebase errors when placeholders are still in place.
 */
function assertFirebase(): NonNullable<typeof db> {
  if (!firebaseConfigured || db === null) {
    throw new Error(
      'Firebase is not configured. Please replace the placeholder values in ' +
        'src/lib/firebase.ts with your real Firebase project config.',
    )
  }
  return db
}

/**
 * Upsert a reading for a given date.
 *
 * - If a document already exists for patientId + date:
 *     only the non-null fields in `data` are written (existing values are preserved).
 * - If no document exists yet:
 *     a new document is created with all provided fields.
 *
 * This ensures one document per patient per day regardless of how many
 * separate reading entries (fasting / post-meal / night) the user submits.
 *
 * Returns the document ID (new or existing).
 */
export async function upsertReading(data: AddReadingInput): Promise<string> {
  const firestore = assertFirebase()

  // Check if a document already exists for this patient + date
  const q = query(
    collection(firestore, COLLECTION),
    where('patientId', '==', data.patientId),
    where('date', '==', data.date),
  )
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    // Document exists — merge only the fields that are being provided now
    const existingDoc = snapshot.docs[0]
    const updates: Record<string, number | string | null> = {}

    if (data.fastingRBS !== null) updates['fastingRBS'] = data.fastingRBS
    if (data.postMealRBS !== null) updates['postMealRBS'] = data.postMealRBS
    if (data.nightRBS !== null) updates['nightRBS'] = data.nightRBS
    // Append notes: only overwrite if the new submission includes a note
    if (data.notes.trim() !== '') updates['notes'] = data.notes.trim()

    await updateDoc(existingDoc.ref, updates)
    return existingDoc.id
  }

  // No document for this date — create a fresh one
  const docRef = await addDoc(collection(firestore, COLLECTION), {
    patientId: data.patientId,
    date: data.date,
    fastingRBS: data.fastingRBS,
    postMealRBS: data.postMealRBS,
    nightRBS: data.nightRBS,
    notes: data.notes,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

/**
 * Query readings for a patient, with optional date-range filtering.
 * Results are ordered by date ascending.
 */
export async function getReadings(
  patientId: string,
  startDate?: string,
  endDate?: string,
): Promise<Reading[]> {
  const firestore = assertFirebase()

  const constraints: QueryConstraint[] = [
    where('patientId', '==', patientId),
  ]

  const q = query(collection(firestore, COLLECTION), ...constraints)
  const snapshot = await getDocs(q)

  const readings = snapshot.docs.map((docSnap) => {
    const raw = docSnap.data()
    return {
      id: docSnap.id,
      patientId: raw['patientId'] as string,
      date: raw['date'] as string,
      fastingRBS: raw['fastingRBS'] as number | null,
      postMealRBS: raw['postMealRBS'] as number | null,
      nightRBS: raw['nightRBS'] as number | null,
      notes: (raw['notes'] as string) ?? '',
      createdAt:
        raw['createdAt'] != null
          ? (raw['createdAt'] as { toDate: () => Date }).toDate().toISOString()
          : new Date().toISOString(),
    }
  })

  // Filter by date range client-side (avoids composite index requirement)
  const filtered = readings.filter((r) => {
    if (startDate && r.date < startDate) return false
    if (endDate && r.date > endDate) return false
    return true
  })

  // Sort by date ascending
  return filtered.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Delete a reading document by its Firestore document ID.
 */
export async function deleteReading(docId: string): Promise<void> {
  const firestore = assertFirebase()
  await deleteDoc(doc(firestore, COLLECTION, docId))
}

/**
 * Get a single reading for a patient on a specific date.
 * Returns null if no reading exists for that date.
 */
export async function getReadingByDate(
  patientId: string,
  date: string,
): Promise<Reading | null> {
  const firestore = assertFirebase()

  const q = query(
    collection(firestore, COLLECTION),
    where('patientId', '==', patientId),
    where('date', '==', date),
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return null
  }

  const docSnap = snapshot.docs[0]
  const raw = docSnap.data()

  return {
    id: docSnap.id,
    patientId: raw['patientId'] as string,
    date: raw['date'] as string,
    fastingRBS: raw['fastingRBS'] as number | null,
    postMealRBS: raw['postMealRBS'] as number | null,
    nightRBS: raw['nightRBS'] as number | null,
    notes: (raw['notes'] as string) ?? '',
    createdAt:
      raw['createdAt'] != null
        ? (raw['createdAt'] as { toDate: () => Date }).toDate().toISOString()
        : new Date().toISOString(),
  }
}
