/**
 * parseReview.js
 * Safely extract and parse the structured JSON review from the AI response.
 * Handles cases where the model wraps JSON in markdown code fences.
 */

/**
 * Attempt to parse AI response text into a review object.
 * @param {string} text - raw text from AI model
 * @returns {object} parsed review
 * @throws {Error} if no valid JSON found
 */
export function parseReview(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or invalid response from AI model.');
  }

  // 1. Try to extract JSON from markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return validateReview(JSON.parse(fenceMatch[1].trim()));
    } catch {
      // Continue to next strategy
    }
  }

  // 2. Try to parse the whole text directly as JSON
  try {
    return validateReview(JSON.parse(text.trim()));
  } catch {
    // Continue
  }

  // 3. Try to extract the first {...} block from the text
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return validateReview(JSON.parse(braceMatch[0]));
    } catch {
      // Continue
    }
  }

  throw new Error('Could not parse a valid JSON review from the AI response. The model may not have followed the expected format.');
}

/**
 * Ensure the parsed object has all required fields,
 * filling in safe defaults for any missing ones.
 * @param {object} raw
 * @returns {object}
 */
function validateReview(raw) {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Parsed value is not an object.');
  }

  return {
    overallScore: clamp(Number(raw.overallScore) || 50, 0, 100),
    verdict: raw.verdict || 'Review complete.',

    codeQuality: {
      score: clamp(Number(raw.codeQuality?.score) || 50, 0, 100),
      summary: raw.codeQuality?.summary || '',
      details: Array.isArray(raw.codeQuality?.details) ? raw.codeQuality.details : [],
    },

    architecture: {
      score: clamp(Number(raw.architecture?.score) || 50, 0, 100),
      summary: raw.architecture?.summary || '',
      details: Array.isArray(raw.architecture?.details) ? raw.architecture.details : [],
    },

    security: {
      score: clamp(Number(raw.security?.score) || 50, 0, 100),
      flags: Array.isArray(raw.security?.flags) ? raw.security.flags : [],
    },

    documentation: {
      score: clamp(Number(raw.documentation?.score) || 50, 0, 100),
      summary: raw.documentation?.summary || '',
      hasReadme: Boolean(raw.documentation?.hasReadme),
    },

    suggestions: Array.isArray(raw.suggestions)
      ? raw.suggestions.slice(0, 3)
      : [],
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
