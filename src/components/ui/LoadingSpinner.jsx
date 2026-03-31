/**
 * LoadingSpinner.jsx
 * Editorial vertical step timeline — monospace, no spinning rings.
 */
import { motion, AnimatePresence } from 'framer-motion';
import imgCurrent from '../../assets/img-current.png';

const STEPS = [
  { key: 'connect',  label: 'Connecting to GitHub' },
  { key: 'tree',     label: 'Fetching file tree' },
  { key: 'filter',   label: 'Filtering relevant files' },
  { key: 'download', label: 'Downloading file contents' },
  { key: 'ai',       label: 'AI analysis in progress' },
  { key: 'parse',    label: 'Parsing review response' },
];

function detectStep(statusMessage) {
  const msg = statusMessage.toLowerCase();
  if (msg.includes('connect') || msg.includes('connecting'))          return 0;
  if (msg.includes('tree') || msg.includes('branch'))                 return 1;
  if (msg.includes('filter'))                                          return 2;
  if (msg.includes('download') || msg.includes('downloading'))         return 3;
  if (msg.includes('ai') || msg.includes('sending') || msg.includes('analy')) return 4;
  if (msg.includes('pars') || msg.includes('complete'))               return 5;
  return 0;
}

export default function LoadingSpinner({ statusMessage, fetchedFiles }) {
  const currentStep = detectStep(statusMessage);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '520px',
        borderTop: '1px solid var(--grid-line)',
        borderBottom: '1px solid var(--grid-line)',
      }}
    >
      {/* Left — nature image */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid var(--grid-line)',
        }}
      >
        <img
          src={imgCurrent}
          alt="River current in forest"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.5) contrast(1.1) saturate(0.7)',
          }}
        />
        {/* Overlay label */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            right: '28px',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            color: 'rgba(240,235,227,0.85)',
            lineHeight: 1.15,
            textAlign: 'right',
          }}
        >
          <span style={{ color: 'var(--accent-rust)', display: 'block' }}>Amidst</span>
          <span style={{ display: 'block' }}>the Code</span>
          <span style={{ color: 'var(--accent-rust)', display: 'block' }}>and the</span>
          <span style={{ display: 'block' }}>Review</span>
        </div>
        {/* Camera label */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '24px',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            color: 'rgba(240,235,227,0.4)',
            letterSpacing: '0.1em',
          }}
        >
          model · nvidia nim
        </div>
      </div>

      {/* Right — step timeline */}
      <div
        style={{
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0',
        }}
      >
        {/* Current status message */}
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '32px',
            borderBottom: '1px solid var(--grid-line)',
            paddingBottom: '16px',
          }}
        >
          — Analyzing repository
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={statusMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body)',
              color: 'var(--accent-rust)',
              letterSpacing: '0.06em',
              marginBottom: '28px',
            }}
          >
            {statusMessage || 'Initializing…'}
          </motion.div>
        </AnimatePresence>

        {/* Step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS.map((step, idx) => {
            const done    = idx < currentStep;
            const active  = idx === currentStep;
            const pending = idx > currentStep;
            return (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--grid-line)',
                  borderLeft: active ? '3px solid var(--accent-rust)' : '3px solid transparent',
                  paddingLeft: '12px',
                  transition: 'border-left-color 0.3s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-label)',
                    color: done ? 'var(--text-muted)' : active ? 'var(--accent-rust)' : 'var(--text-muted)',
                    flexShrink: 0,
                    width: '14px',
                  }}
                >
                  {done ? '✓' : active ? '▶' : '—'}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body)',
                    letterSpacing: '0.04em',
                    color: done
                      ? 'var(--text-muted)'
                      : active
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    opacity: pending ? 0.45 : 1,
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* File list */}
        {fetchedFiles.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div
              className="text-label"
              style={{ marginBottom: '10px', color: 'var(--text-muted)' }}
            >
              Files selected
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {fetchedFiles.map((file, i) => (
                <motion.div
                  key={file}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--accent-rust)', flexShrink: 0 }}>›</span>
                  {file}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
