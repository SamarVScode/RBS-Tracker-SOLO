import { useState } from 'react'

type StatusType = 'normal' | 'warning' | 'danger' | 'unknown'

interface SummaryCardProps {
  label: string
  value: number | null
  unit?: string
  status?: StatusType
  loading?: boolean
}

function getStatusColor(status: StatusType): string {
  switch (status) {
    case 'normal':
      return 'var(--color-success)'
    case 'warning':
      return 'var(--color-warning)'
    case 'danger':
      return 'var(--color-danger)'
    default:
      return 'var(--color-text-secondary)'
  }
}

function getStatusLabel(status: StatusType): string {
  switch (status) {
    case 'normal':
      return 'Normal'
    case 'warning':
      return 'Warning'
    case 'danger':
      return 'High Risk'
    default:
      return 'N/A'
  }
}

function getStatusBgColor(status: StatusType): string {
  switch (status) {
    case 'normal':
      return 'rgba(16, 185, 129, 0.14)'
    case 'warning':
      return 'rgba(245, 158, 11, 0.14)'
    case 'danger':
      return 'rgba(239, 68, 68, 0.14)'
    default:
      return 'var(--color-bg-surface-raised)'
  }
}

function SkeletonBlock({ width, height }: { width: string; height: string }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 'var(--radius-sm)',
        background: 'linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-surface-raised) 50%, var(--color-border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
      aria-hidden="true"
    />
  )
}

export function SummaryCard({
  label,
  value,
  unit = 'mg/dL',
  status = 'unknown',
  loading = false,
}: SummaryCardProps) {
  const [hovered, setHovered] = useState(false)

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-5)',
    paddingLeft: 'calc(var(--space-5) + 4px)',
    boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
    transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
    transform: hovered ? 'translateY(-2px)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    overflow: 'hidden',
  }

  const accentBorderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'var(--gradient-primary)',
    borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const valueRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
  }

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-3xl)',
    fontWeight: 700,
    color: value !== null ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  }

  const unitStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
    alignSelf: 'flex-end',
    marginBottom: '2px',
  }

  const statusDotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: getStatusColor(status),
    flexShrink: 0,
    boxShadow: `0 0 0 2px ${getStatusBgColor(status)}`,
  }

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: '3px var(--space-3)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 600,
    color: getStatusColor(status),
    backgroundColor: getStatusBgColor(status),
    alignSelf: 'flex-start',
    letterSpacing: '0.03em',
  }

  const rangeNoteStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-secondary)',
    opacity: 0.75,
  }

  if (loading) {
    return (
      <div
        style={{ ...cardStyle, cursor: 'default' }}
        aria-busy="true"
        aria-label={`Loading ${label}`}
      >
        <div style={accentBorderStyle} />
        <SkeletonBlock width="55%" height="13px" />
        <SkeletonBlock width="48%" height="38px" />
        <SkeletonBlock width="36%" height="20px" />
      </div>
    )
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="region"
      aria-label={`${label}: ${value !== null ? `${value} ${unit}` : 'No data'}`}
    >
      <div style={accentBorderStyle} />
      <span style={labelStyle}>{label}</span>
      <div style={valueRowStyle}>
        <span style={valueStyle}>
          {value !== null ? (
            value
          ) : (
            <span style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }}>—</span>
          )}
        </span>
        {value !== null && (
          <>
            <span style={unitStyle}>{unit}</span>
            <div style={statusDotStyle} aria-hidden="true" />
          </>
        )}
      </div>
      <span style={badgeStyle}>{getStatusLabel(status)}</span>
      <span style={rangeNoteStyle}>Normal: 90–140 mg/dL</span>
    </div>
  )
}
