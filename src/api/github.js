/**
 * github.js
 * GitHub REST API integration — fetches repo metadata, file tree,
 * and raw file contents for a given public repository.
 */

import axios from 'axios';
import { selectFiles } from '../utils/fileFilter';

const GITHUB_API = 'https://api.github.com';

// Use the PAT from env for higher rate limits (5000 req/hr vs 60)
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_PAT;

const githubClient = axios.create({
  baseURL: GITHUB_API,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
  timeout: 20000,
});

/**
 * Parse a GitHub URL into owner + repo name.
 * Supports: https://github.com/owner/repo, github.com/owner/repo, owner/repo
 * @param {string} url
 * @returns {{ owner: string, repo: string }}
 */
export function parseGitHubUrl(url) {
  const cleaned = url.trim().replace(/\/+$/, ''); // strip trailing slashes

  // Full URL match
  const fullMatch = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s?#]+)/i
  );
  if (fullMatch) {
    return { owner: fullMatch[1], repo: fullMatch[2].replace(/\.git$/, '') };
  }

  // Short form: owner/repo
  const shortMatch = cleaned.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2].replace(/\.git$/, '') };
  }

  throw new Error(
    'Invalid GitHub URL. Expected format: https://github.com/owner/repo'
  );
}

/**
 * Fetch the default branch name of a repository.
 */
async function getDefaultBranch(owner, repo) {
  const { data } = await githubClient.get(`/repos/${owner}/${repo}`);
  return data.default_branch || 'main';
}

/**
 * Fetch the full git tree recursively for a branch.
 */
async function getFileTree(owner, repo, branch) {
  const { data } = await githubClient.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  if (data.truncated) {
    console.warn('[GitLens] Tree was truncated — very large repo. Results may be partial.');
  }
  return data.tree; // Array of { path, type, size, sha, url }
}

/**
 * Fetch and decode the raw content of a single file.
 * Returns empty string on error (don't let one bad file break the review).
 */
async function getFileContent(owner, repo, path) {
  try {
    const { data } = await githubClient.get(
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`
    );
    if (data.encoding === 'base64' && data.content) {
      // atob works in both browser and Node (via bun)
      return atob(data.content.replace(/\n/g, ''));
    }
    return data.content || '';
  } catch (err) {
    console.warn(`[GitLens] Failed to fetch ${path}:`, err.message);
    return '';
  }
}

/**
 * Main export — orchestrates the full GitHub data fetch.
 * @param {string} repoUrl - public GitHub repo URL
 * @param {function} onStatus - callback(string) for status updates
 * @returns {{ owner, repo, branch, files: Array<{path, content}> }}
 */
export async function fetchRepoData(repoUrl, onStatus = () => {}) {
  const { owner, repo } = parseGitHubUrl(repoUrl);

  onStatus(`Connecting to GitHub API for ${owner}/${repo}…`);
  const branch = await getDefaultBranch(owner, repo);

  onStatus(`Fetching file tree from branch "${branch}"…`);
  const tree = await getFileTree(owner, repo, branch);

  onStatus('Filtering relevant code files…');
  const selectedPaths = selectFiles(tree);

  if (selectedPaths.length === 0) {
    throw new Error(
      'No reviewable code files found in this repository. It may be empty or contain only binary/generated files.'
    );
  }

  onStatus(`Downloading ${selectedPaths.length} files (this may take a moment)…`);

  // Fetch files in parallel with a concurrency limit of 5
  const files = [];
  const CHUNK = 5;
  for (let i = 0; i < selectedPaths.length; i += CHUNK) {
    const chunk = selectedPaths.slice(i, i + CHUNK);
    const results = await Promise.all(
      chunk.map(async (path) => ({
        path,
        content: await getFileContent(owner, repo, path),
      }))
    );
    files.push(...results.filter(f => f.content.length > 0));
  }

  return { owner, repo, branch, files };
}
