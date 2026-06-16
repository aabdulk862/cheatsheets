# Master Experience Map

> Every major accomplishment from UCC-HUB mapped to every cheatsheet where it serves as interview evidence.  
> Source of truth: UCC-HUB — Charter Communications/Spectrum via Infosys (Mar 2025–Present)

---

## Platform Context

**Role:** Software Engineer — Infosys (Client: Charter Communications/Spectrum)  
**Platform:** Unified Customer Communications (UCC) Hub  
**Scale:** 40+ Java 21/Spring Boot microservices · millions of messages/day · 31M+ customers · 5 channels (Email, SMS, IVR, RCS, Push) · 15+ upstream source systems · 22+ Kafka consumers · 114M-row primary table (155GB)  
**Infrastructure:** AWS EKS (East/West active-active) · ArgoCD GitOps · Helm · Kafka (3 clusters: Enterprise Kerberos, CCT, Internal) · RabbitMQ (Amazon MQ) · MariaDB Galera Cluster · Oracle (legacy) · Spring Cloud Config · Jasypt · Resilience4j

---

## Technical Depth Rating

| Rating | Technologies |
|--------|-------------|
| **EXPERT** (daily production debugging) | Java 21, Spring Boot 3.x, Spring Cloud Config, Spring Cache, Kafka (22+ consumers), CloudWatch Log Insights, AWS EKS, ArgoCD/GitOps, MariaDB, GitLab CI/CD, Docker |
| **PROFICIENT** (regular production use) | Spring Batch, Spring Cloud Stream, RabbitMQ, MapStruct, Jasypt, Resilience4j, Helm, AWS S3, AWS Pinpoint, Lombok, SQL/Stored Procedures |
| **FAMILIAR** (understand, limited hands-on) | Spring Security, Oracle, Angular, React, Kinesis, SQS, AWS Connect, Kubernetes cluster admin |

---

## Accomplishment Index

### 1. Production Incident: PSA NPE — 16,451 Messages/Hour Saved

**Problem:** `NullPointerException` in `PsaPayloadMapper.templateParamsConversion()` silently dropping PSA outage notifications. `Collectors.toMap()` internally calls `HashMap.merge()` → `Objects.requireNonNull()` — null map values from AOM upstream crash instantly. Spring `@Async` + `SimpleAsyncUncaughtExceptionHandler` swallows the exception — no retry, no DLQ, no alert. Kafka offset committed before crash. Messages permanently lost.

**Root Cause (two vectors):**
1. `Collectors.toMap(TemplateParameter::getName, TemplateParameter::getValue)` — crashes on any null value
2. `parameter.get().getValue().equalsIgnoreCase("Wildfire")` — NPE when outageCauseType exists with null value

**Fix:**
- Vector 1: Replaced `Collectors.toMap()` with manual `HashMap.put()` loop — accepts null values, preserves them for downstream validation (creates failed job record vs. silent drop)
- Vector 2: Yoda condition — `"Wildfire".equalsIgnoreCase(parameter.get().getValue())` — null returns false
- Added `if (templateParameters == null) templateParameters = new ArrayList<>()` guard
- Added `if (tp != null)` guard against null list elements

**Why NOT filter nulls:** Filtering nulls would make messages appear "successful" with incomplete data. Preserving nulls lets downstream `validateTemplateParameters()` catch them and create proper failed job records — trackable in monitoring instead of silently incomplete.

**Testing:** 20 tests covering both NPE vectors, real prod payloads (failing + healthy), edge cases (null lists, empty strings, mixed nulls, minimal payloads), MapStruct integration. Dismissed Amazon Q false positive with documented reasoning.

**Metrics:** ~16,451 msgs/hr → 0 dropped · 25,890 NPEs quantified on peak day · 2nd affected template found beyond ticket scope · Challenged initial RCA (overcounted due to Lombok `toString()` null formatting)

**Deployment:** QA (3 kafka-ingestion-api instances + 3 ingestion-api instances) → UAT (15 ArgoCD values files) → PROD (East/West active-active)

**Evidence:** `Tickets/UCC-29475/`, `Progress/2026/April.md`

| Cheatsheet | Maps To |
|---|---|
| Wells Fargo | Java/Spring Boot (Collectors internals, null safety), Cloud/DevOps (CloudWatch, ArgoCD) |
| Shutterfly | Backend/Architecture (async failure, event-driven debugging), AWS/Infra (CloudWatch) |
| Allstate | TDD (20 tests with real prod data, edge cases), Java/Spring (Collections) |
| Lowe's | Java 8 (Streams/Collectors.toMap null behavior), Microservices/Kafka (consumer failure isolation) |
| Truist | Java (exception handling, defensive coding), SQL (downstream validation patterns) |
| BofA | Java/Core (null safety, Collectors behavior, HashMap internals) |

