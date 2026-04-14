import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useThemeStore } from '../stores/themeStore'

interface LayoutProps {
  children: React.ReactNode
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

interface NavLinkDef {
  to: string
  label: string
  icon: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useThemeStore()
  const [toggleHovered, setToggleHovered] = useState(false)

  const navLinks: NavLinkDef[] = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: <DashboardIcon /> },
    { to: ROUTES.ADD_READING, label: 'Add Reading', icon: <AddIcon /> },
    { to: ROUTES.HISTORY, label: 'History', icon: <HistoryIcon /> },
  ]

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: theme === 'dark'
      ? 'rgba(20, 24, 36, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
  }

  const navInnerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 var(--space-4)',
    height: '60px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.03em',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  }

  const titleAccentBarStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '4px',
    height: '22px',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--gradient-primary)',
    flexShrink: 0,
  }

  const getDesktopNavLinkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    backgroundColor: isActive ? 'var(--color-accent-muted)' : 'transparent',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    minHeight: '36px',
    border: isActive ? '1px solid var(--color-accent-light)' : '1px solid transparent',
  })

  const toggleButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-pill)',
    color: 'var(--color-text-secondary)',
    backgroundColor: toggleHovered ? 'var(--color-accent-muted)' : 'var(--color-bg-surface-raised)',
    border: '1px solid var(--color-border)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
    flexShrink: 0,
  }

  const mainStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: 'var(--space-6) var(--space-4)',
  }

  return (
    <>
      <header style={headerStyle} role="banner">
        <div style={navInnerStyle}>
          <NavLink to={ROUTES.DASHBOARD} style={titleStyle} aria-label="RBS Tracker home">
            <span style={titleAccentBarStyle} aria-hidden="true" />
            RBS Tracker
          </NavLink>

          <DesktopNavLinks navLinks={navLinks} getNavLinkStyle={getDesktopNavLinkStyle} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              style={toggleButtonStyle}
              onClick={toggleTheme}
              onMouseEnter={() => setToggleHovered(true)}
              onMouseLeave={() => setToggleHovered(false)}
              onFocus={() => setToggleHovered(true)}
              onBlur={() => setToggleHovered(false)}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </header>

      <main style={mainStyle} role="main">
        <MobileContentWrapper>
          {children}
        </MobileContentWrapper>
      </main>

      <BottomPillNav navLinks={navLinks} />
    </>
  )
}

function MobileContentWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{ paddingBottom: isMobile ? '100px' : '0' }}>
      {children}
    </div>
  )
}

function DesktopNavLinks({
  navLinks,
  getNavLinkStyle,
}: {
  navLinks: NavLinkDef[]
  getNavLinkStyle: (isActive: boolean) => React.CSSProperties
}) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (isMobile) return null

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => getNavLinkStyle(isActive)}
          end={link.to === ROUTES.DASHBOARD}
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

function BottomPillNav({ navLinks }: { navLinks: NavLinkDef[] }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (!isMobile) return null

  const pillNavStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '2px',
    padding: '4px',
    backgroundColor: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-pill)',
    boxShadow: 'var(--shadow-lg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 100,
    // Prevent overflow on very small screens
    maxWidth: 'calc(100vw - 32px)',
  }

  const getItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    minHeight: '44px',
    minWidth: '56px',
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    backgroundColor: isActive ? 'var(--color-accent-muted)' : 'transparent',
    textDecoration: 'none',
    fontSize: '10px',
    fontWeight: isActive ? 600 : 500,
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  })

  return (
    <nav
      style={pillNavStyle}
      role="navigation"
      aria-label="Bottom navigation"
    >
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => getItemStyle(isActive)}
          end={link.to === ROUTES.DASHBOARD}
          aria-label={link.label}
        >
          {link.icon}
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
