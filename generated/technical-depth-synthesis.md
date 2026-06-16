# Adam — UCC Hub (Charter Communications via Infosys) Interview Synthesis

**Role**: Java Backend Engineer | **Duration**: Nov 2025 – Present (7 months)
**Platform**: Unified Customer Communications Hub — millions of daily messages (Email, SMS, IVR, RCS, Push) to 31M+ Charter/Spectrum customers

---

## 1. Technical Depth Map

### EXPERT — Daily production use with deep debugging

| Technology | Evidence |
|------------|----------|
| **Java 21** | Daily coding across 4 repos; deep `Collectors.toMap()` null semantics, `HashMap.put()` vs `merge()` behavior, MapStruct generated code analysis, Spring `@Async` exception handling |
| **Spring Boot 3.x** | Core framework for all services; `@Cacheable` with proxy self-invocation awareness, `@RefreshScope`, `ApplicationReadyEvent`, `@Value` injection, Bean Validation, multi-datasource `@Qualifier` |
| **Spring Cloud Config** | Externalized SQL in properties, Jasypt-encrypted config, per-environment property files (12-18 files per deployment), config refresh + pod restart patterns |
| **Spring Cache (`@Cacheable`)** | Designed and implemented caching for extract_category_mapping across 3 services; understood proxy self-invocation limitation; CacheConfig registration |
| **Kafka** | 22+ consumer beans analyzed/modified; consumer groups, Spring Cloud Stream bindings, batch mode (max.poll.records: 500), account-based partitioning, DL notification for downstream format changes |
| **AWS CloudWatch Log Insights** | Daily production debugging tool; regex `parse`, `stats count() by`, cross-instance validation, prod incident RCA (25,890 NPEs quantified), before/after deployment verification |
| **AWS EKS** | Multi-region (East/West) deployments, pod restarts for config changes, log group naming patterns, resource limits (4-5 CPU, 2-3Gi), liveness/readiness probes |
| **ArgoCD / GitOps** | Branchless image-tag promotion across environments; App-of-Apps pattern; manual sync for config-only changes; 18-file MRs across multi-region values files |
| **MariaDB** | Schema design (extract_category_mapping), query optimization (ORDER BY + LIMIT fix), externalized SQL, Galera Cluster awareness (East/West active-active), HikariCP tuning (1000 pool), 114M-row table analysis |
| **GitLab CI/CD** | Pipeline orchestration (Deploy DB Only, Deploy Template Version, etc.); cherry-pick branching for hotfix deploys; MR workflows across 4+ repos |
| **Docker** | OpenJDK 21 slim images, ECR push/pull, container health checks, JVM container support flags (`-XX:MaxRAMPercentage=75.0`) |

### PROFICIENT — Regular use in production work

| Technology | Evidence |
|------------|----------|
| **Spring Batch** | Deep understanding of CPM/CMF/CMIP pipeline (partitioned jobs, gridSize 10-40, H2 intermediate processing, CompositeItemProcessor/Writer, step listeners); modified Orchestrator (23 call sites), analyzed ~2000-line stored proc; documented 5 services |
| **Spring Cloud Stream** | Understood Kafka binding configuration, consumer group management, batch mode settings; modified consumers but didn't architect new bindings from scratch |
| **RabbitMQ / Amazon MQ** | Understood queue topology (per-channel priority queues, DLQ, retry with exponential backoff), inter-service communication patterns (CMF→CMIP, CPM→R4D), queue vs direct traffic mode; proposed circuit breaker on R4D publish |
| **MapStruct** | Deep debugging of generated impl code; understood `componentModel="spring"`, `unmappedTargetPolicy=IGNORE`, `qualifiedByName`, `expression="java(...)"` |
| **Jasypt** | Implemented OTP encryption/decryption pipeline; `PBEWithMD5AndDES`, `NoIvGenerator`, `StringEncryptor`, `@EnableEncryptableProperties`, env-var password management |
| **Resilience4j** | Identified missing circuit breakers, proposed 14-item improvement backlog; understood `@CircuitBreaker`, `@Retryable` with exponential backoff; found non-functional `@TimeLimiter`; identified hand-rolled CircuitBreakerSingleton anti-pattern |
| **Helm** | Chart structure (Chart.yaml, values.yaml, templates), OCI artifact dependencies (`helper-chart`), value file management per environment/region |
| **AWS S3** | Dual-copy pattern (delivery + redacted archival), ONEZONE_IA storage class, S3 redaction for PII, GPG encryption for CMF files |
| **AWS Pinpoint** | Template management (Handlebars HTML/text), delivery event streams via Kinesis, SMS opt-out via SNS→SQS fan-out; migration planning to Infobip |
| **Lombok** | Daily use (`@Slf4j`, `@Data`, `@RequiredArgsConstructor`); debugged `toString()` null representation issue in prod RCA |
| **SQL / Stored Procedures** | Analyzed ~2000-line fetch proc (13 contact strategies); designed DB schemas; wrote validation queries; coordinated proc format integration |

