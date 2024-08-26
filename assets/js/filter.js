let activeFilters = {};

export function initializeFilters(itemsSelector) {
  document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      filterBy(this, itemsSelector);
    });
  });
}

export function filterBy(link, itemsSelector) {
  const filterType = link.getAttribute('data-filter');
  const filterValue = link.getAttribute(`data-${filterType}`);

  if (link.classList.contains('active')) {
    link.classList.remove('active');
    activeFilters[filterType] = null;
  } else {
    document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    activeFilters[filterType] = filterValue;
  }
  filterItems(itemsSelector);
}

function filterItems(itemsSelector) {
  document.querySelectorAll(itemsSelector).forEach(item => {
    const matches = Object.keys(activeFilters).every(filter => {
      return !activeFilters[filter] || item.getAttribute(`data-${filter}`) === activeFilters[filter];
    });
    item.style.display = matches ? 'block' : 'none';
  });
}