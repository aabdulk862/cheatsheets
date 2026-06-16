# Truist — Experience Mapping (Deep)

> Interview: Recruiter Screen → Technical Interview(s) · Java, SQL, Banking Domain Focus  
> Tabs: Java/SQL Patterns | Banking Domain Patterns | Likely Questions | Game Plan

---

## Java/SQL Patterns

### Core Java — EXPERT

**OOP in Production:**
- Polymorphism: Single CPM pipeline handles 5 delivery channels (SMS, Email, RCS, IVR, Push) through common interface — each channel has own validation, formatting, and delivery adapter
- Strategy Pattern: Dual persistence (JDBC `NamedParameterJdbcTemplate` for high-performance batch vs JPA for single-record convenience), runtime-switchable via `JDBC_MODE` config
- Template Method: Spring Batch step hierarchy — ItemReader → ItemProcessor → ItemWriter with customizable implementations
- Chain of Responsibility: CPM Orchestrator 14-step pipeline (validation → arbitration → contact preference → DMN → enrichment → template selection → delivery)
- Builder: Complex job record construction with 40+ fields across 5 related tables

**Exception Handling at Scale:**
- Built error categorization across 42 call sites — each `catch` block now references a serial ID from `extract_category_mapping` and builds structured prefix: `Category|SubCategory|Rule|original error`
- Traced `NullPointerException` across `@Async` boundaries where Spring swallows exceptions
- `IncorrectResultSizeDataAccessException` from `queryForObject()` when RCS created 2 rows (expected 1)
- Spring Batch: 500 skip limit per job — non-fatal exceptions skip individual records without killing the batch
- Circuit breaker exception routing: CPM unhealthy → park to RabbitMQ → replay when healthy
- Identified non-functional `@TimeLimiter(1s)` on private method (Spring AOP proxy limitation)

**Talking Point:** "I built a structured error categorization system across 3 services. Each of the 42 error-generating call sites now references a serial ID from a database table. The system lookups the ID via `@Cacheable`, builds a pipe-delimited prefix (`Category|SubCategory|Rule|`), and prepends it to the error description. BI parses it with `split('|', 4)` for dashboards on 9.7M annual failures."

---

### SQL — PROFICIENT

**Schema Design:**
```sql
CREATE TABLE extract_category_mapping (
    id INT PRIMARY KEY,
    error_description VARCHAR(500) NOT NULL
);
-- 75 rows. IDs are non-contiguous (ownership: Gopi 10-15, 32, 36-65; Code 24-31, 34-35, 66-105)
```

**Multi-Table Writes (atomic):**
CPM writes 5 tables per communication record in a single transaction:
1. `job_communication_record` (main record — 114M rows, 155GB)
2. `job_communication_record_contacts` (per-channel contacts with priorities)
3. `job_commn_record_template_parameter` (enriched parameters)
4. `scheduled_communication_details` (scheduled messages)
5. `arbitration_parked_records` (delayed communications)

**Query Fix (props-only, zero code):**
- Problem: `queryForObject()` expected 1 row, RCS fallback created 2 in `job_process_details`
- Fix: Appended `ORDER BY jpd_id DESC LIMIT 1` to externalized SQL in Spring Cloud Config
- Validation: 69 errors/day → 0 immediately after pod restart

**Stored Procedure Integration:**
- `usp_preference_data_denormalization_fetch_merge` — ~2000-line proc with 13 contact strategies
- Proc returns `ID| error text` format — CPM's `resolveProcReason()` parses ID, looks up prefix from DB, builds final categorized string

**Advanced Patterns Used:**
- GROUP_CONCAT aggregation in Ready4Delivery reader (semicolon-delimited contacts per record)
- Modulo partitioning: `jcr_id % forkCount = offset` for parallel processing
- Time-window filter: `created_timestamp > NOW - interval` for incremental processing
- INSERT generation for 75 rows with cross-referenced IDs across teams

**Talking Point:** "I fixed a production SQL issue with zero code changes. The query was externalized in Spring Cloud Config, so I appended `ORDER BY jpd_id DESC LIMIT 1` to the property and restarted pods. Went from 69 errors/day to 0 instantly. This props-only hotfix pattern lets us fix production queries without a full build/deploy cycle."

---

### Spring Data Access — EXPERT

**Production Evidence:**
- `JdbcTemplate.queryForObject()` contract: expects exactly 1 row, throws on 0 or 2+
- Dual persistence: JDBC (high-performance batch inserts via `NamedParameterJdbcTemplate`) vs JPA (convenience for single-record operations)
- HikariCP connection pools: 1000 max (CPM), 200 max (Ingestion), 50 max (UPC secondary)
- Spring Batch chunk-based transaction management (500 records per commit)
- Chained Transaction Manager: coordinates DB commit + RabbitMQ publish atomically per chunk
- `@Cacheable` on repository for O(1) config lookups (extract_category_mapping)
- Jasypt encrypted database credentials via `@EnableEncryptableProperties`

