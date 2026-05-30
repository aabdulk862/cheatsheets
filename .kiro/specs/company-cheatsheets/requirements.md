# Requirements Document

## Introduction

Five standalone company-specific HackerRank/OA cheatsheet web applications for Bank of America, Allstate, Shutterfly, Lowe's, and Truist. Each app replicates the existing Wells Fargo cheatsheet architecture (single-page tabbed interface with timer, search/filter, syntax-highlighted code cards, and game plan) but is tailored to the target company's assessment format, known topics, branding colors, and interview process.

## Glossary

- **Cheatsheet_App**: A standalone single-page web application consisting of an index.html, app.js, and styles.css file set within a dedicated folder
- **Pattern_Card**: A UI card component displaying a code snippet with syntax highlighting, a title, description, language badge, and meta tags
- **Question_Card**: A UI card component displaying a filterable coding problem with its solution code, difficulty badge, and hint text
- **Tab_Navigation**: A horizontal button group allowing the user to switch between content panels without page reload
- **Timer_Component**: A countdown clock with start, pause, and resume controls displayed in the page header
- **Search_Filter**: A text input that filters visible Question_Cards by matching against name and hint fields
- **Game_Plan_Panel**: A tab panel displaying time allocation cards, strategy guides, and topic keyword grids
- **Syntax_Highlighter**: The highlight.js library used to apply language-aware color formatting to code blocks
- **BofA_App**: The Bank of America cheatsheet application located in the bofa/ directory
- **Allstate_App**: The Allstate cheatsheet application located in the allstate/ directory
- **Shutterfly_App**: The Shutterfly cheatsheet application located in the shutterfly/ directory
- **Lowes_App**: The Lowe's cheatsheet application located in the lowes/ directory
- **Truist_App**: The Truist cheatsheet application located in the truist/ directory
- **Infosys_App**: The Infosys Playbook knowledge reference application located in the infosys/ directory, using an expandable Q&A card format rather than the timed assessment format

## Requirements

### Requirement 1: Standalone File Structure

**User Story:** As a developer preparing for interviews, I want each company cheatsheet to be a self-contained folder with its own HTML, CSS, and JS files, so that I can open any one independently in a browser without dependencies on the others.

#### Acceptance Criteria

1. THE Cheatsheet_App SHALL consist of exactly three local files: index.html, styles.css, and app.js within a dedicated folder
2. THE BofA_App SHALL reside in the bofa/ directory relative to the project root
3. THE Allstate_App SHALL reside in the allstate/ directory relative to the project root
4. THE Shutterfly_App SHALL reside in the shutterfly/ directory relative to the project root
5. THE Lowes_App SHALL reside in the lowes/ directory relative to the project root
6. THE Truist_App SHALL reside in the truist/ directory relative to the project root
7. WHEN a user opens any index.html file in a browser with an active internet connection, THE Cheatsheet_App SHALL render all tabs, timer, search filter, and syntax-highlighted code blocks without requiring a build step, local server, or file references outside its own folder
8. THE Cheatsheet_App SHALL reference styles.css and app.js using relative paths within the same directory, and SHALL NOT reference files from other Cheatsheet_App folders or parent directories
9. IF the CDN-hosted Syntax_Highlighter fails to load, THEN THE Cheatsheet_App SHALL still display all content with unformatted code blocks remaining readable as plain text

### Requirement 2: Tabbed Navigation

**User Story:** As a developer, I want tabbed navigation to organize content by category, so that I can quickly switch between patterns, questions, and strategy during a timed assessment.

#### Acceptance Criteria

