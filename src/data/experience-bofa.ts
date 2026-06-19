import type { ExperiencePanelConfig } from './types';

export const bofaExperience: ExperiencePanelConfig = {
  mappings: [
    {
      topic: 'Java Collections & Null Safety',
      level: 'expert',
      evidence: [
        'Fixed a production bug where Collectors.toMap() silently crashed on null values — it uses HashMap.merge() which calls Objects.requireNonNull() on values',
        'Chose HashMap.put() over filtering nulls because put() accepts null keys and values while preserving proper downstream validation behavior',
        'Used Stream filter/map/collect pipelines across 22+ Kafka consumers for payload transformation',
        'Applied Yoda conditions for null safety: "Wildfire".equalsIgnoreCase(value) returns false on null instead of throwing NPE',
      ],
      talkingPoint: "I fixed a critical production bug that comes down to a Java Collections gotcha most developers don't know about. Collectors.toMap() uses HashMap.merge() internally, and merge() calls Objects.requireNonNull() on values. So if any value in your stream is null, it throws an NPE instantly. Empty strings are fine — only nulls crash. Our upstream Kafka system was sending null template parameters for outage notifications. I replaced it with a plain HashMap.put() loop which accepts nulls. The decision mattered: I could have just filtered nulls (one line, simpler), but that would silently remove data. With nulls preserved, our downstream validation properly catches them and creates a failed job record that shows up in monitoring. Without my approach, messages would appear successful but with missing fields — nobody would ever know.",
    },
    {
      topic: 'SQL & Database',
      level: 'proficient',
      evidence: [
        'Designed the extract_category_mapping table: 75 rows with serial IDs for structured error categorization',
        'CPM writes to 5 tables atomically per communication record: main record, contacts, parameters, scheduled, and parked',
        'Fixed queryForObject() crash (expects exactly 1 row) by appending ORDER BY + LIMIT 1 to externalized SQL — zero code change',
        'GROUP_CONCAT aggregation queries in the Publisher for combining per-contact data into single rows',
        'Our primary table is 114 million rows (155 GB) on MariaDB Galera Cluster',
      ],
      talkingPoint: "I work with MariaDB daily — our primary table has 114 million rows at 155 gigabytes, running on a Galera Cluster with multi-master replication across East and West regions. I designed a categorization table from scratch — 75 rows mapping error IDs to structured categories that BI parses with split('|', 4). For a production bug, I fixed a query crash without writing code: the SQL is externalized in Spring Cloud Config, so I appended ORDER BY and LIMIT 1 to the property. The issue was that RCS channel fallback creates a second row where the code expected one. queryForObject() throws IncorrectResultSizeDataAccessException on 0 or 2+ rows.",
    },
    {
      topic: 'Multithreading & Async',
      level: 'proficient',
      evidence: [
        'CPM batch processor: 750 threads, 100 partitions, processing 500 records per chunk',
        '@Async consumers with sync fallback on RejectedExecutionException — no message loss even under thread pool exhaustion',
        'Found unbounded Future.get() without timeout — thread leaked indefinitely if external API hangs',
        'Traced exception swallowing in @Async boundary: SimpleAsyncUncaughtExceptionHandler only logs, no retry/DLQ/alert',
      ],
      talkingPoint: "Our batch processor uses 750 threads across 100 partitions. The Kafka consumers use @Async for throughput — each message gets handed to a thread pool. If the pool is full, RejectedExecutionException fires and we fall back to synchronous processing. Slower but no data loss. I found a scarier issue: an unbounded Future.get() with no timeout calling an external API. If that API hangs, the thread never returns — it's leaked from the pool forever. I also discovered that @Async exception handling is surprisingly dangerous: Spring's default handler just logs the error. No retry, no dead letter queue, no alert. The message is permanently gone and nobody knows.",
    },
  ],
  stories: [
    {
      title: 'Debugging a Silent Failure',
      prompt: 'Tell me about solving a difficult technical problem',
      situation: "About 16,000 outage notification messages per hour were vanishing in production. PSA — Proactive Service Alerts — is how Spectrum tells customers their internet is down. The upstream AOM system publishes events to Kafka, our service consumes and transforms them for delivery. No alerts fired, no dead letter queue caught them. The system appeared completely healthy to monitoring. Customers with outages just never got notified.",
      task: "Find exactly where messages disappear in the distributed pipeline and why there's zero visibility into the failure.",
      action: "I traced the async execution path step by step. The Kafka consumer uses @Async for throughput — commits the offset immediately and hands each message to a thread pool. If the processing thread crashes, Spring's SimpleAsyncUncaughtExceptionHandler just logs it at ERROR level. No retry, no dead letter queue, no alert, no metric. Offset committed = message gone forever. That's why monitoring was clean — the crash was invisible by design. The actual crash: PsaPayloadMapper uses Collectors.toMap() to convert template parameters from a list to a map. Most devs don't know this, but Collectors.toMap() uses HashMap.merge() internally which calls Objects.requireNonNull() on values. The upstream AOM system was sending null values for outageCause, outageCauseType, outageCauseDetails. Every message with these fields = instant NPE. I quantified it: 25,890 NPEs in one day via CloudWatch regex queries. For the fix I chose HashMap.put() over filtering nulls. Critical decision: filtering makes messages appear successful with missing data (no failed record created). HashMap.put() accepts nulls, downstream validation catches them, proper failed records are created — visible in monitoring. Also applied a Yoda condition for a second crash vector: 'Wildfire'.equalsIgnoreCase(value) returns false on null instead of NPE. Wrote 20 tests with real production payloads captured from CloudWatch.",
      result: "Zero messages dropped after deployment. 16K msgs/hr restored. Found a second affected template beyond the original ticket scope. Deployed across QA, UAT (15 ArgoCD files), and production East/West clusters.",
    },
  ],
  gaps: [
    { topic: 'Java Collections & Streams', status: 'strong' },
    { topic: 'SQL (MariaDB, Oracle, schema design)', status: 'strong' },
    { topic: 'Concurrency (thread pools, @Async, fallback)', status: 'strong' },
    { topic: 'Production debugging', status: 'strong' },
    { topic: 'LeetCode Easy under time pressure', status: 'weak', note: 'Practice 15-min timed Easy problems' },
    { topic: 'LeetCode Medium under time pressure', status: 'weak', note: 'Practice 25-min timed Medium problems' },
    { topic: 'Dynamic programming', status: 'weak', note: 'Study top patterns (knapsack, LIS, grid)' },
    { topic: 'Tree/graph traversal', status: 'weak', note: 'Review BFS/DFS, level-order' },
  ],
};
