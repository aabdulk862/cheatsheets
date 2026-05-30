# Implementation Plan: Company Cheatsheets

## Overview

Build 6 company-specific interview cheatsheet pages within a single Astro 5 project. Five pages follow a timed-assessment pattern (BofA, Allstate, Shutterfly, Lowe's, Truist) and one follows a knowledge-reference pattern (Infosys Playbook). The implementation uses shared layouts, React islands for interactivity, content collections for Infosys markdown, and Shiki for build-time syntax highlighting.

## Tasks

- [x] 1. Scaffold Astro 5 project and configure tooling
  - [x] 1.1 Initialize Astro 5 project with React integration
    - Run `npm create astro@latest` or manually create `package.json` with astro, @astrojs/react, react, react-dom
    - Configure `astro.config.mjs` with React integration and Shiki syntax highlighting
    - Create `tsconfig.json` with strict mode and path aliases
    - Set up directory structure: `src/layouts/`, `src/components/`, `src/pages/`, `src/data/`, `src/content/`, `src/styles/`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 Create shared TypeScript interfaces and types
    - Create `src/data/types.ts` with all shared interfaces: `CompanyConfig`, `TabConfig`, `PatternCard`, `PatternSection`, `QuestionItem`, `TimeAllocation`, `StrategyCard`, `GamePlanConfig`
    - Ensure all type constraints match requirements (description ≤200 chars, hint ≤80 chars, diff enum, metaTags 1-5, etc.)
    - _Requirements: 4.1, 5.1, 6.1_

  - [x] 1.3 Create global CSS with custom properties and responsive breakpoints
    - Create `src/styles/global.css` with CSS custom properties (`--color-accent`, `--color-accent-secondary`)
    - Implement responsive breakpoints: single-column at ≤768px, compact tabs at ≤480px, expanded at ≥1600px
    - Add base styles for cards, grids, typography, and code blocks with horizontal scroll at ≤768px
    - _Requirements: 7.6, 7.7, 8.1, 8.2, 8.3, 8.4_

  - [x] 1.4 Set up Vitest, fast-check, and Playwright test configuration
    - Install vitest, fast-check, @testing-library/react, jsdom, playwright
    - Create `vitest.config.ts` with jsdom environment
    - Create `playwright.config.ts` for E2E tests against built static site
    - Create test directory structure: `tests/unit/`, `tests/property/`, `tests/e2e/`
    - _Requirements: (testing infrastructure)_

- [x] 2. Implement shared layout and static Astro components
  - [x] 2.1 Create CheatsheetLayout.astro
    - Implement shared layout accepting props: title, subtitle, accentColor, accentSecondary, tabs, timerMinutes, hasSearch
    - Set CSS custom properties on `<body>` via style attribute
    - Render header with title and subtitle
    - Conditionally render Timer React island (only when timerMinutes provided)
    - Conditionally render SearchFilter React island (only when hasSearch is true)
    - Provide named `<slot>` elements for each tab panel
    - Import and apply global.css
    - _Requirements: 2.1, 2.9, 3.1, 7.6, 7.7_

  - [x] 2.2 Create TabNavigation.astro with keyboard support
    - Implement horizontal pill-container tab bar with ARIA roles (role="tablist", role="tab", role="tabpanel")
    - Add inline script for tab switching: click handler activates tab, shows corresponding panel, hides others
    - Implement keyboard navigation: ArrowRight/ArrowLeft with wrapping from last-to-first and first-to-last
    - Set first tab as active by default on page load
    - Ensure visual transition completes within 200ms
    - _Requirements: 2.1, 2.2, 2.3, 2.9, 2.10_

  - [x] 2.3 Create PatternCard.astro with Shiki syntax highlighting
    - Accept props: title, lang, description, code, metaTags
    - Render language badge, description text, meta tag pills
    - Use Astro's built-in Shiki integration for build-time syntax highlighting of code blocks
    - Preserve indentation and line breaks in code output
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.4 Create QuestionCard.astro
    - Accept props: name, diff, hint, lang, code
    - Render problem name, difficulty badge (easy/medium/hard with color coding), hint text
    - Render solution code with Shiki syntax highlighting
    - Add data attributes for search filtering (data-name, data-hint)
    - _Requirements: 5.1_

  - [x] 2.5 Create GamePlanPanel.astro
    - Accept props: allocations, strategies, keywords
    - Render time allocation cards grid (label, type, minutes, optional highlight)
    - Render strategy cards with numbered step lists
    - Render keyword grid with topic term pills
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 2.6 Create QACard.astro for Infosys expandable cards
    - Accept props: question (string), answer (HTML content)
    - Render card header with question text and expand/collapse chevron
    - Add inline script for click-to-toggle with smooth max-height animation
    - Start in collapsed state by default
    - _Requirements: 14.4, 14.10_

- [x] 3. Implement React island components
  - [x] 3.1 Create Timer.tsx React island
    - Implement state machine: idle → running → paused → running → done → idle
    - Accept `durationMinutes` prop, display initial value as MM:SS in monospace font
    - Start button begins countdown, replaces with Pause button
    - Pause preserves remaining time, replaces with Resume button
    - Resume continues from preserved time
    - At 00:00: stop, apply red color, show Start button for reset
    - Use `useRef` for interval ID to prevent race conditions on rapid clicks
    - Use `client:load` directive for immediate hydration
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 3.2 Write property tests for Timer (P3, P4)
    - **Property 3: Timer Display Format** — For any integer 0–5400, verify MM:SS formatting is correct
    - **Property 4: Timer Pause/Resume Round-Trip** — For any running state with time > 0, pause+resume preserves displayed value
    - Extract `formatTime(seconds: number): string` as pure function for testability
    - Use fast-check to generate random time values
    - **Validates: Requirements 3.1, 3.3, 3.4**

  - [x] 3.3 Create SearchFilter.tsx React island
    - Accept props: targetSelector, searchFields, scope ('active-panel' | 'all-panels')
    - Render text input with search icon
    - On each keystroke, filter cards by case-insensitive substring match against specified data attributes
    - Show "No results found" message when zero cards match
    - For Infosys (scope='all-panels'), search across all tab panels
    - For timed-assessment pages (scope='active-panel'), search within active panel only
    - Use `client:load` directive
    - _Requirements: 5.2, 5.3, 14.5_

  - [ ]* 3.4 Write property tests for SearchFilter (P6)
    - **Property 6: Search Filter Correctness** — For any query string and any set of cards, visible cards after filtering equals exactly the set whose name/question contains query as case-insensitive substring. Empty query shows all.
    - Extract `filterCards(query: string, cards: {name: string, hint: string}[]): filteredCards[]` as pure function
    - Use fast-check to generate random queries and card datasets
    - **Validates: Requirements 5.2, 14.5**

- [x] 4. Checkpoint - Ensure shared components build correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create Bank of America page and data
  - [x] 5.1 Create BofA data file (src/data/bofa.ts)
    - Define company config: accent #012169, secondary #E31837, 90-min timer, 4 tabs (SQL Patterns, Java/Core Patterns, Likely Questions, Game Plan)
    - Create SQL pattern sections: window functions (DENSE_RANK), aggregation (COUNT/GROUP BY), CTEs, LEFT JOIN IS NULL
    - Create Java pattern sections: arrays (two sum, second-largest), linked lists (reversal, merge), strings (reversal, palindrome), sliding window (longest substring), Core Java (OOP, Collections, multithreading, exception handling, String vs StringBuilder, JVM/JDK/JRE)
    - Create questions array: minimum 9 questions covering all required topics with difficulty badges
    - Create game plan: time allocations summing to 90 min (self-intro + 2 coding + explanation video + fitment), strategy cards including video explanation approach, keyword grid
    - _Requirements: 2.4, 3.6, 4.4, 5.4, 6.4, 7.1, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 5.2 Create bofa.astro page
    - Import CheatsheetLayout and all static components
    - Import BofA data, wire up layout props and tab panel slots
    - Render SQL patterns in tab-sql slot, Java patterns in tab-java slot, questions in tab-questions slot, game plan in tab-plan slot
    - Set header subtitle: "HireVue OA — 90 min · Self-Intro + 2 Coding (Easy + Medium) + Explanation Video + Fitment"
    - _Requirements: 1.2, 9.1_

- [x] 6. Create Allstate page and data
  - [x] 6.1 Create Allstate data file (src/data/allstate.ts)
    - Define company config: accent #003DA5, secondary #FF6900, 60-min timer, 4 tabs (TDD Patterns, Java/Spring Patterns, Likely Questions, Game Plan)
    - Create TDD pattern sections: Red-Green-Refactor, test-first with JUnit 5, mocking with Mockito, assertion patterns
    - Create Java/Spring pattern sections: REST controllers, service layer with DI, exception handling, integration testing
    - Create clean code patterns: refactoring techniques (≥3), SOLID principles, code smell identification (≥3)
    - Create questions array: minimum 5 questions covering TDD kata, REST API design, refactoring, distributed systems, web security
    - Create game plan: time allocations summing to 60 min, TDD round strategy (Red-Green-Refactor cycle), pair programming strategy (communication, thinking aloud, clarifying questions, collaborative refactoring)
    - _Requirements: 2.5, 3.7, 4.5, 5.5, 6.5, 7.2, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 6.2 Create allstate.astro page
    - Import CheatsheetLayout and components, wire up Allstate data
    - Set header subtitle: "Recruiter Screen → Technical Coding → Pair Programming/TDD Round"
    - _Requirements: 1.3, 10.1_

- [x] 7. Create Shutterfly page and data
  - [x] 7.1 Create Shutterfly data file (src/data/shutterfly.ts)
    - Define company config: accent #6B2D8B, secondary #00B2A9, 90-min timer, 4 tabs (Array/String Patterns, DP/Math Patterns, Likely Questions, Game Plan)
    - Create array/string patterns: two pointers, sliding window, prefix sum, hash table frequency counting
    - Create DP patterns: 1D (House Robber, Word Break, LIS), 2D (Longest Palindromic Substring, Longest Arithmetic Subsequence), interval DP (Burst Balloons)
    - Create math patterns: modular arithmetic, kth factor, combinatorics
    - Create hard-level patterns: monotonic stack (Trapping Rain Water), heap/stream (Find Median), expression parsing (Basic Calculator)
    - Create questions array: minimum 11 known problems with correct difficulty badges (Find Peak Element, Next Permutation, Rotate Image, Subsets, LIS, House Robber, Word Break, Trapping Rain Water, Find Median, Basic Calculator, First Missing Positive)
    - Create game plan: time allocations distributing 90 min across 39 problems (5 Easy, 25 Medium, 9 Hard), strategy cards
    - _Requirements: 2.6, 3.8, 4.6, 5.6, 6.6, 7.3, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [x] 7.2 Create shutterfly.astro page
    - Import CheatsheetLayout and components, wire up Shutterfly data
    - Set header subtitle: "39 Known Problems — 5 Easy, 25 Medium, 9 Hard · Top Topics: Array, Hash Table, DP, String, Math"
    - _Requirements: 1.4, 11.1_

- [x] 8. Create Lowe's page and data
  - [x] 8.1 Create Lowe's data file (src/data/lowes.ts)
    - Define company config: accent #004990, no secondary, 90-min timer, 4 tabs (Java 8/Core Patterns, Microservices/Kafka Patterns, Likely Questions, Game Plan)
    - Create Java 8 patterns: Stream API (map, filter, reduce, collect), lambdas, functional interfaces (Predicate, Function, Consumer, Supplier), method references, Optional, map vs flatMap
    - Create Collections section: HashMap internals (hashing, buckets, resize), ConcurrentHashMap, ArrayList vs LinkedList, TreeMap vs HashMap, fail-fast vs fail-safe iterators
    - Create microservices patterns: Kafka producer/consumer config, topic partitioning/replication, sync REST vs async messaging, circuit breaker, service discovery
    - Create database patterns: PostgreSQL queries (joins, indexing, EXPLAIN), JPA entity mapping, transaction management, connection pooling
    - Create questions array: minimum 8 questions covering Java 8 features, Collections, Kafka concepts, microservice communication, PostgreSQL
    - Create game plan: time allocations summing to 90 min, strategy cards for each of 3 technical panels (Java 8, microservices/Kafka, database/debugging), debugging strategy section, note that all interviews are purely technical
    - _Requirements: 2.7, 3.9, 4.7, 5.7, 6.7, 7.4, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [x] 8.2 Create lowes.astro page
    - Import CheatsheetLayout and components, wire up Lowe's data
    - Set header subtitle: "Recruiter Call → 3 Technical Panel Interviews · All Technical, No Behavioral"
    - _Requirements: 1.5, 12.1_

- [x] 9. Create Truist page and data
  - [x] 9.1 Create Truist data file (src/data/truist.ts)
    - Define company config: accent #532E8A, no secondary, 60-min timer, 4 tabs (Java/SQL Patterns, Banking Domain Patterns, Likely Questions, Game Plan)
    - Create Java patterns: Core Java (OOP, exception handling, generics, Collections), multithreading (synchronized, ExecutorService, CompletableFuture), design patterns (Singleton, Factory, Observer)
    - Create SQL patterns: multi-table joins (INNER, LEFT, RIGHT, self-joins), window functions, transaction isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), stored procedures, financial data queries (loan aggregation, interest rates, account balance reconciliation)
    - Create banking domain patterns: ACID compliance, data integrity constraints (FK, unique, check), audit logging, regulatory awareness (SOX, PCI-DSS, KYC/AML), secure coding (parameterized queries, input validation, data masking)
    - Create REST API patterns: API versioning, pagination, structured error responses, idempotency in financial transactions
    - Create questions array: minimum 7 questions covering Java Core, SQL, REST API design, Agile/SDLC
    - Create game plan: strategy cards for banking terminology, Agile talking points (sprint ceremonies, user stories, CI/CD in regulated environments), recommended question order (Java → SQL → domain)
    - _Requirements: 2.8, 3.10, 4.8, 5.8, 6.8, 7.5, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [x] 9.2 Create truist.astro page
    - Import CheatsheetLayout and components, wire up Truist data
    - Set header subtitle: "Recruiter Screen → Technical Interview(s) · Java, SQL, Banking Domain Focus"
    - _Requirements: 1.6, 13.1_

