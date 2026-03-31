/**
 * ReviewDashboard.jsx
 * Editorial strip layout — nature archive aesthetic.
 */
import { motion } from 'framer-motion';
import ScoreGauge from './ScoreGauge';
import CategoryCard from './CategoryCard';
import SecurityFlags from './SecurityFlags';
import SuggestionList from './SuggestionList';
import imgCurrent from '../../assets/img-current.png';

export default function ReviewDashboard({ review, repoMeta, fetchedFiles, onReset }) {
  const { owner, repo, branch } = repoMeta;

  return (
    <div>

      {/* ── Repo header strip ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          borderBottom: '1px solid var(--grid-line)',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: repo slug + metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-rust)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          >
            {owner}/{repo}
          </a>
          <span className="text-label">Branch: {branch}</span>
          <span className="text-label">{fetchedFiles.length} files reviewed</span>
        </div>

        {/* Right: back link */}
        <button
          id="analyze-another-btn"
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color var(--transition)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Analyze another repo
        </button>
      </motion.div>

      {/* ── Overall score — split with image ──────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 border-b border-[color:var(--grid-line)] min-h-[320px]"
      >
        {/* Left: score gauges */}
        <div
          style={{
            padding: '10vw 8vw',
          }}
          className="flex flex-col justify-center gap-8 md:gap-9 border-b lg:border-b-0 lg:border-r border-[color:var(--grid-line)]"
        >
          {/* Top label */}
          <div className="text-label" style={{ color: 'var(--text-muted)' }}>
            — AI Verdict
          </div>

          {/* Main gauge + sub-gauges row */}
          <div className="flex flex-wrap items-center gap-8 md:gap-10">
            <ScoreGauge score={review.overallScore} label="Overall Score" size={150} />

            {/* Sub-gauges */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {[
                { label: 'Quality',      score: review.codeQuality.score },
                { label: 'Architecture', score: review.architecture.score },
                { label: 'Security',     score: review.security.score },
                { label: 'Docs',         score: review.documentation.score },
              ].map(({ label, score }) => (
                <ScoreGauge key={label} score={score} label={label} size={78} />
              ))}
            </div>
          </div>

          {/* Verdict text */}
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: '48ch',
              borderLeft: '3px solid var(--grid-line)',
              paddingLeft: '16px',
            }}
          >
            "{review.verdict}"
          </p>
        </div>

        {/* Right: river current image */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="min-h-[200px] lg:min-h-0">
          <img
            src={imgCurrent}
            alt="Forest river current"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.45) contrast(1.12) saturate(0.6)',
            }}
          />
          {/* Archive info overlay */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '28px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-label)',
                color: 'rgba(240,235,227,0.4)',
                letterSpacing: '0.12em',
                marginBottom: '4px',
              }}
            >
              archive by gitlens
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '28px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'rgba(240,235,227,0.85)',
              lineHeight: 1,
              letterSpacing: '0.04em',
              textAlign: 'right',
            }}
          >
            <div>{String(review.overallScore).padStart(2, '0')}</div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '28px',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              color: 'rgba(240,235,227,0.35)',
              letterSpacing: '0.1em',
            }}
          >
            ←
          </div>
        </div>
      </motion.div>

      {/* ── Category cards grid ───────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-[color:var(--grid-line)]"
      >
        {[
          {
            component: (
              <CategoryCard
                key="quality"
                icon="◈"
                title="Code Quality"
                score={review.codeQuality.score}
                summary={review.codeQuality.summary}
                details={review.codeQuality.details}
                delay={0.2}
              />
            ),
          },
          {
            component: (
              <CategoryCard
                key="arch"
                icon="◉"
                title="Architecture"
                score={review.architecture.score}
                summary={review.architecture.summary}
                details={review.architecture.details}
                delay={0.3}
              />
            ),
          },
          {
            component: (
              <SecurityFlags
                key="sec"
                score={review.security.score}
                flags={review.security.flags}
              />
            ),
          },
          {
            component: (
              <CategoryCard
                key="docs"
                icon="◻"
                title="Documentation"
                score={review.documentation.score}
                summary={review.documentation.summary}
                details={[
                  review.documentation.hasReadme
                    ? '✓ README present'
                    : '✗ No README found',
                ]}
                delay={0.4}
              />
            ),
          },
        ].map(({ component }, i) => (
          <div
            key={i}
            style={{ padding: '28px 24px' }}
            className={`border-b last:border-b-0 md:border-b-0 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 2 ? 'md:border-b' : ''} lg:border-b-0 lg:border-r lg:last:border-r-0 border-[color:var(--grid-line)]`}
          >
            {component}
          </div>
        ))}
      </div>

      {/* ── Suggestions ───────────────────────────────────── */}
      <div style={{ padding: '40px 32px', borderBottom: '1px solid var(--grid-line)' }}>
        <SuggestionList suggestions={review.suggestions} />
      </div>

      {/* ── Files disclosure ──────────────────────────────── */}
      {fetchedFiles.length > 0 && (
        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="border-b border-[color:var(--grid-line)]"
        >
          <summary
            style={{
              padding: '14px 32px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              userSelect: 'none',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderTop: '1px solid var(--grid-line)',
            }}
          >
            <span style={{ color: 'var(--accent-rust)' }}>›</span>
            Files included in this review ({fetchedFiles.length})
          </summary>
          <div
            style={{
              padding: '16px 32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderTop: '1px solid var(--grid-line)',
            }}
          >
            {fetchedFiles.map(file => (
              <div
                key={file}
                style={{
                  display: 'flex',
                  gap: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.03em',
                }}
              >
                <span style={{ color: 'var(--accent-rust)' }}>›</span>
                {file}
              </div>
            ))}
          </div>
        </motion.details>
      )}
    </div>
  );
}
