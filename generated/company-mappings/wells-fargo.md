# Wells Fargo — Experience Mapping (Deep)

> Interview: Phone → HackerRank (2 coding, 40-60 min) → 2-3 Technical → Behavioral  
> Tabs: Java/Spring Boot | React/Angular | Cloud/DevOps | Likely Questions | Game Plan

---

## Java/Spring Boot

### Streams & Collections — EXPERT

**Production Evidence:**
- `Collectors.toMap()` crashes on null values via `HashMap.merge()` → `Objects.requireNonNull()`. Fixed in prod — chose `HashMap.put()` loop over `.filter()` because preserving nulls creates proper failed job records downstream (16K msgs/hr impact).
- Stream pipelines in 22+ Kafka consumer beans for payload transformation (`filter` → `map` → `collect`)
- `Optional` chaining in MapStruct mappers for null-safe field resolution
- ConcurrentHashMap-based AppPropertyCache for config lookups

**Talking Point:** "I fixed a production bug where `Collectors.toMap()` was crashing on null values from upstream Kafka. The key insight was choosing `HashMap.put()` over filtering nulls — filtering would make messages appear 'successful' with missing data. Preserving nulls lets downstream validation create proper failed job records. 16,000 messages per hour were silently dropping."

---

### Spring Boot — EXPERT

**Production Evidence:**
- 40+ services on Spring Boot 3.x with Java 21
- `@Cacheable` with proxy self-invocation awareness (implemented `extract_category_mapping` cache across 3 services, registered in `CacheConfig`)
- `@Async` with `SimpleAsyncUncaughtExceptionHandler` — traced that it swallows exceptions silently (no retry, no DLQ, no alert)
- Spring Cloud Config for externalized SQL (enables props-only hotfixes without code deployment)
- `@EnableScheduling` + `@EnableAsync` + `@EnableCaching` + `@EnableEncryptableProperties` combinations
- Jasypt encrypted properties (`PBEWithMD5AndDES`, `NoIvGenerator`, env-var password management)
- Dual persistence strategy: JDBC (high-performance, `NamedParameterJdbcTemplate`) vs JPA (convenience), runtime-switchable via `JDBC_MODE` config
- `@RefreshScope` for config changes, pod restart for Spring Cloud Config re-pull

**Talking Point:** "I designed a caching system for error categorization using `@Cacheable`. The table has ~75 rows of config data — loaded once, O(1) lookups at runtime. I registered the cache in CacheConfig, built a thin wrapper over the DAO, and deployed cache-clear endpoints (`/cache/all`) that broadcast to all pods."

---

### Spring Batch — PROFICIENT

**Production Evidence:**
- CPM: 100 partitions, 750 threads, 500 records/chunk, 50K page size, H2 for batch metadata
- Ready4Delivery: modulo partitioning (`jcr_id % forkCount = offset`), 50K per fork, GROUP_CONCAT aggregation query, chained transaction manager (DB + RabbitMQ coordinated commits per chunk)
- CompositeItemWriter pattern: `MQWriter` + `UpdateJobCommRecordStatusWriter` + `JobProcessDetailsWriter` + `ArbitrationParkingWriter`
- Modified Orchestrator (23 call sites within the batch ItemProcessor pipeline)
- Understood step listeners, skip/retry policies (500 skip limit per job), job restart semantics

**Talking Point:** "CPM processes millions of records using partitioned Spring Batch — 100 partitions, 750 threads, 500 records per chunk. Ready4Delivery uses modulo partitioning and a chained transaction manager that coordinates DB commits with RabbitMQ publishes per chunk — if either fails, both roll back."

---

### Resilience & Exception Handling — EXPERT

**Production Evidence:**
- Traced NPE across `@Async` boundary where `SimpleAsyncUncaughtExceptionHandler` swallowed it
- Custom circuit breaker (`CircuitBreakerSingleton`) in Ingestion API — parks messages to RabbitMQ when CPM unhealthy
- Resilience4j in CPM: circuit breaker (50% failure threshold / 10 calls) on rule engine API, `@TimeLimiter(1s)` (identified as non-functional due to Spring AOP proxy limitation on private methods)
- Identified 14-item stability backlog: unbounded `Future.get()` (thread leak), missing circuit breakers on UPC/Glympse/MDS, 20K RabbitMQ queue hiding backpressure
- Skip/retry policies in Spring Batch for non-fatal exceptions

**Talking Point:** "I identified that a `@TimeLimiter` annotation in CPM was non-functional — it was on a private method, and Spring AOP proxies only intercept public methods called from outside the class. I also found an unbounded `Future.get()` without timeout that could leak threads indefinitely."

---

## React/Angular

### React — FAMILIAR (direct experience outside Charter)

- GAMEC: Led migration from jQuery → Astro 5 + React islands. Zero client-side JS on non-interactive pages.
- Crocodile: React/Next.js SPAs with Material UI, reusable components, standardized routing/state
- Cheatsheet app: Timer.tsx (state machine: idle→running→paused→expired), SearchFilter.tsx (real-time DOM attribute querying)

### Angular — FAMILIAR

- UCC Hub UI: Angular SPA with Tableau integration, SSO, campaign management
- Implemented RBAC consolidation (13→9 roles), landing-page component, menu system
- Familiar with NgRx store pattern, component architecture

