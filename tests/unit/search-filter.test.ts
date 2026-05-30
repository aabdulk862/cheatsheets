import { describe, it, expect } from 'vitest';
import { filterCards } from '../../src/components/SearchFilter';

describe('SearchFilter - filterCards', () => {
  const cards = [
    { name: 'Two Sum', hint: 'Use a hash map' },
    { name: 'Binary Search', hint: 'Sorted array required' },
    { name: 'Palindrome Check', hint: 'Compare reversed string' },
    { name: 'Fibonacci', hint: 'Iterative approach' },
  ];

  it('returns all true when query is empty', () => {
    const result = filterCards('', cards);
    expect(result).toEqual([true, true, true, true]);
  });

  it('matches by name (case-insensitive)', () => {
    const result = filterCards('binary', cards);
    expect(result).toEqual([false, true, false, false]);
  });

  it('matches by hint (case-insensitive)', () => {
    const result = filterCards('hash', cards);
    expect(result).toEqual([true, false, false, false]);
  });

  it('matches partial substrings', () => {
    const result = filterCards('pal', cards);
    expect(result).toEqual([false, false, true, false]);
  });

  it('returns all false when no cards match', () => {
    const result = filterCards('xyz123', cards);
    expect(result).toEqual([false, false, false, false]);
  });

  it('handles cards without hint field', () => {
    const cardsNoHint = [
      { name: 'Two Sum' },
      { name: 'Binary Search', hint: 'Sorted array' },
    ];
    const result = filterCards('sorted', cardsNoHint);
    expect(result).toEqual([false, true]);
  });

  it('matches case-insensitively with uppercase query', () => {
    const result = filterCards('FIBONACCI', cards);
    expect(result).toEqual([false, false, false, true]);
  });

  it('matches multiple cards when query is common substring', () => {
    const result = filterCards('a', cards);
    // 'Two Sum' has 'a' in hint ('hash map'), 'Binary Search' has 'a' in name and hint,
    // 'Palindrome Check' has 'a' in name, 'Fibonacci' has 'a' in hint ('Iterative approach')
    expect(result).toEqual([true, true, true, true]);
  });

  it('handles empty cards array', () => {
    const result = filterCards('test', []);
    expect(result).toEqual([]);
  });
});