### FAMILIAR — Understand concepts, limited hands-on

| Technology | Evidence |
|------------|----------|
| **Spring Security** | Understands JWT/API Key auth, RBAC model, certificate-based auth in platform docs; no direct implementation evidence |
| **Spring Batch (authoring new jobs)** | Deeply understands existing jobs but didn't create new batch jobs from scratch; designed dynamic scheduler POC |
| **Oracle** | Understands UPC legacy schema exists; no direct Oracle query work shown |
| **AWS Connect** | Knows IVR delivery via Kinesis stream listener; no direct implementation |
| **AWS Kinesis** | Understands PinpointStreamListener, AwsConnectStreamListener patterns; no new stream work |
| **AWS SQS** | Understands RcsQListener (5s poll), DND opt-out fan-out; no new queue creation |
| **AWS Secrets Manager** | Knows integration via External Secrets Operator; uses env vars from it |
| **Angular 9 / TypeScript** | Role restructure (13→9 roles), landing-page component, menu system, NgRx store awareness; limited to one feature |
| **React** | Listed in project stack (Timer, SearchFilter components in cheatsheet app); no production evidence at Charter |
| **Resilience4j (advanced)** | Proposed improvements but didn't implement new circuit breakers in production |
| **Kubernetes (cluster admin)** | Uses EKS as deployer; doesn't manage cluster infrastructure, networking, or RBAC |

---

## 2. Accomplishments (Ordered by Interview Impact)

### 1. Production Incident: PSA NullPointerException — 16,451 Messages/Hour Saved (UCC-29475)

**1-line**: Fixed a `Collectors.toMap()` null-value crash dropping ~16K messages/hour from PSA outage notifications in production.

**Full Detail**: PSA (Proactive Service Alerts) Kafka consumer used `Collectors.toMap()` which internally calls `HashMap.merge()` → `Objects.requireNonNull()` — null map values caused NPE. The error was caught by Spring `@Async`'s `SimpleAsyncUncaughtExceptionHandler` which only logs (no retry, no DLQ, no alert), so messages silently dropped. Adam analyzed the full call chain via MapStruct-generated impl, ran CloudWatch queries quantifying 25,890 NPEs in one day, discovered a second affected template not in the original ticket, challenged the initial RCA (which overcounted due to Lombok `toString()` null formatting), and implemented a `HashMap.put()` loop that preserves null values for proper downstream validation (creates failed job records vs. silent drops). Wrote 20 tests covering both NPE vectors with real prod payloads.

**Metrics**: ~16,451 dropped messages/hour → 0; 25,890 NPEs on peak day; 20 unit tests; fix deployed through QA→UAT→PROD in 3 weeks; 2nd template found beyond ticket scope.

**Technologies Proven**: Java 21 (Collections internals), MapStruct, Spring @Async, Kafka consumers, CloudWatch Log Insights, ArgoCD deployment, Lombok.

**Behavioral Angle**: Ownership (took critical incident as new hire), Leadership (challenged flawed RCA, found broader scope), Technical Depth (chose semantically correct approach over simpler filter).

---

### 2. Cross-Service Error Categorization System (UCC-21262)

**1-line**: Designed and implemented a structured error taxonomy across 3 microservices and 2 stored procedures, enabling BI dashboards to slice 9.7M annual failure records by category.

**Full Detail**: BI team couldn't analyze delivery failures because `error_description` was freeform text at 75+ call sites across CPM, Ingestion API, and Ready4Delivery Publisher. Adam went through 3 design iterations (new columns → publisher approach → pipe delimiter), settling on an ID-based DB lookup with `extract_category_mapping` table. Each error-generating call site references a hardcoded ID; proc-originated errors return `ID| text` format parsed by services. Used Spring `@Cacheable` for O(1) lookups. Modified 42 code-level call sites across 3 repos, designed 74 DB rows mapping 94 error patterns to 57 rules. Coordinated 4+ parallel workstreams (stored procs, arbitration, BI parsing, QA).