---

### 2. Cross-Service Error Categorization System — 9.7M Annual Records

**Problem:** BI team couldn't build analytics dashboards on delivery failures. `error_description` in `job_communication_record` (114M rows, 155GB) was freeform text at 75+ call sites across CPM, Ingestion API, and Publisher. No structured categorization existed.

**Design (3 iterations):**
1. ❌ New columns on JCR table — rejected (schema migration on 155GB too risky)
2. ❌ Publisher-only approach — rejected (keep logic in CPM where errors originate)
3. ✅ Pipe-delimited prefix on existing field + ID-based DB lookup

**Solution:** `extract_category_mapping` table (75 rows). Each error site references a hardcoded ID → `getDescription(id)` returns `Category|SubCategory|Rule|`. Final format: `Extraction|Template Error|Template Not Enabled|TEMPLATE/SYSPRINAGENT not enabled`. BI parses with `split("|", 4)`.

**Two integration patterns:**
- Direct call sites (code references ID): `setErrorDescription(getDescription(85) + dynamicText)`
- Proc-originated errors (Gopi): proc returns `ID| error text` → CPM's `resolveProcReason()` parses ID, looks up prefix from DB, builds final string

**Implementation:**
- CPM 3.0.67: `ExtractCategoryConfig.java`, `JobDetailsDAO` with `@Cacheable("extractCategoryMappings")`, 23 call sites in Orchestrator, + ContactPreferenceStep, DMNStep, CommonHelper, PayloadCheckerService
- Ingestion API 3.1.69: `ExtractCategoryRepository`, 7 call sites across TechTrackerEnroute, TechTrackerOrchestrator, PostCommunicationRequestServiceImpl
- Publisher 3.0.20: `TemplateActiveValidator` (ID 86), `ContactValidator` with `resolveProcReason`, child template (ID 85)

**Cross-team coordination:** Gopi (stored procs — 27 IDs), Pete Razo + Shreya Chittari (BI category spreadsheets — changed ID scheme 3 times), Jena + Smruti (arbitration — parallel workstream), Yossi (downstream Kafka DL notification), Praveen + Raghul (QA), Bryan Jones (BA — on hold)

**Metrics:** 42 call sites modified · 75 DB rows · 94 error patterns → 57 rules · 3 services + 2 stored procs · 9.7M annual occurrences categorized · 80% of CPM errors covered in v1

**Evidence:** `Tickets/UCC-21262/`, `Progress/2026/June.md`, `Progress/2026/May.md`

| Cheatsheet | Maps To |
|---|---|
| Wells Fargo | Java/Spring Boot (caching, multi-service design), Cloud/DevOps (multi-repo coordination) |
| Shutterfly | Backend/Architecture (cross-service design, extensible taxonomy, DB-backed config) |
| Allstate | Java/Spring (Spring Cache, clean code across 42 sites), TDD (validation) |
| Lowe's | Microservices (cross-service contract, deployment coordination) |
| Truist | SQL (schema design, stored proc integration), Java (caching patterns) |
| BofA | SQL (table design, INSERT generation), Java (design patterns) |

---

### 3. OTP Encryption Pipeline — Security Compliance

**Problem:** OTP verification codes traveled in plaintext through DB, logs, S3, Kafka. Compliance risk.

**Architecture:** Encrypt-at-source / decrypt-at-delivery
- **Ingestion API:** `OtpEncryptionService` wraps value as `ENC(...)` using Jasypt (`PBEWithMD5AndDES`, `NoIvGenerator`)
- **Intermediate services (CPM, Publisher):** Pass encrypted values unchanged — zero modifications
- **PCDP:** `OtpDecryptionService` decrypts at channel delivery
- **S3:** Separate redacted copy (`verify_code: ******`, URLs `_redacted`)
- **Config-driven scope:** `SENSITIVE_TEMPLATE_CONFIG` DB entry (JSON map: template ID → parameter names). `HashMap.contains()` short-circuits 99% non-OTP traffic.
- **Deployment order IS the safety mechanism:** DB → PCDP (can decrypt) → Email Copy Producer (suppresses logs) → Ingestion API (starts encrypting). Reverse = rollback.

