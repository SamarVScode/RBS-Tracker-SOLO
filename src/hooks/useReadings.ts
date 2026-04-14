import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReadings, upsertReading, deleteReading } from '../services/readingsService'
import type { Reading, AddReadingInput, ReadingFilter, ReadingSummary } from '../types'

const PATIENT_ID = 'patient-001'

export function useReadings(filter?: Partial<ReadingFilter>) {
  return useQuery<Reading[], Error>({
    queryKey: ['readings', PATIENT_ID, filter ?? null],
    queryFn: () => getReadings(PATIENT_ID, filter?.startDate, filter?.endDate),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAddReading() {
  const queryClient = useQueryClient()
  return useMutation<string, Error, AddReadingInput>({
    mutationFn: (input: AddReadingInput) => upsertReading(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['readings'] })
    },
  })
}

export function useDeleteReading() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteReading(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['readings'] })
    },
  })
}

export function useReadingSummary(readings: Reading[]): ReadingSummary {
  if (readings.length === 0) {
    return {
      latestFasting: null,
      latestPostMeal: null,
      latestNight: null,
      avgFasting: null,
      avgPostMeal: null,
      avgNight: null,
      minFasting: null,
      maxFasting: null,
    }
  }

  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date))

  const latestFasting = sorted.find((r) => r.fastingRBS !== null)?.fastingRBS ?? null
  const latestPostMeal = sorted.find((r) => r.postMealRBS !== null)?.postMealRBS ?? null
  const latestNight = sorted.find((r) => r.nightRBS !== null)?.nightRBS ?? null

  const fastingValues = readings.map((r) => r.fastingRBS).filter((v): v is number => v !== null)
  const postMealValues = readings.map((r) => r.postMealRBS).filter((v): v is number => v !== null)
  const nightValues = readings.map((r) => r.nightRBS).filter((v): v is number => v !== null)

  const avg = (vals: number[]): number | null =>
    vals.length === 0 ? null : Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)

  return {
    latestFasting,
    latestPostMeal,
    latestNight,
    avgFasting: avg(fastingValues),
    avgPostMeal: avg(postMealValues),
    avgNight: avg(nightValues),
    minFasting: fastingValues.length > 0 ? Math.min(...fastingValues) : null,
    maxFasting: fastingValues.length > 0 ? Math.max(...fastingValues) : null,
  }
}