**Metrics**: 42 call sites modified; 74 DB rows; 94 error patterns → 57 rules; 3 services + 2 stored procs; 9.7M annual occurrences categorized; 80% of CPM errors covered; targeting 06.17.2026 release.

**Technologies Proven**: Spring @Cacheable, MariaDB schema design, multi-repo coordination, ArgoCD GitOps, cherry-pick branching, Kafka DL notification, stored procedure integration.

**Behavioral Angle**: Ambiguity (3 design iterations, scope changed mid-flight, BI changed ID scheme), Leadership (end-to-end ownership across teams), Collaboration (coordinated Gopi/BI/QA/arbitration team).

---

### 3. OTP Encryption Pipeline — Security Compliance (UCC-30917)

**1-line**: Took deployment ownership of encrypt-at-source/decrypt-at-delivery pipeline protecting OTP codes across 5 channels, finding and fixing 5 errors in the senior dev's runbook.

**Full Detail**: OTP verification codes traveled in plaintext through DB, logs, S3, Kafka. Solution: Jasypt encryption at ingestion → encrypted through pipeline → decrypt at PCDP delivery → redact in S3 archival copies. Adam took UAT/PROD deployment ownership from senior dev Shankar, validated all 5 QA checkpoints via CloudWatch, identified gaps (Push path missing decrypt, no unit tests for OtpDecryptionService), and found 5 errors in the deployment runbook (wrong cache URL, wrong rollback SQL, nonexistent DB column, wrong deployment order, incorrect file count). Deployment order is critical: if Ingestion encrypts before PCDP can decrypt, customers see `ENC(...)`.

**Metrics**: 4 OTP templates secured; 5 delivery channels protected; 22+ Kafka sources covered; O(1) short-circuit for 99% non-OTP traffic; 5 runbook errors caught; 18-file ArgoCD MR.

**Technologies Proven**: Jasypt symmetric encryption, encrypt-at-source/decrypt-at-delivery pattern, multi-region active-active deployment, ArgoCD, Spring Cloud Config, S3 redaction, CloudWatch validation.

**Behavioral Angle**: Ownership (took over from senior dev), Leadership (validated everything, found 5 runbook errors), Quality (identified test gaps proactively).

---

### 4. Props-Only Production Fix: CPNI JPD Query Crash (UCC-27736)

**1-line**: Fixed a production query crash (RCS dual-row bug) with a zero-code, props-only SQL change — 69→0 errors immediately.

**Full Detail**: `queryForObject` crashed with `IncorrectResultSizeDataAccessException` when RCS fails and SMS fallback creates 2 JPD rows for the same job_id. Code predated RCS enablement. Fix: append `ORDER BY jpd_id DESC LIMIT 1` to externalized SQL property — newest row (SMS fallback) always has the correct final status. Validated against 6 edge cases with live prod data. Navigated undocumented Swarm→EKS migration in QA (services had migrated without documentation updates). Created comprehensive EKS Deep Dive guide for team.

**Metrics**: ~400 errors/day in prod → 0; 12 property files updated; zero code changes; zero downtime; QA validated across all 3 EKS instances.

**Technologies Proven**: Spring Cloud Config externalized SQL, MariaDB query optimization, props-only hotfix strategy, CloudWatch validation, ArgoCD pod restart for config changes.

**Behavioral Angle**: Ambiguity (navigated undocumented Swarm→EKS migration), Ownership (created EKS Deep Dive for team), Risk Management (chose lowest-risk fix path).

---

### 5. System Stability Backlog — 14 Prioritized Improvements

**1-line**: Produced a prioritized 14-item stability/observability backlog derived from *Release It!* analysis applied to production codebase.

**Full Detail**: Identified architectural risks including: unbounded `Future.get()` without timeout (thread leak), missing circuit breakers on UPC proc/Glympse/MDS, hand-rolled `CircuitBreakerSingleton` vs Resilience4j, 20K RabbitMQ queue as visibility problem, chunk loss during K8s rolling deploys (no preStop hooks), capacity imbalance (wide ingestion, narrow processing), data lifecycle as slow-motion stability killer (114M rows, 155GB in JCR).

