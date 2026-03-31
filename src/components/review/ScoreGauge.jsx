/**
 * ScoreGauge.jsx
 * Animated SVG gauge — editorial monochrome with rust ring.
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 35) return 'Poor';
  return 'Critical';
}

export default function ScoreGauge({ score, label = 'OVERALL SCORE', size = 160 }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = (score / duration) * step;
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [score]);

  const isLarge = size > 120;
  const strokeW = isLarge ? 12 : 6;
  const radius = size / 2 - (strokeW / 2);
  const circumference = 2 * Math.PI * radius;
  const pct = score / 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isLarge ? 'flex-start' : 'center',
        gap: isLarge ? '24px' : '16px',
      }}
    >
      {/* Circle wrapper */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Base Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="#262626"
            strokeWidth={strokeW}
          />
          {/* Fill Ring */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--accent-rust)"
            strokeWidth={strokeW}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>

        {/* Center Typography */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isLarge ? '3rem' : '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {displayScore}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: isLarge ? '0.65rem' : '0.55rem',
              color: 'rgba(255, 255, 255, 0.3)',
              fontWeight: 400,
              letterSpacing: '0.12em',
              marginTop: isLarge ? '8px' : '4px',
            }}
          >
            / 100
          </div>
        </div>
      </div>

      {/* Label and Badge Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isLarge ? 'flex-start' : 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isLarge ? '0.75rem' : '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.35)',
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isLarge ? '0.65rem' : '0.55rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--accent-rust)',
            padding: '4px 8px',
            border: '1px solid rgba(184, 74, 42, 0.3)',
            fontWeight: 700,
          }}
        >
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}
