/**
 * nvidia.js
 * NVIDIA Inference API integration — builds a structured code review prompt
 * and calls the NVIDIA NIM endpoint using CodeLlama.
 */

import axios from 'axios';
import { parseReview } from '../utils/parseReview';

// Local Dev: uses vite proxy. Production (Vercel): uses the serverless proxy.
const isDev = import.meta.env.DEV;
const NVIDIA_API_URL = isDev ? '/api/nvidia/chat/completions' : '/api/review';
const NVIDIA_API_KEY = isDev ? import.meta.env.VITE_NVIDIA_API_KEY : '';
const MODEL = 'meta/llama-4-maverick-17b-128e-instruct';

// Maximum characters of file content to send (stay within context window)
const MAX_CONTENT_CHARS = 60_000;

/**
 * Build the system prompt that instructs the model to return strict JSON.
 */
const SYSTEM_PROMPT = `You are an expert software engineer and code reviewer with 15+ years of experience.
Analyze the provided repository files and return ONLY a single, valid JSON object — no markdown, no prose, no code fences.
The JSON must strictly match this schema:

{
  "overallScore": <integer 0-100>,
  "verdict": "<one sentence summary of the codebase>",
  "codeQuality": {
    "score": <integer 0-100>,
    "summary": "<2-3 sentence summary>",
    "details": ["<specific observation>", "<specific observation>", "<specific observation>"]
  },
  "architecture": {
    "score": <integer 0-100>,
    "summary": "<2-3 sentence summary>",
    "details": ["<specific observation>", "<specific observation>", "<specific observation>"]
  },
  "security": {
    "score": <integer 0-100>,
    "flags": ["<security issue or 'No security issues identified.'>"]
  },
  "documentation": {
    "score": <integer 0-100>,
    "summary": "<1-2 sentence summary>",
    "hasReadme": <true|false>
  },
  "suggestions": [
    "<actionable improvement #1>",
    "<actionable improvement #2>",
    "<actionable improvement #3>"
  ]
}

Scoring guide:
- 90-100: Excellent, production-ready
- 70-89: Good, minor improvements needed
- 50-69: Fair, notable issues to address
- 30-49: Poor, significant refactoring needed
- 0-29: Critical issues, major overhaul required

Be specific — reference actual file names, function names, or patterns you observe.`;

/**
 * Build the user message with all file contents bundled in.
 * Truncates total content to stay within context limits.
 */
function buildUserMessage(owner, repo, files) {
  let totalChars = 0;
  const parts = [
    `Repository: https://github.com/${owner}/${repo}`,
    `Files selected for review (${files.length} files):`,
    '',
  ];

  for (const file of files) {
    const header = `\n${'─'.repeat(60)}\nFile: ${file.path}\n${'─'.repeat(60)}\n`;
    const remaining = MAX_CONTENT_CHARS - totalChars;

    if (remaining <= 0) {
      parts.push(`\n[... ${files.length - files.indexOf(file)} more files truncated due to context limit ...]`);
      break;
    }

    const content = file.content.slice(0, remaining);
    parts.push(header + content);
    totalChars += header.length + content.length;
  }

  parts.push('\nPlease review the above files and return your analysis as a JSON object.');
  return parts.join('\n');
}

/**
 * Call the NVIDIA inference API and return a parsed review object.
 * @param {{ owner: string, repo: string, files: Array<{path, content}> }} repoData
 * @param {function} onStatus - callback(string) for status updates
 * @returns {object} parsed review
 */
export async function reviewWithNvidia(repoData, onStatus = () => {}) {
  // Only check for the Frontend API key in local development. 
  // In production, the Vercel Serverless proxy securely handles the key.
  if (isDev && !NVIDIA_API_KEY) {
    throw new Error('Local dev requires VITE_NVIDIA_API_KEY in your .env file.');
  }

  const { owner, repo, files } = repoData;

  onStatus('Sending code to AI model for analysis…');

  const userMessage = buildUserMessage(owner, repo, files);

  let response;
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (NVIDIA_API_KEY) {
      headers.Authorization = `Bearer ${NVIDIA_API_KEY}`;
    }

    response = await axios.post(
      NVIDIA_API_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userMessage },
        ],
        temperature: 0.1,        // low temp for consistent JSON output
        top_p: 0.9,
        max_tokens: 2048,
        stream: false,
      },
      {
        headers,
        timeout: 120_000,        // 2 minute timeout for large repos
      }
    );
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 401) throw new Error('Invalid NVIDIA API key. Check VITE_NVIDIA_API_KEY.');
      if (status === 429) throw new Error('NVIDIA API rate limit reached. Please wait and try again.');
      if (status === 400) throw new Error(`NVIDIA API bad request: ${err.response.data?.detail || 'unknown error'}`);
      throw new Error(`NVIDIA API error (${status}): ${err.response.data?.detail || err.message}`);
    }
    if (err.code === 'ECONNABORTED') throw new Error('Request timed out. The repository may be too large.');
    throw new Error(`Network error: ${err.message}`);
  }

  onStatus('Parsing AI response…');

  const rawText = response.data?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('AI model returned an empty response. Try again.');
  }

  return parseReview(rawText);
}