- [x] 10. Checkpoint - Ensure all 5 timed-assessment pages build correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create Infosys Playbook page with content collections
  - [x] 11.1 Set up Infosys content collection
    - Create `src/content/config.ts` with Zod schema (title: string, order: number, lang: string with default 'java')
    - Convert existing Infosys Playbook markdown files into content collection format with frontmatter (title, order, lang)
    - Create `src/content/infosys/` directory with: java.md, spring.md, sql.md, react-frontend.md, http.md, cloud-sdlc.md, coding.md, git.md
    - Parse each source file: H1 headings become Q&A card questions, content between headings becomes answer body
    - Preserve all code examples with language annotations for Shiki highlighting (Java, SQL, JavaScript/JSX, bash)
    - _Requirements: 14.2, 14.6, 14.9_

  - [x] 11.2 Create infosys.astro page
    - Query content collection with `getCollection('infosys')`, sort by order
    - Generate tabs dynamically from collection entries
    - Render QACard components for each H1 section within each topic
    - Wire up SearchFilter with scope='all-panels' for cross-tab search
    - Do NOT render Timer component (no timerMinutes prop)
    - Set header: "Infosys Playbook — Full-Stack Interview Knowledge Base"
    - Set subtitle: "Java · Spring · SQL · React · HTTP · Cloud · Coding · Git"
    - Set accent colors: primary #007CC3, secondary #00A5E3
    - _Requirements: 14.1, 14.2, 14.3, 14.5, 14.7, 14.8_

