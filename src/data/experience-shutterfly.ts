import type { ExperiencePanelConfig } from './types';

export const shutterflyExperience: ExperiencePanelConfig = {
  mappings: [
    {
      topic: 'Microservices at Enterprise Scale',
      level: 'expert',
      evidence: [
        'Work on 40+ Java 21/Spring Boot microservices organized by domain: ingestion, processing, delivery, and response handling',
        'Dual messaging strategy: Kafka handles event streaming from 15+ external systems, RabbitMQ handles internal service orchestration with retry semantics',
        'Extracted the Appointment Service from a monolithic codebase — identified the bounded context, stripped 4 unnecessary dependency trees (Kafka, S3, Spring Batch, Glympse), created clean REST + RabbitMQ contracts, and demoed to the Director of Engineering',
        'Identified capacity imbalance as architectural risk: 22 Kafka consumers feeding into a 750-thread processing pool — the ingestion is wider than processing can handle during spikes',
      ],
      talkingPoint: "I work on 40+ microservices processing millions of messages daily across 5 channels for 31 million customers. The architecture uses domain-driven boundaries — separate services for ingestion, processing, delivery, and response tracking. I extracted a standalone microservice from a monolith last month — the Appointment Service was tangled with Glympse tracking, Kafka, S3, and batch processing. I identified the bounded context, stripped 4 dependency trees that didn't belong, created clean API contracts, and presented a working demo to our Director of Engineering. He approved further decomposition work based on that approach. One architectural risk I identified: our ingestion layer has 22 Kafka consumers that can flood messages in faster than our 750-thread processing pool can handle during traffic spikes. I flagged this as a capacity imbalance that needs either autoscaling or back-pressure signaling.",
    },
    {
      topic: 'Event-Driven Architecture',
      level: 'expert',
      evidence: [
        '22+ Kafka consumers from source systems: PSA outages, CPNI privacy, Disney content, IVR callbacks, device connectivity, service activation, and 15+ more',
        'Per-message error isolation — one bad payload never kills the batch',
        'Circuit breaker parking: when downstream is unhealthy, messages park to RabbitMQ and auto-replay when the circuit closes',
        'Chained transaction manager: database commit + RabbitMQ publish happen as one atomic unit',
        'H2 in-memory for batch metadata to avoid remote DB calls during high-throughput processing',
      ],
      talkingPoint: "The platform uses dual messaging — Kafka for high-throughput event streaming from external systems and RabbitMQ for internal orchestration with retry semantics. What makes it interesting is the resilience layers. When our downstream processor is unhealthy, the circuit breaker parks messages in RabbitMQ — they automatically replay when the circuit closes. Our Publisher uses a chained transaction manager that makes the database write and the RabbitMQ publish atomic — both succeed or both roll back. This prevents orphaned records where you wrote to the DB but never published, or published but the DB write failed. I also traced a subtle failure mode where @Async processing swallowed exceptions entirely — Kafka had already committed the offset, so the message was permanently lost with zero visibility.",
    },
    {
      topic: 'AWS Infrastructure & Deployment',
      level: 'expert',
      evidence: [
        '31 services on EKS across East/West clusters — active-active with MariaDB Galera multi-master replication',
        'ArgoCD GitOps: branchless model, all environments on main with folder-based separation, 15-18 values files per release',
        'S3 dual-copy pattern: one copy for delivery (real values), one redacted copy for archival (sensitive fields replaced with ******)',
        'CloudWatch Log Insights for daily production debugging — quantified 25,890 NPEs in one day during incident',
        'Found 5 errors in deployment runbook before production: wrong cache URL, wrong rollback SQL, nonexistent DB column, wrong deploy order, incorrect file count',
      ],
      talkingPoint: "We run 31 services across East and West EKS clusters with active-active MariaDB Galera. I use ArgoCD GitOps — all environments live on main with folder separation, no environment branches. Each release touches 15-18 values files. For the OTP encryption feature, I took deployment ownership from a senior developer and found 5 errors in his runbook before we hit production — any one of them could have caused an incident. The deployment order was wrong: if you deploy the encryption service before the decryption service, customers see literal 'ENC(aXf3...)' text instead of their verification code. I also use S3 with a dual-copy pattern — one copy keeps real values for delivery, and a separate redacted copy goes to archival with sensitive fields replaced by asterisks.",
    },
    {
      topic: 'Design Iteration & Technical Decision Making',
      level: 'expert',
      evidence: [
        'Started with pattern-matching ErrorCategoryResolver (approved, scoped to 19 patterns) — realized it breaks silently when error messages change',
        'Pivoted to ID-based DB lookup: declare category at the source, @Cacheable for O(1), extensible with just INSERT + use ID',
        'Incorporated code review feedback: manual ConcurrentHashMap → Spring @Cacheable (cleaner, standard)',
        'Identified unbounded Future.get(), missing circuit breakers, preStop hook gap during codebase analysis',
      ],
      talkingPoint: "I scrapped my own approved plan mid-implementation because I realized it was fundamentally fragile. Pattern matching on error strings breaks silently when messages change — nobody gets alerted. The ID-based approach I replaced it with declares the category at the source: the code generating the error already knows what went wrong, so it references an ID directly. New errors = INSERT one row. No pattern matching that silently breaks. The pivot added one day of re-planning but the approach is correct for years. During code review the team suggested Spring @Cacheable over my manual ConcurrentHashMap — I incorporated that immediately because it's cleaner and follows the existing project pattern.",
    },
  ],
  stories: [
    {
      title: 'Monolith → Microservice Extraction',
      prompt: 'Tell me about decomposing a monolith',
      situation: "Our Tech Tracker service was a classic monolith problem. It combined appointment lifecycle management (scheduling, dispatch, completion) with Glympse real-time technician tracking, Kafka consumers for work order events from CSG, S3 file handling, and Spring Batch processing — all in one codebase. Any change to appointment logic risked breaking the Glympse integration or the batch pipeline. The service had grown organically over years and nobody had drawn a boundary.",
      task: "Extract the appointment domain into a standalone microservice. The goal was reduced blast radius — changes to appointments shouldn't risk technician tracking or batch jobs.",
      action: "I started by mapping class dependencies to identify what actually belongs to the appointment domain vs what's Glympse, batch, or file-handling. Then I created a brand new Spring Boot project with only two communication patterns: REST APIs for the appointment lifecycle endpoints and RabbitMQ for async notifications. Systematically removed 4 dependency trees that didn't belong: Kafka (appointment domain doesn't consume events directly), S3 (file storage is a different concern), Spring Batch (batch processing doesn't belong in an appointment service), and Glympse (tracking is a separate bounded context). Each removal required verifying no appointment logic accidentally depended on those libraries. Built clean API contracts that the remaining Tech Tracker monolith could call. Presented the working demo to our Director of Engineering with a clear explanation of bounded contexts and why this decomposition makes sense.",
      result: "Standalone Appointment Service deployed to QA. Changes to appointment logic can no longer break Glympse tracking or batch processing. Director approved the approach and wants further decomposition along the same pattern. Documented the extraction methodology for the team to follow on future extractions.",
    },
    {
      title: 'Design Pivot — Pattern Matching → ID-Based Lookup',
      prompt: 'Tell me about changing your approach mid-project',
      situation: "I was implementing the error categorization system. My first approved design was a pattern-matching resolver — an ErrorCategoryResolver with startsWith/contains chains matching freeform error text to categories. I'd scoped it to 19 patterns covering 838K records/year. But as I dug deeper — reading the ~2000-line stored procedure, tracing all 30+ setErrorDescription call sites, running CloudWatch on production — I realized pattern matching was fundamentally fragile.",
      task: "Decide whether to continue with the approved plan that was ready to implement, or propose a fundamentally different approach requiring re-planning.",
      action: "I identified the core problem: pattern matching breaks silently when someone changes an error message. 'Couldn't determine' becomes 'Unable to determine' and the matcher stops working — with no alert. The code generating the error already knows what went wrong, so it should declare the category at the source. I proposed an ID-based DB lookup: a table with serial IDs mapped to structured prefixes, each call site references its ID directly. Dropped the ErrorCategoryResolver entirely. Dropped the post-hoc hook points. Created extract_category_mapping table (75 rows) with @Cacheable wrapper. Each call site becomes: setErrorDescription(getDescription(15) + dynamicText). New errors = INSERT one row. Other teams adopt the same pattern. During code review, team suggested Spring @Cacheable over my manual ConcurrentHashMap — incorporated that and simplified further.",
      result: "Implemented across 42 call sites in 3 services. Fundamentally more maintainable — no fragile string matching. Extensible: new error = one INSERT. Other teams adopted the same ID pattern. The pivot added one day of re-planning but saved months of future maintenance.",
    },
  ],
  gaps: [
    { topic: 'Microservices at scale (40+ services)', status: 'strong' },
    { topic: 'Event-driven (Kafka + RabbitMQ)', status: 'strong' },
    { topic: 'AWS (EKS, S3, CloudWatch, Pinpoint)', status: 'strong' },
    { topic: 'Monolith decomposition', status: 'strong' },
    { topic: 'Production debugging', status: 'strong' },
    { topic: 'Resilience patterns', status: 'strong' },
    { topic: 'Python', status: 'partial', note: 'Used in Communication Templates repo, not primary' },
    { topic: 'Aurora PostgreSQL / DynamoDB', status: 'weak', note: 'We use MariaDB + Oracle' },
    { topic: 'Terraform', status: 'weak', note: 'We use Helm/ArgoCD instead' },
    { topic: 'LeetCode Hard (graph/DP)', status: 'weak', note: 'Need practice' },
  ],
};