**Metrics**: 14 items across P0-P3; estimated effort from hours to sprints; covers CPM, Ingestion API, Ready4Delivery, all services.

**Technologies Proven**: Resilience4j patterns, Spring Batch thread pool analysis, Kubernetes deployment strategies, RabbitMQ queue management, distributed tracing concepts, capacity planning.

**Behavioral Angle**: Leadership (proactive proposals beyond assigned work), Ownership (deep codebase analysis finding real risks), Technical Vision (synthesized book knowledge with production patterns).

---

### 6. Platform Documentation Rebuild — 6 Service Reference Docs

**1-line**: Created verified reference documentation for 6 core services, discovering multiple inaccuracies in existing tribal knowledge.

**Full Detail**: Built comprehensive "Power Docs" for Ingestion API, CPM, CMF, Ready4Delivery, CMIP, and DND Management Service. Verified every claim against actual codebase — found 5+ significant errors in existing understanding (22 consumers not 15, SSHJ not JSch, arbitration runs twice not OR, duplicate detection DISABLED, RCS check in CPM not R4D). Also rebuilt stale CMF documentation from scratch (previous docs 1+ year outdated).

**Metrics**: 6 service docs; 15+ documentation artifacts total; 5+ corrections to team's existing understanding.

**Technologies Proven**: Full-stack comprehension (Java, Spring Batch, Kafka, RabbitMQ, S3, SSHJ, Resilience4j, Kubernetes).

**Behavioral Angle**: Ownership (verified everything against code), Leadership (created shared knowledge for team), Quality (caught real inaccuracies that could cause incidents).

---

### 7. Angular UI Role Restructure

**1-line**: Proposed and implemented RBAC consolidation from 13 roles to 9, preserving all functionality while eliminating redundancies.

**Full Detail**: Started with environment-specific access for COMM_DESK users; pivoted to comprehensive role restructure after stakeholder discussion. Analyzed existing 13-role system, identified redundancies (APPROVER/SENDER overlap), proposed consolidation to 9 roles with full access matrix. Updated landing-page component, menu system, documented complete local dev process.

**Metrics**: 13→9 roles (30% reduction); full access matrix including submenus; DB migration script designed.

**Technologies Proven**: Angular, TypeScript, SQL analysis, stakeholder management.

**Behavioral Angle**: Leadership (proposed consolidation beyond original ask), Adaptability (pivoted scope based on stakeholder input).

---

## 3. Behavioral Stories (STAR Format)

### Story 1: Production Incident — PSA NPE (Ownership Under Pressure)

**Situation**: 4 months into the job, a critical production incident was dropping ~16,451 PSA outage notifications per hour. The initial RCA from another engineer overstated the impact count and missed a second affected template.

**Task**: Take full ownership of the production incident, identify root cause, implement fix, and validate through all environments.

**Action**:
- Built understanding of PSA flow from scratch (no prior context) — traced from Kafka consumer through MapStruct mapper to downstream processing
- Identified the actual root cause: `Collectors.toMap()` → `HashMap.merge()` → `Objects.requireNonNull()` rejects null values
- Challenged the initial RCA: Lombok `@Data` `toString()` prints `value=null` for actual nulls vs `value=)` for empty strings — RCA overcounted by conflating the two
- Discovered a second affected template (`customTemplateName`) not in the original ticket scope
- Chose semantically correct fix: `HashMap.put()` loop preserves null values so downstream creates proper failed job records (vs. filtering nulls which silently drops)
- Dismissed an Amazon Q false positive with clear reasoning during code review
- Wrote 20 comprehensive tests covering both NPE vectors with real production payloads
- Ran CloudWatch queries quantifying 25,890 NPEs on peak day to confirm severity
- Deployed through QA→UAT→PROD with ArgoCD, validating at each stage

**Result**: Zero NPEs after deployment; ~16,451 messages/hour restored; broader scope fixed than original ticket; team adopted the validation pattern for future MapStruct mappers.

---

### Story 2: Cross-Team Collaboration — Error Categorization (UCC-21262)

**Situation**: BI team needed structured error categories across 3 microservices and 2 stored procedures to build dashboards on 9.7M annual delivery failures. No taxonomy existed — 75+ call sites wrote freeform error text. Multiple teams (BI, DB, arbitration, QA, downstream Kafka consumers) all had parallel dependencies.

