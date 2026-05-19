/**
 * Pure utility helpers shared across modules.
 */

/**
 * Clamp a number between min and max; returns fallback if value is not finite.
 */
export function clamp(value, min, max, fallback = min) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

/**
 * Sanitize numeric form input with optional min/max enforcement.
 */
export function sanitizeNumber(value, { min = 0, max = Infinity, fallback = 0 } = {}) {
  const parsed = parseFloat(String(value).replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, min, max, fallback);
}

/**
 * Safe division avoiding divide-by-zero; returns fallback when invalid.
 */
export function safeDivide(numerator, denominator, fallback = 0) {
  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return fallback;
  return num / den;
}

/**
 * Convert display name to URL-safe id slug.
 */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format number as USD currency without decimals.
 */
export function formatCurrency(value) {
  const num = sanitizeNumber(value, { fallback: 0 });
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format plain number with locale grouping.
 */
export function formatNumber(value) {
  const num = sanitizeNumber(value, { fallback: 0 });
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Escape HTML to prevent XSS when interpolating user input.
 */
export function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(str).replace(/[&<>"']/g, (ch) => map[ch]);
}

/**
 * Debounce function calls (used sparingly for input handlers).
 */
export function debounce(fn, waitMs = 200) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };
}

/**
 * Group array items by a key returned from iteratee.
 */
export function groupBy(array, iteratee) {
  return array.reduce((acc, item) => {
    const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Ensure object weights sum to ~1; normalize if needed.
 */
export function normalizeWeights(weights, metricKeys) {
  const entries = metricKeys.map((key) => [key, sanitizeNumber(weights?.[key], { min: 0, fallback: 0 })]);
  const sum = entries.reduce((total, [, w]) => total + w, 0);

  if (sum <= 0) {
    const even = 1 / metricKeys.length;
    return Object.fromEntries(metricKeys.map((key) => [key, even]));
  }

  return Object.fromEntries(entries.map(([key, w]) => [key, w / sum]));
}

/**
 * Resolve match category object from numeric score.
 */
export function getCategoryForScore(score, categories) {
  const safeScore = clamp(score, 0, 100, 0);
  return (
    categories.find((cat) => safeScore >= cat.minScore && safeScore <= cat.maxScore) ||
    categories[categories.length - 1]
  );
}

/**
 * Determine pass / close / fail status for a normalized subscore.
 */
export function getMetricStatus(normalized) {
  if (normalized >= 1) return 'pass';
  if (normalized >= 0.85) return 'close';
  return 'fail';
}
