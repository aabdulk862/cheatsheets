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
      topic: 'System Stability & Resilience',
      level: 'proficient',
      evidence: [
        'Proactively produced a 14-item stability backlog by applying Release It! patterns to our production codebase',
        'Found: unbounded Future.get() (thread leak if API hangs), missing circuit breakers on 3 external APIs, hand-rolled CircuitBreakerSingleton (anti-pattern vs Resilience4j)',
        'Identified 20K RabbitMQ queue capacity hiding backpressure — silently buffers instead of alerting',
        'Missing preStop hooks on K8s pods — in-flight batch chunks lost during rolling deploys',
        '114M-row table (155GB) with no archival strategy — slow-motion stability degradation',
      ],
      talkingPoint: "I proactively applied patterns from Release It! to our production codebase and produced a 14-item stability backlog. The scariest finding: an unbounded Future.get() call with no timeout on an external API — if that API hangs, the thread is leaked forever. We also have a hand-rolled CircuitBreakerSingleton that should be Resilience4j, missing circuit breakers on 3 external APIs (one stored procedure call takes up to 30 seconds), and Kubernetes pods without preStop hooks that lose in-flight batch chunks during rolling deploys. Our primary table is 114 million rows — 155 gigabytes — with no archival. That's a slow-motion stability risk that compounds monthly. Nobody was tracking any of this before I flagged it.",
    },
  ],
  stories: [
    {
      title: 'Monolith → Microservice Extraction',
      prompt: 'Tell me about decomposing a monolith',
      situation: 'The Tech Tracker service was a monolith combining appointment lifecycle management with Glympse tracking, Kafka consumers, S3 file handling, and Spring Batch processing. Changes to appointment logic risked breaking unrelated functionality.',
      task: 'Extract the appointment domain into a clean standalone microservice with minimal blast radius.',
      action: 'Mapped all class dependencies to identify the bounded context. Created a new Spring Boot project with only REST and RabbitMQ. Systematically removed Kafka, S3, Spring Batch, and Glympse dependency trees. Ensured all existing integration tests still passed against the extracted API. Presented the working demo to our Director of Engineering.',
      result: 'Standalone Appointment Service deployed. Reduced blast radius — appointment changes no longer risk Glympse or batch processing. Director approved further decomposition. Pattern documented for the team.',
    },
    {
      title: 'Proactive Risk Identification',
      prompt: 'Tell me about going above and beyond',
      situation: 'The platform had undocumented architectural risks that nobody was tracking. Multiple latent stability issues were compounding — unbounded calls, missing circuit breakers, data growth with no archival.',
      task: 'Self-initiated: identify and prioritize risks before they became incidents.',
      action: 'Applied Release It! stability patterns to actual production codebase. Analyzed thread pool configs, circuit breaker coverage, queue capacities, deployment hooks, and data growth rates. Produced prioritized P0-P3 backlog with effort estimates and specific file/line references for each issue.',
      result: '14-item stability backlog accepted by management. Established pattern of proactive risk tracking. Several items being addressed in upcoming sprints.',
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
