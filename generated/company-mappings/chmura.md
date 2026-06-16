# Chmura — Experience Mapping

> Interview Format: Phone → Skills Test → Panel (Angular/TypeScript/RxJS/Signals)  
> Tabs: Angular/Signals | RxJS/State | Data UI Patterns | Likely Questions | Game Plan  
> Product: JobsEQ — cloud-based labor market analytics

---

## Tab 1: Angular/Signals

### Component Architecture

**UCC-HUB Experience (Adjacent):**
- UCC Hub UI is an Angular SPA (campaign management, analytics dashboard, SSO integration)
- Observed component architecture with Tableau integration
- UI API (BFF pattern) serves as dedicated backend for the Angular frontend

**Direct Experience (Other Roles):**
- GAMEC: Component-based architecture with Astro 5 + React islands
- Built reusable components with proper lifecycle management
- TypeScript across all projects (strict typing, interfaces, generics)
- Cheatsheets app: Built with Astro + React (Timer, SearchFilter components)

**Interview Talking Point:**
"I've built component-based architectures in both React and Astro with TypeScript. At Charter, I work alongside an Angular SPA that manages campaigns for 40+ microservices. I'm proficient in TypeScript, understand reactive patterns, and have built interactive data-driven UIs."

---

### TypeScript Proficiency

**UCC-HUB Experience:**
- All cheatsheet data files are TypeScript with strict interfaces (`PatternCard`, `QuestionItem`, `GamePlanConfig`)
- Type-safe component props and data structures
- Used across React islands (Timer.tsx, SearchFilter.tsx)

**Direct TypeScript Usage:**
```typescript
// From this cheatsheet project — type definitions
interface PatternCard {
  title: string;
  lang: string;
  description: string;
  code: string;
  metaTags: string[];
}

interface CompanyConfig {
  slug: string;
  title: string;
  subtitle: string;
  accentColor: string;
  tabs: TabConfig[];
  timerMinutes?: number;
}
```

**Interview Talking Point:**
"I use TypeScript daily — strict interfaces for data structures, generics for reusable components, and type guards for runtime safety. The cheatsheet project I built uses TypeScript for all data files, component props, and React islands."

---

### Signals & Reactive State (Study Area)

**Adjacent Experience:**
- React `useState`/`useEffect` patterns (analogous to signals/effects)
- Computed values in React (`useMemo`) ≈ Angular `computed()`
- Observable patterns from working with event-driven systems (Kafka/RabbitMQ consume → process → emit)
- State management patterns: centralized config, cache invalidation, derived state

**Interview Talking Point:**
"While I haven't used Angular Signals in production, the pattern is directly analogous to what I use in React — `signal()` maps to `useState`, `computed()` to `useMemo`, and `effect()` to `useEffect`. The mental model of fine-grained reactivity also maps to event-driven backend patterns I work with daily."

---

## Tab 2: RxJS/State

### Observable Patterns (Adjacent Experience)

**UCC-HUB Experience:**
- Spring Cloud Stream: reactive message processing (Publisher → Subscriber patterns)
- Kafka consumer groups: same subscribe/process/emit pattern as Observable pipelines
- Backpressure handling: thread pool exhaustion → sync fallback (same concept as RxJS backpressure)
- Error isolation: per-message error handling ≈ RxJS `catchError` per stream
- Retry semantics: RabbitMQ retry queues ≈ `retry()` / `retryWhen()` operators

**Interview Talking Point:**
"My backend work uses the same reactive patterns — subscribe to events, transform through a pipeline, handle errors per item, retry with backoff. RabbitMQ retry queues are the server-side equivalent of `retryWhen()` with exponential backoff. Kafka consumer groups are like shared Observable subscriptions."

---

### State Management

**UCC-HUB Experience:**
- Spring Cache: centralized state with invalidation (equivalent to frontend stores)
- Config Server: centralized configuration consumed by all services
- Circuit breaker state: CLOSED → OPEN → HALF_OPEN (finite state machine)
- Campaign processing state: PENDING → PROCESSING → DELIVERED/FAILED