**My contribution:** Took UAT/PROD deployment ownership from Shankar Bhaskaran. Found and fixed 5 errors in his deployment runbook:
1. Wrong cache clear URL (`/cache/all` not `/cache/clear`)
2. Wrong rollback SQL (`SET parameter_value = '{}'` not `SET enabled = 0`)
3. Nonexistent `created_by` column in DB INSERT
4. Wrong deployment step order (PCDP must deploy before Ingestion API)
5. PROD West kafka-ingestion has 3 files not 5

**Validation (CloudWatch):** ✅ Encryption at Ingestion · ✅ Decryption at PCDP (all channels) · ✅ S3 redaction · ✅ Log suppression · ✅ Non-OTP unaffected

**Metrics:** 4 OTP templates secured · 5 delivery channels · 22+ Kafka sources covered · O(1) short-circuit for 99% traffic · 5 runbook errors caught · 18-file ArgoCD MR

**Evidence:** `Tickets/UCC-30917/`, `Progress/2026/June.md`

| Cheatsheet | Maps To |
|---|---|
| Wells Fargo | Cloud/DevOps (ArgoCD, multi-region, rollback), Java/Spring Boot (Jasypt) |
| Shutterfly | AWS/Infra (EKS deployment, S3 redaction), Backend (security architecture) |
| Lowe's | Microservices (cross-service feature, deployment order) |
| Truist | Banking Domain (encryption, PII, compliance, deployment rigor) |

---

### 4. CPNI RCS Props-Only Fix — Zero Code Change

**Problem:** `IncorrectResultSizeDataAccessException: expected 1, actual 2` in `CpniRepository.getJpdTableJpdStatus()`. RCS channel was recently enabled for CPNI templates. When RCS fails → SMS fallback creates 2 `job_process_details` rows. Code predated RCS and assumed 1 row.

**Fix:** Props-only — appended `ORDER BY jpd_id DESC LIMIT 1` to externalized SQL in Spring Cloud Config property file. Newest row (SMS fallback) always has correct final status. Zero code changes, zero downtime.

**Challenge:** Discovered undocumented Swarm→EKS migration in QA during validation. Services had migrated without updating docs. Had to find correct log groups, property file naming (`-eks-qa1` suffix), and learn that ArgoCD sync doesn't restart pods for config-only changes.

**Metrics:** ~400 errors/day → 0 · 12 property files updated · Zero code change · Validated across 3 EKS instances

**Evidence:** `Tickets/UCC-27736/`, `Progress/2026/April.md`

| Cheatsheet | Maps To |
|---|---|
| Wells Fargo | Java/Spring Boot (externalized SQL), Cloud/DevOps (props-only hotfix) |
| Truist | SQL (ORDER BY + LIMIT pattern), Banking Domain (zero-risk fix) |
| Lowe's | Microservices (config-driven fix, deployment without code change) |
| BofA | SQL (query contracts, result set handling) |

---

### 5. System Stability Backlog — 14 Prioritized Improvements

**What:** Produced a prioritized 14-item stability/observability backlog from *Release It!* analysis applied to production codebase.

**Key findings:**
- P0: Unbounded `Future.get()` without timeout (thread leak vector)
- P0: Missing circuit breakers on UPC stored proc, Glympse API, MDS push API
- P1: Hand-rolled `CircuitBreakerSingleton` anti-pattern vs Resilience4j
- P1: 20K RabbitMQ queue capacity hides backpressure (should alert, not buffer silently)
- P2: Chunk loss during K8s rolling deploys (no `preStop` hooks — in-flight requests dropped)
- P2: Capacity imbalance (wide ingestion funnel, narrow processing thread pool)
- P3: Data lifecycle (114M rows, 155GB in JCR — no archival, slow degradation)
- P2: Missing distributed tracing (OpenTelemetry)

**Evidence:** `Progress/System-Improvements.md`

| Cheatsheet | Maps To |
|---|---|
| Shutterfly | Backend/Architecture (resilience patterns, capacity planning) |
| Lowe's | Microservices (circuit breakers, deployment strategies, backpressure) |
| Wells Fargo | Cloud/DevOps (Kubernetes deployment, observability) |

---

### 6. Appointment Service Extraction (Monolith → Microservice)

**What:** Extracted Appointment Service from monolithic Tech Tracker codebase into standalone Spring Boot microservice. Removed 4 unnecessary dependency trees (Kafka, S3, Spring Batch, Glympse). Created clean REST + RabbitMQ API contracts. Presented working demo to Director of Engineering.

