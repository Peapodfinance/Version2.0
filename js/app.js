/**
 * Application entry point — orchestrates data loading, scoring, and UI.
 */

import { APP_CONFIG, DISCLAIMER_FALLBACK, INPUT_LIMITS } from './constants.js';
import { sanitizeNumber } from './utils.js';
import {
  loadLenders,
  buildIndustryOptions,
  evaluateApplicant,
} from './lenderService.js';
import {
  initDomRefs,
  getDom,
  renderIndustryOptions,
  renderDisclaimer,
  renderFilterBar,
  renderResults,
  showError,
  hideError,
  setLoading,
} from './uiRenderer.js';

/** @type {Array} */
let lendersCache = [];
/** @type {object|null} */
let lastEvaluation = null;
let activeFilter = 'all';

async function bootstrap() {
  initDomRefs();
  setLoading(true);
  hideError();

  try {
    await loadDisclaimer();
    lendersCache = await loadLenders();
    renderIndustryOptions(buildIndustryOptions(lendersCache));
    renderFilterBar((filter) => {
      activeFilter = filter;
      if (lastEvaluation) {
        renderResults(lastEvaluation, activeFilter);
      }
    });
    bindFormEvents();
  } catch (error) {
    showError(
      'Unable to load lender data. Please run via a local server (e.g. npx serve) and refresh.',
    );
    console.error('[app] bootstrap failed:', error);
  } finally {
    setLoading(false);
  }
}

async function loadDisclaimer() {
  const fallback = `<div class="disclaimer" role="note"><p>${DISCLAIMER_FALLBACK}</p></div>`;
  try {
    const res = await fetch(APP_CONFIG.disclaimerPath);
    const html = res.ok ? await res.text() : fallback;
    renderDisclaimer(html);
  } catch {
    renderDisclaimer(fallback);
  }
}

function bindFormEvents() {
  const { form } = getDom();
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  for (const id of ['monthlyRevenue', 'avgBalance']) {
    const input = document.getElementById(id);
    input?.addEventListener('input', (e) => {
      e.target.value = String(e.target.value).replace(/[^\d.]/g, '');
    });
  }
}

function parseApplicantFromForm(form) {
  const limits = INPUT_LIMITS;
  const get = (id) => document.getElementById(id)?.value ?? '';
  return {
    personalCredit: sanitizeNumber(get('personalCredit'), limits.personalCredit),
    monthlyRevenue: sanitizeNumber(get('monthlyRevenue'), limits.monthlyRevenue),
    deposits: sanitizeNumber(get('deposits'), limits.deposits),
    nsfs: sanitizeNumber(get('nsfs'), limits.nsfs),
    avgBalance: sanitizeNumber(get('avgBalance'), limits.avgBalance),
    monthsBusiness: sanitizeNumber(get('monthsBusiness'), limits.monthsBusiness),
    industry: String(get('industry') || 'Other').trim(),
  };
}

function handleSubmit(event) {
  event.preventDefault();

  if (!lendersCache.length) {
    showError('Lender data is not available. Please refresh the page.');
    return;
  }

  const form = event.target;
  const submitBtn = form.querySelector('.submit-btn');
  const originalLabel = submitBtn?.textContent ?? 'Estimate Qualification Fit';

  hideError();
  setLoading(true);
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Analyzing...';
  }

  const applicant = parseApplicantFromForm(form);

  window.setTimeout(() => {
    try {
      lastEvaluation = evaluateApplicant(lendersCache, applicant);
      renderResults(lastEvaluation, activeFilter);
    } catch (error) {
      console.error('[app] evaluation error:', error);
      showError('An error occurred while estimating qualification fit. Please try again.');
    } finally {
      setLoading(false);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  }, APP_CONFIG.analyzeDelayMs);
}

document.addEventListener('DOMContentLoaded', bootstrap);
