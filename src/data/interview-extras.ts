import type { SystemDesignTopic, IntroPanelConfig, StoryRoute } from './types';

// ─── Shared Story Routes (all companies draw from these) ─────────────────────

const sharedRoutes: StoryRoute[] = [
  { prompt: 'Tell me about a production incident', storyTitle: 'PSA NPE — 16K msgs/hr', oneLiner: 'Traced async exception swallowing, fixed Collectors.toMap null crash, 20 tests, deployed East/West' },
  { prompt: 'Tell me about cross-team collaboration', storyTitle: 'Error Categorization', oneLiner: '42 call sites, 3 repos, 4+ teams, BI changed schema 3 times — delivered on schedule' },
  { prompt: 'Tell me about taking ownership', storyTitle: 'OTP Deployment Handoff', oneLiner: 'Found 5 runbook errors, validated security-sensitive deployment, prevented customer-visible ENC(...) text' },
  { prompt: 'Tell me about navigating ambiguity', storyTitle: 'CPNI + Undocumented EKS Migration', oneLiner: 'Discovered services migrated without docs, found correct config, created EKS guide for team' },
  { prompt: 'Tell me about a technical disagreement', storyTitle: 'Null Preservation vs Filtering', oneLiner: 'Chose harder approach (preserve nulls) because filtering = silent data loss in downstream' },
  { prompt: 'Tell me about going above and beyond', storyTitle: 'Design Pivot — Pattern Matching → ID Lookup', oneLiner: 'Scrapped approved pattern-matching plan mid-implementation, proposed fundamentally better ID-based DB approach — added 1 day re-planning, saved months of maintenance' },
  { prompt: 'Tell me about handling scope changes', storyTitle: 'Error Categorization ID Scheme', oneLiner: 'BI changed IDs 3 times (58→57→74), remapped all, caught 10 rules they missed' },
  { prompt: 'Tell me about compliance-sensitive work', storyTitle: 'CPNI Federal Compliance', oneLiner: 'Telecom Act 1996 violation — analyzed 5+ repos, zero code needed, found 3 pre-existing bugs' },
];

// ─── System Design Topics ────────────────────────────────────────────────────

const notificationSystemDesign: SystemDesignTopic = {
  title: 'Design a Notification/Communication Platform',
  prompt: 'Design a system that sends notifications across multiple channels at scale',
  mermaid: `graph TD
    A[15+ Source Systems] -->|Kafka| B[Kafka Ingestion API]
    A2[REST Clients] -->|HTTP| C[Ingestion API]
    A3[SFTP/S3 Files] --> D[CMF]
    D -->|RabbitMQ JobLaunchDTO| E[CMIP]
    E --> F[CPM Batch]
    B --> G[CPM SingleAPI]
    C --> G
    F -->|Spring Batch| H[Ready4Delivery Publisher]
    G --> H2[Ready4Delivery SingleAPI]
    H --> I[Amazon MQ]
    H2 --> I
    I --> J[PCDP]
    J -->|API| K[Pinpoint - Email/SMS/Push]
    J -->|API| L[Connect - IVR]
    J -->|API| M[Infobip - RCS]
    K -->|Kinesis| N[Response Handler]
    L -->|Kinesis| N
    M -->|Kafka| N
    N -->|15s batch| O[(MariaDB)]`,
  concepts: ['Event-driven', 'Multi-channel', 'Kafka + RabbitMQ dual messaging', 'Circuit breaker', 'Retry/DLQ', 'Batch vs SingleAPI paths', 'Pinpoint/Connect/Infobip delivery', 'Kinesis response streaming'],
  talkingPoint: 'I work on exactly this system — millions of messages daily across 5 channels for 31M customers. There are two processing paths: Kafka/REST events go through CPM SingleAPI for real-time, while file-based bulk campaigns go through CMF → CMIP → CPM Batch with Spring Batch (100 partitions, 750 threads). Both converge at Ready4Delivery which publishes to Amazon MQ. PCDP picks up from the queue and calls Pinpoint for email/SMS/push, Connect for IVR, and Infobip for RCS. Delivery events stream back via Kinesis and Kafka to our Response Handler.',
};

