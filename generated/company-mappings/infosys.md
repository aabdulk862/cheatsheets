# Infosys — Experience Mapping (Playbook)

> Format: Full-Stack Knowledge Base (no timer) — Reference Guide  
> Topics: Java | Spring | SQL | React | HTTP | Cloud | Coding | Git

---

## Java

### Collections & Streams

**UCC-HUB Experience:**
- `Collectors.toMap()` null crash in production (HashMap.merge → Objects.requireNonNull)
- Stream pipelines for Kafka payload transformation (filter, map, collect)
- Concurrent collections in multi-threaded batch processing (750 threads)
- `Optional` for null-safe field resolution in MapStruct mappers

**Interview Talking Point:**
"I've hit production issues with Streams that you won't find in textbooks. `Collectors.toMap()` crashes on null map values because it uses `HashMap.merge()` internally. I fixed a bug dropping 16K messages/hour caused by this exact behavior."

---

### Concurrency & Threading

**UCC-HUB Experience:**
- `@Async` with configurable thread pools (20-100 core, 5000 queue capacity)
- `RejectedExecutionException` → synchronous fallback pattern
- Spring Batch: 750 threads, 100 partitions, throttle limit 100
- Connection pool management: 1000 max connections
- `SimpleAsyncUncaughtExceptionHandler` — swallows exceptions silently in async paths

**Interview Talking Point:**
"I traced a production issue where async exceptions were invisible. Spring's `@Async` uses `SimpleAsyncUncaughtExceptionHandler` which only logs — no alerts, no retries, no DLQ. Exceptions thrown in async methods just vanish unless you install a custom handler."

---

### Design Patterns

**UCC-HUB Experience:**
- Strategy: JDBC vs JPA persistence (switchable at runtime)
- Template Method: Spring Batch ItemReader → ItemProcessor → ItemWriter
- Observer: Kafka pub/sub, RabbitMQ message listeners
- Builder: MapStruct object construction
- Chain of Responsibility: CPM orchestrator steps (validation → arbitration → enrichment → delivery)
- Circuit Breaker: Ingestion API message parking

---

## Spring

### Spring Boot

**UCC-HUB Experience:**
- 40+ microservices all on Spring Boot 3.x with Java 21
- `@EnableScheduling`, `@EnableAsync`, `@EnableCaching` combinations
- Spring Cloud Config for externalized configuration
- Spring Security with API Key, JWT, and Basic Auth
- Jasypt encrypted properties (`@EnableEncryptableProperties`)
- Spring profiles for environment separation
- Actuator endpoints for health checks and cache management

---

### Spring Batch

**UCC-HUB Experience:**
- Chunk-oriented processing (500 records per chunk)
- Partitioned steps (100 partitions for parallel processing)
- Skip/retry policies (500 skip limit per job)
- Job restart semantics
- H2 for batch metadata storage
- Fork-based execution in Ready4Delivery (5 forks × 50K records)

---

### Spring Cache

**UCC-HUB Experience:**
- Built error categorization with Spring Cache (`@Cacheable` on repository lookups)
- Cache clear broadcasts (`/cache/all` endpoint hits all pods)
- Named caches: `generic`, `Marketing-generic`, `otherLangDetails`, `childTemplatesOneToMany`
- Cache invalidation strategy during deployments

---

## SQL

### Schema Design

**UCC-HUB Experience:**
- `extract_category_mapping`: id, category, subcategory, description, error_pattern (74+ rows)
- CPM writes to 5 tables atomically: job_communication_record, contacts, template_parameters, scheduled_communication, parked_records
- Multi-table relationships with foreign keys
- Stored procedure integration (output parsing: `ID| text` format)

---

### Query Patterns

**UCC-HUB Experience:**
- `queryForObject()` contract (expects exactly 1 row)
- Aggregation with GROUP BY for error volume analysis
- Multi-table JOINs across communication records
- INSERT generation for seeding configuration tables
- Validation queries for deployment verification

---

### Database Operations

**UCC-HUB Experience:**
- MariaDB Galera Cluster (multi-master replication)
- Oracle (legacy integration)
- Connection pool tuning (1000 max, 200 min idle)
- Liquibase for schema migrations (Communication Templates)
- Production data validation queries

