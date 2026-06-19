import type { ExperiencePanelConfig } from './types';

export const lowesExperience: ExperiencePanelConfig = {
  mappings: [
    {
      topic: 'Kafka Architecture',
      level: 'expert',
      evidence: [
        'Our Ingestion API has 22 Kafka consumer beans — not 15 like the team previously believed. I verified this by reading every consumer in the actual codebase.',
        'We run 3 Kafka clusters: Enterprise uses Kerberos authentication for regulated compliance topics like CPNI, CCT uses plaintext for internal topics, and a third Internal cluster.',
        'Each consumer uses Spring Cloud Stream function-based bindings with batch mode (max.poll.records: 500) — meaning one poll returns up to 500 messages at once.',
        'Per-message error isolation: each message gets its own try-catch so one bad payload never kills the whole batch.',
        'Account-based partitioning ensures all messages for the same customer account go to the same partition — guarantees ordering per customer.',
      ],
      talkingPoint: "Our Ingestion API has 22 Kafka consumer beans across 3 clusters. The Enterprise cluster uses Kerberos authentication because it handles compliance-regulated topics — things like CPNI, which is federally protected customer data. Each consumer polls up to 500 messages at a time in batch mode, and we process them with per-message error isolation — if one message has bad data, we catch the exception for that message and continue with the rest. I learned this architecture deeply when debugging a production issue where messages were being silently dropped. The key insight: our consumers use @Async for throughput, which means the consumer thread commits the Kafka offset immediately and hands each message to a thread pool. If that thread crashes, the offset is already committed — the message is permanently lost. That's how we were losing 16,000 messages per hour with zero alerting.",
    },
    {
      topic: 'RabbitMQ & Inter-Service Communication',
      level: 'proficient',
      evidence: [
        'Per-channel priority queues: separate queues for email, SMS, IVR, RCS, and push — so one channel being slow doesn\'t block the others',
        'Circuit breaker pattern: when CPM (our processing engine) is unhealthy, messages get parked in a RabbitMQ queue and automatically replayed when the circuit closes',
        'Chained Transaction Manager in our Publisher: DB commit and RabbitMQ publish happen atomically per chunk — if either fails, both roll back',
        'Traffic mode switch: a runtime config flag switches between direct REST calls (low latency) and queue-based processing (backpressure handling)',
        'I identified that our 20K RabbitMQ queue capacity is actually hiding backpressure — it silently buffers instead of alerting, which masks problems until it\'s too late',
      ],
      talkingPoint: "We use RabbitMQ for three main patterns. First, inter-service task routing — Ingestion API publishes job IDs to a campaign queue, CPM picks them up for processing. Second, per-channel delivery queues — separate queues for email, SMS, IVR, RCS, and push notifications. This isolation means if the email channel backs up, it doesn't block SMS delivery. Third, circuit breaker parking — when our downstream processor is unhealthy, messages get parked in a queue and automatically replayed when the circuit closes. Our Publisher service does something interesting: it uses a chained transaction manager that coordinates the database commit and the RabbitMQ publish as a single unit — both succeed or both roll back. This prevents the case where you write to the DB but fail to publish, or publish but fail to write. One stability risk I identified: our RabbitMQ queues have 20,000 capacity, which sounds safe, but it actually hides backpressure. The queue just silently fills up instead of alerting anyone.",
    },
    {
      topic: 'Java Streams & Concurrency',
      level: 'expert',
      evidence: [
        'Collectors.toMap() null crash — most developers don\'t know this fails on null values because HashMap.merge() calls Objects.requireNonNull()',
        '750-thread pool in our campaign processor with 100 batch partitions',
        '@Async with sync fallback on RejectedExecutionException — guarantees no message loss even under thread pool exhaustion',
        'Found an unbounded Future.get() with no timeout — this can leak threads indefinitely if an external API hangs',
        'JVM container awareness: -XX:MaxRAMPercentage=75.0 so the JVM respects container memory limits',
      ],
      talkingPoint: "Our campaign processor runs 750 threads across 100 partitions, processing 500 records per chunk. The concurrency model is interesting — Kafka consumers use @Async to hand messages to a thread pool for throughput. When the pool fills up, we catch RejectedExecutionException and fall back to synchronous processing. It's slower but guarantees no data loss. I also found an architectural risk: an unbounded Future.get() call with no timeout. If the external API it's calling hangs, that thread is leaked forever — it'll never come back to the pool. I flagged this as a P0 stability item.",
    },
    {
      topic: 'Spring Batch',
      level: 'proficient',
      evidence: [
        'CPM (Campaign Process Manager): 100 partitions, 750 threads, 500 records per chunk, 50K page size for DB reads',
        'Ready4Delivery Publisher: modulo partitioning (record_id % forkCount = offset), GROUP_CONCAT query aggregates contacts per record',
        'H2 in-memory database for batch metadata — avoids remote DB calls for Spring Batch\'s internal bookkeeping',
        'CompositeItemWriter that atomically updates 5 tables and publishes to RabbitMQ per chunk',
        'I identified chunk loss during Kubernetes rolling deploys — missing preStop hooks mean pods die before in-flight chunks finish',
      ],
      talkingPoint: "Our batch pipeline processes millions of records using Spring Batch. CPM splits work across 100 partitions with 750 threads, reading 50,000 records per page in chunks of 500. The Publisher uses an interesting partitioning strategy — modulo on the record ID — and a GROUP_CONCAT query that aggregates all contacts for a record into a single row. The write step uses a CompositeItemWriter that atomically updates 5 database tables and publishes to RabbitMQ using a chained transaction manager. One risk I identified: during Kubernetes rolling deploys, we don't have preStop hooks configured. That means when a pod is being terminated, it can be killed while still processing a chunk — those records are lost and have to be manually reprocessed.",
    },
    {
      topic: 'Database & SQL',
      level: 'proficient',
      evidence: [
        'MariaDB Galera Cluster — multi-master replication across East and West regions. Either region can handle writes.',
        'Fixed a production query crash with zero code changes: appended ORDER BY jpd_id DESC LIMIT 1 to an externalized SQL property',
        'Our primary table has 114 million rows (155 GB) — I identified no archival strategy as a ticking stability bomb',
        'CPM writes to 5 tables atomically per communication record',
        'Integrated with a ~2000-line stored procedure that handles 13 different contact strategies',
      ],
      talkingPoint: "Our primary table has 114 million rows — 155 gigabytes — with no archival strategy. I flagged that as a long-term stability risk. For the CPNI bug, I fixed a production query crash without writing a single line of code. The query was externalized in Spring Cloud Config properties, so I just appended 'ORDER BY jpd_id DESC LIMIT 1' to the property and restarted the pods. Went from 69 errors per day to zero instantly. The root cause was interesting: when we added RCS (Rich Communication Services) to the CPNI template, the fallback mechanism creates a second row in the database — one for RCS attempt, one for SMS fallback. The code was using queryForObject() which expects exactly one row. Two rows = IncorrectResultSizeDataAccessException.",
    },
  ],
  stories: [
    {
      title: 'Kafka Consumer Silent Failure',
      prompt: 'Tell me about debugging a complex distributed system problem',
      situation: "Our PSA outage notification Kafka consumer was silently dropping about 16,000 messages per hour. PSA is how Spectrum tells customers 'we know your internet is down.' The upstream AOM system publishes outage events to Kafka, our Kafka Ingestion API consumes them and transforms them for delivery. No alerts fired, no dead letter queue caught the failures. Customers with outages were never notified.",
      task: "Figure out exactly where messages disappear in the distributed pipeline — between Kafka offset commit and downstream delivery — and why we have zero visibility into the failure.",
      action: "I traced the async execution path step by step. The Kafka consumer uses Spring Cloud Stream with batch mode (500 records per poll). For throughput, each message is handed to a thread pool via @Async. The consumer thread immediately commits the Kafka offset and moves on. If the processing thread crashes, Spring's SimpleAsyncUncaughtExceptionHandler logs it at ERROR level — but there's no retry, no dead letter queue, no alert, no metric. The offset is committed, so Kafka thinks the message was processed. It's permanently gone. The actual crash was in a MapStruct mapper: Collectors.toMap() uses HashMap.merge() internally, which calls Objects.requireNonNull() on values. The upstream AOM system sends null template parameters for some outage fields. Every message with a null value crashes instantly in the mapper. I ran CloudWatch Log Insights queries with regex parsing — 'parse @message /NullPointerException.*PsaPayloadMapper/ | stats count()' — and quantified 25,890 NPEs in a single day. For the fix, I chose HashMap.put() over filtering nulls because filtering would make downstream think the message was successful (missing keys = message succeeds with incomplete data, no failed record). With nulls preserved, downstream validation catches them and creates proper failed records.",
      result: "Zero messages dropped after fix. 16K msgs/hr restored. Found a second affected template beyond the ticket scope. Documented the @Async exception-swallowing pattern for the team — this is a platform-wide risk anywhere we use @Async without a custom exception handler.",
    },
    {
      title: 'Cross-Service Error Categorization',
      prompt: 'Tell me about designing something that spans multiple services',
      situation: "Our BI team couldn't build dashboards on delivery failures because the error_description field was freeform text scattered across 75+ call sites in 3 microservices (CPM, Ingestion API, Publisher). 9.7 million error records per year with no way to slice by category. The data was in a 114-million-row table (155 GB). Multiple teams needed to converge: Gopi owns stored procedures that generate some errors, Jena's arbitration team owns others, and BI needed a format they could parse.",
      task: "Design and implement a structured error taxonomy that works across Java code (where I control error generation) AND stored procedures (where another developer controls output format). Coordinate 4+ teams working in parallel to ship in the same release.",
      action: "Three design iterations: (1) new columns on the 155GB table — rejected as too risky. (2) Publisher-only approach — rejected because errors originate in CPM. (3) Pipe-delimited prefix on existing field (approved) — BI parses with split('|', 4), old records without pipes are uncategorized (backward compatible), zero schema migration. Built extract_category_mapping table (75 rows), @Cacheable service for O(1) lookups. Each error site references a hardcoded ID → service looks up the structured prefix. For Gopi's stored procs: he returns 'ID| error text', my code parses the ID and resolves the prefix from DB. Modified 42 call sites across 3 repos. BI changed the ID scheme 3 times — maintained cross-references each time, regenerated all SQL, caught 10 rules they missed. Coordinated Gopi (proc format), Pete/Shreya (BI categories), Jena/Smruti (arbitration sub-ticket), Yossi (downstream Kafka notification), Praveen (QA).",
      result: "75 DB rows categorizing 94 error patterns. All merged and in QA. Extensible: new error = one INSERT + reference the ID. BI can build dashboards on 9.7M annual failures for the first time. Shipping in 06.17 release.",
    },
  ],
  gaps: [
    { topic: 'Kafka (22+ consumers, 3 clusters, partitioning)', status: 'strong' },
    { topic: 'RabbitMQ (circuit breaker, retry, chained TM)', status: 'strong' },
    { topic: 'Java Streams & concurrency patterns', status: 'strong' },
    { topic: 'Spring Batch (partitioned processing)', status: 'strong' },
    { topic: 'Microservices (40+ services, communication patterns)', status: 'strong' },
    { topic: 'Production debugging (CloudWatch, log analysis)', status: 'strong' },
    { topic: 'Database (MariaDB Galera, externalized SQL)', status: 'strong' },
    { topic: 'Kafka Streams API (raw)', status: 'partial', note: 'Use Spring Cloud Stream abstraction, not raw Streams API' },
    { topic: 'Schema Registry / Avro', status: 'weak', note: 'We use JSON payloads only' },
    { topic: 'Docker Compose orchestration', status: 'partial', note: 'Use EKS/ArgoCD, not standalone Docker' },
  ],
};
