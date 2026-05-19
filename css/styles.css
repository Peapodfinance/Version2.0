/* ==========================================================================
   Peapod Calculator — Educational MCA Qualification Estimator
   Mobile-first, glassmorphism UI with accessible contrast
   ========================================================================== */

:root {
  --color-bg-start: #f5f0e8;
  --color-bg-mid: #ede5d8;
  --color-bg-end: #e6dcc9;
  --color-primary: #6b8e23;
  --color-primary-light: #8fbc8f;
  --color-text: #333;
  --color-text-muted: #666;
  --color-card: rgba(255, 255, 255, 0.9);
  --color-card-border: rgba(255, 255, 255, 0.4);
  --shadow-card: 0 20px 40px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 25px 50px rgba(0, 0, 0, 0.12);
  --radius-lg: 20px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --transition: 0.3s ease;

  --match-strong-start: #d4edda;
  --match-strong-end: #a8d5b5;
  --match-likely-start: #cce5ff;
  --match-likely-end: #99c2ff;
  --match-possible-start: #fff3cd;
  --match-possible-end: #ffe08a;
  --match-unlikely-start: #f8d7da;
  --match-unlikely-end: #f1b0b7;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, var(--color-bg-start) 0%, var(--color-bg-mid) 50%, var(--color-bg-end) 100%);
  min-height: 100vh;
  padding: 20px;
  color: var(--color-text);
  line-height: 1.5;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 1000;
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  border-radius: var(--radius-sm);
}

.skip-link:focus {
  left: 16px;
  top: 16px;
}

/* Header */
.site-header {
  text-align: center;
  margin-bottom: 24px;
}

.site-header h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 8px;
}

.site-header__tagline {
  color: var(--color-text-muted);
  font-size: 1.05rem;
}

.site-header__partner {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-top: 4px;
}

/* Disclaimer */
.disclaimer-container {
  max-width: 1400px;
  margin: 0 auto 20px;
}

.disclaimer {
  background: rgba(255, 243, 205, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 193, 7, 0.4);
  border-left: 4px solid #ffc107;
  border-radius: var(--radius-md);
  padding: 14px 18px;
  font-size: 0.9rem;
  color: #856404;
}

/* Error banner */
.error-banner {
  max-width: 1400px;
  margin: 0 auto 16px;
  padding: 14px 18px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: var(--radius-md);
  color: #721c24;
  font-weight: 500;
}

/* Layout */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(300px, 380px) 1fr;
  gap: 30px;
  align-items: start;
}

.results-container {
  min-width: 0;
}

.card {
  background: var(--color-card);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-card-border);
  transition: transform var(--transition), box-shadow var(--transition);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
}

