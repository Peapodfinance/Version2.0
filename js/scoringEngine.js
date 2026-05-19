/**
 * Weighted underwriting confidence scoring engine.
 * Pure functions — no DOM dependencies.
 */

import {
  APP_CONFIG,
  DEFAULT_WEIGHTS,
  MINIMUM_METRICS,
  NSF_METRIC,
  ALL_METRICS,
  CATEGORY_ORDER,
  METRIC_LABELS,
} from './constants.js';
import {
  clamp,
  sanitizeNumber,
  normalizeWeights,
  getCategoryForScore,
  safeDivide,
} from './utils.js';
import {
  buildScoreNarratives,
} from './explanationEngine.js';

const CAP = APP_CONFIG.metricOverperformanceCap;

/**
 * Minimum-threshold metrics: higher applicant value = better fit.
 * Capped at 125% of requirement.
 */
export function normalizeMinimum(actual, required) {
  const req = sanitizeNumber(required, { min: 0.0001, fallback: 1 });
  const act = sanitizeNumber(actual, { min: 0, fallback: 0 });
  return Math.min(safeDivide(act, req, 0), CAP);
}

/**
 * NSF metric: lower applicant NSFs = better fit.
 */
export function normalizeNsf(applicantNsfs, maxAllowed) {
  const allowed = sanitizeNumber(maxAllowed, { min: 0, fallback: 1 });
  const nsfs = Math.max(sanitizeNumber(applicantNsfs, { min: 0, fallback: 0 }), 0);
  return Math.min(safeDivide(allowed, Math.max(nsfs, 1), 0), CAP);
}

/**
 * Check if applicant industry is on lender restriction list.
 */
export function isIndustryRestricted(lender, applicant) {
  const industry = String(applicant?.industry ?? '').trim();
  if (!industry || industry === 'Other') return false;
  const restricted = lender.restrictedIndustries ?? [];
  return restricted.some((r) => r.toLowerCase() === industry.toLowerCase());
}

/**
 * Compute weighted score and per-metric breakdown for one lender.
 */
export function calculateLenderScore(lender, applicant) {
  const criteria = lender.criteria ?? {};
  const weights = normalizeWeights(
    { ...DEFAULT_WEIGHTS, ...lender.weights },
    ALL_METRICS,
  );

  const industryBlocked = isIndustryRestricted(lender, applicant);
  const breakdown = {};
  let weightedSum = 0;

  for (const key of MINIMUM_METRICS) {
    const required = criteria[key];
    const actual = applicant[key];
    const normalized = normalizeMinimum(actual, required);
    const weight = weights[key];
    const contribution = normalized * weight * 100;

    weightedSum += normalized * weight;
    breakdown[key] = {
      label: METRIC_LABELS[key],
      required,
      actual,
      normalized: round(normalized, 3),
      weight,
      contribution: round(contribution, 1),
      status: normalized >= 1 ? 'pass' : normalized >= 0.85 ? 'close' : 'fail',
      type: 'minimum',
    };
  }

  {
    const key = NSF_METRIC;
    const required = criteria[key];
    const actual = applicant[key];
    const normalized = normalizeNsf(actual, required);
    const weight = weights[key];
    const contribution = normalized * weight * 100;

    weightedSum += normalized * weight;
    breakdown[key] = {
      label: METRIC_LABELS[key],
      required,
      actual,
      normalized: round(normalized, 3),
      weight,
      contribution: round(contribution, 1),
      status: normalized >= 1 ? 'pass' : normalized >= 0.85 ? 'close' : 'fail',
      type: 'maximum',
    };
  }

  let score = Math.round(Math.min(weightedSum * 100, 100));

  if (industryBlocked) {
    score = Math.min(score, APP_CONFIG.industryRestrictedScoreCap);
  }

  const category = getCategoryForScore(score, CATEGORY_ORDER);
  const narratives = buildScoreNarratives(lender, applicant, breakdown, {
    industryBlocked,
    score,
  });

  return {
    score,
    grade: category.id,
    category: category.label,
    categoryMeta: category,
    breakdown,
    blockers: narratives.blockers,
    strengths: narratives.strengths,
    warnings: narratives.warnings,
    industryBlocked,
    revenueFit: breakdown.monthlyRevenue?.normalized ?? 0,
  };
}

/**
 * Score all lenders and return enriched result objects.
 */
export function scoreAllLenders(lenders, applicant) {
  if (!Array.isArray(lenders) || lenders.length === 0) return [];

  return lenders.map((lender) => ({
    lender,
    result: calculateLenderScore(lender, applicant),
  }));
}

function round(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(sanitizeNumber(value, { fallback: 0 }) * factor) / factor;
}
