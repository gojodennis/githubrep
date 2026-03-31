/**
 * App.jsx — GitLens root component.
 * Editorial archive aesthetic.
 */
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/layout/Header';
import RepoInput from './components/input/RepoInput';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorAlert from './components/ui/ErrorAlert';
import ReviewDashboard from './components/review/ReviewDashboard';
import { useRepoReview } from './hooks/useRepoReview';

const YEAR = new Date().getFullYear();

export default function App() {
  const {
    review,
    repoMeta,
    isLoading,
    error,
    statusMessage,
    fetchedFiles,
    runReview,
    reset,
  } = useRepoReview();

  const screen = review ? 'review' : isLoading ? 'loading' : 'input';

  return (
    <>
      <title>GitLens — AI Code Review for GitHub Repositories</title>
      <meta name="description" content="Paste a public GitHub repository URL and receive an instant AI-powered code review covering quality, architecture, security, and documentation." />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ flex: 1 }}>
          <AnimatePresence mode="wait">

            {screen === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RepoInput onSubmit={runReview} isLoading={false} />

                {error && (
                  <div style={{ padding: '0 32px', marginTop: '-1px' }}>
                    <ErrorAlert message={error} onDismiss={reset} />
                  </div>
                )}
              </motion.div>
            )}

            {screen === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner
                  statusMessage={statusMessage}
                  fetchedFiles={fetchedFiles}
                />
              </motion.div>
            )}

            {screen === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ReviewDashboard
                  review={review}
                  repoMeta={repoMeta}
                  fetchedFiles={fetchedFiles}
                  onReset={reset}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* ── Editorial footer strip ─────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--grid-line)' }}>
          <div
            style={{
              padding: '12px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="text-label">GitLens by gojodennis</span>
            <span className="text-label">Creative · Review</span>
            <span className="text-label">{YEAR}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
