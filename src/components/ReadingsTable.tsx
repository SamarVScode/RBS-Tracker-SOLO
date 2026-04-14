import { useState } from 'react'
import type { Reading } from '../types'

interface ReadingsTableProps {
  readings: Reading[]
  loading?: boolean
  onDelete?: (id: string) => void
}

type StatusType = 'normal' | 'warning' | 'danger' | 'unknown'

function getRBSStatus(value: number | null): StatusType {
  if (value === null) return 'unknown'
  if (value < 70 || value > 200) return 'danger'
  if ((value >= 70 && value < 90) || (value > 140 && value <= 200)) return 'warning'
  return 'normal'
}

function getBadgeColors(status: StatusType): { color: string; bg: string; label: string } {
  switch (status) {
    case 'normal':
      return { color: '#059669', bg: 'rgba(5,150,105,0.12)', label: 'OK' }
    case 'warning':
      return { color: '#d97706', bg: 'rgba(217,119,6,0.12)', label: 'Warn' }
    case 'danger':
      return { color: '#dc2626', bg: 'rgba(220,38,38,0.14)', label: 'High' }
    default:
      return { color: 'var(--color-text-secondary)', bg: 'var(--color-bg-surface-raised)', label: '—' }
  }
}

function Badge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
          opacity: 0.5,
        }}
      >
        —
      </span>
    )
  }

  const status = getRBSStatus(value)
  const { color, bg, label } = getBadgeColors(status)

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        fontSize: 'var(--font-size-sm)',
      }}
    >
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--color-text-primary)',
          fontWeight: 600,
        }}
      >
        {value}
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          fontWeight: 700,
          color,
          backgroundColor: bg,
          letterSpacing: '0.02em',
          lineHeight: 1.6,
        }}
      >
        {label}
      </span>
    </span>
  )
}

function DeleteTooltip({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--color-text-primary)',
        color: 'var(--color-bg-surface)',
        fontSize: '11px',
        fontWeight: 500,
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s ease',
        zIndex: 10,
      }}
    >
      Delete
    </span>
  )
}

