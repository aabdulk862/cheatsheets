# Shutterfly — Experience Mapping (Deep)

> Interview: Phone Screen → 2 Technical (Java + Architecture) → Managerial  
> Tabs: Backend/Architecture | AWS/Infra | Coding Problems | Likely Questions | Game Plan  
> Scale: 80M users, 75+ PB, 100k req/min, 300 services. **UCC Hub**: 40+ services, millions msgs/day, 114M-row tables.

---

## Backend/Architecture

### Microservices at Scale — EXPERT

**Production Evidence (UCC Hub ≈ Shutterfly scale patterns):**
- 40+ Java 21/Spring Boot microservices, domain-driven boundaries (ingestion → processing → delivery → response)
- 22+ Kafka consumer beans across 3 clusters (Enterprise Kerberos, CCT plaintext, Internal)
- RabbitMQ for inter-service orchestration with per-channel priority queues, circuit breaker parking, retry semantics
- Spring Cloud Config for centralized configuration across all services
- 114M-row primary table (155GB) — identified no archival strategy as ticking stability risk
- Dual traffic modes: Direct REST (low latency, <100ms) vs Queue-based (backpressure handling, <500ms) — runtime switchable

**Architecture I Can Whiteboard:**
```
[15+ Source Systems] → Kafka (22 consumers, account-partitioned)
                    → REST API (Direct mode)
                    → SFTP/S3 (Batch files)
                           ↓
     Ingestion API (validate, transform, encrypt, persist, route)
                           ↓ (RabbitMQ or direct REST)
     CPM: 14-step Orchestrator (Spring Batch: 100 partitions, 750 threads)
          [arbitrate → enrich contacts → DMN → params → validate]
                           ↓ (RabbitMQ per-channel queues)
     Ready4Delivery Publisher (GROUP_CONCAT, modulo partition, chained TM)
                           ↓ (Amazon MQ priority queues)
     PCDP → [Pinpoint/Connect] → Customer
                           ↓ (Kinesis/SQS)
     Response Handler (delivery status writeback, DND enforcement)
```

**Talking Point:** "I work on a platform with 40+ microservices processing millions of messages daily. The architecture uses dual messaging — Kafka for high-throughput event ingestion from 15+ external systems with account-based partitioning, and RabbitMQ for internal orchestration with per-channel priority queues, circuit breaker parking, and chained transaction management."

---

### Event-Driven Architecture — EXPERT

**Key patterns I've debugged/operated:**
- **Consumer isolation:** Each of 22 consumers has own group, own error handling. One bad payload ≠ batch failure.
- **Circuit breaker + message parking:** CPM unhealthy → messages park to RabbitMQ → replay when circuit closes. Identified hand-rolled `CircuitBreakerSingleton` as anti-pattern vs Resilience4j.
- **Chained Transaction Manager:** Ready4Delivery coordinates DB commit + RabbitMQ publish per chunk — both succeed or both roll back.
- **Async + fallback:** Thread pool exhaustion → `RejectedExecutionException` → synchronous fallback (no data loss, just slower)
- **Props-only hotfix:** Externalized SQL in Spring Cloud Config — fix production without code build (demonstrated with `ORDER BY + LIMIT 1`)
- **H2 intermediate processing:** CPM reads campaign data from MariaDB into H2 in-memory for batch — avoids repeated remote queries during 50K+ records/min processing

---

### Monolith → Microservice — Direct Experience

**Appointment Service Extraction:**
- Identified bounded context within monolithic Tech Tracker codebase
- Stripped 4 dependency trees: Kafka, S3, Spring Batch, Glympse
- Created standalone Spring Boot with REST + RabbitMQ only
- Presented working demo to Director of Engineering
- Pattern: identify domain boundary → strip dependencies → create clean contracts → validate independently

---

### High-Throughput Processing — EXPERT

| Stage | Config |
|---|---|
| Ingestion API (Kafka) | 20-100 core threads, 5000 queue capacity, max.poll.records: 500 |
| CPM (Spring Batch) | 100 partitions, 750 threads, 500 records/chunk, 50K page size, 20K queue |
| Ready4Delivery | 50 threads, 200 throttle, 50K per fork, modulo partitioning, chained TM |
| Delivery (PCDP) | Per-channel Amazon MQ queues with DLQ per channel |

**Stability risks I identified:**
- Unbounded `Future.get()` — thread leak if external API hangs
- 20K RabbitMQ queue hides backpressure (should alert, not buffer)
- Missing `preStop` hooks → in-flight chunk loss during K8s rolling deploys
- Capacity imbalance: wide ingestion funnel (22 consumers), narrow processing (750 threads)
- 114M rows, 155GB table — no archival, slow degradation guaranteed

---

