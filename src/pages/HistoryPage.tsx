import { useState } from 'react'
import { useReadings, useDeleteReading } from '../hooks/useReadings'
import { ReadingsTable } from '../components/ReadingsTable'
import { EmptyState } from '../components/EmptyState'
import { Layout } from '../components/Layout'
import type { ReadingFilter, ReadingType } from '../types'

function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const EMPTY_FILTER: ReadingFilter = {
  startDate: '',
  endDate: '',
  readingType: 'all',
}

const TYPE_PILLS: { value: ReadingType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'fasting', label: 'Fasting' },
  { value: 'postMeal', label: 'Post-Meal' },
  { value: 'night', label: 'Night' },
]

export function HistoryPage() {
  const [appliedFilter, setAppliedFilter] = useState<ReadingFilter>(EMPTY_FILTER)
  const [draftFilter, setDraftFilter] = useState<ReadingFilter>(EMPTY_FILTER)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [retryHovered, setRetryHovered] = useState(false)
  const [hoveredPill, setHoveredPill] = useState<ReadingType | null>(null)
  const [applyHovered, setApplyHovered] = useState(false)
  const [clearHovered, setClearHovered] = useState(false)

  const queryFilter = {
    startDate: appliedFilter.startDate || undefined,
    endDate: appliedFilter.endDate || undefined,
  }

  const { data: rawReadings = [], isLoading, isError, error, refetch } = useReadings(queryFilter)
  const { mutate: deleteReading } = useDeleteReading()

  const readings = rawReadings.filter((r) => {
    if (appliedFilter.readingType === 'all') return true
    if (appliedFilter.readingType === 'fasting') return r.fastingRBS !== null
    if (appliedFilter.readingType === 'postMeal') return r.postMealRBS !== null
    if (appliedFilter.readingType === 'night') return r.nightRBS !== null
    return true
  })

  function handleApplyFilters() {
    setAppliedFilter({ ...draftFilter })
  }

  function handleClearFilters() {
    setDraftFilter(EMPTY_FILTER)
    setAppliedFilter(EMPTY_FILTER)
  }

  const activeFilterCount = [
    appliedFilter.startDate !== '',
    appliedFilter.endDate !== '',
    appliedFilter.readingType !== 'all',
  ].filter(Boolean).length

  const filtersAreActive = activeFilterCount > 0

  function getInputStyle(fieldName: string): React.CSSProperties {
    const focused = focusedField === fieldName
    return {
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--radius-md)',
      border: focused
        ? '1.5px solid var(--color-accent)'
        : '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg-input)',
      color: 'var(--color-text-primary)',
      fontSize: 'var(--font-size-sm)',
      outline: 'none',
      boxShadow: focused ? '0 0 0 3px var(--color-accent-light)' : 'none',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
      minHeight: '40px',
      minWidth: '150px',
    }
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  }

  const pillStyle = (value: ReadingType): React.CSSProperties => {
    const isActive = draftFilter.readingType === value
    const isHovered = hoveredPill === value
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 14px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: isActive ? 600 : 500,
      border: isActive ? '1px solid transparent' : '1px solid var(--color-border)',
      background: isActive
        ? 'var(--gradient-primary)'
        : isHovered
        ? 'var(--color-bg-surface-raised)'
        : 'var(--color-bg-surface)',
      color: isActive ? '#ffffff' : 'var(--color-text-primary)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      minHeight: '36px',
      outline: 'none',
      userSelect: 'none',
      boxShadow: isActive ? '0 1px 4px rgba(79,70,229,0.25)' : 'none',
    }
  }

  return (
    <Layout>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.02em',
          }}
        >
          Reading History
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Browse and manage all your blood sugar readings.
          {activeFilterCount > 0 && (
            <span
              style={{
                marginLeft: 'var(--space-2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
              }}
            >
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          )}
        </p>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
          padding: 'var(--space-5)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-card)',
          flexWrap: 'wrap',
        }}
        role="search"
        aria-label="Filter readings"
      >
        {/* Date range */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="filter-start" style={labelStyle}>Start Date</label>
          <input
            id="filter-start"
            type="date"
            value={draftFilter.startDate}
            onChange={(e) => setDraftFilter((f) => ({ ...f, startDate: e.target.value }))}
            onFocus={() => setFocusedField('start')}
            onBlur={() => setFocusedField(null)}
            style={getInputStyle('start')}
            max={draftFilter.endDate || getTodayString()}
            aria-label="Filter start date"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label htmlFor="filter-end" style={labelStyle}>End Date</label>
          <input
            id="filter-end"
            type="date"
            value={draftFilter.endDate}
            onChange={(e) => setDraftFilter((f) => ({ ...f, endDate: e.target.value }))}
            onFocus={() => setFocusedField('end')}
            onBlur={() => setFocusedField(null)}
            style={getInputStyle('end')}
            min={draftFilter.startDate || undefined}
            max={getTodayString()}
            aria-label="Filter end date"
          />
        </div>

        {/* Reading type pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={labelStyle} id="type-filter-label">Reading Type</span>
          <div
            style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}
            role="group"
            aria-labelledby="type-filter-label"
          >
            {TYPE_PILLS.map((pill) => (
              <button
                key={pill.value}
                style={pillStyle(pill.value)}
                onClick={() => setDraftFilter((f) => ({ ...f, readingType: pill.value }))}
                onMouseEnter={() => setHoveredPill(pill.value)}
                onMouseLeave={() => setHoveredPill(null)}
                aria-pressed={draftFilter.readingType === pill.value}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-2) var(--space-5)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: '#ffffff',
              background: applyHovered ? 'var(--color-accent-hover)' : 'var(--gradient-primary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              minHeight: '40px',
              outline: 'none',
              boxShadow: '0 1px 4px rgba(79,70,229,0.3)',
            }}
            onClick={handleApplyFilters}
            onMouseEnter={() => setApplyHovered(true)}
            onMouseLeave={() => setApplyHovered(false)}
            aria-label="Apply filters"
          >
            Apply
          </button>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
              color: clearHovered ? 'var(--color-danger)' : 'var(--color-text-secondary)',
              backgroundColor: clearHovered ? 'var(--color-danger-light)' : 'transparent',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              minHeight: '40px',
              outline: 'none',
            }}
            onClick={handleClearFilters}
            onMouseEnter={() => setClearHovered(true)}
            onMouseLeave={() => setClearHovered(false)}
            aria-label="Clear all filters"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            padding: 'var(--space-4) var(--space-5)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid var(--color-danger)',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap',
          }}
          role="alert"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-danger)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)', fontWeight: 500 }}>
              {error instanceof Error ? error.message : 'Failed to load readings.'}
            </span>
          </div>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: retryHovered ? '#ffffff' : 'var(--color-danger)',
              backgroundColor: retryHovered ? 'var(--color-danger)' : 'transparent',
              border: '1px solid var(--color-danger)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              minHeight: '36px',
              outline: 'none',
              whiteSpace: 'nowrap',
            }}
            onClick={() => { void refetch() }}
            onMouseEnter={() => setRetryHovered(true)}
            onMouseLeave={() => setRetryHovered(false)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state when filtered and no results */}
      {!isLoading && !isError && readings.length === 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <EmptyState
            title="No readings found"
            description={
              filtersAreActive
                ? 'No readings match your current filters. Try adjusting or clearing them.'
                : 'You have not added any blood sugar readings yet. Start by adding one.'
            }
            actionLabel={filtersAreActive ? 'Clear Filters' : undefined}
            onAction={filtersAreActive ? handleClearFilters : undefined}
          />
        </div>
      )}

      {/* Table */}
      {(isLoading || readings.length > 0) && (
        <ReadingsTable
          readings={readings}
          loading={isLoading}
          onDelete={(id) => deleteReading(id)}
        />
      )}
    </Layout>
  )
}
