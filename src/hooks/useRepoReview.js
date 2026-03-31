/**
 * useRepoReview.js
 * Main orchestration hook — coordinates GitHub fetching and NVIDIA review.
 * Manages loading state, status messages, error handling, and result caching.
 */

import { useState, useCallback } from 'react';
import { fetchRepoData } from '../api/github';
import { reviewWithNvidia } from '../api/nvidia';

const CACHE_KEY = 'gitlens_review_cache';
const CACHE_MAX = 10; // max entries in localStorage

/**
 * Load review cache from localStorage.
 */
function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Save a review to cache, evicting oldest if over limit.
 */
function saveToCache(key, value) {
  try {
    const cache = loadCache();
    const keys = Object.keys(cache);
    if (keys.length >= CACHE_MAX) {
      // Remove oldest entry
      delete cache[keys[0]];
    }
    cache[key] = { review: value, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage may be full; ignore silently
  }
}

/**
 * @returns {{
 *   review: object|null,
 *   repoMeta: object|null,
 *   isLoading: boolean,
 *   error: string|null,
 *   statusMessage: string,
 *   fetchedFiles: string[],
 *   runReview: (url: string) => Promise<void>,
 *   reset: () => void,
 * }}
 */
export function useRepoReview() {
  const [review, setReview]             = useState(null);
  const [repoMeta, setRepoMeta]         = useState(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState(null);
  const [statusMessage, setStatus]      = useState('');
  const [fetchedFiles, setFetchedFiles] = useState([]);

  const reset = useCallback(() => {
    setReview(null);
    setRepoMeta(null);
    setIsLoading(false);
    setError(null);
    setStatus('');
    setFetchedFiles([]);
  }, []);

  const runReview = useCallback(async (repoUrl) => {
    setIsLoading(true);
    setError(null);
    setReview(null);
    setRepoMeta(null);
    setFetchedFiles([]);

    // Check local cache first
    const cacheKey = repoUrl.trim().toLowerCase();
    const cache = loadCache();
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
      // Cache hit (< 30 min old) — use immediately
      setStatus('Loaded from cache ✓');
      setReview(cached.review.review);
      setRepoMeta(cached.review.meta);
      setFetchedFiles(cached.review.files || []);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch repo data from GitHub
      const repoData = await fetchRepoData(repoUrl, (msg) => setStatus(msg));
      setRepoMeta({ owner: repoData.owner, repo: repoData.repo, branch: repoData.branch });
      setFetchedFiles(repoData.files.map(f => f.path));

      // 2. Send to NVIDIA for review
      const result = await reviewWithNvidia(repoData, (msg) => setStatus(msg));

      setStatus('Review complete ✓');
      setReview(result);

      // Cache for next time
      saveToCache(cacheKey, {
        review: result,
        meta: { owner: repoData.owner, repo: repoData.repo, branch: repoData.branch },
        files: repoData.files.map(f => f.path),
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    review,
    repoMeta,
    isLoading,
    error,
    statusMessage,
    fetchedFiles,
    runReview,
    reset,
  };
}
