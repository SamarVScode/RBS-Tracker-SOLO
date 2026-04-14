// Reading as stored in Firestore (with id from doc.id)
export interface Reading {
  id: string
  patientId: string
  date: string // YYYY-MM-DD
  fastingRBS: number | null
  postMealRBS: number | null
  nightRBS: number | null
  notes: string
  createdAt: string // ISO string from Timestamp.toDate().toISOString()
}

// Input shape for creating a new reading (no id, no createdAt — server sets those)
export interface AddReadingInput {
  patientId: string
  date: string // YYYY-MM-DD
  fastingRBS: number | null
  postMealRBS: number | null
  nightRBS: number | null
  notes: string
}

// Theme toggle
export type Theme = 'light' | 'dark'

// Filter for chart/table display
export type ReadingType = 'fasting' | 'postMeal' | 'night' | 'all'

// Aggregated stats for Dashboard summary cards
export interface ReadingSummary {
  latestFasting: number | null
  latestPostMeal: number | null
  latestNight: number | null
  avgFasting: number | null
  avgPostMeal: number | null
  avgNight: number | null
  minFasting: number | null
  maxFasting: number | null
}

// Filter state used by HistoryPage
export interface ReadingFilter {
  startDate: string // YYYY-MM-DD, empty string = no filter
  endDate: string   // YYYY-MM-DD, empty string = no filter
  readingType: ReadingType
}