1. THE Tab_Navigation SHALL display all tab buttons in a horizontal row within a pill-shaped container with no more than 6 tab buttons visible at once
2. WHEN a user clicks a tab button, THE Cheatsheet_App SHALL display the corresponding panel and hide all other panels so that exactly one panel is visible at any time
3. WHEN a user clicks a tab button, THE Cheatsheet_App SHALL apply a visually distinct background and text color to the selected tab and remove that styling from all other tabs within 200 milliseconds
4. THE BofA_App SHALL include tabs for: SQL Patterns, Java/Core Patterns, Likely Questions, and Game Plan
5. THE Allstate_App SHALL include tabs for: TDD Patterns, Java/Spring Patterns, Likely Questions, and Game Plan
6. THE Shutterfly_App SHALL include tabs for: Array/String Patterns, DP/Math Patterns, Likely Questions, and Game Plan
7. THE Lowes_App SHALL include tabs for: Java 8/Core Patterns, Microservices/Kafka Patterns, Likely Questions, and Game Plan
8. THE Truist_App SHALL include tabs for: Java/SQL Patterns, Banking Domain Patterns, Likely Questions, and Game Plan
9. WHEN the Cheatsheet_App loads, THE Tab_Navigation SHALL display the first tab as active and its corresponding panel as visible by default
10. WHEN a user presses the left or right arrow key while a tab button has focus, THE Tab_Navigation SHALL move focus to the adjacent tab button and activate it

### Requirement 3: Timer Component

**User Story:** As a developer taking a timed assessment, I want a visible countdown timer with start/pause/resume controls, so that I can track remaining time without leaving the page.

#### Acceptance Criteria

1. THE Timer_Component SHALL display remaining time in MM:SS format using a monospace font, showing the full configured duration as the initial value before the timer is started
2. WHEN the user clicks the Start button, THE Timer_Component SHALL begin counting down from the configured duration, decrementing the display every 1 second, and SHALL replace the Start button with a Pause button
3. WHEN the user clicks the Pause button, THE Timer_Component SHALL stop the countdown, preserve the remaining time on display, and SHALL replace the Pause button with a Resume button
4. WHEN the user clicks the Resume button, THE Timer_Component SHALL continue counting down from the preserved time and SHALL replace the Resume button with a Pause button
5. WHEN the timer reaches 00:00, THE Timer_Component SHALL stop counting, apply a red color to the time display, and SHALL replace the Pause button with a Start button to allow restarting from the configured duration
6. THE BofA_App Timer_Component SHALL default to 90 minutes
7. THE Allstate_App Timer_Component SHALL default to 60 minutes
8. THE Shutterfly_App Timer_Component SHALL default to 90 minutes
9. THE Lowes_App Timer_Component SHALL default to 90 minutes
10. THE Truist_App Timer_Component SHALL default to 60 minutes

### Requirement 4: Pattern Cards with Syntax Highlighting

**User Story:** As a developer, I want code patterns displayed in syntax-highlighted cards with descriptions and meta tags, so that I can quickly review solution templates during an assessment.

#### Acceptance Criteria

1. THE Pattern_Card SHALL display a title, a language badge indicating the code block's language, a description of no more than 200 characters, a syntax-highlighted code block with preserved indentation and line breaks, and between 1 and 5 meta tags containing keyword terms relevant to the pattern
2. WHEN the page finishes rendering Pattern_Cards, THE Syntax_Highlighter SHALL use highlight.js loaded from a CDN to apply language-specific coloring to all code blocks
3. IF highlight.js fails to load from the CDN, THEN THE Pattern_Card SHALL still display the code block as plain monospaced text without coloring
4. THE BofA_App SHALL include at least one Pattern_Card per listed topic for SQL (window functions, aggregation, CTEs) and Java (HashMap, binary search, string manipulation, stack, arrays)
5. THE Allstate_App SHALL include at least one Pattern_Card per listed topic for TDD (Red-Green-Refactor, test structure, mocking), Java/Spring (REST controllers, service layer, dependency injection), and clean code (refactoring, SOLID)
6. THE Shutterfly_App SHALL include at least one Pattern_Card per listed topic for arrays/strings (two pointers, sliding window, hash table), dynamic programming (1D, 2D, knapsack), and math patterns
7. THE Lowes_App SHALL include at least one Pattern_Card per listed topic for Java 8 (streams, lambdas, functional interfaces, Optional), microservices (Kafka producers/consumers, REST API design), and database (PostgreSQL queries, JPA/JDBC)
8. THE Truist_App SHALL include at least one Pattern_Card per listed topic for Java (Core Java, Collections, multithreading), SQL (joins, window functions, transaction queries), and banking domain (ACID, data integrity, security patterns)

