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
      situation: 'Our PSA outage notification Kafka consumer was silently dropping about 16,000 messages per hour. No alerts fired. No dead letter queue caught them. Customers with internet outages were never being notified.',
      task: 'Figure out where messages disappear between Kafka offset commit and downstream delivery, and fix it.',
      action: 'Traced the full async execution path: consumer commits offset, @Async hands to thread pool, NPE fires in MapStruct mapper, SimpleAsyncUncaughtExceptionHandler just logs it — no retry, no DLQ, no alert. Ran CloudWatch queries quantifying 25,890 NPEs in one day. Identified that Collectors.toMap() rejects null values. Chose to preserve nulls (not filter them) so downstream validation creates proper failed records instead of silent success.',
      result: 'Zero messages dropped after fix. 16K msgs/hr restored. Found a second affected template beyond the original ticket scope. Documented the @Async exception pattern for the team.',
    },
    {
      title: 'Cross-Service Error Categorization',
      prompt: 'Tell me about designing something that spans multiple services',
      situation: 'Our BI team couldn\'t build dashboards on 9.7 million annual delivery failures because error messages were freeform text scattered across 75+ call sites in 3 microservices.',
      task: 'Design and implement a structured error taxonomy that works for Java code call sites AND stored procedure outputs, with 4+ teams working in parallel.',
      action: 'After 3 design iterations, landed on an ID-based DB lookup with pipe-delimited prefixes. BI parses the output with split("|", 4). Modified 42 call sites across 3 repos. Coordinated with stored proc developer (different format: "ID| error text"), BI team (changed ID scheme 3 times), arbitration team (parallel workstream), and QA. Caught 10 rules BI missed in their own spreadsheet.',
      result: '75 DB rows categorizing 94 error patterns. All merged and in QA. Extensible — new error = INSERT one row and reference the ID. Shipping in 06.17 release.',
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