const eventDrivenDesign: SystemDesignTopic = {
  title: 'Design an Event-Driven Architecture',
  prompt: 'How would you design a system with event-driven communication between services?',
  mermaid: `graph TD
    subgraph Sources
      K1[Enterprise Kafka - Kerberos]
      K2[CCT Kafka - Plaintext]
      REST[REST Clients]
      AMQ[ActiveMQ - MDA]
    end
    subgraph Ingestion
      K1 --> KIA[Kafka Ingestion API]
      K2 --> KIA
      REST --> IA[Ingestion API]
      AMQ --> IA
    end
    subgraph Routing
      KIA -->|singleapi-campaign-processor queue| RMQ[Amazon MQ]
      IA -->|Direct or Queue mode| RMQ
      RMQ --> CPM[CPM SingleAPI]
    end
    subgraph Delivery
      CPM --> R4D[Ready4Delivery]
      R4D --> MQ2[Per-Channel Queues]
      MQ2 --> PCDP[PCDP]
      PCDP --> PIN[Pinpoint/Connect/Infobip]
    end
    subgraph Resilience
      IA -.->|Circuit breaker park| PQ[Parking Queue]
      PQ -.->|Replay| IA
    end`,
  concepts: ['Dual messaging - Kafka + RabbitMQ', 'Consumer groups per source', 'Account partitioning', 'Circuit breaker parking', 'Direct vs Queue traffic mode', 'Per-channel delivery queues', 'Kinesis response streaming', 'Props-only hotfix via Spring Cloud Config'],
  talkingPoint: 'The platform uses dual messaging — Kafka for ingestion from 15+ external systems (with Kerberos on compliance topics) and Amazon MQ (RabbitMQ) for internal routing. A traffic mode config switches between direct REST calls to CPM and queue-based processing at runtime. PCDP is the final delivery orchestrator — it pulls from per-channel queues and calls the appropriate delivery API: Pinpoint for email/SMS/push, Connect for IVR, Infobip for RCS.',
};

const batchProcessingDesign: SystemDesignTopic = {
  title: 'Design a High-Throughput Batch Pipeline',
  prompt: 'Design a system that processes millions of records efficiently',
  mermaid: `graph TD
    subgraph Ingestion
      SFTP[SFTP/S3 Files] --> CMF[CMF Formatter]
      CMF -->|RabbitMQ JobLaunchDTO| CMIP[CMIP Loader]
      CMIP -->|Validate + Load| DB[(MariaDB)]
    end
    subgraph Processing
      DB --> READER[JdbcPagingReader - 50K pages]
      READER --> PROC[CampaignProcessor]
      PROC --> ARB[Arbitration - Send/Suppress/Delay]
      PROC --> ORCH[Orchestrator 14 Steps]
      ORCH --> WRITER[CompositeWriter - 5 Tables]
    end
    subgraph Delivery
      WRITER -->|RabbitMQ notify| R4D[Ready4Delivery]
      R4D -->|Chained TM| MQ[Amazon MQ]
      MQ --> PCDP[PCDP]
      PCDP --> DEL[Pinpoint/Connect/Infobip]
    end
    subgraph Config
      SP[100 Partitions] --- TH[750 Threads]
      TH --- CH[500 per chunk]
    end`,
  concepts: ['Spring Batch', 'Partitioned processing', 'Chunk transactions', 'CMF→CMIP→CPM pipeline', 'CompositeWriter - 5 tables atomic', 'Modulo partitioning in Publisher', 'Chained Transaction Manager', 'Arbitration pre and post enrichment'],
  talkingPoint: 'Bulk campaigns flow through CMF (formats files) → CMIP (validates and loads to DB) → CPM Batch (Spring Batch with 100 partitions, 750 threads, 500/chunk). CPM runs a 14-step orchestrator: arbitration, contact preference via stored proc, DMN template selection, parameter enrichment, then writes to 5 tables atomically. Ready4Delivery picks up enriched records, uses a chained transaction manager (DB + RabbitMQ atomic per chunk), and publishes to Amazon MQ for PCDP to deliver via Pinpoint, Connect, or Infobip.',
};