---

## React

### Component Architecture

**Direct Experience:**
- Timer.tsx: Countdown timer with state machine (start/pause/resume/reset)
- SearchFilter.tsx: Case-insensitive DOM attribute search with real-time filtering
- GAMEC: Full Astro 5 + React islands migration from jQuery
- Crocodile: React/Next.js SPAs with Material UI
- Reusable component patterns, prop interfaces, lifecycle management

---

### State Management

**Direct Experience:**
- useState/useEffect patterns in Timer and SearchFilter
- State machines: Timer (idle → running → paused → expired)
- Derived state from DOM queries (SearchFilter reads `data-*` attributes)
- Component-local state without external state library

---

## HTTP

### REST API Design

**UCC-HUB Experience:**
- Ingestion API: POST `/api/v1/communications` (main ingestion endpoint)
- Multiple auth methods: API Key (`x-api-key` header), JWT, Basic Auth
- Request validation with proper error responses
- Content negotiation (JSON primary)
- Rate limiting and request throttling
- Circuit breaker responses (503 when downstream unhealthy)

---

### API Patterns

**UCC-HUB Experience:**
- Pagination (batch job listing with page/size)
- Idempotency (duplicate check in CPM)
- API versioning via URL path
- Health check endpoints (`/actuator/health`)
- Cache clear endpoints (`/cache/all`)
- Async processing (accept → queue → process → callback)

---

## Cloud

### AWS

**UCC-HUB Experience:**
- **EKS**: 31 microservices, East/West clusters, rolling updates
- **CloudWatch**: Log Insights, regex queries, volume analysis
- **S3**: File attachments, sensitive data redaction
- **Pinpoint**: Email, SMS, Push delivery
- **Connect**: IVR delivery
- **Secrets Manager**: Credential management
- **ECR**: Docker image registry
- **Kinesis**: Delivery event streaming (Response Handler)
- **SQS**: SMS status events, DND processing
- **Transfer Family**: Managed SFTP for file ingestion

---

### Kubernetes & GitOps

**UCC-HUB Experience:**
- ArgoCD: branchless GitOps, folder-based environment separation
- Helm: charts + values files per environment
- Rolling updates: `maxSurge: 1, maxUnavailable: 0`
- Multi-region: East/West with traffic-routing
- Resource management: CPU/RAM per service
- Pod scaling: environment-specific replica counts (dev: 1, qa: 2, prod: 5)

---

## Coding

### Patterns from Production

- Null-safe collection processing (filter before collect)
- Yoda conditions for NPE prevention
- Error categorization (serial ID lookup → prefix → description)
- Dual strategy pattern (runtime-switchable implementations)
- Fork-based parallel processing with throttling
- Config-driven behavior (feature flags via database tables)

---

## Git

### GitOps Workflow

**UCC-HUB Experience:**
- GitLab for source code (feature/release branches)
- ArgoCD watches `main` branch of `ucc-argo-applications` repo
- Branchless deployment model (folder-based environment separation)
- MR workflow: feature branch → code review → merge to release → build → deploy
- Rollback via Git revert (preferred for audit trail)
- 15+ files updated per release in values repo

---

## Gap Analysis

### Strong Matches (Direct Daily Experience)
- Java 21, Spring Boot, Spring Batch, Spring Cache, Spring Cloud Config
- Kafka, RabbitMQ, event-driven architecture
- AWS (EKS, CloudWatch, S3, Pinpoint, SQS, Kinesis)
- SQL (MariaDB, Oracle, schema design, queries)
- REST API design and implementation
- Kubernetes, ArgoCD, Helm, GitOps
- Git workflows, CI/CD
- Production debugging, incident response

### Partial Matches
- React (GAMEC, Crocodile, cheatsheet project — not daily)
- HTTP deep internals (use daily but may need to review caching headers, CORS details)
- Coding puzzles (applied patterns but need LeetCode practice)

### Study Areas
- LeetCode patterns: arrays, strings, hashmaps, trees, graphs
- HTTP caching headers, CORS, preflight requests
- React advanced patterns (custom hooks, context, suspense)
