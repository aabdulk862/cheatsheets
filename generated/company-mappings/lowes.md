# Lowe's — Experience Mapping (Deep)

> Interview: 3 Back-to-Back Technical Panels — Java 8, Microservices/Kafka, Database/Debugging  
> ALL technical, NO behavioral. Must demonstrate depth in every answer.

---

## Panel 1: Java 8/Core

### Stream API — EXPERT

**Production Evidence:**
- `Collectors.toMap()` null crash: `HashMap.merge()` → `Objects.requireNonNull()`. Empty strings pass, nulls don't. Fixed with `HashMap.put()` loop.
- `Stream.filter()` + `map()` for Kafka payload transformation in 22+ consumer beans
- `Collectors.groupingBy()` patterns in report generation
- `mapToInt()` + `reduce()` for volume calculations in validation queries
- Understood `flatMap` for nested list processing in batch record expansion

**Depth Answer (if asked "Collectors.toMap() gotchas"):** "In production, I discovered that `Collectors.toMap()` uses `HashMap.merge()` internally which calls `Objects.requireNonNull()` on values. Null map values throw NPE instantly. Empty strings are fine. This was crashing our Kafka consumer processing 16K+ messages/hour. The fix choice matters — filtering nulls before collection silently drops data, while switching to `HashMap.put()` preserves them for proper downstream validation."

---

### Lambda & Functional Interfaces — PROFICIENT

**Production Evidence:**
- Kafka consumer beans: `Consumer<List<Request>>` functional interface — Spring Cloud Stream function composition
- MapStruct `@Named` default methods with functional signatures
- Predicate patterns: `.filter(e -> e != null && OUTAGE_CAUSE_TYPE.equalsIgnoreCase(e.getName()))`
- `Runnable`/`Callable` in async thread pools (`RejectedExecutionException` → sync fallback)
- `BiFunction` patterns in composite validation chains

---

### Concurrency — EXPERT (operational, not greenfield)

**Production Evidence:**
- CPM: 750 core/max threads, 100 partitions, 20K queue capacity, throttle limit 50-100
- Ingestion API: 20-100 core threads, 5000 queue capacity for Kafka async
- `@Async` + `SimpleAsyncUncaughtExceptionHandler` — swallows exceptions silently (no retry/DLQ/alert)
- `RejectedExecutionException` → synchronous fallback (ensures no message loss, just slower)
- Connection pool: HikariCP 1000 max (CPM), 200 max (Ingestion), 200 min idle
- Identified unbounded `Future.get()` without timeout as thread leak vector (P0 stability item)
- JVM flags: `-XX:MaxRAMPercentage=75.0` for container-aware memory management

**Depth Answer:** "Our Kafka consumers use `@Async` for throughput — the consumer thread commits the offset and hands each message to a thread pool. The critical issue: if the pool is full, `RejectedExecutionException` fires. Our fallback processes synchronously — slower but no data loss. I also found that `@Async` exceptions hit `SimpleAsyncUncaughtExceptionHandler` which only logs. No retry, no DLQ, no alert. Messages permanently lost if the processing thread crashes."

---

## Panel 2: Microservices/Kafka

### Kafka Architecture — EXPERT

**Production Evidence:**
- **22+ consumer beans** in Ingestion API (not 15 as previously documented — I verified against source code)
- **3 Kafka clusters:** Enterprise (SASL_SSL/Kerberos — PSA, CPNI), CCT (PLAINTEXT — IVR, UCM, TMS, Disney, SCS, Device Connect), Internal
- **Consumer groups:** Isolated per source system. Each consumer has its own group → independent offset management
- **Account-based partitioning:** Ordered processing per customer account
- **Batch mode:** `max.poll.records: 500` — multiple events per consumer invocation
- **Async + fallback:** Thread pool for async processing with sync fallback on exhaustion
- **Per-message error isolation:** One bad payload doesn't kill the batch — `try/catch` per message
- **Spring Cloud Stream bindings:** Function-based consumers (`Consumer<List<Request>>`)
- **Consumer activation:** Consumers controlled by remote config server per environment profile (not local `spring.cloud.function.definition`)

