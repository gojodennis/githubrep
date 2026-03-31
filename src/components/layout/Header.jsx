/**
 * Header.jsx — GitLens editorial header strip
 */
export default function Header() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--grid-line)',
        background: 'rgba(12, 11, 9, 0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
        className="px-4 md:px-6 h-[52px] flex items-center justify-between"
      >
        {/* Left: Wordmark */}
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            fontWeight: 700,
          }}
        >
          GitLens
        </div>

        {/* Center: descriptor */}
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="hidden md:block"
        >
          AI Code Review
        </div>

        {/* Right: nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a
            href="https://github.com/gojodennis/githubrep"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-muted)')}
          >
            GitHub
          </a>
          <a
            href="https://gojodennis.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-muted)')}
          >
            Portfolio
          </a>
        </nav>
      </div>
    </header>
  );
}
