/**
 * DOM rendering layer — decoupled from scoring logic.
 */

import { APP_CONFIG, CATEGORY_ORDER } from './constants.js';
import { escapeHtml } from './utils.js';
import { formatMetricComparison } from './explanationEngine.js';

/** Cached DOM references populated on init. */
let dom = {};

export function initDomRefs() {
  dom = {
    form: document.getElementById('calculatorForm'),
    industrySelect: document.getElementById('industry'),
    resultsList: document.getElementById('resultsList'),
    statsContainer: document.getElementById('statsContainer'),
    recommendationsContainer: document.getElementById('recommendationsContainer'),
    emptyState: document.getElementById('emptyState'),
    errorBanner: document.getElementById('errorBanner'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    disclaimerContainer: document.getElementById('disclaimerContainer'),
    filterBar: document.getElementById('filterBar'),
    statStrong: document.getElementById('statStrong'),
    statLikely: document.getElementById('statLikely'),
    statPossible: document.getElementById('statPossible'),
    statTotal: document.getElementById('statTotal'),
  };
}

export function getDom() {
  return dom;
}

export function renderIndustryOptions(industries) {
  if (!dom.industrySelect) return;

  const fragment = document.createDocumentFragment();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '-- Select Industry --';
  fragment.appendChild(placeholder);

  for (const industry of industries) {
    const opt = document.createElement('option');
    opt.value = industry;
    opt.textContent = industry;
    fragment.appendChild(opt);
  }

  dom.industrySelect.replaceChildren(fragment);
}

export function renderDisclaimer(html) {
  if (dom.disclaimerContainer) {
    dom.disclaimerContainer.innerHTML = html;
  }
}

export function showError(message) {
  if (!dom.errorBanner) return;
  dom.errorBanner.hidden = false;
  dom.errorBanner.textContent = message;
}

export function hideError() {
  if (dom.errorBanner) dom.errorBanner.hidden = true;
}

export function setLoading(isLoading) {
  const overlay = dom.loadingOverlay;
  if (overlay) {
    overlay.hidden = !isLoading;
    overlay.setAttribute('aria-hidden', String(!isLoading));
    // CSS display:flex overrides [hidden] without explicit none
    overlay.style.display = isLoading ? 'flex' : 'none';
    overlay.style.pointerEvents = isLoading ? 'auto' : 'none';
  }
  if (dom.form) dom.form.classList.toggle('loading', isLoading);
}

export function renderFilterBar(onFilterChange) {
  if (!dom.filterBar) return;

  const chips = [
    { id: 'all', label: 'All Results' },
    ...CATEGORY_ORDER.map((c) => ({ id: c.id, label: c.label })),
  ];

  dom.filterBar.innerHTML = chips
    .map(
      (chip) => `
      <button type="button" class="filter-chip${chip.id === 'all' ? ' active' : ''}"
        data-filter="${chip.id}" aria-pressed="${chip.id === 'all'}">
        ${escapeHtml(chip.label)}
      </button>`,
    )
    .join('');

  dom.filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;

    dom.filterBar.querySelectorAll('.filter-chip').forEach((el) => {
      el.classList.toggle('active', el === btn);
      el.setAttribute('aria-pressed', String(el === btn));
    });

    onFilterChange(btn.dataset.filter);
  });

  dom.filterBar.hidden = false;
}

export function renderResults({ results, recommendations, stats }, activeFilter = 'all') {
  if (!dom.resultsList) return;

  const filtered =
    activeFilter === 'all'
      ? results
      : results.filter((r) => r.result.categoryMeta?.id === activeFilter);

  dom.emptyState?.remove();

  if (dom.statsContainer) {
    dom.statsContainer.hidden = false;
    dom.statStrong.textContent = stats.strong;
    dom.statLikely.textContent = stats.likely;
    dom.statPossible.textContent = stats.possible;
    dom.statTotal.textContent = stats.total;
  }

  renderRecommendations(recommendations);

  const fragment = document.createDocumentFragment();

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-filter';
    empty.textContent = 'No lenders in this category for your profile.';
    fragment.appendChild(empty);
  } else {
    const grouped = groupResultsByCategory(filtered);
    for (const [categoryLabel, items] of grouped) {
      fragment.appendChild(createCategoryHeader(categoryLabel, items.length));
      for (const item of items) {
        fragment.appendChild(createLenderCard(item));
      }
    }
  }

  dom.resultsList.replaceChildren(fragment);
  dom.resultsList.classList.add('fade-in');
}

