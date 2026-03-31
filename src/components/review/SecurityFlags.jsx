/**
 * SecurityFlags.jsx
 * Editorial ruled card for security — flat, monochrome, archival.
 */
import { motion } from 'framer-motion';

export default function SecurityFlags({ score, flags }) {
  const isClean = flags.length === 0 ||
    (flags.length === 1 && /no security issues/i.test(flags[0]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="ruled-card"
      style={{
        padding: '24px 20px',
        borderLeftColor: isClean
          ? 'var(--grid-line-heavy)'
          : 'var(--accent-rust)',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
          gap: '12px',
        }}
      >
        <div>
          <div
            className="text-label"
            style={{ marginBottom: '4px', color: 'var(--text-muted)' }}
          >
            Security
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              color: isClean ? 'var(--text-muted)' : 'var(--accent-rust)',
              letterSpacing: '0.08em',
            }}
          >
            {isClean ? 'No issues' : score < 50 ? 'Critical' : 'Review needed'}
          </div>
        </div>
        <div className={isClean ? 'score-stamp' : 'score-stamp'} style={{ flexShrink: 0 }}>
          {score}
        </div>
      </div>

      {/* Score bar */}
      <div className="progress-bar" style={{ marginBottom: '18px' }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Flags */}
      {isClean ? (
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body)',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            fontStyle: 'italic',
          }}
        >
          — no security issues identified —
        </div>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {flags.map((flag, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                borderLeft: '1px solid var(--accent-rust-border)',
                paddingLeft: '10px',
              }}
            >
              <span style={{ color: 'var(--accent-rust)', flexShrink: 0 }}>⚠</span>
              {flag}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
