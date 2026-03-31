/**
 * RepoInput.jsx
 * Editorial hero landing — nature archive aesthetic.
 * Split layout: left text + right leaf image strip.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { parseGitHubUrl } from '../../api/github';
import heroLeaves from '../../assets/img-hero-leaves.png';
import imgFoliage from '../../assets/img-foliage.png';

const SAMPLE_REPOS = [
  'https://github.com/facebook/react',
  'https://github.com/vitejs/vite',
  'https://github.com/tiangolo/fastapi',
  'https://github.com/vercel/next.js',
];

const today = new Date();
const DAY   = String(today.getDate()).padStart(2, '0');
const MONTH = String(today.getMonth() + 1).padStart(2, '0');
const YEAR  = String(today.getFullYear()).slice(2);

export default function RepoInput({ onSubmit, isLoading }) {
  const [url, setUrl]     = useState('');
  const [valid, setValid] = useState(null);

  function validateUrl(val) {
    if (!val.trim()) { setValid(null); return; }
    try { parseGitHubUrl(val); setValid(true); }
    catch { setValid(false); }
  }

  function handleChange(e) { setUrl(e.target.value); validateUrl(e.target.value); }

  function handleSubmit(e) {
    e.preventDefault();
    if (valid && !isLoading) onSubmit(url.trim());
  }

  function fillSample(repo) { setUrl(repo); setValid(true); }

  const borderColor =
    valid === true  ? 'var(--accent-rust)'       :
    valid === false ? 'rgba(184,74,42,0.6)'       :
    'var(--grid-line-heavy)';

  return (
    <section>

      {/* ── Top metadata strip ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          borderBottom: '1px solid var(--grid-line)',
          padding: '10px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="text-label">Where your code stands,</span>
        <span className="text-label">Repository · Intelligence</span>
        <span className="text-label">Atmosphere</span>
      </motion.div>

      {/* ── Hero body — split layout ────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 'clamp(460px, 60vh, 640px)',
          borderBottom: '1px solid var(--grid-line)',
        }}
      >
        {/* Left — text + form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            padding: 'clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid var(--grid-line)',
          }}
        >
          {/* Pre-label */}
          <div className="text-label" style={{ marginBottom: '20px' }}>
            — There I take a review.
          </div>

          {/* Display headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              marginBottom: '32px',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ color: 'var(--accent-rust)', display: 'block' }}>
              Instant
            </span>
            <span style={{ display: 'block' }}>AI Review</span>
            <span style={{ color: 'var(--accent-rust)', display: 'block' }}>
              for any
            </span>
            <span style={{ display: 'block' }}>GitHub Repo</span>
          </h1>

          {/* Subtext — monospace caption */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body)',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: '38ch',
              marginBottom: '36px',
            }}
          >
            — Paste a public GitHub URL and receive a structured code review covering quality, architecture, security, and documentation.
          </p>

          {/* Input form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                id="repo-url-input"
                type="url"
                value={url}
                onChange={handleChange}
                placeholder="https://github.com/owner/repo"
                className="glow-input"
                disabled={isLoading}
                aria-label="GitHub repository URL"
                aria-invalid={valid === false}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderColor,
                }}
              />
              {valid !== null && (
                <div
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: valid ? 'var(--text-secondary)' : 'var(--accent-rust)',
                  }}
                >
                  {valid ? '✓' : '✗'}
                </div>
              )}
            </div>

            {valid === false && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-label)',
                  color: 'var(--accent-rust)',
                  letterSpacing: '0.06em',
                  marginBottom: '10px',
                }}
              >
                Enter a valid GitHub URL (e.g. github.com/owner/repo)
              </p>
            )}

            <button
              id="review-submit-btn"
              type="submit"
              disabled={!valid || isLoading}
              className="btn-primary"
              style={{ width: '100%', padding: '13px 20px' }}
            >
              {isLoading ? 'Analyzing…' : 'Review Repo →'}
            </button>
          </form>

          {/* Sample repos */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span className="text-label">Try:</span>
            {SAMPLE_REPOS.map(repo => {
              const name = repo.split('/').slice(-2).join('/');
              return (
                <button
                  key={repo}
                  id={`sample-${name.replace('/', '-')}`}
                  onClick={() => fillSample(repo)}
                  disabled={isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-label)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    padding: 0,
                    transition: 'color var(--transition)',
                  }}
                  onMouseEnter={e => (e.target.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.target.style.color = 'var(--text-muted)')}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Right — hero leaf image strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={heroLeaves}
            alt="Autumnal leaf close-up"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(0.65) contrast(1.1) saturate(0.85)',
            }}
          />
          {/* Archive stamp overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 700,
                color: 'rgba(240,235,227,0.9)',
                lineHeight: 1,
                letterSpacing: '0.04em',
              }}
            >
              {DAY}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 700,
                color: 'rgba(240,235,227,0.9)',
                lineHeight: 1,
                letterSpacing: '0.04em',
              }}
            >
              {MONTH}
            </div>
          </div>
          {/* Top-left nav arrow */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              fontFamily: 'var(--font-body)',
              fontSize: '1.2rem',
              color: 'rgba(240,235,227,0.5)',
            }}
          >
            →
          </div>
        </motion.div>
      </div>

      {/* ── Foliage image strip (narrow) ───────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        style={{
          height: '180px',
          overflow: 'hidden',
          borderBottom: '1px solid var(--grid-line)',
          position: 'relative',
        }}
      >
        <img
          src={imgFoliage}
          alt="Dark forest canopy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            filter: 'brightness(0.5) contrast(1.15) saturate(0.7)',
          }}
        />
        {/* Feature labels over image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 24px',
          }}
        >
          {[
            { label: 'Smart file selection', code: '01' },
            { label: 'NVIDIA CodeLlama AI', code: '02' },
            { label: 'Results in ~30s',      code: '03' },
            { label: 'No login required',    code: '04' },
          ].map(f => (
            <div key={f.code} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-label)',
                  color: 'var(--accent-rust)',
                  letterSpacing: '0.14em',
                  marginBottom: '6px',
                }}
              >
                {f.code}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-label)',
                  color: 'rgba(240,235,227,0.75)',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                }}
              >
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Bottom metadata strip ───────────────────────────── */}
      <div
        style={{
          padding: '10px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--grid-line)',
        }}
      >
        <span className="text-label">AI Archive</span>
        <span className="text-label">Code · Review</span>
        <span className="text-label">2K{YEAR}</span>
      </div>
    </section>
  );
}
