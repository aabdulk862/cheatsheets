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
      situation: 'Needed a comprehensive interview preparation tool with tabbed navigation, countdown timers, real-time search filtering, syntax-highlighted code, and mobile responsiveness — all while minimizing client-side JavaScript.',
      task: 'Build 8 company-specific pages with consistent UX, accessibility, and performance.',
      action: 'Chose Astro 5 for static rendering with React islands for interactive pieces only. Built tabbed navigation with keyboard/ARIA support. Timer as a state machine component. SearchFilter queries DOM data-attributes for real-time filtering. Shiki for build-time syntax highlighting (zero runtime JS for code blocks). Responsive breakpoints with mobile-first approach. Added fullscreen toggle for code blocks.',
      result: '8 company pages built. Zero JS for static content. Accessible navigation. Mobile responsive with scrollable tabs. Every interactive component (Timer, Search) hydrated only when needed.',
    },
    {
      title: 'Full-Stack Migration',
      prompt: 'Tell me about modernizing a legacy application',
      situation: 'A non-profit site was built with static HTML and jQuery — hard to maintain, poor performance, no component reuse.',
      task: 'Lead migration to modern architecture while maintaining all functionality.',
      action: 'Migrated to Astro 5 with React islands. Component-based architecture. Build-time rendering for 20+ pages. Automated image optimization (WebP). Critical CSS inlining. XML sitemap generation. Structured data (JSON-LD). Zero client-side JS on non-interactive pages.',
      result: 'Improved Core Web Vitals. Zero runtime dependencies on static pages. Component reuse across pages. WAI-ARIA compliant navigation with full keyboard support.',
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
