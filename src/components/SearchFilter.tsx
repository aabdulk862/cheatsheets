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
