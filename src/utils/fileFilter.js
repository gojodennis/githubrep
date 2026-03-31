/**
 * fileFilter.js
 * Smart file selection logic — picks the most relevant code files
 * from a GitHub repo tree, capped at MAX_FILES.
 */

const MAX_FILES = 10;

// Extensions we actually want to review
const INCLUDE_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.py', '.java', '.go', '.rb', '.rs',
  '.cpp', '.c', '.h', '.cs', '.php',
  '.vue', '.svelte', '.astro',
  '.md',   // README, docs
]);

// Directories to skip entirely
const EXCLUDE_DIR_PATTERNS = [
  'node_modules', 'dist', 'build', '.next', '.nuxt', '.venv',
  'vendor', '__pycache__', '.cache', 'coverage', '.nyc_output',
  'target', 'bin', 'obj', '.git', '.github/workflows',
  'public/static', 'assets/images',
];

// Filenames/patterns to never include
const EXCLUDE_FILE_PATTERNS = [
  /\.min\.(js|css)$/,
  /\.generated\./,
  /\.d\.ts$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /bun\.lock(b)?$/,
  /composer\.lock$/,
  /Gemfile\.lock$/,
  /Cargo\.lock$/,
  /\.env/,
  /\.log$/,
  /\.snap$/,
  /\.test\.(js|ts|jsx|tsx)$/,
  /\.spec\.(js|ts|jsx|tsx)$/,
  /__tests__\//,
  /test\//,
  /mock\//,
  /fixture\//,
];

// Files that score bonus points — likely to be the most "interesting"
const PRIORITY_FILENAMES = [
  /^(index|main|app|server|router|routes|api)\.(js|ts|jsx|tsx|py|go|rb|rs)$/i,
  /^(config|settings|constants)\.(js|ts|json)$/i,
  /^README\.md$/i,
];

/**
 * Score a file path — higher = more relevant
 * @param {string} path - full relative path from repo root
 * @returns {number}
 */
function scoreFile(path) {
  let score = 100;

  // Penalise deep nesting — shallower = more important
  const depth = path.split('/').length - 1;
  score -= depth * 8;

  const filename = path.split('/').pop();

  // Bonus for entry-point-like names
  for (const pattern of PRIORITY_FILENAMES) {
    if (pattern.test(filename)) {
      score += 40;
      break;
    }
  }

  // Bonus for README (only one should exist)
  if (/README\.md$/i.test(path)) score += 60;

  // Slight penalty for test-adjacent paths that passed
  if (/test|spec|mock|fixture/i.test(path)) score -= 20;

  return score;
}

/**
 * Given a raw GitHub tree (array of {path, type, size}),
 * return the top MAX_FILES file paths to review.
 * @param {Array<{path: string, type: string, size: number}>} tree
 * @returns {string[]}
 */
export function selectFiles(tree) {
  const candidates = [];

  for (const item of tree) {
    if (item.type !== 'blob') continue;        // skip dirs/symlinks
    if (!item.path) continue;

    const parts = item.path.split('/');
    const filename = parts[parts.length - 1];

    // Skip excluded directories
    const inExcludedDir = EXCLUDE_DIR_PATTERNS.some(dir =>
      item.path.startsWith(dir + '/') || parts.includes(dir)
    );
    if (inExcludedDir) continue;

    // Check extension
    const ext = '.' + filename.split('.').pop().toLowerCase();
    if (!INCLUDE_EXTENSIONS.has(ext)) continue;

    // Skip excluded file patterns
    const isExcluded = EXCLUDE_FILE_PATTERNS.some(p => p.test(item.path));
    if (isExcluded) continue;

    // Skip excessively large files (> 80KB — likely auto-generated)
    if (item.size && item.size > 80 * 1024) continue;

    candidates.push({ path: item.path, score: scoreFile(item.path) });
  }

  // Sort descending by score, take top N
  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_FILES)
    .map(c => c.path);
}