const deploymentDesign: SystemDesignTopic = {
  title: 'Design a Multi-Region Zero-Downtime Deployment',
  prompt: 'How do you deploy across regions with zero downtime?',
  mermaid: `graph TD
    subgraph GitOps
      DEV[Dev Values] --> QA[QA Values]
      QA --> UAT[UAT Values]
      UAT --> PROD[Prod Values]
      GIT[Git Push main] --> ARGO[ArgoCD Sync]
    end
    subgraph Clusters
      ARGO --> EAST[EKS East]
      ARGO --> WEST[EKS West]
      EAST -.-> ROLL[Rolling Update]
    end
    subgraph Safety
      TRAFFIC[Traffic Routing] -.->|Failover| EAST
      TRAFFIC -.->|Failover| WEST
      GALERA[(MariaDB Galera)] --- EAST
      GALERA --- WEST
    end`,
  concepts: ['ArgoCD GitOps', 'Branchless - folder-based', 'Rolling updates', 'Traffic-routing failover', 'Galera multi-master', 'preStop hooks', 'Deployment order safety', 'Rollback hierarchy'],
  talkingPoint: 'We use ArgoCD with branchless GitOps — all environments on main with folder separation. Production deploys route traffic to the opposite region during rolling updates. MariaDB Galera provides multi-master replication across East/West. Rollback is Git revert → ArgoCD auto-sync. Deployment order matters — for OTP encryption, PCDP (decryption) must deploy before Ingestion API (encryption) or customers see ENC(...) text.',
};

// ─── Per-Company Exports ─────────────────────────────────────────────────────