### Requirement 5: Question List with Filter

**User Story:** As a developer, I want a searchable list of likely assessment questions with inline solutions, so that I can quickly find and review specific problems.

#### Acceptance Criteria

1. THE Question_Card SHALL display the problem name, a difficulty badge (easy, medium, or hard), a hint of no more than 80 characters, and the full solution code with syntax highlighting applied by the Syntax_Highlighter
2. WHEN the user types in the Search_Filter input, THE Cheatsheet_App SHALL show only Question_Cards whose name or hint contains the typed text as a substring match (case-insensitive), updating the visible list after each keystroke
3. IF the Search_Filter input text matches zero Question_Cards, THEN THE Cheatsheet_App SHALL hide all Question_Cards and display a message indicating no results were found
4. THE BofA_App SHALL include at least 9 questions covering: second-largest in array, string reversal, palindrome check, Fibonacci (iterative + recursive), Longest Substring Without Repeating Characters, linked list operations, pattern printing, SQL second highest salary, and SQL employees with no manager
5. THE Allstate_App SHALL include at least 5 questions covering: TDD kata problems, REST API design, refactoring exercises, distributed systems concepts, and web security patterns
6. THE Shutterfly_App SHALL include at least 10 questions covering the top reported topics (arrays, hash tables, dynamic programming, strings, and math problems) with at least 1 question per difficulty level (easy, medium, and hard)
7. THE Lowes_App SHALL include at least 8 questions covering: Java 8 features (streams, lambdas, method references, Map vs FlatMap), Collections framework, Kafka concepts (producers, consumers, partitions, replication), microservice communication patterns, and PostgreSQL queries
8. THE Truist_App SHALL include at least 7 questions covering: Java Core (OOP, exception handling, generics), SQL (joins, aggregation, window functions, transaction isolation), REST API design, and Agile/SDLC concepts

### Requirement 6: Game Plan Panel

**User Story:** As a developer, I want a strategy panel showing time allocation per question and test-taking tips, so that I can plan my approach before starting the assessment.

#### Acceptance Criteria

1. THE Game_Plan_Panel SHALL display time allocation cards, each showing the question number, question type, and recommended minutes, where the sum of all recommended minutes equals the assessment's total duration and each individual allocation is between 1 and 45 minutes
2. THE Game_Plan_Panel SHALL display at least one strategy card containing a numbered list of between 3 and 7 ordered steps for approaching problems
3. THE Game_Plan_Panel SHALL display a keyword grid containing between 6 and 20 topic terms sourced from the company's known assessment topics as defined in the corresponding company-specific content requirement
4. THE BofA_App Game_Plan_Panel SHALL display time allocation cards for: 1 self-intro video, 2 coding questions (1 easy + 1 medium), 1 explanation video, and 1 fitment question, with per-section minute values summing to 90 minutes
5. THE Allstate_App Game_Plan_Panel SHALL include a strategy card with ordered steps for the TDD round (Red-Green-Refactor cycle) and a separate strategy card with ordered steps for pair programming collaboration
6. THE Shutterfly_App Game_Plan_Panel SHALL display time allocation cards that distribute 90 minutes across 39 problems (5 Easy, 25 Medium, 9 Hard), showing recommended minutes per difficulty tier
7. THE Lowes_App Game_Plan_Panel SHALL include a strategy card with ordered steps for each of the 3 back-to-back technical panels covering Java 8, microservices/Kafka, and database/debugging
8. THE Truist_App Game_Plan_Panel SHALL include a strategy card with ordered steps for conversational technical interviews covering preparation for Java fundamentals questions, SQL proficiency questions, and banking domain questions

### Requirement 7: Company-Specific Branding

**User Story:** As a developer, I want each cheatsheet to use the target company's brand colors, so that I can visually distinguish between them and feel the context of the target interview.

#### Acceptance Criteria