**Task**: Design and implement a cross-service categorization system that works for both code-originated and stored-proc-originated errors, coordinating 4+ parallel workstreams.

**Action**:
- Investigated the full error landscape: read ~2000-line stored procedure, identified all 30+ `setErrorDescription()` call sites, discovered critical gap (Single API + Kafka bypass CampaignProcessor.process())
- Went through 3 design iterations: new JCR columns (rejected by manager as too complex) → publisher approach (rejected, keep in CPM) → pipe-delimited prefix with ID-based DB lookup (approved)
- Incorporated code review feedback: switched from ConcurrentHashMap to Spring `@Cacheable`
- Coordinated: Gopi (stored procs, format integration), Pete Razo/Shreya (BI category spreadsheets), Jena/Smruti (arbitration — parallel workstream), Yossi (downstream Kafka DL notification), Praveen (QA)
- When BI changed the entire ID numbering scheme mid-implementation, remapped all 94 profiles against 47 rule IDs and caught 10 rules BI missed
- When Gopi's proc returned `ID| error text` instead of expected format, designed CPM parsing fix at QA boundary

**Result**: 42 call sites modified across 3 repos; 74 DB rows; 94 error patterns categorized; coordinated 4+ parallel workstreams to converge on single release (06.17.2026); BI dashboards enabled for first time ever.

---

### Story 3: Ownership/Initiative — Documentation Rebuild + Runbook Corrections

**Situation**: Existing documentation for 6 core services was 1+ years stale. When taking deployment ownership of OTP encryption from a senior developer, the runbook had undiscovered errors that could cause customer-facing incidents.

**Task**: Self-initiated: rebuild documentation from source of truth (code). Assigned: execute UAT/PROD deployment using provided runbook.

**Action**:
- Identified stale docs gap on own initiative — nobody asked for documentation refresh
- Verified every claim against actual codebase, found 5+ significant errors in team's existing understanding (22 consumers not 15, SSHJ not JSch, arbitration logic wrong, duplicate detection disabled)
- Built 6 comprehensive Power Docs for shared reference
- On OTP runbook: didn't blindly follow — validated every step against actual system state
- Found 5 errors: wrong cache URL (`/cache/all` not `/cache/clear`), wrong rollback SQL, nonexistent DB column in INSERT, wrong deployment step order, incorrect PROD West file count
- Fixed runbook before execution, preventing potential customer-visible `ENC(...)` text

**Result**: Team has verified reference docs for first time; prevented potential production incident from runbook errors; established pattern of "validate before execute."

---

### Story 4: Navigating Ambiguity — CPNI JPD Fix (Undocumented Migration)

**Situation**: Deployed a props-only fix to QA but nothing worked. The kafka-ingestion-api had been migrated from Docker Swarm to EKS in QA without updating documentation. The correct log groups, property file locations, and deployment mechanisms were all different from what existing docs described.

**Task**: Deploy and validate a SQL property change that fixes `IncorrectResultSizeDataAccessException` in the CPNI JPD scheduler.

**Action**:
- Discovered the EKS migration by investigating why Portainer (Swarm) showed no running services
- Found correct EKS property file naming (`-eks-qa1`, `-eks-qa2` suffixes)
- Identified correct CloudWatch log group (Chalk docs had discrepancies from reality)
- Determined that ArgoCD sync alone doesn't restart pods for config-only changes — Spring Cloud Config Server requires pod restart to re-pull
- Restarted pod explicitly, confirmed errors stopped
- Validated across all 3 EKS instances using CloudWatch Log Insights (69 errors pre-fix → 0 post-fix)
- Created comprehensive EKS Deep Dive guide for team to prevent others from hitting same blockers

**Result**: Fix validated (69→0 errors); EKS Deep Dive doc prevents future confusion for team; demonstrated ability to navigate undocumented system state independently.

---

### Story 5: Technical Disagreement — Preserving Nulls vs. Filtering (UCC-29475)

**Situation**: The PSA NPE fix had two valid approaches: (A) filter out null values before calling `Collectors.toMap()`, or (B) switch to `HashMap.put()` which accepts nulls. Amazon Q's automated code review also flagged a concern about null handling that was a false positive.

