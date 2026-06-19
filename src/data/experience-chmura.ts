import type { ExperiencePanelConfig } from './types';

export const chmuraExperience: ExperiencePanelConfig = {
  mappings: [
    {
      topic: 'TypeScript & Type Safety',
      level: 'proficient',
      evidence: [
        'Use TypeScript with strict interfaces for all data structures — every component prop, every data file, every API response has an explicit type',
        'Generics and union types for reusable patterns: TabConfig, PatternCard, QuestionItem all typed',
        'Type-safe React components: Timer.tsx uses typed state machine (idle | running | paused | expired), SearchFilter.tsx has typed DOM attribute queries',
        'Built 8 company-specific data files with consistent type contracts — adding a new company means implementing the same interface',
      ],
      talkingPoint: "I use TypeScript with strict mode everywhere. Every data structure has an explicit interface — PatternCard, QuestionItem, CompanyConfig, ExperiencePanelConfig. When I built this interview prep app, I defined the type contracts first, then each company's data file implements those interfaces. Adding a new company is just implementing the same contract. My React islands use typed state machines — the Timer has four states (idle, running, paused, expired) and the transitions between them are type-safe.",
    },
    {
      topic: 'Component Architecture & UI Patterns',
      level: 'proficient',
      evidence: [
        'Built tabbed navigation with full keyboard support (arrow keys switch tabs) and ARIA roles for accessibility',
        'Timer component implements a state machine: idle → running → paused → expired, with proper start/pause/resume transitions',
        'SearchFilter does real-time filtering by querying data-* attributes on DOM elements — case-insensitive substring match',
        'Led a full migration from jQuery to Astro 5 with React islands for a non-profit site — zero client-side JS on non-interactive pages',
        'Responsive layouts: single column ≤768px, scrollable tabs ≤480px, expanded ≥1600px',
      ],
      talkingPoint: "I've built data-rich component UIs from scratch. This cheatsheet app has tabbed navigation with keyboard arrow-key support and full ARIA roles — screen readers announce tabs correctly. The Timer is a proper state machine with four states and clear transitions. The SearchFilter queries DOM data attributes in real-time for case-insensitive filtering. I also led a migration from jQuery to Astro 5 with React islands for a non-profit — the key architectural decision was making pages zero-JS by default and only hydrating interactive components. Non-interactive pages ship no JavaScript at all.",
    },
    {
      topic: 'REST API Design & Consumption',
      level: 'expert',
      evidence: [
        'Deep understanding from building and consuming APIs across 40+ microservices daily',
        'Multiple auth patterns in production: API Key headers (x-api-key), JWT tokens, Basic Auth, and certificate-based auth for external services',
        'Request validation pipeline: required fields, template resolution, contact validation, conditional mandatory parameters per template type',
        'Operational endpoints: /cache/all broadcasts cache clear to all pods, /config/refresh reloads Spring Cloud Config',
        'Built Postman collections for testing and validation',
      ],
      talkingPoint: "I design and consume REST APIs daily across 40+ microservices. Our Ingestion API has a 9-step validation pipeline: circuit breaker check, maintenance mode check, required field validation, template resolution from DB, contact validation, conditional parameters per template type, data transformation, persistence, and routing. I understand auth patterns in production — we use API Key headers for service-to-service, JWT for user-facing, and certificate-based auth for external partner APIs. I also build operational endpoints — like a cache-clear endpoint that broadcasts to all pods simultaneously.",
    },
    {
      topic: 'Reactive & Event-Driven Patterns (Backend → Frontend Translation)',
      level: 'familiar',
      evidence: [
        'Kafka pub/sub directly maps to Observable subscribe/process/emit patterns',
        'RabbitMQ retry queues with exponential backoff = retryWhen() operator',
        'Circuit breaker state machine (CLOSED → OPEN → HALF_OPEN) = the same finite state pattern used in UI components',
        'Backpressure handling: thread pool exhaustion → sync fallback = the same concept as RxJS backpressure strategies',
        'Event-driven state management: changes propagate through the system reactively, not imperatively',
      ],
      talkingPoint: "While I haven't used Angular Signals or RxJS in production, the patterns map directly to what I do on the backend daily. RxJS Observables = Kafka consumers that subscribe, transform, and emit. retryWhen() with backoff = our RabbitMQ retry queues. Backpressure strategies = our thread pool exhaustion fallback. Circuit breaker state (CLOSED → OPEN → HALF_OPEN) is the same finite state machine pattern I implement in UI components. The mental model translates directly — subscribe to a data source, transform through a pipeline, handle errors per item, retry with configurable backoff.",
    },
  ],
  stories: [
    {
      title: 'Building a Data-Rich Interactive Application',
      prompt: 'Tell me about a complex UI you\'ve built',
      situation: "I needed a comprehensive interview preparation tool — something I could glance at during prep and quickly find code patterns, likely questions, and strategy for each specific company. It needed tabbed navigation (8+ tabs per page), countdown timers for timed interviews, real-time search filtering across hundreds of cards, syntax-highlighted code blocks, and mobile responsiveness. The key constraint: minimize client-side JavaScript because most of the content is static.",
      task: "Build 8 company-specific pages with consistent UX, full accessibility, and near-zero runtime JS for static content — only hydrating interactive pieces.",
      action: "Chose Astro 5 because it renders everything static by default and only hydrates components marked with client:load. Built tabbed navigation with full keyboard support — arrow keys switch tabs, ARIA roles announce correctly to screen readers, tabindex management follows WAI-ARIA authoring practices. The Timer is a React island implementing a proper state machine: idle → running → paused → expired, with start/pause/resume transitions. SearchFilter is another React island that queries data-* attributes on DOM elements for case-insensitive real-time filtering — no re-render of the entire list, just toggling display on existing elements. Used Shiki for build-time syntax highlighting — the code blocks ship as pre-rendered HTML with zero runtime JavaScript. Added a fullscreen toggle button on every code block using the native Fullscreen API. Responsive design with 3 breakpoints: mobile (single column, scrollable tabs), tablet, and desktop (expanded grids). Later added experience mapping panels, system design diagrams (Mermaid rendered client-side on tab activation), and a story router — all following the same pattern of static-first with selective hydration.",
      result: "8 company pages plus a homepage with master experience map. Zero JavaScript for static content. Accessible navigation verified with keyboard-only testing. Mobile responsive with horizontally scrollable tabs at 480px. Timer and SearchFilter are the only pieces that ship JS — everything else is pure HTML/CSS.",
    },
    {
      title: 'Full-Stack Migration (GAMEC)',
      prompt: 'Tell me about modernizing a legacy application',
      situation: "A non-profit organization's website was built with static HTML files and jQuery — about 20+ pages with duplicated headers/footers in every file, no component reuse, manual image handling, and poor Core Web Vitals scores. As the sole technical contributor, I owned all architecture decisions.",
      task: "Lead migration to a modern component-based architecture while maintaining all existing functionality and improving performance.",
      action: "Migrated to Astro 5 with React islands for the few interactive pieces (donation forms, mobile menu). The key architectural decision: pages are zero-JS by default. Only components that actually need interactivity get hydrated. Introduced component-based architecture — shared Header, Footer, Navigation extracted into reusable Astro components so changes propagate everywhere. Build-time rendering for all 20+ pages means no client-side routing or hydration cost. Automated image optimization pipeline: source images converted to WebP at build time with responsive srcset attributes. Critical CSS inlined in the head, non-critical loaded async. XML sitemap generated automatically from page routes. Structured data (JSON-LD) for organization schema. WAI-ARIA compliant navigation with full keyboard support and proper focus management for the mobile hamburger menu.",
      result: "Core Web Vitals improved significantly — largest contentful paint under 1.5s, zero layout shift. Non-interactive pages ship literally zero JavaScript. Component reuse eliminated the duplicated header/footer maintenance problem. Keyboard navigation works end-to-end. Progressive enhancement means the site works without JS entirely.",
    },
  ],
  gaps: [
    { topic: 'TypeScript (strict, interfaces, generics)', status: 'strong' },
    { topic: 'Component architecture (React islands, state machines)', status: 'strong' },
    { topic: 'REST API design & consumption', status: 'strong' },
    { topic: 'Accessibility (ARIA, keyboard navigation)', status: 'strong' },
    { topic: 'Angular Signals (signal, computed, effect)', status: 'weak', note: 'Analogous to React hooks — study Angular-specific API' },
    { topic: 'RxJS operators (switchMap, combineLatest, debounceTime)', status: 'weak', note: 'Know the concepts from backend — study RxJS syntax' },
    { topic: 'Angular Material component APIs', status: 'weak', note: 'Review mat-table, mat-form-field, mat-dialog' },
    { topic: 'Angular control flow (@if, @for, @switch)', status: 'weak', note: 'New template syntax — practice with examples' },
    { topic: 'Vitest with Angular TestBed', status: 'weak', note: 'Familiar with testing concepts — study Angular-specific setup' },
  ],
};