1. THE BofA_App SHALL define CSS custom properties --color-accent as #012169 (navy) and --color-accent-secondary as #E31837 (red) and apply them to the timer button background, active tab background, and progress bar fill
2. THE Allstate_App SHALL define CSS custom properties --color-accent as #003DA5 (blue) and --color-accent-secondary as #FF6900 (orange) and apply them to the timer button background, active tab background, and progress bar fill
3. THE Shutterfly_App SHALL define CSS custom properties --color-accent as #6B2D8B (purple) and --color-accent-secondary as #00B2A9 (teal) and apply them to the timer button background, active tab background, and progress bar fill
4. THE Lowes_App SHALL define CSS custom properties --color-accent as #004990 (blue) and apply it to the timer button background, active tab background, and progress bar fill
5. THE Truist_App SHALL define CSS custom properties --color-accent as #532E8A (purple) and apply it to the timer button background, active tab background, and progress bar fill
6. THE Cheatsheet_App SHALL apply the company --color-accent value to exactly these elements: the .timer-btn background color, the .tab-btn.active background color, and the .progress-fill background color
7. WHEN a user opens any Cheatsheet_App, THE Cheatsheet_App SHALL render the timer button, active tab, and progress bar fill in the company-specific accent color without requiring manual configuration

### Requirement 8: Responsive Layout

**User Story:** As a developer, I want the cheatsheet to be usable on different screen sizes, so that I can reference it on a second monitor, tablet, or phone during preparation.

#### Acceptance Criteria

1. WHEN the viewport width is 768px or less, THE Cheatsheet_App SHALL stack the pattern grid and strategy grid into a single column and collapse the plan grid from four columns to two columns
2. WHEN the viewport width is 480px or less, THE Cheatsheet_App SHALL reduce tab button padding to no more than 6px vertical and 10px horizontal and reduce tab button font size to no larger than 12px
3. WHEN the viewport width is 1600px or more, THE Cheatsheet_App SHALL expand the maximum container width to 1600px and increase code block font size to 14px
4. WHILE the viewport width is 768px or less, THE Cheatsheet_App SHALL ensure that code blocks scroll horizontally within their container rather than causing the page to overflow

### Requirement 9: Bank of America Assessment-Specific Content

**User Story:** As a developer preparing for a Bank of America HireVue assessment, I want content tailored to their known format (self-intro + 2 coding + 1 explanation video + 1 fitment question), so that I focus on the right material.

#### Acceptance Criteria

1. THE BofA_App header SHALL describe the assessment format: "HireVue OA — 90 min · Self-Intro + 2 Coding (Easy + Medium) + Explanation Video + Fitment"
2. THE BofA_App SHALL include SQL patterns for: second highest salary (DENSE_RANK), employees with no manager (LEFT JOIN IS NULL), COUNT with GROUP BY, and window functions
3. THE BofA_App SHALL include Java patterns for: arrays (two sum, second-largest element), linked lists (reversal, merge), string manipulation (reversal, palindrome check), sliding window (longest substring without repeating), and Core Java concepts (OOP, Collections, multithreading, exception handling)
4. THE BofA_App Game_Plan_Panel SHALL include a strategy section for the video explanation question (how to articulate your approach clearly)
5. THE BofA_App SHALL include a Core Java quick-reference section covering: inheritance, abstraction vs encapsulation, String vs StringBuilder vs StringBuffer, JVM/JDK/JRE, and Collections Framework

### Requirement 10: Allstate Assessment-Specific Content

**User Story:** As a developer preparing for an Allstate technical interview, I want content tailored to their TDD and pair programming emphasis, so that I demonstrate Extreme Programming fluency.

#### Acceptance Criteria