**Sources systems:** PSA (outages), CPNI (privacy), UCM, TMS, Disney, IVR Callbacks, SCS, Device Connect, Agent OS, OCM (collections), Service Activation, NEOS, SSPP, assisted registration, payment submitted, auth ID, self-install WiFi7, flexible autopay, credit refund

**Depth Answer:** "The Ingestion API has 22 Kafka consumer beans across 3 clusters — Enterprise with Kerberos auth for compliance topics like CPNI, CCT plaintext for internal topics, and an internal cluster. Each consumer uses Spring Cloud Stream function bindings with batch mode. We process 500 records per poll. Each message is isolated — one failure doesn't kill the batch. Thread pool exhaustion triggers synchronous fallback. Consumer activation is per-environment via remote config, not local function definitions."

---

### RabbitMQ — PROFICIENT

**Production Evidence:**
- **Inter-service routing:** Ingestion → CPM (campaign queue), CPM → Ready4Delivery (3 queues: kafka/rest/batch)
- **Per-channel priority queues:** `ucc-hub-email`, `ucc-hub-sms`, `ucc-hub-ivr`, `ucc-hub-rcs`, `ucc-hub-push` — prevents one channel's failures from blocking others
- **Circuit breaker parking:** Open → messages routed to `circuitBreakerParkedReq` queue → replayed when circuit closes
- **Retry queues:** Tech Tracker first attempt → second attempt (circular), exponential backoff
- **Maintenance mode:** Messages parked during planned maintenance windows
- **Traffic mode switch:** `SINGLE_API_TRAFFIC_MODE`: `DIRECT` (sync REST to CPM) vs `QUEUE` (publish to RabbitMQ → CPM consumes)
- **Chained Transaction Manager:** Ready4Delivery coordinates DB commit + RabbitMQ publish per chunk — both succeed or both rollback
- **RabbitMQ fanout exchange:** Used in dynamic scheduler POC design for uniform pod notification
- **Queue capacity concern:** 20K capacity hides backpressure (identified as stability risk — should alert, not buffer silently)

**Depth Answer:** "We use RabbitMQ for three patterns: inter-service task routing (Ingestion → CPM → Publisher), per-channel priority queues for delivery isolation, and circuit breaker message parking. The Publisher uses a chained transaction manager that coordinates DB commits with RabbitMQ publishes per chunk — if either fails, both roll back. I identified that our 20K queue capacity is actually hiding backpressure — we should alert when queues grow, not silently buffer."

---

### Microservice Communication Patterns — EXPERT

**Production Evidence:**
- **Synchronous REST:** Ingestion → CPM (`/job/single/{jobID}`), CPM → Glympse API, CPM → UPC, CPM → Camunda DMN
- **Async queues:** RabbitMQ for task routing with retry semantics
- **Event streaming:** Kafka for upstream ingestion + downstream analytics (Kafka Communication Events Publisher)
- **Circuit breaker:** Custom `CircuitBreakerSingleton` parks messages when CPM unhealthy. Identified as anti-pattern vs Resilience4j.
- **Config-driven routing:** `SINGLE_API_TRAFFIC_MODE` switches direct REST vs queue-based at runtime
- **Props-only hotfix:** Externalized SQL in Spring Cloud Config — fix queries without code deployment (demonstrated with CPNI JPD fix: `ORDER BY jpd_id DESC LIMIT 1`)
- **Resilience4j:** CPM circuit breaker on rule engine (50% failure / 10 calls). Identified non-functional `@TimeLimiter` on private method (AOP proxy limitation).

---

### Deployment & Service Mesh — EXPERT

**Production Evidence:**
- ArgoCD GitOps: branchless, folder-based environment separation on `main`
- Zero-downtime rolling updates (`maxSurge: 1, maxUnavailable: 0`)
- Multi-region East/West with traffic-routing during deployments
- Deployment order as safety mechanism (OTP: PCDP before Ingestion API)
- 15-18 values files per release
- Pod restart required for Spring Cloud Config changes (ArgoCD sync alone insufficient)
- Missing `preStop` hooks → in-flight chunk loss during rolling deploys (identified, proposed fix)
- Helm charts with OCI artifact dependencies (`helper-chart`)