**Task**: Choose the semantically correct fix and defend the decision against simpler alternatives and automated tool feedback.

**Action**:
- Initially considered `.filter(e -> e.getValue() != null)` — simpler, fewer lines, passes all tests
- Analyzed downstream behavior: if null values are filtered out, the template parameter map has missing keys. Downstream code doesn't validate for missing keys — it simply doesn't populate the field. The message processes as "successful" but with incomplete data. No failed job record is created.
- Chose `HashMap.put()` approach: null values stay in map → downstream `validateTemplateParameters()` catches the null → creates proper failed job record with error description → visible in monitoring
- The null field shifted between dates (`outageCause` one day, `uccUpdateType` another) — validated generic approach over field-specific guard
- Amazon Q flagged a potential NPE in the new code. Analyzed the specific path and determined it was unreachable given the MapStruct generated code's execution order. Dismissed with clear inline comment explaining why.

**Result**: Fix preserves proper failure tracking (vs. silent data loss); generic approach handles future null fields without code changes; dismissed false positive with documented reasoning rather than adding unnecessary defensive code.

---

### Story 6: Leadership/Mentoring — Dynamic Job Scheduler POC Design

**Situation**: Manager (Shankar) requested a POC for dynamic cron schedule updates without service restarts. CMF batch jobs run on fixed cron schedules defined in YAML — changing timing requires a full deployment cycle.

**Task**: Design a complete solution architecture for dynamic scheduling that another developer could pick up and implement.

**Action**:
- Built full planning package: gameplan, 25-task breakdown across 6 phases, design doc with Mermaid architecture diagrams, class-level designs, data model, REST API spec, messaging topology
- Key design decision: DB owns *when* (cron expression + enabled status), YAML owns *what* (job config/mappings). Single startup entry point in `SchedulerConfig`. RabbitMQ fanout exchange ensures all pods receive schedule changes uniformly.
- When Shankar narrowed scope (3:17 PM same day) to single-pod minimal demo, adapted immediately without pushback
- Produced deliverable ready for Daniel (POC candidate) or any team member to execute independently

**Result**: Complete design package ready for implementation; demonstrated ability to produce technical leadership artifacts (design docs, task breakdowns, API specs) beyond just writing code; adapted to scope change gracefully.

---

### Bonus Story 7: Federal Compliance Gap — CPNI Delete Notifications (UCC-28725)

**Situation**: RTSN system only notified customers of contact adds/updates — deletions generated no notification, violating Telecom Act of 1996 requirements. Multiple teams involved (EDS owns RTSN, UCC Hub delivers notifications, Badger handles postcards).

**Task**: Analyze the full pipeline and determine what changes UCC Hub needs.

**Action**:
- Analyzed 5+ repos end-to-end (ingestion-api, report-generation, Pinpoint templates, RTSN, Brailleworks)
- Key finding: UCC Hub repos are passthroughs — zero code changes needed. Real work is in Handlebars templates.
- Identified dedup requirement (same-window change+delete would duplicate display text) and designed `{{includes}}` + `{{#unless}}` pattern
- Discovered 3 pre-existing bugs during analysis: CPNI Fallout YML mapper bug (`sourceName: ST` vs SQL alias `State`), Dev vs Prod SQL structural difference, cron timezone issue (UTC vs EDT)
- Formulated precise questions for external EDS team with sample payloads
- Coordinated with 7+ people across 4 organizations (Charter, EDS, Badger/Quality Resource, Template team)

**Result**: Comprehensive 4-phase action plan; identified that UCC Hub needs no code changes (saved engineering cycles); found 3 pre-existing bugs; closed federal compliance gap.

---

## 4. System Design Evidence

### Architecture 1: Multi-Service Error Categorization (Extensible Taxonomy)

**Problem**: How do you add structured metadata to freeform error strings across 3 microservices and 2 stored procedures without schema migration on a 114M-row, 155GB table?