function SkeletonRow() {
  const cellStyle: React.CSSProperties = {
    padding: '14px var(--space-4)',
    borderBottom: '1px solid var(--color-border)',
  }

  const skeletonStyle: React.CSSProperties = {
    height: '15px',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(90deg, var(--color-border) 25%, var(--color-bg-surface-raised) 50%, var(--color-border) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
  }

  return (
    <tr aria-hidden="true">
      <td style={cellStyle}><div style={{ ...skeletonStyle, width: '76px' }} /></td>
      <td style={cellStyle}><div style={{ ...skeletonStyle, width: '64px' }} /></td>
      <td style={cellStyle}><div style={{ ...skeletonStyle, width: '64px' }} /></td>
      <td style={cellStyle}><div style={{ ...skeletonStyle, width: '64px' }} /></td>
      <td style={cellStyle}><div style={{ ...skeletonStyle, width: '110px' }} /></td>
      <td style={cellStyle}><div style={{ ...skeletonStyle, width: '36px' }} /></td>
    </tr>
  )
}

const ROWS_PER_PAGE = 10

export function ReadingsTable({ readings, loading = false, onDelete }: ReadingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [hoveredDeleteId, setHoveredDeleteId] = useState<string | null>(null)
  const [hoveredPage, setHoveredPage] = useState<number | null>(null)
  const [focusedDeleteId, setFocusedDeleteId] = useState<string | null>(null)
  const [focusedPage, setFocusedPage] = useState<number | null>(null)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(readings.length / ROWS_PER_PAGE))
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE
  const pageRows = readings.slice(startIdx, startIdx + ROWS_PER_PAGE)

  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  async function handleDelete(id: string) {
    if (!onDelete) return
    setDeletingId(id)
    try {
      onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '—'
    try {
      const [y, m, d] = dateStr.split('-')
      return `${m}/${d}/${y}`
    } catch {
      return dateStr
    }
  }

  const tableContainerStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'auto',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-surface)',
    boxShadow: 'var(--shadow-card)',
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  }

  const thStyle: React.CSSProperties = {
    padding: '12px var(--space-4)',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    backgroundColor: 'var(--color-bg-surface-raised)',
    borderBottom: '2px solid var(--color-border)',
    whiteSpace: 'nowrap',
  }

  const tdStyle: React.CSSProperties = {
    padding: '14px var(--space-4)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
    borderBottom: '1px solid var(--color-border)',
    verticalAlign: 'middle',
  }

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-3) var(--space-4)',
    borderTop: '1px solid var(--color-border)',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
    backgroundColor: 'var(--color-bg-surface-raised)',
    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
  }

  const pageButtonStyle = (page: number, isCurrent: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: 'var(--radius-md)',
    border: isCurrent ? '1px solid transparent' : '1px solid var(--color-border)',
    background: isCurrent
      ? 'var(--gradient-primary)'
      : hoveredPage === page
      ? 'var(--color-bg-surface-raised)'
      : 'transparent',
    color: isCurrent ? '#ffffff' : 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: isCurrent ? 700 : 400,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    outline: focusedPage === page ? '2px solid var(--color-accent)' : 'none',
    outlineOffset: '2px',
    minHeight: '34px',
    minWidth: '34px',
  })

  const navButtonStyle = (disabled: boolean, focused: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '34px',
    padding: '0 var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'transparent',
    color: disabled ? 'var(--color-text-placeholder)' : 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-fast)',
    outline: focused ? '2px solid var(--color-accent)' : 'none',
    outlineOffset: '2px',
    minHeight: '34px',
  })

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  if (loading) {
    return (
      <div style={tableContainerStyle} aria-busy="true" aria-label="Loading readings">
        <table style={tableStyle} aria-label="Blood sugar readings">
          <thead>
            <tr>
              <th style={thStyle} scope="col">Date</th>
              <th style={thStyle} scope="col">Fasting</th>
              <th style={thStyle} scope="col">Post-Meal</th>
              <th style={thStyle} scope="col">Night</th>
              <th style={thStyle} scope="col">Notes</th>
              <th style={thStyle} scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle} aria-label="Blood sugar readings">
        <thead>
          <tr>
            <th style={thStyle} scope="col">Date</th>
            <th style={thStyle} scope="col">Fasting (mg/dL)</th>
            <th style={thStyle} scope="col">Post-Meal (mg/dL)</th>
            <th style={thStyle} scope="col">Night (mg/dL)</th>
            <th style={thStyle} scope="col">Notes</th>
            <th style={{ ...thStyle, textAlign: 'center' }} scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {readings.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: 'var(--space-12) var(--space-4)',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ opacity: 0.35 }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M9 9h6M9 13h4" />
                  </svg>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-base)' }}>
                    No readings found
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    No blood sugar readings match your current filters.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            pageRows.map((reading) => (
              <tr
                key={reading.id}
                onMouseEnter={() => setHoveredRowId(reading.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                style={{
                  backgroundColor: hoveredRowId === reading.id
                    ? 'var(--color-bg-surface-raised)'
                    : 'transparent',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatDate(reading.date)}
                </td>
                <td style={tdStyle}>
                  <Badge value={reading.fastingRBS} />
                </td>
                <td style={tdStyle}>
                  <Badge value={reading.postMealRBS} />
                </td>
                <td style={tdStyle}>
                  <Badge value={reading.nightRBS} />
                </td>
                <td
                  style={{
                    ...tdStyle,
                    color: reading.notes ? 'var(--color-text-primary)' : 'var(--color-text-placeholder)',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={reading.notes || undefined}
                >
                  {reading.notes || (
                    <span style={{ opacity: 0.4 }}>—</span>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {onDelete && (
                    <div style={{ position: 'relative', display: 'inline-flex' }}>
                      <DeleteTooltip visible={hoveredDeleteId === reading.id} />
                      <button
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          backgroundColor: hoveredDeleteId === reading.id
                            ? 'rgba(220,38,38,0.1)'
                            : 'transparent',
                          color: hoveredDeleteId === reading.id
                            ? '#dc2626'
                            : 'var(--color-text-secondary)',
                          cursor: deletingId === reading.id ? 'not-allowed' : 'pointer',
                          transition: 'background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)',
                          outline: focusedDeleteId === reading.id ? '2px solid var(--color-accent)' : 'none',
                          outlineOffset: '2px',
                          borderColor: hoveredDeleteId === reading.id
                            ? 'rgba(220,38,38,0.4)'
                            : 'var(--color-border)',
                        }}
                        onClick={() => { void handleDelete(reading.id) }}
                        onMouseEnter={() => setHoveredDeleteId(reading.id)}
                        onMouseLeave={() => setHoveredDeleteId(null)}
                        onFocus={() => { setFocusedDeleteId(reading.id); setHoveredDeleteId(reading.id) }}
                        onBlur={() => { setFocusedDeleteId(null); setHoveredDeleteId(null) }}
                        disabled={deletingId === reading.id}
                        aria-label={`Delete reading from ${formatDate(reading.date)}`}
                      >
                        {deletingId === reading.id ? (
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              border: '2px solid var(--color-text-secondary)',
                              borderTopColor: 'transparent',
                              animation: 'spin 0.7s linear infinite',
                              display: 'inline-block',
                            }}
                          />
                        ) : (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {readings.length > 0 && totalPages > 1 && (
        <div style={paginationStyle} role="navigation" aria-label="Pagination">
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Showing {startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, readings.length)} of {readings.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              style={navButtonStyle(currentPage === 1, focusedPage === -1)}
              onClick={() => handlePageChange(currentPage - 1)}
              onFocus={() => setFocusedPage(-1)}
              onBlur={() => setFocusedPage(null)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Prev
            </button>
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ padding: '0 var(--space-2)', color: 'var(--color-text-secondary)' }}
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  style={pageButtonStyle(page, page === currentPage)}
                  onClick={() => handlePageChange(page)}
                  onMouseEnter={() => setHoveredPage(page)}
                  onMouseLeave={() => setHoveredPage(null)}
                  onFocus={() => setFocusedPage(page)}
                  onBlur={() => setFocusedPage(null)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            )}
            <button
              style={navButtonStyle(currentPage === totalPages, focusedPage === -2)}
              onClick={() => handlePageChange(currentPage + 1)}
              onFocus={() => setFocusedPage(-2)}
              onBlur={() => setFocusedPage(null)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