**Direct Frontend Experience:**
- React state management in Timer component (start/pause/resume state machine)
- SearchFilter component: derived state from user input + DOM queries
- Astro islands: isolated component state with hydration

---

## Tab 3: Data UI Patterns

### Data Visualization & Tables (Adjacent)

**UCC-HUB Experience:**
- Report Generation service: generates CSV/Excel reports with Apache POI
- UCC Hub UI: analytics dashboard with Tableau integration
- Campaign data: tabular data (job records, communication statuses, error categories)
- Experience with large data sets (millions of records, paginated views)

**Direct Experience:**
- Built tabbed navigation with keyboard support and ARIA roles (this cheatsheet app)
- Filterable card lists with case-insensitive search
- Responsive data layouts (tables → cards on mobile)
- Expandable Q&A accordion component with smooth animations

**Interview Talking Point:**
"I've built data-rich UIs — this cheatsheet app has tabbed navigation with keyboard/ARIA support, filterable question lists, and expandable accordions. At Charter, the analytics dashboard presents campaign data across millions of records with filtering and visualization."

---

### REST API Integration

**UCC-HUB Experience:**
- Deep understanding of REST API design (Ingestion API, CPM, Tech Tracker all expose REST endpoints)
- Request/response patterns, validation, error handling
- API versioning, authentication (API key, JWT, Basic Auth)
- Built Postman collections for testing

**Interview Talking Point:**
"I design and consume REST APIs daily. The Ingestion API accepts communication requests with validation, transforms data, and routes downstream. I understand content negotiation, proper status codes, pagination, and authentication patterns."

---

## Behavioral / Culture Fit

### "Why Chmura / Why Frontend?"
"I'm drawn to building tools that make data accessible and actionable. The backend platform I work on processes millions of records — but the UI is where that data becomes useful to humans. I want to be closer to the user experience while bringing my backend understanding of data pipelines and API design."

### "Tell me about a complex UI you've built"
→ This cheatsheet app: "Tabbed navigation with keyboard support, countdown timer with state machine (React island), search filter that queries DOM attributes, syntax-highlighted code blocks with fullscreen toggle, responsive layout with mobile scrolling tabs."

---

## System Design — Chmura Specific

### "Design a Data Dashboard with Filters"

| Chmura Concept | My Experience |
|---|---|
| Dashboard components | Astro components + React islands |
| Reactive filters | SearchFilter with DOM queries + derived state |
| Data tables | Report Generation output + tabular cheatsheet data |
| API integration | REST API consumption patterns (Postman, fetch, service calls) |
| State management | Timer state machine, Spring Cache patterns |
| Accessibility | ARIA roles, keyboard navigation, semantic HTML |

---

## Gap Analysis

### Strong Matches
- TypeScript (daily use, strict interfaces, generics)
- Component architecture (React islands, reusable patterns)
- REST API design and consumption
- Data-driven UI patterns (tables, filters, search)
- Accessibility (ARIA, keyboard nav, semantic HTML)
- State machines (Timer component, circuit breaker patterns)

### Partial Matches
- Angular (observed UCC Hub UI, not daily contributor)
- RxJS (analogous backend patterns, not direct Angular RxJS usage)
- Signals (analogous to React hooks, understand the concepts)
- SCSS (use CSS custom properties, familiar with preprocessors)

### Weak Areas
- Angular Signals syntax (need to practice `signal()`, `computed()`, `effect()`)
- RxJS operators (`switchMap`, `combineLatest`, `distinctUntilChanged`, `debounceTime`)
- Angular Material specific component APIs
- Vitest (used for testing, but need Angular-specific testing patterns)
- Angular control flow (`@if`, `@for`, `@switch`)

### Suggested Study Topics
1. Angular Signals: `signal()`, `computed()`, `effect()`, signal inputs/outputs
2. RxJS core operators: `switchMap`, `combineLatest`, `debounceTime`, `distinctUntilChanged`
3. Angular standalone components + `inject()` pattern
4. Angular Material table, form, and dialog components
5. Vitest with Angular (TestBed alternatives)