function groupResultsByCategory(results) {
  const order = CATEGORY_ORDER.map((c) => c.label);
  const map = new Map();
  for (const item of results) {
    const label = item.result.category;
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(item);
  }
  return order.filter((l) => map.has(l)).map((l) => [l, map.get(l)]);
}

function createCategoryHeader(label, count) {
  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `
    <h3 class="category-header__title">${escapeHtml(label)}</h3>
    <span class="category-header__count">${count} lender${count !== 1 ? 's' : ''}</span>
  `;
  return header;
}

function createLenderCard({ lender, result }) {
  const card = document.createElement('article');
  const cssClass = result.categoryMeta?.cssClass ?? 'match-unlikely';
  card.className = `lender-card ${cssClass}`;
  card.setAttribute('aria-label', `${lender.name}, estimated match score ${result.score}`);

  const breakdownId = `breakdown-${lender.id}`;
  const maxContribution = Math.max(
    ...Object.values(result.breakdown).map((m) => m.contribution),
    1,
  );

  card.innerHTML = `
    <header class="lender-card__header">
      <div class="lender-card__title-group">
        <h4 class="lender-card__name">${escapeHtml(lender.name)}</h4>
        <span class="lender-card__fit">Estimated Qualification Fit</span>
      </div>
      <div class="lender-card__badges">
        <span class="score-badge" aria-label="Estimated match score ${result.score}">${result.score}</span>
        <span class="category-badge">${escapeHtml(result.category)}</span>
      </div>
    </header>

    <div class="lender-card__body">
      ${renderListSection('Strengths', result.strengths, 'strengths')}
      ${renderListSection('Considerations', result.warnings, 'warnings')}
      ${renderListSection('Restrictions', result.blockers, 'blockers')}
    </div>

    <button type="button" class="expand-btn"
      aria-expanded="false"
      aria-controls="${breakdownId}"
      data-breakdown-toggle>
      Why this score?
      <span class="expand-icon" aria-hidden="true">▼</span>
    </button>

    <section id="${breakdownId}" class="breakdown-panel" hidden>
      <h5 class="breakdown-panel__title">Weighted Metric Breakdown</h5>
      <div class="breakdown-list">
        ${Object.values(result.breakdown)
          .map((metric) => renderBreakdownRow(metric, maxContribution))
          .join('')}
      </div>
    </section>
  `;

  const toggleBtn = card.querySelector('[data-breakdown-toggle]');
  const panel = card.querySelector(`#${CSS.escape(breakdownId)}`);

  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    toggleBtn.querySelector('.expand-icon').textContent = expanded ? '▼' : '▲';
  });

  return card;
}

function renderListSection(title, items, type) {
  if (!items?.length) return '';
  const listItems = items.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
  return `
    <div class="narrative narrative--${type}">
      <h5 class="narrative__title">${title}</h5>
      <ul class="narrative__list">${listItems}</ul>
    </div>
  `;
}

function renderBreakdownRow(metric, maxContribution) {
  const barWidth = Math.round((metric.contribution / maxContribution) * 100);
  const statusLabel = {
    pass: 'Meets guideline',
    close: 'Close to guideline',
    fail: 'Below guideline',
  }[metric.status];

  return `
    <div class="breakdown-row">
      <div class="breakdown-row__header">
        <span class="breakdown-row__label">${escapeHtml(metric.label)}</span>
        <span class="breakdown-row__status status-${metric.status}">${statusLabel}</span>
      </div>
      <p class="breakdown-row__comparison">${escapeHtml(formatMetricComparison(metric))}</p>
      <div class="contribution-bar" role="presentation">
        <div class="contribution-bar__fill" style="width: ${barWidth}%"></div>
      </div>
      <div class="breakdown-row__meta">
        <span>Weight: ${Math.round(metric.weight * 100)}%</span>
        <span>Contribution: ${metric.contribution}</span>
        <span>Normalized: ${metric.normalized}</span>
      </div>
    </div>
  `;
}

function renderRecommendations(recommendations) {
  if (!dom.recommendationsContainer) return;

  if (!recommendations?.length) {
    dom.recommendationsContainer.replaceChildren();
    return;
  }

  const items = recommendations
    .slice(0, APP_CONFIG.maxRecommendations)
    .map(
      (tip) => `
      <div class="recommendation-item impact-${tip.impact}">
        <strong>${escapeHtml(tip.message)}</strong>
        <p>${escapeHtml(tip.action)}</p>
      </div>`,
    )
    .join('');

  dom.recommendationsContainer.innerHTML = `
    <aside class="recommendations-card" aria-label="Ways to improve qualification fit">
      <h3>Ways to Improve Qualification Fit</h3>
      ${items}
    </aside>
  `;
}