export const wellsFargoExtras = {
  systemDesign: [notificationSystemDesign, eventDrivenDesign, deploymentDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I'm a software engineer at Infosys supporting Charter Communications' customer communications platform — 40+ Java 21 and Spring Boot microservices processing millions of messages daily across SMS, Email, RCS, and IVR. I diagnose production incidents, design cross-service features, and manage deployments on AWS EKS. I have my AWS Solutions Architect Associate, and I'm excited about Wells Fargo because the scale and compliance requirements align with the enterprise systems I work on daily.",
    whyCompany: [
      'Scale matches my daily work — millions of transactions processing through distributed Java services',
      'Enterprise Java/Spring Boot stack is exactly my expertise',
      'Compliance requirements (financial PII) parallel the CPNI federal regulations I handle',
      'Multi-region, high-availability architecture is what I deploy and manage',
    ],
    closingStatement: "I bring production-tested experience with exactly the patterns Wells Fargo needs — distributed Java systems at scale, event-driven architecture, multi-region deployments, and the discipline of compliance-grade change management. I'm ready to contribute from day one.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes,
};

export const shutterflyExtras = {
  systemDesign: [notificationSystemDesign, batchProcessingDesign, deploymentDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I'm a software engineer at Infosys supporting Charter Communications' customer communications platform — 40+ Java 21 microservices handling millions of messages daily across SMS, Email, RCS, and IVR on AWS EKS. I've fixed production bugs dropping 16,000 messages per hour, designed cross-service error systems used by our BI team, extracted microservices from monoliths, and built AI-augmented engineering workflows using LLMs with structured context. I'm excited about Shutterfly because of the engineering scale and the emphasis on AI tooling in the JD — that's something I've already operationalized.",
    whyCompany: [
      'Engineering scale mirrors my work — 300 services at Shutterfly vs 40+ at Charter',
      'AI/LLM emphasis in the JD aligns with my verified knowledge base and steering files for code generation',
      'AWS infrastructure (ECS, S3, SQS) maps directly to my EKS/S3/Pinpoint experience',
      'Principal Engineer panel suggests they value depth over breadth — I can go deep on production systems',
    ],
    closingStatement: "I bring enterprise-scale production experience — not CRUD apps. I've owned services, resolved incidents affecting 16,000 customers per hour, coordinated cross-team features, and operationalized AI tools for engineering productivity. I'd love to bring that perspective to Shutterfly.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes,
};

export const lowesExtras = {
  systemDesign: [eventDrivenDesign, batchProcessingDesign, notificationSystemDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I support a communications platform with 40+ Spring Boot microservices, 22+ Kafka consumers across 3 clusters, RabbitMQ for service orchestration, and Spring Batch processing millions of records daily. I've fixed production bugs dropping 16K messages per hour, built cross-service error systems, and managed multi-region deployments. For Lowe's, the Java 8, Kafka, and microservices focus is my daily work.",
    whyCompany: [
      'All-technical panels align with my strengths — deep Java, Kafka, and microservices knowledge',
      'Kafka architecture (consumer groups, partitioning, error isolation) is my expert area',
      'Spring Batch processing at scale is what our pipeline does daily',
      'Database debugging and production troubleshooting is where I excel',
    ],
    closingStatement: "I live in the exact stack Lowe's uses — Java, Kafka, Spring Boot, microservices, and SQL. I can discuss any of these at production-debugging depth because that's what I do every day.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes,
};

export const allstateExtras = {
  systemDesign: [eventDrivenDesign, batchProcessingDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I'm a software engineer working on a distributed communications platform — 40+ Java microservices on AWS EKS. I write tests first when fixing production bugs, I've modified 42 call sites across 3 repos with consistent clean patterns, and I value collaboration — coordinating with 4+ teams on a single feature. For Allstate, the TDD and pair programming focus resonates with how I approach quality code.",
    whyCompany: [
      'TDD focus aligns with my test-first approach to bug fixes (20 tests with real prod data)',
      'Pair programming culture matches my collaborative development style',
      'Clean code emphasis — I maintained consistent patterns across 42 call sites in 3 services',
      'Java/Spring Boot is my primary stack with deep production experience',
    ],
    closingStatement: "I write tests that mirror production reality — capturing actual failing payloads and encoding them as fixtures. I'm comfortable thinking out loud, explaining trade-offs, and adapting when requirements change mid-sprint.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes,
};

export const truistExtras = {
  systemDesign: [notificationSystemDesign, deploymentDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I support a platform processing millions of communications daily through a multi-stage Java pipeline — validation, enrichment, arbitration, and multi-channel delivery. I work with MariaDB (114M-row tables), stored procedures, and Spring Boot services deployed on AWS EKS with compliance-grade change management. For Truist, the Java, SQL, and banking-domain focus aligns with my daily work handling federally-regulated customer data.",
    whyCompany: [
      'Java + SQL focus is exactly my production environment (MariaDB, stored procs, Spring JDBC)',
      'Banking compliance mirrors CPNI federal regulations I already work under',
      'Change management rigor (MOPs, rollback procedures) is how I deploy every release',
      'Multi-stage processing pipelines are what I build and debug daily',
    ],
    closingStatement: "I bring the discipline of compliance-grade deployments and the hands-on SQL and Java expertise Truist needs — from schema design to production debugging to coordinated multi-region releases.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes,
};

export const bofaExtras = {
  systemDesign: [batchProcessingDesign, eventDrivenDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I'm a software engineer at Infosys supporting Charter's communications platform — 40+ Java 21 microservices processing millions of messages daily across SMS, Email, RCS, and IVR. I diagnose production incidents, design cross-service features, and manage deployments on AWS EKS. I have my AWS Solutions Architect and Security+ certifications, and I'm excited about Bank of America because the scale and compliance requirements align with my daily work.",
    whyCompany: [
      'Enterprise Java at scale is my core expertise (40+ microservices, Spring Boot 3.x)',
      'Compliance and data integrity requirements mirror my CPNI/federal regulation experience',
      'Millions of daily transactions matches my platform\'s message volume',
      'AWS Solutions Architect certification demonstrates cloud infrastructure knowledge',
    ],
    closingStatement: "I bring production-tested Java expertise, compliance awareness from handling federally-regulated data, and the ability to debug complex distributed systems under pressure.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes.slice(0, 5),
};

export const chmuraExtras = {
  systemDesign: [eventDrivenDesign],
  intro: {
    selfIntro: "Hi, I'm Adam. I'm a software engineer with experience building component-based UIs with TypeScript and modern frameworks. I led a migration from jQuery to Astro 5 with React islands, built this interview prep app with tabbed navigation, real-time search, and accessible keyboard support. My backend experience on a 40+ microservice platform gives me deep understanding of the REST APIs and data pipelines that frontends consume.",
    whyCompany: [
      'TypeScript proficiency — strict interfaces, generics, type-safe components',
      'Component architecture experience (React islands, Astro, tabbed navigation)',
      'Deep REST API understanding from building/consuming APIs on 40+ microservices',
      'Data-driven UI patterns (tables, filters, search, dashboards)',
    ],
    closingStatement: "I combine frontend component skills with deep backend API knowledge. I understand the full pipeline from event source to rendered dashboard — which makes me effective at building data-rich UIs like JobsEQ.",
  } as IntroPanelConfig,
  storyRoutes: sharedRoutes.slice(0, 4),
};
