// Active filters keyed by filter type; absent key means no active value for that type.
let activeFilters = {};

/**
 * Attach click handlers to all [data-filter] elements and perform initial count calculation.
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
 * Toggle a filter link: activate its value (and deactivate siblings of same type) or remove it.
 */
export function toggleFilter(link) {
  const type = link.dataset.filter;
  const value = link.dataset[type];
  const wasActive = link.classList.contains('active');

  // Deactivate all links of the same filter type.
  document.querySelectorAll(`[data-filter="${type}"]`).forEach(el => el.classList.remove('active'));

  if (!wasActive) {
    link.classList.add('active');
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

    const baseLabel = link.textContent.split(' (')[0];
    link.textContent = `${baseLabel} (${count})`;
  });
}
