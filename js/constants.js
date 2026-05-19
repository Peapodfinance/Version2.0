/**
 * Application-wide constants for the MCA qualification estimator.
 * Centralizes thresholds, labels, and configuration to avoid magic strings.
 */

export const APP_CONFIG = {
  name: 'Peapod Calculator Tool',
  tagline: 'Educational qualification estimation for business funding options',
  partner: 'Partnered with Blue Bear Group LLC',
  lendersDataPath: './data/lenders.json',
  disclaimerPath: './components/disclaimer.html',
  analyzeDelayMs: 400,
  maxRecommendations: 3,
  industryRestrictedScoreCap: 35,
  metricOverperformanceCap: 1.25,
};

/** Default criterion weights when lender JSON omits custom weights. */
export const DEFAULT_WEIGHTS = {
  personalCredit: 0.25,
  monthlyRevenue: 0.3,
  deposits: 0.1,
  nsfs: 0.2,
  avgBalance: 0.05,
  monthsBusiness: 0.1,
};

/** Numeric keys evaluated against minimum thresholds. */
export const MINIMUM_METRICS = [
  'personalCredit',
  'monthlyRevenue',
  'deposits',
  'avgBalance',
  'monthsBusiness',
];

/** NSF uses inverse scoring (lower applicant NSFs = better). */
export const NSF_METRIC = 'nsfs';

export const ALL_METRICS = [...MINIMUM_METRICS, NSF_METRIC];

/** Human-readable labels for UI and explanations. */
export const METRIC_LABELS = {
  personalCredit: 'Credit Score',
  monthlyRevenue: 'Monthly Revenue',
  deposits: 'Monthly Deposits',
  nsfs: 'NSF Activity',
  avgBalance: 'Avg Daily Balance',
  monthsBusiness: 'Months in Business',
};

/** Match categories derived from final score (educational framing). */
export const MATCH_CATEGORIES = {
  STRONG: {
    id: 'strong',
    label: 'Strong Match',
    minScore: 90,
    maxScore: 100,
    cssClass: 'match-strong',
  },
  LIKELY: {
    id: 'likely',
    label: 'Likely Match',
    minScore: 75,
    maxScore: 89,
    cssClass: 'match-likely',
  },
  POSSIBLE: {
    id: 'possible',
    label: 'Possible Match',
    minScore: 60,
    maxScore: 74,
    cssClass: 'match-possible',
  },
  UNLIKELY: {
    id: 'unlikely',
    label: 'Unlikely Match',
    minScore: 0,
    maxScore: 59,
    cssClass: 'match-unlikely',
  },
};

/** Ordered list for category resolution (highest threshold first). */
export const CATEGORY_ORDER = [
  MATCH_CATEGORIES.STRONG,
  MATCH_CATEGORIES.LIKELY,
  MATCH_CATEGORIES.POSSIBLE,
  MATCH_CATEGORIES.UNLIKELY,
];

/** Close-match band for warnings and improvement tips. */
export const CLOSE_MATCH_THRESHOLD = 0.85;

/** Input validation bounds. */
export const INPUT_LIMITS = {
  personalCredit: { min: 300, max: 850 },
  monthlyRevenue: { min: 0, max: 100_000_000 },
  deposits: { min: 0, max: 999 },
  nsfs: { min: 0, max: 999 },
  avgBalance: { min: 0, max: 100_000_000 },
  monthsBusiness: { min: 0, max: 600 },
};

export const DISCLAIMER_FALLBACK =
  'Results are estimates based on lender guidelines and do not guarantee financing approval.';
