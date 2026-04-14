import { useState } from 'react'
import { useAddReading } from '../hooks/useReadings'
import type { AddReadingInput } from '../types'

const PATIENT_ID = 'patient-001'

type ReadingTypeOption = 'fasting' | 'postMeal' | 'night'

const READING_OPTIONS: { value: ReadingTypeOption; label: string; helpText: string; placeholder: string }[] = [
  { value: 'fasting', label: 'Fasting', helpText: 'Measured in the morning before eating', placeholder: 'e.g. 95' },
  { value: 'postMeal', label: 'Post-Meal', helpText: 'Measured 2 hours after a meal', placeholder: 'e.g. 140' },
  { value: 'night', label: 'Night', helpText: 'Measured before sleep', placeholder: 'e.g. 110' },
]

function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function validateRBSValue(val: string): string | null {
  if (val.trim() === '') return 'Please enter a value.'
  const num = parseFloat(val)
  if (isNaN(num)) return 'Please enter a valid number.'
  if (num < 40) return 'Value seems too low (< 40 mg/dL). Please verify.'
  if (num > 500) return 'Value seems too high (> 500 mg/dL). Please verify.'
  return null
}

export function AddReadingForm() {
  const { mutateAsync, isPending, isError, error } = useAddReading()

  const [date, setDate] = useState(getTodayString())
  const [selectedType, setSelectedType] = useState<ReadingTypeOption>('fasting')
  const [rbsValue, setRbsValue] = useState('')
  const [notes, setNotes] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [rbsError, setRbsError] = useState<string | null>(null)

  const [submitHovered, setSubmitHovered] = useState(false)
  const [submitFocused, setSubmitFocused] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const selectedOption = READING_OPTIONS.find((o) => o.value === selectedType)!

  function handleTypeChange(val: ReadingTypeOption) {
    setSelectedType(val)
    setRbsValue('')
    setRbsError(null)
    setSuccessMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccessMessage('')

    const err = validateRBSValue(rbsValue)
    setRbsError(err)
    if (err) return

    const num = parseFloat(rbsValue)

    const input: AddReadingInput = {
      patientId: PATIENT_ID,
      date,
      fastingRBS: selectedType === 'fasting' ? num : null,
      postMealRBS: selectedType === 'postMeal' ? num : null,
      nightRBS: selectedType === 'night' ? num : null,
      notes: notes.trim(),
    }

    await mutateAsync(input)
    setSuccessMessage(`${selectedOption.label} reading saved successfully.`)
    setRbsValue('')
    setNotes('')
    setRbsError(null)
  }

  const formStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-5)',
    maxWidth: '520px',
    width: '100%',
  }

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  }

  const radioGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
  }

  function getRadioCardStyle(isSelected: boolean, isHovered: boolean): React.CSSProperties {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-md)',
      border: isSelected
        ? '2px solid var(--color-accent)'
        : '1.5px solid var(--color-border)',
      backgroundColor: isSelected
        ? 'var(--color-accent-light)'
        : isHovered
        ? 'var(--color-bg-surface-raised)'
        : 'var(--color-bg-surface)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      flex: '1 1 0',
      minWidth: '100px',
      minHeight: '44px',
      userSelect: 'none' as const,
    }
  }

  const radioLabelStyle = (isSelected: boolean): React.CSSProperties => ({
    fontSize: 'var(--font-size-sm)',
    fontWeight: isSelected ? 600 : 400,
    color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
    cursor: 'pointer',
  })

  function getInputStyle(fieldName: string, hasError: boolean): React.CSSProperties {
    const focused = focusedField === fieldName
    return {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-md)',
      border: hasError
        ? '1.5px solid var(--color-danger)'
        : focused
        ? '1.5px solid var(--color-border-focus)'
        : '1.5px solid var(--color-border)',
      backgroundColor: 'var(--color-bg-input)',
      color: 'var(--color-text-primary)',
      fontSize: 'var(--font-size-base)',
      outline: focused ? '2px solid var(--color-accent)' : 'none',
      outlineOffset: '2px',
      transition: 'border-color var(--transition-fast)',
      minHeight: '44px',
    }
  }

  const errorStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-danger)',
  }

  const helpTextStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-secondary)',
  }

  const submitButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 600,
    color: 'var(--color-text-inverse)',
    backgroundColor: isPending
      ? 'var(--color-text-secondary)'
      : submitHovered || submitFocused
      ? 'var(--color-accent-hover)'
      : 'var(--color-accent)',
    border: 'none',
    cursor: isPending ? 'not-allowed' : 'pointer',
    transition: 'background-color var(--transition-fast)',
    minHeight: '44px',
    width: '100%',
    outline: submitFocused ? '2px solid var(--color-accent)' : 'none',
    outlineOffset: '2px',
  }

  const successBannerStyle: React.CSSProperties = {
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid var(--color-success)',
    color: 'var(--color-success)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
  }

  const errorBannerStyle: React.CSSProperties = {
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-danger-light)',
    border: '1px solid var(--color-danger)',
    color: 'var(--color-danger)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
  }

  return (
    <form style={formStyle} onSubmit={(e) => { void handleSubmit(e) }} noValidate>
      {successMessage && (
        <div style={successBannerStyle} role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      {isError && (
        <div style={errorBannerStyle} role="alert">
          {error instanceof Error ? error.message : 'Failed to save reading. Please try again.'}
        </div>
      )}

      {/* Date */}
      <div style={fieldStyle}>
        <label htmlFor="rbs-date" style={labelStyle}>Date</label>
        <input
          id="rbs-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onFocus={() => setFocusedField('date')}
          onBlur={() => setFocusedField(null)}
          style={getInputStyle('date', false)}
          required
          aria-required="true"
          max={getTodayString()}
        />
      </div>

      <hr style={{ borderTop: '1px solid var(--color-border)', margin: 0 }} />

      {/* Reading type selector */}
      <div style={fieldStyle}>
        <span style={labelStyle} id="reading-type-label">Reading Type</span>
        <div style={radioGroupStyle} role="radiogroup" aria-labelledby="reading-type-label">
          {READING_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.value}
              option={opt}
              isSelected={selectedType === opt.value}
              onSelect={() => handleTypeChange(opt.value)}
              getStyle={getRadioCardStyle}
              labelStyle={radioLabelStyle}
            />
          ))}
        </div>
      </div>

      {/* Dynamic single input */}
      <div style={fieldStyle}>
        <label htmlFor="rbs-value" style={labelStyle}>
          {selectedOption.label} RBS <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>(mg/dL)</span>
        </label>
        <input
          key={selectedType}
          id="rbs-value"
          type="number"
          inputMode="decimal"
          placeholder={selectedOption.placeholder}
          value={rbsValue}
          onChange={(e) => {
            setRbsValue(e.target.value)
            setRbsError(null)
          }}
          onFocus={() => setFocusedField('rbs-value')}
          onBlur={() => setFocusedField(null)}
          style={getInputStyle('rbs-value', !!rbsError)}
          aria-describedby={rbsError ? 'rbs-error' : 'rbs-help'}
          aria-required="true"
          min={0}
          max={600}
          step="any"
          autoFocus
        />
        {rbsError ? (
          <span id="rbs-error" style={errorStyle} role="alert">{rbsError}</span>
        ) : (
          <span id="rbs-help" style={helpTextStyle}>{selectedOption.helpText}</span>
        )}
      </div>

      {/* Notes */}
      <div style={fieldStyle}>
        <label htmlFor="rbs-notes" style={labelStyle}>
          Notes{' '}
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="rbs-notes"
          placeholder="Any relevant notes (e.g., meal details, medications)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onFocus={() => setFocusedField('notes')}
          onBlur={() => setFocusedField(null)}
          style={{
            ...getInputStyle('notes', false),
            minHeight: '88px',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
          maxLength={500}
          aria-describedby="notes-help"
        />
        <span id="notes-help" style={helpTextStyle}>{notes.length}/500 characters</span>
      </div>

      <button
        type="submit"
        style={submitButtonStyle}
        disabled={isPending}
        onMouseEnter={() => setSubmitHovered(true)}
        onMouseLeave={() => setSubmitHovered(false)}
        onFocus={() => setSubmitFocused(true)}
        onBlur={() => setSubmitFocused(false)}
        aria-label={isPending ? 'Saving reading...' : `Save ${selectedOption.label} reading`}
      >
        {isPending ? 'Saving...' : `Save ${selectedOption.label} Reading`}
      </button>
    </form>
  )
}

// Extracted to avoid hook-in-loop — each card manages its own hover state
function RadioCard({
  option,
  isSelected,
  onSelect,
  getStyle,
  labelStyle,
}: {
  option: { value: ReadingTypeOption; label: string }
  isSelected: boolean
  onSelect: () => void
  getStyle: (isSelected: boolean, isHovered: boolean) => React.CSSProperties
  labelStyle: (isSelected: boolean) => React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <label
      style={getStyle(isSelected, hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="radio"
        name="reading-type"
        value={option.value}
        checked={isSelected}
        onChange={onSelect}
        style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px', flexShrink: 0 }}
        aria-label={option.label}
      />
      <span style={labelStyle(isSelected)}>{option.label}</span>
    </label>
  )
}
