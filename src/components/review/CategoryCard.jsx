/**
 * CategoryCard.jsx
 * Editorial ruled card with flat score bar and rust stamp.
 */
import { motion } from 'framer-motion';

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 35) return 'Poor';
  return 'Critical';
}

export default function CategoryCard({ icon, title, score, summary, details, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="ruled-card"
      style={{ padding: '24px 20px' }}
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
            {title}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            {getScoreLabel(score)}
          </div>
        </div>

        {/* Score stamp */}
        <div className="score-stamp" style={{ flexShrink: 0 }}>
          {score}
        </div>
      </div>

      {/* Score bar — 2px flat line */}
      <div className="progress-bar" style={{ marginBottom: '18px' }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Summary */}
      {summary && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.75,
            marginBottom: details?.length ? '14px' : 0,
          }}
        >
          {summary}
        </p>
      )}

      {/* Details */}
      {details && details.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {details.map((detail, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: 'var(--accent-rust)', flexShrink: 0, marginTop: '1px' }}>
                ›
              </span>
              {detail}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