## AWS/Infra

### EKS — EXPERT

- 31 services across East/West clusters
- Rolling updates: `maxSurge: 1, maxUnavailable: 0`
- Multi-region active-active with Galera replication
- Traffic-routing during deployments (failover region)
- Resource limits: 4-5 CPU, 2-3Gi RAM per pod
- JVM: `-XX:MaxRAMPercentage=75.0` for container awareness
- Identified missing `preStop` hooks (in-flight loss during rolling deploys)
- Created EKS Deep Dive guide when discovering undocumented Swarm→EKS migration

### ArgoCD GitOps — EXPERT

- Branchless: all envs on `main`, folder-based separation
- 15-18 values files per release
- Deployment order as safety mechanism (OTP: PCDP before Ingestion)
- Manual sync required for config-only changes (sync ≠ pod restart)
- Rollback: Git revert (audit trail) → ArgoCD UI → `kubectl rollout undo`

### S3 — PROFICIENT

- Dual-copy pattern: delivery copy (real values) + redacted archival copy (`verify_code: ******`)
- `ONEZONE_IA` storage class for archival
- GPG encryption for CMF file ingestion
- SFTP via AWS Transfer Family

### CloudWatch — EXPERT

- Daily production debugging with regex parsing
- Quantified 25,890 NPEs in peak day
- Post-deployment feature validation (OTP encryption/decryption/redaction confirmed per channel)
- Before/after comparison for props-only fixes (69→0 errors)

---

## System Design — Shutterfly-Specific

### "Design an Image Upload & Processing Pipeline"

| Shutterfly Concept | UCC-HUB Equivalent (can discuss at depth) |
|---|---|
| Image upload to S3 | SFTP file upload → CMF/CMIP ingestion. S3 for attachments. |
| Async processing queue | RabbitMQ routing (3 ready4delivery queues: kafka/rest/batch) |
| Workers (thumbnail gen) | CPM: 14-step orchestrator, 100 partitions × 750 threads |
| CDN distribution | AWS Pinpoint multi-channel delivery (5 channels) |
| Status tracking | Response Handler: Kinesis (email events), SQS (SMS), RCS webhooks |
| Retry on failure | Circuit breaker parking → replay. RabbitMQ retry queues (first → second → DL) |
| Rate limiting | Throttle limits (100-200 concurrent), chunk sizes (500), fork-based processing |
| Multi-region HA | East/West EKS, Galera replication, traffic-routing during deploys |
| Feature flags | DB-backed config (`SENSITIVE_TEMPLATE_CONFIG`, `SINGLE_API_TRAFFIC_MODE`) |
| Observability | CloudWatch Log Insights, structured logging with traceId/spanId |

---

## Behavioral / Managerial Round

### "Tell me about a time you took ownership"
→ **OTP Deployment Handoff**: Security-sensitive feature across 3 services. Found 5 errors in senior dev's runbook (wrong URLs, SQL, columns, deploy order, file counts). Validated everything against system state before execution. Prevented potential customer-facing `ENC(...)` text.

### "Tell me about handling scope changes"
→ **Error Categorization**: BI changed ID scheme 3 times mid-sprint. Went from 58→57→74 rules. Caught 10 rules BI missed. Maintained cross-reference table, regenerated SQL, verified 94 patterns still mapped correctly. Delivered on schedule.

### "Tell me about going above and beyond"
→ **Stability Backlog + Doc Rebuild**: Nobody asked for these. Proactively identified 14 architectural risks (*Release It!* analysis). Rebuilt 6 service docs from source code. Found 5+ errors in team's existing understanding (22 consumers not 15, SSHJ not JSch, arbitration runs twice, duplicate detection disabled).

### "Tell me about scale"
→ "40+ microservices, millions of messages daily, 31M+ customers, 5 delivery channels, 22+ Kafka consumers across 3 clusters, 114M-row primary table (155GB), 750 concurrent processing threads, multi-region active-active."

---

## Gap Analysis

### Strong Matches
Microservices at scale (40+ services), Event-driven architecture (Kafka + RabbitMQ), AWS (EKS, S3, CloudWatch, Pinpoint, Kinesis), High-throughput batch processing, Multi-region deployment, Production debugging, Service extraction, Release management, Resilience patterns

### Partial Matches
Python (Communication Templates repo uses it), Aurora PostgreSQL (MariaDB + Oracle experience translates), DynamoDB (no direct experience), Terraform (use Helm/ArgoCD)

### Study Priorities
1. LeetCode Medium/Hard — array manipulation, BFS/DFS, dynamic programming
2. System design: image upload pipeline (CDN, thumbnails, metadata)
3. DynamoDB single-table design patterns
4. Terraform basics (they use it, we use Helm)
