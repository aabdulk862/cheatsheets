# Bank of America — Experience Mapping

> Interview Format: HireVue OA — 90 min · Self-Intro + 2 Coding (Easy + Medium) + Explanation Video + Fitment  
> Tabs: SQL Patterns | Java/Core Patterns | Likely Questions | Game Plan

---

## Tab 1: SQL Patterns

### Window Functions & Ranking

**UCC-HUB Experience:**
- Designed `extract_category_mapping` table with serial IDs for categorization
- Wrote validation queries using `COUNT(*)` with `GROUP BY` for error volume analysis
- Debugging queries against `job_communication_record`, `job_process_details` tables
- `ROW_NUMBER`, `DENSE_RANK` patterns familiar from data analysis work
- MariaDB (primary), Oracle (legacy) — both SQL dialects

**Interview Talking Point:**
"I work with SQL daily — MariaDB for primary data and Oracle for legacy systems. I've designed categorization tables, written production validation queries, and diagnosed issues like the CPNI duplicate where `queryForObject()` expected 1 row but RCS fallback created 2."

---

### Aggregation & GROUP BY

**UCC-HUB Experience:**
- Error volume queries: `SELECT error_category, COUNT(*) FROM job_communication_record GROUP BY error_category`
- Post-deployment validation: counting records by status, template, channel
- Job processing statistics across batch runs
- BI analytics enablement (9.7M annual records categorized)

**Interview Talking Point:**
"I write aggregation queries for production validation — counting error volumes by category, tracking delivery rates by channel, and verifying batch processing completeness. The error categorization system I built enables BI to aggregate 9.7M annual error records."

---

### Joins & Subqueries

**UCC-HUB Experience:**
- Multi-table queries across `job_communication_record` ↔ `job_process_details` ↔ `job_communication_record_contacts`
- Subqueries for finding duplicate records (CPNI RCS investigation)
- INSERT with subselect patterns for data migration
- Stored procedure integration (proc returns `ID| text` format parsed by Java)

**Interview Talking Point:**
"When debugging the CPNI duplicate issue, I wrote queries joining `job_process_details` with `job_communication_record` to trace how RCS fallback created 2 JPD entries per communication. The fix was a SQL-level `LIMIT 1` with proper ordering."

---

## Tab 2: Java/Core Patterns

### Collections & Streams

**UCC-HUB Experience:**
- `Collectors.toMap()` — discovered null value crash behavior in production (NPE fix)
- `Stream.filter()` + `map()` + `collect()` for Kafka payload transformation
- `Optional` chaining for null-safe field access
- HashMap-based config lookup patterns (error category resolver)

**Interview Talking Point:**
"I diagnosed a production issue where `Collectors.toMap()` crashed on null values. It internally calls `HashMap.merge()` → `Objects.requireNonNull()`. The upstream Kafka payload had null parameter values from the AOM system. Fix: filter nulls before collecting."

---

### OOP & Design Patterns

**UCC-HUB Experience:**
- Strategy Pattern: Dual persistence (JDBC vs JPA) switchable at runtime in Ingestion API
- Template Method: Spring Batch step execution pattern (ItemReader → ItemProcessor → ItemWriter)
- Observer: Kafka consumer → service → downstream notification
- Builder: Complex request/response objects with MapStruct mapping
- Factory: Campaign flow construction from configuration into executable steps

**Interview Talking Point:**
"The Ingestion API uses a strategy pattern for persistence — JDBC for high-performance and JPA for convenience, switchable at runtime via configuration. CPM uses template method through Spring Batch's chunk-oriented processing steps."

---

### Exception Handling

**UCC-HUB Experience:**
- Traced `NullPointerException` across async execution boundaries
- Handled `IncorrectResultSizeDataAccessException` (expected 1, actual 2)
- Custom error handling: categorized 30+ call sites into structured error codes
- Circuit breaker exception routing to parking queues
- Skip/retry policies in Spring Batch for non-fatal exceptions

**Interview Talking Point:**
"I've traced production exceptions across async boundaries where Spring's `@Async` handler swallows them silently. I've also built a structured error categorization system — modifying 30+ catch blocks to attach serial IDs from a DB lookup table."

---

### Multithreading & Concurrency

**UCC-HUB Experience:**
- Spring Batch: 750 core/max threads, 100 partitions
- Async processing: `@Async` with configurable thread pools (20-100 core, 5000 queue capacity)
- Thread pool exhaustion handling: `RejectedExecutionException` → sync fallback
- Concurrent database access with connection pool management (1000 max connections)

**Interview Talking Point:**
"Our Kafka consumers use async processing with configurable thread pools. When the pool is exhausted, a `RejectedExecutionException` triggers synchronous fallback. CPM's batch processing uses 750 threads across 100 partitions with throttling."

---

## Self-Introduction (30 seconds)

"Hi, I'm Adam. I'm a software engineer at Infosys supporting Charter Communications' customer communications platform — 40+ Java 21 and Spring Boot microservices processing millions of messages daily across SMS, Email, RCS, and IVR. I diagnose production incidents, design cross-service features, and manage deployments on AWS EKS. I have my AWS Solutions Architect and Security+ certifications, a BS in IT from George Mason, and I'm excited about Bank of America because the scale and compliance requirements align with the enterprise systems I work on daily."

---

## Fitment / Why BofA

**Talking Points:**
- "The compliance and data integrity requirements in financial services mirror what I see in telecommunications — CPNI (Customer Proprietary Network Information) is our equivalent of PII/financial data protection."
- "I'm attracted to the scale — millions of transactions daily is what I work with now."
- "Enterprise Java at a bank aligns perfectly with my Spring Boot / microservices background."

---

## Gap Analysis

### Strong Matches
- Java 21 (Collections, Streams, OOP, exception handling, concurrency)
- SQL (MariaDB, Oracle, query design, joins, aggregation)
- Production debugging and root cause analysis
- Enterprise-scale system understanding

### Partial Matches
- Data structures (use HashMap/List/Queue daily, but not LeetCode-optimized)
- Algorithm design (applied patterns but need whiteboard practice)

### Weak Areas
- LeetCode Easy/Medium under time pressure (HireVue OA format)
- Dynamic programming problems
- Tree/graph traversal under 20-min time limit

### Suggested Study Topics
1. LeetCode Easy (15 min) + Medium (25 min) timed practice
2. Two-pointer, sliding window, hashmap patterns
3. SQL window functions (DENSE_RANK, ROW_NUMBER, PARTITION BY)
4. String manipulation problems