.card h2 {
  color: var(--color-text);
  margin-bottom: 25px;
  font-size: 1.6rem;
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group--full {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  background: #fff;
  transition: border-color var(--transition), box-shadow var(--transition);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(107, 142, 35, 0.15);
}

.submit-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #fff;
  border: none;
  padding: 16px 32px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 10px 20px rgba(107, 142, 35, 0.3);
  transition: transform var(--transition), box-shadow var(--transition);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(107, 142, 35, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

form.loading {
  opacity: 0.75;
  pointer-events: none;
}

/* Stats */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(107, 142, 35, 0.1);
  border-radius: var(--radius-md);
}

.stat-item {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  color: var(--color-primary);
}

/* Filter bar */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-chip {
  padding: 8px 14px;
  border: 2px solid #e1e5e9;
  border-radius: 50px;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.filter-chip:hover,
.filter-chip.active {
  border-color: var(--color-primary);
  background: rgba(107, 142, 35, 0.12);
  color: var(--color-primary);
}

/* Recommendations */
.recommendations-card {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: var(--radius-md);
  border-left: 5px solid #ffc107;
}

.recommendations-card h3 {
  font-size: 1.1rem;
  color: #856404;
  margin-bottom: 12px;
}

.recommendation-item {
  background: rgba(255, 255, 255, 0.75);
  padding: 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.recommendation-item.impact-high { border-left: 4px solid #dc3545; }
.recommendation-item.impact-medium { border-left: 4px solid #ffc107; }
.recommendation-item.impact-low { border-left: 4px solid #28a745; }

/* Results list */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state,
.empty-filter {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
  font-style: italic;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 12px;
  margin-bottom: 0;
}

.category-header__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
}

.category-header__count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Lender comparison table (reference-style rows) */
.lender-comparison {
  margin-bottom: 8px;
}

.lender-table {
  background: #fff;
  border-radius: var(--radius-md);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.lender-table__head,
.lender-row__grid {
  display: grid;
  grid-template-columns: var(--row-grid, 1.5fr 0.85fr 1.6fr 0.95fr 0.75fr 0.85fr 0.95fr 0.75fr);
  align-items: center;
  gap: 12px 16px;
  padding: 14px 20px;
}

.lender-table__head {
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.lender-row {
  background: #fff;
  border-bottom: 1px solid #ececec;
  border-left: 4px solid transparent;
  transition: background var(--transition);
}

.lender-row:last-child {
  border-bottom: none;
}

.lender-row:hover {
  background: #fafbfc;
}

.lender-row.match-strong { border-left-color: #28a745; }
.lender-row.match-likely { border-left-color: #0d6efd; }
.lender-row.match-possible { border-left-color: #e0a800; }
.lender-row.match-unlikely { border-left-color: #dc3545; }

.lender-row--expanded {
  background: #f8faf9;
}

.lender-table__cell {
  min-width: 0;
}

.lender-table__cell--metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lender-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lender-brand__mark {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #f0f4e8;
  color: var(--color-primary);
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dde5d0;
}

.lender-brand__name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.25;
}

.lender-brand__sub {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.match-score {
  display: flex;
  align-items: center;
  gap: 4px;
}

.match-score__star {
  color: #1a8f4a;
  font-size: 1rem;
}

.match-score__value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
}

.match-score__max {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.lender-summary {
  font-size: 0.88rem;
  color: var(--color-text);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.metric-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.metric-label {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.tier-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 50px;
  background: #f0f4e8;
  color: var(--color-primary);
  white-space: nowrap;
}

.lender-row.match-strong .tier-badge {
  background: #e8f5e9;
  color: #155724;
}

.lender-row.match-likely .tier-badge {
  background: #e7f1ff;
  color: #004085;
}

.lender-row.match-possible .tier-badge {
  background: #fff8e1;
  color: #856404;
}

.lender-row.match-unlikely .tier-badge {
  background: #fdecea;
  color: #721c24;
}

.details-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
  text-align: left;
}

.details-link:hover,
.details-link:focus-visible {
  color: #0a58ca;
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.lender-row__details {
  border-top: 1px solid #ececec;
  background: #fafbfc;
  animation: slideDown 0.3s ease;
}

.lender-row__details-inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
  padding: 20px 24px 24px;
}

.lender-row__narratives .narrative {
  margin-bottom: 12px;
}

.narrative {
  margin-bottom: 10px;
}

.narrative__title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
  color: var(--color-text-muted);
  font-weight: 700;
}

.narrative__list {
  list-style: none;
  padding-left: 0;
  font-size: 0.86rem;
  color: var(--color-text);
}

.narrative__list li {
  padding: 3px 0;
  padding-left: 14px;
  position: relative;
}

.narrative__list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.breakdown-panel__title {
  font-size: 0.9rem;
  margin-bottom: 12px;
  font-weight: 700;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.breakdown-panel__title {
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.breakdown-row {
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.breakdown-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.breakdown-row__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.breakdown-row__label {
  font-weight: 600;
  font-size: 0.9rem;
}

.breakdown-row__status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 50px;
}

.status-pass { background: rgba(40, 167, 69, 0.2); color: #155724; }
.status-close { background: rgba(255, 193, 7, 0.3); color: #856404; }
.status-fail { background: rgba(220, 53, 69, 0.2); color: #721c24; }

.breakdown-row__comparison {
  font-size: 0.82rem;
  margin-bottom: 8px;
  opacity: 0.9;
}

.contribution-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.contribution-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.breakdown-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.75rem;
  opacity: 0.85;
}

/* Loading overlay — [hidden] must beat display:flex or overlay blocks all clicks */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 240, 232, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-overlay[hidden] {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(107, 142, 35, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 900px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1100px) {
  .lender-table__head {
    display: none;
  }

  .lender-row__grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'lender lender'
      'score tier'
      'summary summary'
      'rev credit'
      'time action';
    gap: 12px;
    padding: 16px;
  }

  .lender-table__cell--lender { grid-area: lender; }
  .lender-table__cell--score { grid-area: score; }
  .lender-table__cell--summary { grid-area: summary; }
  .lender-table__cell--metric:nth-of-type(4) { grid-area: rev; }
  .lender-table__cell--metric:nth-of-type(5) { grid-area: credit; }
  .lender-table__cell--metric:nth-of-type(6) { grid-area: time; }
  .lender-table__cell--tier { grid-area: tier; justify-self: end; }
  .lender-table__cell--action { grid-area: action; justify-self: end; }

  .lender-row__details-inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  body { padding: 12px; }
  .card { padding: 16px; }
  .form-grid { grid-template-columns: 1fr; }

  .main-container {
    grid-template-columns: 1fr;
  }

  .lender-row__grid {
    grid-template-columns: 1fr;
    grid-template-areas: none;
  }

  .lender-table__cell--tier,
  .lender-table__cell--action {
    justify-self: start;
  }

  .breakdown-row__header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