- [x] 12. Create landing page and finalize routing
  - [x] 12.1 Create index.astro landing page
    - Create a simple landing/navigation page linking to all 6 company cheatsheets
    - Include company names, brief descriptions, and accent-colored links
    - _Requirements: 1.7_

- [x] 13. Checkpoint - Full build verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Write unit tests and property-based tests
  - [ ]* 14.1 Write unit tests for data validation
    - Verify each company data file exports valid typed data matching interfaces
    - Verify company configs have correct accent colors, timer durations, and tab labels
    - Verify minimum content counts per requirements (BofA ≥9 questions, Shutterfly ≥11, etc.)
    - Verify Infosys content collection files have valid frontmatter
    - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [ ]* 14.2 Write property test for tab switching (P1)
    - **Property 1: Tab Switching Invariant** — For any tab click, exactly one panel has `active` class AND exactly one tab has `active` class AND visible panel corresponds to clicked tab
    - Generate random sequences of tab clicks, verify invariant after each
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 14.3 Write property test for keyboard navigation (P2)
    - **Property 2: Keyboard Tab Navigation Wraps Correctly** — For any focused tab, ArrowRight moves to next (wrapping last→first), ArrowLeft moves to previous (wrapping first→last)
    - Generate random starting tab index + random arrow key sequences
    - **Validates: Requirements 2.10**

  - [ ]* 14.4 Write property test for game plan allocation (P7)
    - **Property 7: Game Plan Time Allocation Invariant** — For any timed-assessment app, sum of all time allocation values equals configured timer duration
    - Test against all 5 company configs
    - **Validates: Requirements 6.1**

  - [ ]* 14.5 Write property test for card rendering (P5)
    - **Property 5: Card Rendering Completeness** — For any valid question data object, rendered HTML contains: name text, diff badge, hint text, and code block
    - Generate random question objects with arbitrary strings
    - **Validates: Requirements 4.1, 5.1**

  - [ ]* 14.6 Write property test for QA card toggle (P8)
    - **Property 8: Q&A Card Toggle Round-Trip** — For any Q&A card, clicking header twice returns card to original collapsed state
    - Generate random card states, apply two toggles, verify identity
    - **Validates: Requirements 14.4, 14.10**

  - [ ]* 14.7 Write E2E tests with Playwright
    - Test each route renders correctly (all 6 pages)
    - Verify tab switching works on each page
    - Verify Timer starts, pauses, resumes, reaches zero (timed pages)
    - Verify SearchFilter shows/hides cards correctly
    - Verify Infosys Q&A cards expand and collapse
    - Verify Shiki syntax highlighting classes present in HTML
    - Verify responsive breakpoints trigger correct layout changes
    - Verify company accent colors applied to correct elements
    - _Requirements: 2.2, 3.2, 3.3, 3.4, 3.5, 5.2, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 14.4, 14.10_

- [x] 15. Final checkpoint - All tests pass and build succeeds
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The Astro project uses `output: 'static'` (default) for full SSG — all pages are pre-rendered HTML
- Timer and SearchFilter property tests (P3, P4, P6) are placed alongside their component implementation in task 3 for early error detection
- Content for the 5 timed-assessment pages should be sourced from the user's domain knowledge and existing reference materials

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 3, "tasks": ["3.1", "3.3"] },
    { "id": 4, "tasks": ["3.2", "3.4"] },
    { "id": 5, "tasks": ["5.1", "6.1", "7.1", "8.1", "9.1", "11.1"] },
    { "id": 6, "tasks": ["5.2", "6.2", "7.2", "8.2", "9.2", "11.2"] },
    { "id": 7, "tasks": ["12.1"] },
    { "id": 8, "tasks": ["14.1", "14.2", "14.3", "14.4", "14.5", "14.6"] },
    { "id": 9, "tasks": ["14.7"] }
  ]
}
```
