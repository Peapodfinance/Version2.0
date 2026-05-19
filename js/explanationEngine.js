/**
 * Generates human-readable underwriting narratives and improvement guidance.
 */

import { CLOSE_MATCH_THRESHOLD, METRIC_LABELS } from './constants.js';
import { formatCurrency, sanitizeNumber } from './utils.js';

/**
 * Per-lender strengths, warnings, and blockers from score breakdown.
 */
export function buildScoreNarratives(lender, applicant, breakdown, { industryBlocked, score }) {
  const strengths = [];
  const warnings = [];
  const blockers = [];

  if (industryBlocked) {
    blockers.push(
      `Industry "${applicant.industry}" is restricted by ${lender.name} guidelines.`,
    );
  }

  const preferred = lender.metadata?.preferredIndustries ?? [];
  if (
    !industryBlocked &&
    preferred.length > 0 &&
    preferred.some((p) => p.toLowerCase() === String(applicant.industry).toLowerCase())
  ) {
    strengths.push(`Industry aligns with ${lender.name} preferred sectors.`);
  }

  appendMetricNarratives(breakdown, strengths, warnings);

  if (score >= 90) {
    strengths.push('Overall profile aligns strongly with this lender’s typical guidelines.');
  } else if (score < 60 && !industryBlocked) {
    warnings.push('Several metrics fall below typical qualification ranges for this lender.');
  }

  return { strengths: unique(strengths), warnings: unique(warnings), blockers: unique(blockers) };
}

function appendMetricNarratives(breakdown, strengths, warnings) {
  const credit = breakdown.personalCredit;
  if (credit?.normalized >= 1.1) strengths.push('Strong credit profile relative to guideline.');
  else if (credit?.status === 'close') warnings.push('Credit score is close to the guideline threshold.');

  const revenue = breakdown.monthlyRevenue;
  if (revenue?.normalized >= 1.15) strengths.push('Strong revenue profile.');
  else if (revenue?.status === 'close') {
    const gap = sanitizeNumber(revenue.required) - sanitizeNumber(revenue.actual);
    if (gap > 0) {
      warnings.push(
        `Monthly revenue is within range but below preferred levels (about ${formatCurrency(gap)} below guideline).`,
      );
    }
  } else if (revenue?.status === 'fail') {
    warnings.push('Monthly revenue is below this lender’s typical minimum.');
  }

  const nsf = breakdown.nsfs;
  if (nsf?.normalized >= 1) strengths.push('Low NSF activity supports banking stability.');
  else if (nsf?.status === 'fail') warnings.push('NSF activity may reduce estimated lender fit.');

  const time = breakdown.monthsBusiness;
  if (time?.normalized >= 1) strengths.push('Established operating history.');
  else if (time?.status === 'close') {
    warnings.push('Time in business is slightly below preferred range.');
  }

  const deposits = breakdown.deposits;
  if (deposits?.status === 'close') warnings.push('Deposit frequency is near the minimum guideline.');

  const balance = breakdown.avgBalance;
  if (balance?.status === 'fail') warnings.push('Average daily balance is below typical requirements.');
}

/**
 * Global improvement recommendations across all lenders.
 */
export function generateImprovementRecommendations(scoredResults, applicant) {
  const tips = [];
  const lowScoreResults = scoredResults.filter((r) => r.result.score < 75);

  if (lowScoreResults.length === 0) return tips;

  const creditGains = computeUnlockGain(lowScoreResults, 'personalCredit', applicant);
  if (creditGains.count > 0) {
    tips.push({
      type: 'credit',
      message: `Improving credit by about ${creditGains.gap} points may improve fit with ${creditGains.count} additional lenders.`,
      impact: impactLevel(creditGains.count),
      action: 'Consider reducing revolving balances and resolving reporting errors.',
    });
  }

  const revenueGains = computeUnlockGain(lowScoreResults, 'monthlyRevenue', applicant);
  if (revenueGains.count > 0 && revenueGains.gap > 0) {
    tips.push({
      type: 'revenue',
      message: `Increasing monthly revenue by about ${formatCurrency(revenueGains.gap)} may improve qualification odds.`,
      impact: impactLevel(revenueGains.count),
      action: 'Focus on core revenue growth or recurring revenue streams.',
    });
  }

  const nsfIssues = lowScoreResults.filter((r) => r.result.breakdown.nsfs?.status !== 'pass');
  if (nsfIssues.length >= 3) {
    tips.push({
      type: 'nsf',
      message: 'Reducing NSF activity may improve lender fit across multiple programs.',
      impact: impactLevel(nsfIssues.length),
      action: 'Improve cash flow timing and maintain buffer balances.',
    });
  }

  const timeIssues = lowScoreResults.filter((r) => r.result.breakdown.monthsBusiness?.status !== 'pass');
  if (timeIssues.length >= 3) {
    const maxRequired = Math.max(
      ...timeIssues.map((r) => sanitizeNumber(r.lender.criteria?.monthsBusiness, { fallback: 0 })),
    );
    const gap = maxRequired - sanitizeNumber(applicant.monthsBusiness, { fallback: 0 });
    if (gap > 0) {
      tips.push({
        type: 'time',
        message: `About ${gap} more month(s) in business may unlock stronger match categories.`,
        impact: 'medium',
        action: 'Continue building deposit history and stable revenue while waiting.',
      });
    }
  }

  return tips.sort((a, b) => impactRank(b.impact) - impactRank(a.impact));
}

/**
 * Identify lenders where small metric improvements would cross close-match threshold.
 */
export function identifyCloseMatches(scoredResults) {
  return scoredResults.filter(({ result }) => {
    if (result.industryBlocked) return false;
    const metrics = Object.values(result.breakdown);
    const closeCount = metrics.filter((m) => m.normalized >= CLOSE_MATCH_THRESHOLD && m.normalized < 1).length;
    return result.score >= 60 && result.score < 90 && closeCount >= 2;
  });
}

function computeUnlockGain(results, metricKey, applicant) {
  const actual = sanitizeNumber(applicant[metricKey], { fallback: 0 });
  let count = 0;
  let minRequired = Infinity;

  for (const { lender, result } of results) {
    const required = sanitizeNumber(lender.criteria?.[metricKey], { fallback: 0 });
    const metric = result.breakdown[metricKey];
    if (metric?.status !== 'pass' && required > 0) {
      count += 1;
      minRequired = Math.min(minRequired, required);
    }
  }

  return {
    count,
    gap: count > 0 ? Math.max(0, Math.ceil(minRequired - actual)) : 0,
  };
}

function impactLevel(count) {
  if (count > 5) return 'high';
  if (count > 2) return 'medium';
  return 'low';
}

function impactRank(level) {
  return { high: 3, medium: 2, low: 1 }[level] ?? 0;
}

function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Format metric comparison line for expandable breakdown UI.
 */
export function formatMetricComparison(metric) {
  if (!metric) return '';
  const isCurrency = metric.label.includes('Revenue') || metric.label.includes('Balance');
  const formatVal = (v) => (isCurrency ? formatCurrency(v) : String(v));

  if (metric.type === 'maximum') {
    return `Guideline: ≤ ${metric.required} NSFs · Yours: ${metric.actual}`;
  }
  return `Guideline: ≥ ${formatVal(metric.required)} · Yours: ${formatVal(metric.actual)}`;
}
