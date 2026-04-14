import { useState } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

function EmptyIllustration() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="48" cy="48" r="44" fill="var(--color-accent-muted)" />

      {/* Clipboard body */}
      <rect
        x="26"
        y="28"
        width="44"
        height="52"
        rx="6"
        fill="var(--color-bg-surface)"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />

      {/* Clipboard clip */}
      <rect
        x="36"
        y="22"
        width="24"
        height="12"
        rx="4"
        fill="var(--color-bg-surface)"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
      <rect x="42" y="25" width="12" height="3" rx="1.5" fill="var(--color-accent-muted)" />

      {/* Lines — content skeleton */}
      <rect x="34" y="46" width="28" height="3" rx="1.5" fill="var(--color-accent-muted)" />
      <rect x="34" y="54" width="20" height="3" rx="1.5" fill="var(--color-accent-muted)" />
      <rect x="34" y="62" width="24" height="3" rx="1.5" fill="var(--color-accent-muted)" />

      {/* Plus badge in bottom-right */}
      <circle cx="66" cy="68" r="12" fill="var(--gradient-primary, #4f46e5)" />
      <circle cx="66" cy="68" r="12" fill="url(#plusGrad)" />
      <line x1="66" y1="62" x2="66" y2="74" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="68" x2="72" y2="68" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      <defs>
        <linearGradient id="plusGrad" x1="56" y1="58" x2="76" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  const [btnHovered, setBtnHovered] = useState(false)

  const outerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-12) var(--space-6)',
    textAlign: 'center',
    background: 'var(--gradient-hero)',
    borderRadius: 'var(--radius-2xl)',
    border: '2px dashed var(--color-border)',
    gap: 'var(--space-4)',
  }

  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '96px',
    height: '96px',
    flexShrink: 0,
    filter: 'drop-shadow(0 4px 12px var(--color-accent-muted))',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    marginTop: 'var(--space-2)',
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    maxWidth: '320px',
    lineHeight: 1.7,
  }

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-pill)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--color-text-inverse)',
    background: btnHovered
      ? 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)'
      : 'var(--gradient-primary)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    minHeight: '44px',
    minWidth: '44px',
    marginTop: 'var(--space-2)',
    outline: 'none',
    boxShadow: btnHovered
      ? 'var(--shadow-accent)'
      : 'var(--shadow-md)',
    transform: btnHovered ? 'translateY(-1px)' : 'translateY(0)',
  }

  return (
    <div style={outerStyle} role="status" aria-label={title}>
      <div style={iconWrapperStyle}>
        <EmptyIllustration />
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      {actionLabel && onAction && (
        <button
          style={buttonStyle}
          onClick={onAction}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          onFocus={() => setBtnHovered(true)}
          onBlur={() => setBtnHovered(false)}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
