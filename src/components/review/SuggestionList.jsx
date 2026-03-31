/**
 * SuggestionList.jsx
 * Editorial numbered list — 01. 02. 03. in rust, full-width stacked strips.
 */
import { motion } from 'framer-motion';

export default function SuggestionList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--grid-line)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          Top Improvement Suggestions
        </h2>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          — Priority actions for this codebase
        </span>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {suggestions.slice(0, 3).map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr',
              borderTop: i === 0 ? '1px solid var(--grid-line)' : 'none',
              borderBottom: '1px solid var(--grid-line)',
              padding: '20px 0',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Number in rust */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--accent-rust)',
                letterSpacing: '0.04em',
                paddingTop: '2px',
              }}
            >
              {String(i + 1).padStart(2, '0')}.
            </div>

            {/* Suggestion text */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body)',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                letterSpacing: '0.03em',
              }}
            >
              {suggestion}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