**Design Decisions**:
1. **Prepend vs. new columns**: Chose pipe-delimited prefix on existing `error_description` field. Rationale: zero schema change on 155GB table; BI uses `split("|", 4)` to parse; old records unaffected (no pipe = uncategorized).
2. **ID-based lookup vs. pattern matching**: Hardcoded IDs at error-generation sites + `@Cacheable` DB lookup. Rationale: adding a new error = INSERT row + use ID (vs. maintaining fragile startsWith/contains chains); O(1) lookup after cache load.
3. **Two integration patterns**: Direct call sites (code references ID) vs. proc-originated (proc returns `ID| text`, service parses and resolves). Accommodates code you control vs. stored procs owned by another developer.
4. **Cache strategy**: Spring `@Cacheable` with scheduled eviction. Table is config data (~74 rows), updated infrequently. Each service loads its own cache independently.
5. **Deployment safety**: DB table is inert (old code ignores unknown prefix); deploy order: DB → procs → services; rollback = git revert image tags.

**Scalability Consideration**: If error volume grows, pipe-delimiter approach means no index changes. If categories need hierarchy, add columns to mapping table (code unchanged).

---

### Architecture 2: Encrypt-at-Source / Decrypt-at-Delivery Pipeline (OTP Security)

**Problem**: How do you protect sensitive data (OTP codes) traveling through a multi-service pipeline (Ingestion → CPM → Publisher → PCDP → delivery channel) without modifying every intermediate service?

**Design Decisions**:
1. **Encrypt at earliest point (Ingestion API)**: `OtpEncryptionService` wraps value as `ENC(...)`. Intermediate services (CPM, Publisher) pass through encrypted values unchanged — zero modifications needed.
2. **Decrypt at latest point (PCDP)**: `OtpDecryptionService` decrypts only at channel delivery. If PCDP down, customers never see `ENC(...)` because Ingestion is deployed last.
3. **Config-driven scope**: `SENSITIVE_TEMPLATE_CONFIG` in DB (JSON map of template ID → parameter names). O(1) `HashMap.contains()` short-circuits 99% of traffic. Adding new sensitive templates = DB INSERT + cache clear.
4. **Redaction for persistence**: S3 archival gets `******` replacement. Separate delivery copy has real value. JPD gets `_redacted` suffix.
5. **Deployment order is the safety mechanism**: DB → PCDP (can decrypt) → Email Copy Producer (suppresses logs) → Ingestion API (starts encrypting). Reverse for rollback.
6. **Shared secret via env vars**: Jasypt password in ConfigMap/ExternalSecret, not in config files.

**Trade-offs discussed**: Asymmetric vs. symmetric encryption (chose symmetric — simpler key management for internal pipeline, not public-facing); per-message vs. shared key (chose shared — rotation via env var update + pod restart).

---

### Architecture 3: Event-Driven Multi-Channel Communication Platform (Full System)

**Can discuss in system design interview** (knowledge from operating the system):

```
[15+ Source Systems] → Kafka (22+ topics, account-partitioned)
                    → REST API (Single API path)
                    → SFTP/S3 (Batch files)
                           ↓
              ┌─── Ingestion API (validate, transform, encrypt) ────┐
              │         ↓ (RabbitMQ)                                │
              │    CMF → CMIP → CPM (14-step orchestrator)          │
              │         ↓ (RabbitMQ/REST)                           │
              │    Ready4Delivery Publisher                         │
              │         ↓ (Amazon MQ priority queues)               │
              │    PCDP (decrypt, deliver per channel)              │
              │         ↓                                           │
              │    [Pinpoint/Infobip/Connect] → Customer            │
              │         ↓ (Kinesis/SQS)                             │
              └─── Response Handler (delivery status writeback) ────┘
```

**Key design discussions Adam can lead**:
- **Direct vs Queue mode**: Feature flag controls whether Single API processes synchronously (<100ms) or queues to RabbitMQ (<500ms). Queue mode adds backpressure but higher latency.
- **H2 intermediate processing**: CPM reads campaign data from MariaDB into H2 in-memory DB for batch processing. Avoids repeated remote DB queries during 50K+ records/min processing.
- **Multi-region active-active**: East/West with Galera replication. Deployment strategy: route traffic to opposite region → deploy → verify → switch back.
- **Priority queues per channel**: Amazon MQ routes EMAIL/SMS/IVR/RCS/PUSH to separate queues with DLQ. Prevents one channel's failures from blocking others.
- **Props-only hotfix pattern**: SQL externalized in Spring Cloud Config properties — fix production queries without code build/deploy (demonstrated with CPNI fix).

---

### Architecture 4: Dynamic Job Scheduler (POC Design — Not Implemented)

**Problem**: How do you update batch job schedules across a multi-pod deployment without restart?