1. THE Allstate_App header SHALL describe the process: "Recruiter Screen → Technical Coding → Pair Programming/TDD Round"
2. THE Allstate_App SHALL include at least one Pattern_Card for each of the following TDD topics: Red-Green-Refactor cycle, test-first development with JUnit 5, mocking with Mockito, and assertion patterns
3. THE Allstate_App SHALL include at least one Pattern_Card for each of the following Spring Boot topics: REST controller structure, service layer with dependency injection, exception handling, and integration testing
4. THE Allstate_App SHALL include at least one Pattern_Card for each of the following clean code topics: refactoring techniques (minimum 3 techniques), SOLID principles applied in Java, and code smell identification (minimum 3 code smells)
5. THE Allstate_App Game_Plan_Panel SHALL include pair programming strategy cards covering: communication style, thinking aloud, asking clarifying questions, and collaborative refactoring
6. THE Allstate_App SHALL include at minimum the following TDD interview questions as Question_Cards: explaining Red-Green-Refactor to a non-practitioner, handling disagreements with a pair partner about testing approach, and determining what to test

### Requirement 11: Shutterfly Assessment-Specific Content

**User Story:** As a developer preparing for a Shutterfly coding assessment, I want content covering their heavier algorithmic focus (39 known problems across 5 Easy, 25 Medium, 9 Hard), so that I practice the right difficulty distribution.

#### Acceptance Criteria

1. THE Shutterfly_App header SHALL describe the assessment: "39 Known Problems — 5 Easy, 25 Medium, 9 Hard · Top Topics: Array, Hash Table, DP, String, Math"
2. THE Shutterfly_App SHALL include array and string Pattern_Cards for: two pointers, sliding window, prefix sum, and hash table frequency counting, with at least one Pattern_Card per sub-topic
3. THE Shutterfly_App SHALL include dynamic programming Pattern_Cards for: 1D DP (House Robber, Word Break, Longest Increasing Subsequence), 2D DP (Longest Palindromic Substring, Longest Arithmetic Subsequence), and interval DP (Burst Balloons or similar range-based subproblem)
4. THE Shutterfly_App SHALL include math Pattern_Cards for: modular arithmetic, finding kth factor, and combinatorics
5. THE Shutterfly_App Question list SHALL include at minimum the following 11 known Shutterfly problems as Question_Cards: Find Peak Element (Medium), Next Permutation (Medium), Rotate Image (Medium), Subsets (Medium), Longest Increasing Subsequence (Medium), House Robber (Medium), Word Break (Medium), Trapping Rain Water (Hard), Find Median from Data Stream (Hard), Basic Calculator (Hard), and First Missing Positive (Hard), each displaying its corresponding difficulty badge
6. THE Shutterfly_App SHALL include hard-level Pattern_Cards for: monotonic stack (Trapping Rain Water), heap/stream processing (Find Median from Data Stream), and expression parsing (Basic Calculator)
7. WHEN the user types in the Search_Filter input on the Shutterfly_App Likely Questions tab, THE Shutterfly_App SHALL show only Question_Cards whose name or hint contains the typed text, matching case-insensitively

### Requirement 12: Lowe's Assessment-Specific Content

**User Story:** As a developer preparing for a Lowe's technical interview, I want content tailored to their all-technical panel format focused on Java 8, microservices, and Kafka, so that I demonstrate production-level backend expertise.

#### Acceptance Criteria

1. THE Lowes_App header SHALL describe the process: "Recruiter Call → 3 Technical Panel Interviews · All Technical, No Behavioral"
2. THE Lowes_App SHALL include Java 8 patterns for: Stream API (map, filter, reduce, collect), lambda expressions, functional interfaces (Predicate, Function, Consumer, Supplier), method references, Optional, and the difference between map and flatMap
3. THE Lowes_App SHALL include microservices patterns for: Kafka producer/consumer configuration, topic partitioning and replication, inter-service communication (sync REST vs async messaging), circuit breaker pattern, and service discovery
4. THE Lowes_App SHALL include database patterns for: PostgreSQL queries (joins, indexing, EXPLAIN), JPA entity mapping, transaction management, and connection pooling
5. THE Lowes_App Game_Plan_Panel SHALL display a strategy card stating that all 3 interviews are purely technical with no HR/behavioral component, and SHALL include a debugging strategy section covering: systematic isolation of failures, reading stack traces, divide-and-conquer narrowing, and verifying assumptions with logging
6. THE Lowes_App SHALL include a dedicated Collections section covering: HashMap internals (hashing, bucket collisions, resize threshold), ConcurrentHashMap, ArrayList vs LinkedList, TreeMap vs HashMap, and fail-fast vs fail-safe iterators

