import { useState, useCallback } from 'react';

/**
 * Pure function for testability: given a query and an array of card objects,
 * returns a boolean array indicating which cards match.
 * A card matches if any of its fields contain the query as a case-insensitive substring.
 * An empty query matches all cards.
 */
export function filterCards(
  query: string,
  cards: { name: string; hint?: string }[]
): boolean[] {
  if (!query) {
    return cards.map(() => true);
  }
  const lowerQuery = query.toLowerCase();
  return cards.map((card) => {
    if (card.name.toLowerCase().includes(lowerQuery)) return true;
    if (card.hint && card.hint.toLowerCase().includes(lowerQuery)) return true;
    return false;
  });
}

interface SearchFilterProps {
  targetSelector: string;
  searchFields: string[];
  scope?: 'active-panel' | 'all-panels';
}

export default function SearchFilter({
  targetSelector,
  searchFields,
  scope = 'active-panel',
}: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [noResults, setNoResults] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      const lowerQuery = value.toLowerCase();

      // Determine the container to search within
      let container: Element | Document = document;
      if (scope === 'active-panel') {
        const activePanel = document.querySelector('.panel.active');
        if (activePanel) {
          container = activePanel;
        }
      }

      // For all-panels scope with a query, show all panels so matches are visible
      if (scope === 'all-panels' && value) {
        const allPanels = document.querySelectorAll<HTMLElement>('.panel');
        allPanels.forEach((panel) => {
          panel.classList.add('active');
        });
      } else if (scope === 'all-panels' && !value) {
        // Restore: only first panel active (or whichever tab is selected)
        const allPanels = document.querySelectorAll<HTMLElement>('.panel');
        const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
        const activeId = activeTab?.getAttribute('aria-controls');
        allPanels.forEach((panel) => {
          if (panel.id === activeId) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      }

      // Get all cards matching the target selector within the scope
      const cards = container.querySelectorAll<HTMLElement>(targetSelector);

      let visibleCount = 0;

      cards.forEach((card) => {
        if (!value) {
          // Empty query: show all cards
          card.style.display = '';
          visibleCount++;
          return;
        }

        // Check if any of the search fields contain the query
        let matches = false;
        for (const field of searchFields) {
          const attrValue = card.getAttribute(field);
          if (attrValue && attrValue.includes(lowerQuery)) {
            matches = true;
            break;
          }
        }

        if (matches) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // For all-panels: hide panels that have zero visible cards
      if (scope === 'all-panels' && value) {
        const allPanels = document.querySelectorAll<HTMLElement>('.panel');
        allPanels.forEach((panel) => {
          const visibleCards = panel.querySelectorAll<HTMLElement>(targetSelector);
          const hasVisible = Array.from(visibleCards).some(
            (card) => card.style.display !== 'none'
          );
          if (!hasVisible) {
            panel.classList.remove('active');
          }
        });
      }

      setNoResults(value.length > 0 && visibleCount === 0);
    },
    [targetSelector, searchFields, scope]
  );

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        aria-label="Search cards"
      />
      {noResults && (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
}
