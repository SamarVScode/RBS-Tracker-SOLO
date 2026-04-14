import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReadings, useReadingSummary } from '../hooks/useReadings'
import { SummaryCard } from '../components/SummaryCard'
import { LineChartRBS } from '../components/LineChartRBS'
import { BarChartRBS } from '../components/BarChartRBS'
import { EmptyState } from '../components/EmptyState'
import { Layout } from '../components/Layout'
import { ROUTES } from '../constants/routes'
import { firebaseConfigured } from '../lib/firebase'
import type { ReadingFilter } from '../types'

type DatePreset = '7d' | '30d' | 'all'

type StatusType = 'normal' | 'warning' | 'danger' | 'unknown'

function getRBSStatus(value: number | null): StatusType {
  if (value === null) return 'unknown'
  if (value < 70 || value > 200) return 'danger'
  if ((value >= 70 && value < 90) || (value > 140 && value <= 200)) return 'warning'
  return 'normal'
}

function getDateRange(preset: DatePreset): { startDate: string; endDate: string } {
  if (preset === 'all') return { startDate: '', endDate: '' }
  const today = new Date()
  const days = preset === '7d' ? 7 : 30
  const start = new Date(today)
  start.setDate(today.getDate() - days + 1)
  const fmt = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dy = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dy}`
  }
  return { startDate: fmt(start), endDate: fmt(today) }
}

function FirebaseWarningBanner() {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid var(--color-warning)',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: 1.6,
        marginBottom: 'var(--space-6)',
      }}
      role="alert"
    >
      <div
        style={{
          fontWeight: 600,
          color: 'var(--color-warning)',
          marginBottom: 'var(--space-2)',
          fontSize: 'var(--font-size-base)',
        }}
      >
        Firebase Not Configured
      </div>
      <p>
        This app requires Firebase to store and retrieve data. Please replace the placeholder
        values in{' '}
        <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>src/lib/firebase.ts</code>{' '}
        with your real Firebase project credentials to enable data persistence.
      </p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [preset, setPreset] = useState<DatePreset>('30d')
  const [hoveredPreset, setHoveredPreset] = useState<DatePreset | null>(null)
  const [retryHovered, setRetryHovered] = useState(false)

  const { startDate, endDate } = getDateRange(preset)

  const filter: Partial<ReadingFilter> = startDate
    ? { startDate, endDate }
    : {}

  const { data: readings = [], isLoading, isError, error, refetch } = useReadings(filter)
  const summary = useReadingSummary(readings)

  const presets: { id: DatePreset; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ]

  const summaryCards = [
    { label: 'Latest Fasting', value: summary.latestFasting, status: getRBSStatus(summary.latestFasting) },
    { label: 'Latest Post-Meal', value: summary.latestPostMeal, status: getRBSStatus(summary.latestPostMeal) },
    { label: 'Latest Night', value: summary.latestNight, status: getRBSStatus(summary.latestNight) },
    { label: 'Avg Fasting', value: summary.avgFasting, status: getRBSStatus(summary.avgFasting) },
    { label: 'Avg Post-Meal', value: summary.avgPostMeal, status: getRBSStatus(summary.avgPostMeal) },
    { label: 'Avg Night', value: summary.avgNight, status: getRBSStatus(summary.avgNight) },
  ]

  const responsiveGridCss = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .rbs-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    @media (max-width: 767px) {
      .rbs-summary-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 479px) {
      .rbs-summary-grid { grid-template-columns: 1fr !important; }
    }
  `

  const heroStyle: React.CSSProperties = {
    background: 'var(--gradient-hero)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-8) var(--space-6)',
    marginBottom: 'var(--space-6)',
    position: 'relative',
    overflow: 'hidden',
  }

  const heroTitleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
    letterSpacing: '-0.02em',
  }

  const heroSubtitleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  }

  const filterBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-6)',
    flexWrap: 'wrap',
  }

  const presetButtonStyle = (id: DatePreset): React.CSSProperties => {
    const isActive = preset === id
    const isHovered = hoveredPreset === id
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-2) var(--space-4)',
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
      minHeight: '38px',
      outline: 'none',
      boxShadow: isActive ? 'var(--shadow-card)' : 'none',
    }
  }

  const errorCardStyle: React.CSSProperties = {
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
  }

  const retryButtonStyle: React.CSSProperties = {
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
  }

  return (
    <Layout>
      <style>{responsiveGridCss}</style>

      {!firebaseConfigured && <FirebaseWarningBanner />}

      <div style={heroStyle}>
        <h1 style={heroTitleStyle}>Dashboard</h1>
        <p style={heroSubtitleStyle}>
          Track and monitor your blood sugar readings over time.
        </p>
      </div>

      {isError && (
        <div style={errorCardStyle} role="alert">
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
            style={retryButtonStyle}
            onClick={() => { void refetch() }}
            onMouseEnter={() => setRetryHovered(true)}
            onMouseLeave={() => setRetryHovered(false)}
          >
            Retry
          </button>
        </div>
      )}

      <div style={filterBarStyle} role="group" aria-label="Date range filter">
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            marginRight: 'var(--space-1)',
          }}
        >
          Range:
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            style={presetButtonStyle(p.id)}
            onClick={() => setPreset(p.id)}
            onMouseEnter={() => setHoveredPreset(p.id)}
            onMouseLeave={() => setHoveredPreset(null)}
            onFocus={() => setHoveredPreset(p.id)}
            onBlur={() => setHoveredPreset(null)}
            aria-pressed={preset === p.id}
            aria-label={`Filter by ${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="rbs-summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            status={card.status}
            loading={isLoading}
          />
        ))}
      </div>

      {!isLoading && readings.length === 0 && !isError && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <EmptyState
            title="No readings yet"
            description="Start tracking your blood sugar by adding your first reading."
            actionLabel="Add First Reading"
            onAction={() => void navigate(ROUTES.ADD_READING)}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <ChartCard title="Blood Sugar Trend (Line Chart)">
          <LineChartRBS readings={readings} loading={isLoading} />
        </ChartCard>

        <ChartCard title="Reading Comparison (Bar Chart)">
          <BarChartRBS readings={readings} loading={isLoading} />
        </ChartCard>
      </div>
    </Layout>
  )
}
