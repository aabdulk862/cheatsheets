/**
 * Shared TypeScript interfaces for company cheatsheet data.
 * All company data files and components import from this module.
 */

/** Tab configuration for navigation */
export interface TabConfig {
  id: string;
  label: string;
}

/** Top-level company page configuration */
export interface CompanyConfig {
  slug: string;                    // Route slug: "bofa", "allstate", etc.
  title: string;                   // Header title
  subtitle: string;                // Header subtitle/description
  accentColor: string;             // Primary accent hex
  accentSecondary?: string;        // Optional secondary accent hex
  timerMinutes?: number;           // Timer duration (omit for Infosys)
  tabs: TabConfig[];               // Tab configuration
}

/** A code pattern card with syntax highlighting */
export interface PatternCard {
  title: string;                   // Pattern name
  lang: 'java' | 'sql' | 'javascript' | 'python' | 'bash' | 'typescript';
  description: string;             // ≤200 chars
  code: string;                    // Raw code (Shiki highlights at build time)
  metaTags: string[];              // 1–5 keyword tags
}

/** A group of related pattern cards under a section heading */
export interface PatternSection {
  label: string;                   // Section heading (e.g., "Window Functions")
  cards: PatternCard[];
}

/** A filterable question with solution code */
export interface QuestionItem {
  name: string;                    // Problem title
  diff: 'easy' | 'medium' | 'hard';
  hint: string;                    // ≤80 chars
  lang: string;                    // Language for syntax highlighting
  code: string;                    // Full solution code
}

/** Time allocation entry in the game plan */
export interface TimeAllocation {
  label: string;                   // e.g., "Q1"
  type: string;                    // e.g., "SQL"
  minutes: number;                 // 1–45
  highlight?: boolean;             // Visual emphasis
}

/** Strategy card with ordered steps */
export interface StrategyCard {
  title: string;
  steps: string[];                 // 3–7 ordered steps
  highlightText?: string;          // Optional callout
}

/** Game plan panel configuration */
export interface GamePlanConfig {
  allocations: TimeAllocation[];
  strategies: StrategyCard[];
  keywords: string[];              // 6–20 topic terms
}
