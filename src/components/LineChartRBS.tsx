import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import type { Reading } from '../types'
import { useThemeStore } from '../stores/themeStore'

interface LineChartRBSProps {
  readings: Reading[]
  loading?: boolean
}

interface TooltipPayloadEntry {
  name: string
  value: number | null
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  return `${parts[1]}/${parts[2]}`
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    boxShadow: 'var(--shadow-card-hover)',
    minWidth: '168px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 'var(--space-2)',
    paddingBottom: 'var(--space-2)',
    borderBottom: '1px solid var(--color-border)',
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--space-4)',
    fontSize: 'var(--font-size-sm)',
    padding: '3px 0',
  }

  const dotStyle = (color: string): React.CSSProperties => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: '6px',
    flexShrink: 0,
  })

  return (
    <div style={tooltipStyle}>
      <div style={labelStyle}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} style={rowStyle}>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            <span style={dotStyle(entry.color)} aria-hidden="true" />
            {entry.name}
          </span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {entry.value !== null ? `${entry.value}` : '—'}
            {entry.value !== null && (
              <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginLeft: '3px' }}>mg/dL</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

function SkeletonChart() {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-surface-raised) 50%, var(--color-border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
      aria-hidden="true"
    />
  )
}

function ChartEmptyState() {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-accent-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent)',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <span
        style={{
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}
      >
        No readings yet
      </span>
      <span
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          maxWidth: '260px',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Add your first blood sugar reading to see the trend chart.
      </span>
    </div>
  )
}

export function LineChartRBS({ readings, loading = false }: LineChartRBSProps) {
  const { theme } = useThemeStore()

  const fastingColor = theme === 'dark' ? '#818cf8' : '#4f46e5'
  const postMealColor = theme === 'dark' ? '#fbbf24' : '#f59e0b'
  const nightColor = theme === 'dark' ? '#a78bfa' : '#8b5cf6'
  const gridColor = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)'
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b'

  if (loading) {
    return (
      <div aria-busy="true" aria-label="Loading chart">
        <SkeletonChart />
      </div>
    )
  }

  if (readings.length === 0) {
    return <ChartEmptyState />
  }

  const data = readings.map((r) => ({
    date: formatDateLabel(r.date),
    fullDate: r.date,
    Fasting: r.fastingRBS,
    'Post-Meal': r.postMealRBS,
    Night: r.nightRBS,
  }))

  return (
    <div
      role="img"
      aria-label="Line chart showing blood sugar readings over time for fasting, post-meal, and night measurements"
      style={{ width: '100%', height: '300px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 300]}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}`}
            label={{
              value: 'mg/dL',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fill: textColor, fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ fontSize: '13px', paddingTop: '12px', color: textColor }}
          />
          <ReferenceLine y={90} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} label={{ value: '90', fill: '#10b981', fontSize: 10 }} />
          <ReferenceLine y={140} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} label={{ value: '140', fill: '#10b981', fontSize: 10 }} />
          <ReferenceLine y={200} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1} label={{ value: '200', fill: '#f59e0b', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="Fasting"
            stroke={fastingColor}
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: fastingColor, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--color-bg-surface)' }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="Post-Meal"
            stroke={postMealColor}
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: postMealColor, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--color-bg-surface)' }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="Night"
            stroke={nightColor}
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: nightColor, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--color-bg-surface)' }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