| Cheatsheet | Maps To |
|---|---|
| Shutterfly | Backend/Architecture (monolith decomposition, bounded contexts) |
| Lowe's | Microservices (extraction strategy, dependency cleanup) |
| Wells Fargo | Java/Spring Boot (clean service design) |

---

### 7. Platform Documentation Rebuild — 6 Service Power Docs

**What:** Created verified reference documentation for 6 core services by reading actual source code. Found 5+ significant errors in team's existing tribal knowledge:
- 22 Kafka consumers (team believed 15)
- SSHJ for SFTP (team believed JSch)
- Arbitration runs TWICE (pre + post enrichment), not once
- Duplicate detection DISABLED in production config
- RCS capability check happens in CPM, not Ready4Delivery

**Impact:** Team has verified reference docs for first time. Pattern established: "verify against code before documenting."

---

### 8. CPNI Delete Notifications — Federal Compliance (UCC-28725)

**What:** Analyzed 5+ repos end-to-end for federal compliance gap (Telecom Act of 1996 — RTSN system didn't notify customers of contact deletions). Key finding: UCC Hub repos are passthroughs — zero code changes needed. Real work is in Handlebars templates.

**Discovered 3 pre-existing bugs:** CPNI Fallout YML mapper bug (`sourceName: ST` vs SQL alias `State`), Dev vs Prod SQL structural difference, cron timezone issue (UTC vs EDT).

**Coordinated with:** 7+ people across 4 organizations (Charter, EDS, Badger/Quality Resource, Template team)

| Cheatsheet | Maps To |
|---|---|
| Truist | Banking Domain (federal compliance, audit requirements) |
| Wells Fargo | Cloud/DevOps (multi-system analysis), Behavioral (cross-org coordination) |

---

## Behavioral Stories (STAR Format)

### Story 1: Production Incident Under Pressure

**S:** 4 months into job, critical PSA outage notifications silently dropping in PROD. No alerts. ~16K customers/hour missed.  
**T:** Take ownership, diagnose root cause, fix, validate.  
**A:** Built understanding from scratch (no prior context). Ran CloudWatch regex queries quantifying 25,890 NPEs/day. Identified two crash vectors in MapStruct-generated code. Challenged initial RCA that overcounted (Lombok toString null formatting). Chose semantically correct fix (preserve nulls) over simpler filter. Dismissed Amazon Q false positive. Wrote 20 tests with real prod payloads. Deployed East/West.  
**R:** Zero messages dropped. 16K msgs/hr restored. Found broader scope than original ticket. Team adopted validation pattern.

---

### Story 2: Cross-Team Collaboration (Error Categorization)

**S:** BI couldn't analyze 9.7M annual delivery failures — freeform text at 75+ sites across 3 services.  
**T:** Design cross-service taxonomy. Coordinate 4+ parallel workstreams (procs, arbitration, BI, QA).  
**A:** Went through 3 design iterations. Settled on ID-based DB lookup with pipe delimiter. Modified 42 call sites across 3 repos. BI changed ID scheme 3 times mid-sprint — remapped all 94 profiles, caught 10 rules BI missed. Designed CPM parsing fix when proc format differed from expectation. Coordinated Gopi, Pete, Shreya, Jena, Smruti, Yossi, Praveen.  
**R:** Full categorization shipping in 06.17 release. BI dashboards enabled for first time.

---

### Story 3: Ownership & Initiative (OTP Handoff + Doc Rebuild)

**S:** OTP feature ready for deployment but senior dev needed to hand off. Existing team docs stale/incorrect.  
**T:** Execute security-sensitive deployment. Also: self-initiated doc rebuild.  
**A:** Validated every runbook step against system state. Found 5 errors (wrong URLs, SQL, columns, order, file counts). Fixed before execution. Separately: rebuilt 6 service docs from source code, found 5+ errors in team's understanding. Established "verify against code" culture.  
**R:** OTP deployed without incident. 5 errors prevented. Team has verified docs for first time.

---

### Story 4: Navigating Ambiguity (CPNI + Undocumented Migration)

**S:** Deploying props-only fix to QA — nothing worked. Discovered undocumented Swarm→EKS migration.  
**T:** Validate SQL property change in environment with incorrect documentation.  
**A:** Discovered migration by investigating missing Portainer services. Found correct EKS property naming. Determined ArgoCD sync doesn't restart pods for config-only changes. Explicitly restarted, confirmed 69→0 errors. Created EKS Deep Dive guide for team.  
**R:** Fix validated. EKS guide prevents future confusion. Demonstrated independent navigation of undocumented state.

---

### Story 5: Technical Disagreement (Preserving Nulls vs. Filtering)

**S:** Two valid approaches to PSA fix. Filter nulls = simpler. Preserve nulls = semantically correct.  
**T:** Choose approach and defend against simpler alternative + Amazon Q automated feedback.  
**A:** Analyzed downstream behavior: filtered nulls = keys missing = message processes as "successful" with incomplete data = no failed job record. Preserved nulls = downstream catches them = proper failed record. Dismissed Amazon Q false positive with documented reasoning.  
**R:** Proper failure tracking preserved. Generic approach handles future null fields without code changes.

---

### Story 6: Leadership/Proactive (Stability Backlog + Dynamic Scheduler POC)

**S:** Platform had undocumented architectural risks. Manager requested dynamic scheduler POC.  
**T:** Identify risks proactively. Design complete POC for another dev to implement.  
**A:** Applied *Release It!* patterns to codebase. Found 14 items (unbounded Future.get, missing circuit breakers, chunk loss on rolling deploy, 114M-row table with no archival). For POC: built full planning package (25 tasks, 6 phases, Mermaid diagrams, class designs, REST API spec, messaging topology). When scope narrowed same-day, adapted immediately.  
**R:** 14-item backlog accepted. POC design package ready for implementation. Demonstrated technical leadership beyond assigned work.

---

### Story 7: Federal Compliance (CPNI Delete Notifications)

**S:** RTSN system violated Telecom Act of 1996 — no customer notification on contact deletions.  
**T:** Analyze full pipeline and determine UCC Hub changes needed.  
**A:** Analyzed 5+ repos end-to-end. Key finding: UCC Hub repos are passthroughs — zero code changes needed (saved engineering cycles). Found 3 pre-existing bugs. Designed dedup pattern. Coordinated 7+ people across 4 organizations.  
**R:** Comprehensive action plan. Zero UCC Hub code changes identified. 3 bugs discovered. Federal compliance gap closed.

---

## System Design Evidence

### Design 1: Extensible Error Taxonomy

**Decision:** Pipe-delimited prefix on existing 155GB table vs. schema migration  
**Rationale:** Zero ALTER TABLE on 114M rows. BI parses with `split("|", 4)`. Old records unaffected (no pipe = uncategorized). Adding new error = INSERT + use ID.  
**Architecture:** ID-based DB lookup → `@Cacheable` → O(1) at runtime. Two integration patterns (direct call sites + proc parsing).

### Design 2: Encrypt-at-Source / Decrypt-at-Delivery

**Decision:** Symmetric Jasypt encryption at earliest point (Ingestion) with decrypt at latest (PCDP delivery)  
**Rationale:** Zero modifications to intermediate services (CPM, Publisher). Deployment order is safety mechanism. Config-driven scope (DB JSON map) — O(1) short-circuit for 99% traffic.

### Design 3: Event-Driven Multi-Channel Platform (Full Architecture)

**Key patterns:** Direct vs Queue mode (feature flag), H2 intermediate processing, multi-region active-active, per-channel priority queues, props-only hotfix pattern (externalized SQL).

### Design 4: Dynamic Job Scheduler (POC)

**Decision:** DB owns *when* (cron + enabled), YAML owns *what* (job config). RabbitMQ fanout ensures all pods receive changes. `ScheduledFuture` cancel + re-register.

---

## Gap Analysis

| Priority | Gap | Study Action |
|----------|-----|-------------|
| HIGH | System design from scratch (greenfield) | Practice "Design a notification platform" drawing on UCC Hub |
| HIGH | LeetCode/DS&A | Medium problems — arrays, hashmaps, trees, graphs |
| HIGH | Concurrency deep-dive (CompletableFuture, virtual threads) | Java 21 patterns beyond @Async |
| HIGH | Testing philosophy (TDD demo, mocking strategy) | Practice live TDD kata, review Mockito advanced |
| MEDIUM | Distributed tracing (OpenTelemetry) | Correlation ID propagation patterns |
| MEDIUM | Kafka producer patterns | Idempotent producers, exactly-once, custom partitioners |
| MEDIUM | Database indexing/EXPLAIN | Composite indexes, covering indexes, query plans |
| MEDIUM | API design from scratch | REST maturity, pagination, rate limiting |
| LOWER | React depth | Only if applying full-stack |
| LOWER | Terraform/IaC | Not used at Charter (Helm/ArgoCD instead) |
| LOWER | NoSQL (Redis, DynamoDB) | Platform is MariaDB-centric |
