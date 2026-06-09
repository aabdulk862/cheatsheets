# Company Interview Cheatsheets

A collection of 6 company-specific interview preparation cheatsheets built with Astro 5. Each page is a tabbed, single-page reference with syntax-highlighted code patterns, filterable question lists, and strategy game plans.

## Pages

| Company | Route | Format | Timer |
|---------|-------|--------|-------|
| Bank of America | `/bofa` | HireVue OA — Self-Intro + 2 Coding + Explanation Video + Fitment | 90 min |
| Allstate | `/allstate` | Recruiter Screen → Technical Coding → Pair Programming/TDD Round | 60 min |
| Shutterfly | `/shutterfly` | Phone Screen → 2 Technical (Java + Architecture) → Managerial | 60 min |
| Chmura | `/chmura` | Phone → Skills Test → Panel (Angular/TypeScript/RxJS/Signals) | 60 min |
| Lowe's | `/lowes` | 3 Technical Panels — Java 8, Microservices/Kafka, Database | 90 min |
| Truist | `/truist` | Java, SQL, Banking Domain Focus | 60 min |
| Infosys | `/infosys` | Full-Stack Knowledge Base (no timer) | — |
| Wells Fargo | `/wellsfargo` | Phone → HackerRank → 2-3 Technical → Behavioral Panel | 60 min |

## Tech Stack

- **Astro 5** — Static site generation with component islands
- **React 19** — Interactive components (Timer, SearchFilter) hydrated with `client:load`
- **Shiki** — Build-time syntax highlighting (zero runtime JS for code blocks)
- **TypeScript** — Type-safe data files and components
- **Content Collections** — Astro content collections for Infosys markdown Q&A

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── layouts/
│   └── CheatsheetLayout.astro    # Shared layout (header, tabs, timer, search)
├── components/
│   ├── TabNavigation.astro       # Tab bar with keyboard nav
│   ├── PatternCard.astro         # Code pattern card with Shiki highlighting
│   ├── QuestionCard.astro        # Filterable question card
│   ├── GamePlanPanel.astro       # Time allocation + strategy cards
│   ├── QACard.astro              # Expandable Q&A accordion (Infosys)
│   ├── Timer.tsx                 # Countdown timer (React island)
│   └── SearchFilter.tsx          # Card filter (React island)
├── pages/
│   ├── index.astro               # Landing page
│   ├── bofa.astro
│   ├── allstate.astro
│   ├── shutterfly.astro
│   ├── chmura.astro
│   ├── lowes.astro
│   ├── truist.astro
│   ├── wellsfargo.astro
│   └── infosys.astro
├── data/
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── bofa.ts
│   ├── allstate.ts
│   ├── shutterfly.ts
│   ├── chmura.ts
│   ├── lowes.ts
│   ├── wellsfargo.ts
│   └── truist.ts
├── content/
│   └── infosys/                  # Markdown content collection (8 topics)
└── styles/
    └── global.css                # CSS custom properties + responsive styles
```

## Features

- **Tabbed navigation** with keyboard arrow key support and ARIA roles
- **Countdown timer** with start/pause/resume state machine
- **Search filter** — case-insensitive substring match on questions/cards
- **Syntax highlighting** — build-time Shiki (Java, SQL, JavaScript, bash)
- **Responsive layout** — single column ≤768px, compact tabs ≤480px, expanded ≥1600px
- **Company branding** — accent colors via CSS custom properties per page
- **Expandable Q&A cards** — click-to-toggle with smooth animation (Infosys)
- **Zero JS for static content** — only Timer and SearchFilter ship JavaScript

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires build first)
npm run build && npm run test:e2e
```
