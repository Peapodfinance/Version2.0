/**
 * Lender data loading, validation, and result sorting.
 */

import { APP_CONFIG } from './constants.js';
import { scoreAllLenders } from './scoringEngine.js';
import { generateImprovementRecommendations } from './explanationEngine.js';
import { slugify, sanitizeNumber } from './utils.js';

/**
 * Fetch and validate lender dataset from external JSON.
 */
export async function loadLenders(url = APP_CONFIG.lendersDataPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load lenders (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Lender data must be an array');
    }

    const lenders = data.map(normalizeLenderRecord).filter(Boolean);

    if (lenders.length === 0) {
      throw new Error('No valid lenders found in dataset');
    }

    return lenders;
  } catch (error) {
    console.error('[lenderService] loadLenders:', error);
    throw error;
  }
}

/**
 * Ensure each lender record has required fields and stable id.
 */
function normalizeLenderRecord(raw, index) {
  if (!raw?.name || !raw?.criteria) return null;

  const criteria = {};
  for (const key of [
    'personalCredit',
    'monthlyRevenue',
    'deposits',
    'nsfs',
    'avgBalance',
    'monthsBusiness',
  ]) {
    criteria[key] = sanitizeNumber(raw.criteria[key], { min: 0, fallback: 0 });
  }

  return {
    id: raw.id || slugify(raw.name) || `lender-${index}`,
    name: String(raw.name).trim(),
    criteria,
    weights: raw.weights ?? null,
    restrictedIndustries: Array.isArray(raw.restrictedIndustries)
      ? raw.restrictedIndustries.map(String)
      : [],
    metadata: raw.metadata ?? {},
  };
}

/**
 * Build unique sorted industry list for form dropdown.
 */
export function buildIndustryOptions(lenders) {
  const set = new Set(['Other']);
  for (const lender of lenders) {
    for (const ind of lender.restrictedIndustries ?? []) {
      set.add(ind);
    }
    for (const ind of lender.metadata?.preferredIndustries ?? []) {
      set.add(ind);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Score all lenders and sort per product requirements.
 */
export function evaluateApplicant(lenders, applicant) {
  const scored = scoreAllLenders(lenders, applicant);
  const sorted = sortScoredResults(scored);
  const recommendations = generateImprovementRecommendations(sorted, applicant);

  const stats = {
    total: sorted.length,
    strong: sorted.filter((r) => r.result.score >= 90).length,
    likely: sorted.filter((r) => r.result.score >= 75 && r.result.score < 90).length,
    possible: sorted.filter((r) => r.result.score >= 60 && r.result.score < 75).length,
    unlikely: sorted.filter((r) => r.result.score < 60).length,
    topScore: sorted[0]?.result.score ?? 0,
  };

  return { results: sorted, recommendations, stats };
}

/**
 * Sort: highest score → non-restricted → strongest revenue fit.
 */
export function sortScoredResults(scoredResults) {
  return [...scoredResults].sort((a, b) => {
    if (b.result.score !== a.result.score) {
      return b.result.score - a.result.score;
    }

    if (a.result.industryBlocked !== b.result.industryBlocked) {
      return a.result.industryBlocked ? 1 : -1;
    }

    return b.result.revenueFit - a.result.revenueFit;
  });
}
