import { Layout } from '../components/Layout'
import { AddReadingForm } from '../components/AddReadingForm'

export function AddReadingPage() {
  const pageStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: 'var(--space-6)',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  }

  return (
    <Layout>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Add Blood Sugar Reading</h1>
          <p style={subtitleStyle}>
            Record your daily blood sugar levels. All three reading types are optional —
            enter only the measurements you have available.
          </p>
        </div>
        <AddReadingForm />
      </div>
    </Layout>
  )
}