**Design**:
- DB table: `schedule_config (id, job_name, cron_expression, enabled, updated_at)`
- REST API: `PUT /schedules/{jobName}` validates cron, updates DB, publishes RabbitMQ fanout
- RabbitMQ fanout exchange: all pods consume uniformly (no partitioning needed)
- Each pod: `SchedulerConfig` at startup registers all jobs; on fanout message, cancels old `ScheduledFuture`, re-registers with new cron
- Separation of concerns: DB owns *when*, YAML owns *what* (job config/mapping files)

---

## 5. Gaps & Study Priorities

### High Priority (Likely asked in Java/Spring Backend interviews)

| Gap | Why It Matters | Study Action |
|-----|---------------|--------------|
| **System design from scratch** | Adam operates/extends existing architecture but hasn't designed a greenfield system | Practice: "Design a notification platform" end-to-end (he can draw on UCC Hub but needs to articulate initial choices) |
| **Concurrency deep-dive** | Understands thread pools/async but no evidence of implementing lock-free structures, CompletableFuture chains, or reactive streams | Study: Java concurrency patterns, CompletableFuture composition, virtual threads (Java 21) |
| **Spring Security implementation** | Platform has JWT/RBAC but Adam hasn't implemented auth flows | Study: Spring Security filter chain, OAuth2/OIDC, JWT creation/validation |
| **Unit/integration testing philosophy** | Writes tests (31+) but no evidence of TDD, mocking strategies, test architecture patterns | Prepare: discuss testing pyramid, @SpringBootTest vs slices, WireMock, Testcontainers |
| **Performance tuning** | Knows thread pool configs but hasn't profiled/optimized performance from scratch | Study: JVM profiling (async-profiler), GC tuning, load testing (Gatling/JMeter) |
| **Data structures & algorithms** | No LeetCode-style evidence | Practice: medium difficulty problems, especially graph/tree problems that map to system design |

### Medium Priority (Asked in senior-level rounds)

| Gap | Why It Matters | Study Action |
|-----|---------------|--------------|
| **Distributed tracing (OpenTelemetry)** | Identified as P2 improvement but hasn't implemented | Study: correlation ID propagation, Jaeger/Zipkin, trace context in Kafka headers |
| **Kafka producer patterns** | Heavy consumer experience but limited producer evidence | Study: idempotent producers, exactly-once semantics, custom partitioners |
| **Database indexing/query plans** | Fixed a query with ORDER BY+LIMIT but no evidence of EXPLAIN analysis or index design | Study: composite indexes, covering indexes, query plan analysis |
| **Kubernetes internals** | Uses as deployer (ArgoCD/Helm) but no evidence of writing operators, understanding scheduling, or network policies | Study: pod lifecycle, init containers, resource quotas, HPA |
| **API design** | Consumes APIs but limited evidence of designing REST/gRPC APIs from scratch | Study: REST maturity model, API versioning, pagination patterns, rate limiting |
| **Microservices patterns (advanced)** | Understands existing saga/CQRS but hasn't implemented | Study: saga orchestration vs choreography, outbox pattern, event sourcing |

### Lower Priority (Nice-to-have depth)

| Gap | Study Action |
|-----|--------------|
| **React/frontend depth** | Only if applying for full-stack roles; Angular experience is shallow |
| **Terraform/IaC** | Not used at Charter (Helm/ArgoCD instead) but common elsewhere |
| **GraphQL** | Not in tech stack; some companies ask about it |
| **NoSQL (Redis, MongoDB, DynamoDB)** | Not in evidence; platform is MariaDB-centric |
| **Message ordering guarantees** | Kafka partitioning exists but no evidence of handling out-of-order or exactly-once semantics |

---

## Summary: Interview Positioning

**Strongest narrative**: "In 7 months, I went from onboarding to owning production incidents, designing cross-service systems, and deploying security-critical features across multi-region EKS clusters — while building the team's documentation foundation and identifying architectural risks nobody was tracking."

**Differentiators**:
1. Production debugging depth (CloudWatch → root cause → fix → validate)
2. Cross-team coordination (4+ workstreams, external teams, BI, QA)
3. Ownership beyond scope (found bugs outside tickets, challenged flawed RCAs, validated senior dev's runbook)
4. Scale context (31M customers, millions of daily messages, 114M-row tables)
5. Full deployment lifecycle (design → code → test → deploy → validate → monitor)