---

## Banking Domain Patterns

### Compliance & Security (CPNI ↔ Banking PII)

**Production Evidence:**
- **CPNI** (Customer Proprietary Network Information) — federally regulated under Telecom Act of 1996. Same legal weight as PII/financial data.
- Built compliance notification analysis for contact deletions (UCC-28725): RTSN system only notified on adds/updates — deletions violated federal requirements. Analyzed 5+ repos, coordinated 4 organizations.
- **OTP Encryption:** Jasypt symmetric encryption at ingestion → encrypted through pipeline → decrypt at delivery → redact in S3. Deployment order is safety mechanism (PCDP must decrypt before Ingestion encrypts).
- **DND (Do-Not-Deliver):** Legally-required opt-out compliance. SMS keywords (STOP, QUIT, CANCEL) → DND Management Service → CPM enforcement.
- **Delivery Response Tracking:** Full audit trail from ingestion through delivery. Every communication has correlation ID tracked across services.
- **Found 3 pre-existing bugs** during compliance analysis: YML mapper bug, Dev vs Prod SQL difference, cron timezone issue

**Talking Point:** "I've worked on federal compliance requirements — CPNI is telecom's equivalent of financial PII, regulated under the Telecom Act of 1996. I analyzed an end-to-end compliance gap where contact deletions weren't generating customer notifications. The key finding was that UCC Hub repos needed zero code changes — saving engineering cycles — while identifying 3 pre-existing bugs in the process."

---

### Transaction Processing Equivalent

| Banking Concept | UCC-HUB Implementation |
|---|---|
| Transaction validation | 9-step ingestion validation pipeline |
| Payment processing | Multi-stage: validate → enrich → arbitrate → deliver |
| Idempotency | Duplicate check step in CPM (`PayloadCheckerService`) |
| ACID guarantees | CPM writes 5 tables atomically. Chained TM: DB + RabbitMQ. |
| Audit trail | Every record tracked ingestion → enrichment → delivery → response |
| Multi-channel | 5 channels: Email, SMS, IVR, RCS, Push |
| Rate limiting | Throttle limits (100-200 concurrent), chunk sizes (500) |
| Settlement/reconciliation | Report Generation service: CSV/Excel reports, SMDH file exchange |

---

### Change Management (Banking-Grade)

**Production Evidence:**
- MOPs (Method of Procedure) for every production release
- Rollback procedures per feature per service
- UAT validation gates before production promotion
- Multi-region deployment with traffic-routing (failover East↔West)
- Post-deploy CloudWatch validation queries per feature
- Change Request (CR) process for production changes
- Found 5 errors in senior dev's deployment runbook — corrected before production execution
- Deployment order as safety mechanism (OTP encryption sequence)
- Cherry-pick branching for hotfix deploys

**Talking Point:** "Every production deployment follows structured change management: MOP with ordered steps, rollback procedures per service, UAT validation, multi-region traffic-routing during rolling updates, and post-deploy CloudWatch queries to confirm each feature. For OTP, I found 5 errors in the existing runbook and corrected them before production — including a deployment order issue that could have shown customers encrypted text."

---

## Behavioral (if asked)

### "Tell me about attention to detail saving a production issue"
→ **OTP Runbook Errors:** Found 5 errors (wrong cache URL, wrong rollback SQL, nonexistent DB column, wrong deploy order, incorrect file count) in senior dev's runbook. Any of these could have caused customer-visible `ENC(...)` text or failed rollback.

### "Tell me about compliance-sensitive work"
→ **CPNI Federal Compliance (UCC-28725):** Telecom Act of 1996 requirement. Analyzed 5+ repos, coordinated 7+ people across 4 organizations, found 3 pre-existing bugs, determined UCC Hub needed zero code changes.

### "Tell me about a zero-risk production fix"
→ **CPNI JPD Props-Only Fix:** `ORDER BY + LIMIT 1` appended to externalized SQL property. Zero code change, zero downtime, 69→0 errors. Chose lowest-risk path deliberately.

---

## Gap Analysis

### Strong Matches
- Java 21 (OOP, exception handling, collections, concurrency config)
- SQL (MariaDB, schema design, stored proc integration, externalized SQL)
- Spring Boot / Spring JDBC / Spring Batch / Spring Cache
- Compliance-grade deployments (MOPs, rollback, validation, audit)
- Multi-stage processing pipelines (14-step orchestrator)
- Production debugging and root cause analysis
- Change management rigor

### Partial Matches
- Banking domain specifics (CPNI ≈ PII, know compliance patterns, not banking-specific regs)
- Financial calculations (BigDecimal not daily task)
- ACID guarantees (use transactions, not distributed 2PC)

### Study Priorities
1. Banking terminology: ACH, wire, FedNow, BSA/AML, SOX, GLBA basics
2. Java BigDecimal precision patterns for financial calculations
3. Banking SQL: account balance queries, transaction history, audit tables
4. Distributed transaction patterns (saga, outbox, compensating transactions)