**Talking Point:** "At Charter, I restructured the Angular UI's role system from 13 to 9 roles, eliminating redundancies while preserving all functionality. Outside Charter, I led a full-stack migration from jQuery to Astro 5 with React islands."

---

## Cloud/DevOps

### AWS EKS & Kubernetes — EXPERT

**Production Evidence:**
- 31 microservices across East/West EKS clusters (migrated from Docker Swarm)
- Multi-region active-active with MariaDB Galera replication
- Rolling updates: `maxSurge: 1, maxUnavailable: 0`
- Traffic-routing during deployments (failover East↔West)
- Resource limits: 4-5 CPU, 2-3Gi per pod. JVM flags: `-XX:MaxRAMPercentage=75.0`
- Identified missing `preStop` hooks (in-flight requests dropped during rolling deploys — P2 stability item)
- Created EKS Deep Dive guide when discovering undocumented Swarm→EKS migration

**Talking Point:** "We deploy across East and West EKS clusters with traffic-routing during rolling updates. I identified a gap — no `preStop` hooks meant in-flight requests were dropped during deploys. The fix is a sleep delay to allow load balancers to drain connections before pod termination."

---

### ArgoCD GitOps — EXPERT

**Production Evidence:**
- Branchless model: all environments on `main` branch, folder-based separation (`low/east/CORE/qa/`, `high/east/CORE/prod/`)
- 15-18 values files per release across regions/environments
- Managed OutOfSync apps, manual sync for config-only changes
- Discovered that ArgoCD sync alone doesn't restart pods for config changes — requires explicit pod restart
- Rollback hierarchy: Git revert (audit trail) → ArgoCD UI → `kubectl rollout undo` (emergency)
- App-of-Apps pattern for managing 31 services

**Talking Point:** "I manage 18-file ArgoCD MRs per release. I discovered that ArgoCD sync alone doesn't restart pods for Spring Cloud Config changes — pods cache config at startup. You need an explicit restart or config refresh endpoint. I documented this for the team."

---

### CloudWatch & Observability — EXPERT

**Production Evidence:**
- Daily tool for production debugging
- Regex-based parsing: `parse @message /regex/ | stats count() by errorType`
- Quantified 25,890 NPEs on peak day during PSA investigation
- Post-deployment validation (OTP: confirmed encryption/decryption/redaction across all channels)
- Before/after comparison for props-only fixes (69→0 errors)
- Log group naming patterns per service/environment/cluster

**Talking Point:** "For the PSA incident, I ran CloudWatch queries that quantified 25,890 NPEs in a single day. After deployment, I used the same queries to confirm zero NPEs and verify previously-failing messages now flow through the pipeline successfully."

---

### CI/CD & Release Management — EXPERT

**Production Evidence:**
- Managed full 06.17.2026 release: MOP authoring, image version bumps across 15+ files, UAT/PROD promotion, post-deploy validation
- GitLab CI/CD: pipeline orchestration, cherry-pick branching for hotfix deploys
- Docker: OpenJDK 21 slim images, ECR push/pull, container health checks
- Deployment order as safety mechanism (OTP: PCDP before Ingestion API)
- Props-only hotfix pattern: SQL externalized in Spring Cloud Config — fix production without code build

**Talking Point:** "For the 06.17 release, I managed 3 features across 5+ services — writing MOPs, coordinating deployment order (OTP encryption requires PCDP deployed before Ingestion API to avoid customers seeing `ENC(...)` text), and running post-deploy CloudWatch validation queries per feature."

---

## Behavioral Panel

### "Tell me about a production incident"
→ **PSA NPE** (full detail above). Key: took ownership as new hire, challenged flawed RCA, found broader scope, chose semantically correct fix.

### "Tell me about cross-team collaboration"
→ **Error Categorization** (3 design iterations, BI changed ID scheme 3 times, coordinated 4+ parallel workstreams across 7+ people). Key: adapted without deadline slip.

### "Tell me about taking ownership"
→ **OTP Deployment Handoff** (found 5 errors in senior dev's runbook, validated everything against system state). Key: didn't blindly follow instructions.

### "Tell me about navigating ambiguity"
→ **CPNI + Undocumented EKS Migration** (discovered services had migrated without docs, found correct property naming, created EKS guide for team).

### "Tell me about a technical disagreement"
→ **Null Preservation vs Filtering** (chose harder approach because it's semantically correct — silent data loss vs proper failure tracking). Key: dismissed automated tool false positive with documented reasoning.

### "Tell me about going above and beyond"
→ **Stability Backlog + Doc Rebuild** (proactively identified 14 architectural risks, rebuilt 6 service docs, found 5+ errors in team's understanding). Key: nobody asked for this.

---

## Gap Analysis

### Strong Matches
Java 21, Spring Boot 3.x, Spring Batch, Spring Cache, Spring Cloud Config, Kafka (22+ consumers), RabbitMQ, AWS EKS/CloudWatch/S3, ArgoCD/Helm/GitOps, MariaDB, Microservices (40+ services), Production debugging, CI/CD, Release management

### Partial Matches
React (GAMEC/Crocodile), Angular (limited feature at Charter), SQL optimization (daily use, not DBA-level)

### Study Priorities
1. HackerRank: LeetCode Medium timed practice (arrays, hashmaps, sliding window, DP)
2. System design whiteboard: "Design a notification platform" (use UCC Hub as reference)
3. React hooks + testing (for frontend round)
4. Wells Fargo domain: payment processing, fraud detection patterns