### Requirement 13: Truist Assessment-Specific Content

**User Story:** As a developer preparing for a Truist technical interview, I want content tailored to their banking-domain focus on Java, SQL, and financial services patterns, so that I demonstrate readiness for a regulated enterprise environment.

#### Acceptance Criteria

1. THE Truist_App header SHALL describe the process: "Recruiter Screen → Technical Interview(s) · Java, SQL, Banking Domain Focus"
2. THE Truist_App SHALL include at least 1 Pattern_Card for each Java sub-topic: Core Java (OOP principles, exception handling, generics, Collections), multithreading (synchronized, ExecutorService, CompletableFuture), and design patterns (Singleton, Factory, Observer)
3. THE Truist_App SHALL include at least 1 Pattern_Card for each SQL sub-topic: multi-table joins (INNER, LEFT, RIGHT, self-joins), window functions, transaction isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), stored procedures, and financial data queries (loan aggregation, interest rate calculations, account balance reconciliation)
4. THE Truist_App SHALL include at least 1 Pattern_Card for each banking domain sub-topic: ACID compliance, data integrity constraints (foreign keys, unique constraints, check constraints), audit logging, regulatory awareness (SOX auditability, PCI-DSS data handling, KYC/AML concepts), and secure coding patterns (parameterized queries, input validation, sensitive data masking)
5. THE Truist_App Game_Plan_Panel SHALL include strategy cards covering: how to reference banking domain terminology during technical answers, Agile methodology talking points (sprint ceremonies, user stories, CI/CD in regulated environments), and recommended question order based on Java-first then SQL then domain topics
6. THE Truist_App SHALL include at least 1 Pattern_Card for each REST API sub-topic: API versioning, pagination, structured error responses with retry guidance, and idempotency in financial transactions

### Requirement 14: Infosys Playbook Knowledge Reference App

**User Story:** As a developer, I want my existing Infosys Playbook content (Java, Spring, SQL, React, HTTP, Cloud/SDLC, Coding, Git, Non-Technical) converted into a searchable cheatsheet app, so that I can quickly reference interview knowledge in the same card-based UI as my other cheatsheets.

#### Acceptance Criteria

1. THE Infosys_App SHALL reside in the infosys/ directory relative to the project root and follow the same standalone file structure (index.html, styles.css, app.js)
2. THE Infosys_App SHALL include tabs for: Java, Spring, SQL, React/Frontend, HTTP, Cloud/SDLC, Coding, and Git — each corresponding to a topic file from the Infosys Playbook folder
3. THE Infosys_App SHALL NOT include a countdown timer, as this is a knowledge reference rather than a timed assessment prep tool
4. THE Infosys_App SHALL display content as expandable Q&A cards where each card shows the question as a header and the full answer (including code examples) expands on click
5. THE Infosys_App SHALL include a global Search_Filter that searches across all tabs, filtering Q&A cards by question title (case-insensitive substring match)
6. THE Infosys_App SHALL preserve all code examples from the source markdown files with syntax highlighting via highlight.js, supporting Java, SQL, JavaScript/JSX, and bash languages
7. THE Infosys_App SHALL use Infosys brand colors (primary: #007CC3 blue, accent: #00A5E3 light blue) for the accent color and active tab states
8. THE Infosys_App header SHALL describe the content: "Infosys Playbook — Full-Stack Interview Knowledge Base · Java · Spring · SQL · React · HTTP · Cloud"
9. THE Infosys_App SHALL include all content from the following source files: Java Questions, Spring Questions, SQL Questions, React + Frontend Questions, HTTP Questions, Cloud + SDLC Questions, Coding Questions, and Git Questions
10. WHEN a user clicks a Q&A card header, THE Infosys_App SHALL toggle the visibility of the answer content with a smooth expand/collapse animation