---

## Panel 3: Database/Debugging

### Database — PROFICIENT

**Production Evidence:**
- MariaDB Galera Cluster (multi-master, East/West active-active)
- 114M-row primary table (`job_communication_record`, 155GB) — no archival strategy (identified as stability risk)
- Schema design: `extract_category_mapping` (75 rows, serial IDs, category structure)
- CPM writes to 5 tables atomically per record: JCR, contacts, template_params, scheduled_comm, parked_records
- `queryForObject()` contract bug: CPNI RCS created 2 rows → `IncorrectResultSizeDataAccessException`
- Fix: `ORDER BY jpd_id DESC LIMIT 1` appended to externalized SQL property — zero code change
- Connection pool: HikariCP 1000 max (CPM), 200 (Ingestion), 200 min idle
- Stored procedure integration: ~2000-line `usp_preference_data_denormalization_fetch_merge` with 13 contact strategies

**Depth Answer:** "I fixed a production query crash where `queryForObject()` threw `IncorrectResultSizeDataAccessException` because RCS channel fallback created a second row. The query was externalized in Spring Cloud Config — I appended `ORDER BY jpd_id DESC LIMIT 1` to the property and restarted pods. Zero code change, zero downtime, validated from 69 errors/day to 0."

---

### Production Debugging — EXPERT

**Production Evidence:**
- CloudWatch Log Insights with regex parsing for RCA
- Quantified 25,890 NPEs in single day (PSA incident)
- Before/after deployment validation queries
- Log group naming patterns per service/environment/cluster
- Structured logging with traceId/spanId correlation
- Splunk for additional analysis
- Identified Lombok `@Data` `toString()` null formatting vs empty string (challenged flawed RCA)

---

## System Design — Lowe's Specific

### "Design an Order/Delivery Notification System"

**Direct UCC-HUB mapping:**

| Concept | UCC-HUB Implementation |
|---|---|
| Event sources | 22+ Kafka consumers from 15+ systems |
| Ingestion validation | 9-step pipeline: circuit breaker → maintenance → validate → transform → timezone → persist → attach → route |
| Processing engine | CPM: 14-step orchestrator with Spring Batch (partitioned, 750 threads) |
| Multi-channel delivery | Per-channel RabbitMQ queues → PCDP → Pinpoint/Connect |
| Preference management | UPC stored proc (13 contact strategies), DND enforcement |
| Template management | AWS Pinpoint templates with Handlebars, A/B testing |
| Delivery tracking | Response Handler: Kinesis (email), SQS (SMS), RCS webhooks |
| Retry/DLQ | RabbitMQ retry queues (first → second → DL), circuit breaker parking |
| Config-driven behavior | Feature flags in DB, externalized SQL, traffic mode switch |
| Multi-region HA | East/West EKS, Galera replication, traffic-routing during deploys |
| Observability | CloudWatch, structured logging, Splunk |

---

## Gap Analysis

### Strong Matches
Java 21 (Collections internals, async, concurrency), Kafka (22+ consumers, 3 clusters, consumer groups, partitioning, Spring Cloud Stream), RabbitMQ (circuit breaker, retry, priority queues, chained transactions), Spring Boot/Batch, Microservices (40+ services), Database (MariaDB, schema design, externalized SQL), Production debugging (CloudWatch), Deployment (ArgoCD, rolling updates, multi-region)

### Partial Matches
Docker Compose (use containers via EKS, not standalone compose), Kafka Streams API (use Spring Cloud Stream, not raw Streams), Schema Registry/Avro (JSON payloads)

### Study Priorities
1. Java 8 deep: `groupingBy` with downstream collectors, `partitioningBy`, custom Collector
2. Kafka internals: partition rebalancing, offset management, exactly-once semantics, consumer lag monitoring
3. SQL: indexing strategies, EXPLAIN analysis, composite indexes on 114M-row tables
4. Docker Compose multi-service orchestration
