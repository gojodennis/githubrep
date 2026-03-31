/**
 * ErrorAlert.jsx — Editorial rust left-rule error strip
 */
export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      style={{
        borderLeft: '3px solid var(--accent-rust)',
        borderTop: '1px solid var(--grid-line)',
        borderRight: '1px solid var(--grid-line)',
        borderBottom: '1px solid var(--grid-line)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        animation: 'fade-up 0.3s ease-out',
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Label */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--accent-rust)',
            marginBottom: '6px',
          }}
        >
          Error
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.7,
            letterSpacing: '0.03em',
          }}
        >
          {message}
        </div>
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            padding: '0 4px',
            transition: 'color var(--transition)',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.target.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.target.style.color = 'var(--text-muted)')}
        >
          ✕
        </button>
      )}
    </div>
  );
}
