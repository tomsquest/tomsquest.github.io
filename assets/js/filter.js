// Active filters keyed by filter type; absent key means no active value for that type.
let activeFilters = {};

/**
 * Attach click handlers to all [data-filter] buttons and perform initial count calculation.
 */
export function initializeFilters(itemsSelector) {
  document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      toggleFilter(link);
      filterItems(itemsSelector);
      updateCounts(itemsSelector);
    });
  });
  updateCounts(itemsSelector);
}

/**
 * Toggle a filter button: activate its value (and deactivate siblings of same type) or remove it.
 */
export function toggleFilter(link) {
  const type = link.dataset.filter;
  const value = link.dataset[type];
  const wasActive = link.getAttribute('aria-pressed') === 'true';

  // Deactivate all buttons of the same filter type.
  document.querySelectorAll(`[data-filter="${type}"]`).forEach(el => el.setAttribute('aria-pressed', 'false'));

  if (!wasActive) {
    link.setAttribute('aria-pressed', 'true');
    activeFilters[type] = value;
  } else {
    delete activeFilters[type]; // remove key when toggled off
  }
}

/**
 * Show/hide items based on current active filters.
 * A filter is ignored if its value is falsy (behavior preserved from original logic).
 */
function filterItems(itemsSelector) {
  const keys = Object.keys(activeFilters);
  document.querySelectorAll(itemsSelector).forEach(item => {
    const visible = keys.every(k =>
      !activeFilters[k] || item.getAttribute(`data-${k}`) === activeFilters[k]
    );
    item.style.display = visible ? 'block' : 'none';
  });
}

/**
 * Update each filter link's count to reflect how many items would remain
 * if that value were (or stayed) selected alongside other active filters.
 */
function updateCounts(itemsSelector) {
  const items = Array.from(document.querySelectorAll(itemsSelector));
  const keys = Object.keys(activeFilters);

  document.querySelectorAll('[data-filter]').forEach(link => {
    const type = link.dataset.filter;
    const value = link.dataset[type];

    const count = items.filter(item => {
      const matchesOthers = keys.every(k =>
        k === type || !activeFilters[k] || item.getAttribute(`data-${k}`) === activeFilters[k]
      );
      return matchesOthers && item.getAttribute(`data-${type}`) === value;
    }).length;

    // Counts live in their own span so the label markup (e.g. screen-reader text) is kept.
    let countEl = link.querySelector('.count');
    if (!countEl) {
      countEl = document.createElement('span');
      countEl.className = 'count';
      link.append(' ', countEl);
    }
    countEl.textContent = `(${count})`;
  });
}
