import type { ExperiencePanelConfig } from './types';

export const truistExperience: ExperiencePanelConfig = {
  mappings: [
    {
      topic: 'SQL & Database Work',
      level: 'proficient',
      evidence: [
        'Designed the extract_category_mapping table from scratch: 75 rows with serial IDs mapping error patterns to structured categories',
        'Fixed a production query crash with zero code: appended ORDER BY jpd_id DESC LIMIT 1 to an externalized SQL property (Spring Cloud Config), restarted pods, errors went from 69/day to 0 instantly',
        'Our primary table (job_communication_record) has 114 million rows at 155 gigabytes — I identified no archival strategy as a ticking stability risk',
        'CPM writes to 5 tables atomically per record: the main record, contacts per channel, template parameters, scheduled communications, and parked records',
        'Integrated with a ~2000-line stored procedure that handles 13 different contact resolution strategies. The proc returns errors in "ID| error text" format which our Java code parses.',
      ],
      talkingPoint: "I fixed a production query crash without writing a single line of code. Here's what happened: when we enabled RCS for CPNI templates, the fallback mechanism started creating a second database row — one for the RCS attempt, one for the SMS fallback. Our code used queryForObject() which expects exactly one row back. Two rows meant IncorrectResultSizeDataAccessException. The fix was elegant: since our SQL is externalized in Spring Cloud Config properties, I just appended 'ORDER BY jpd_id DESC LIMIT 1' to the query. The newest row — the SMS fallback — always has the correct final delivery status. Restarted pods, 69 errors per day dropped to zero instantly. No code change, no MR review for Java, no full deployment cycle. This props-only hotfix pattern is incredibly powerful for production.",
    },
    {
      topic: 'Java Exception Handling & Error Systems',
      level: 'expert',
      evidence: [
        'Built a structured error categorization system spanning 42 call sites across 3 microservices — each exception handler now references a serial ID from a cached DB table',
        'The output format is pipe-delimited: "Extraction|Template Error|Template Not Enabled|original error text" — BI parses with split("|", 4)',
        'Traced a NullPointerException across @Async thread boundaries where Spring silently swallows the exception',
        'Found IncorrectResultSizeDataAccessException from queryForObject() when RCS created duplicate rows',
        'Discovered a @TimeLimiter annotation on a private method that was completely non-functional due to Spring AOP proxy limitation',
      ],
      talkingPoint: "I built an error categorization system that takes 9.7 million annual uncategorized failures and makes them queryable by BI. The design: each of our 42 error-generating call sites references a serial ID from a cached database table. At runtime, the code looks up the ID, gets a pipe-delimited prefix like 'Extraction|Template Error|Template Not Enabled|', and prepends it to the original error message. BI splits on the pipe and gets Category, SubCategory, Rule, and the raw error text. It's deliberately simple — @Cacheable gives O(1) lookups, the table has 75 rows that rarely change, and adding a new error type is just an INSERT plus referencing the ID. No infrastructure changes needed.",
    },
    {
      topic: 'Compliance & Security',
      level: 'proficient',
      evidence: [
        'CPNI (Customer Proprietary Network Information) is federally regulated under the Telecom Act of 1996 — same legal weight as banking PII',
        'Analyzed a federal compliance gap where contact deletions weren\'t generating customer notifications — traced through 5+ repositories across 4 organizations',
        'Managed OTP encryption deployment: Jasypt encryption at ingestion → encrypted through pipeline → decrypt at delivery → redact in S3 archival',
        'Found 3 pre-existing bugs during compliance analysis: a YML mapper field mismatch, Dev vs Prod SQL structural difference, and a cron timezone issue (UTC vs EDT)',
        'Every production deployment requires a MOP (Method of Procedure), documented rollback plan, and post-deploy validation queries',
      ],
      talkingPoint: "I work with federally regulated customer data — CPNI, which is telecom's equivalent of banking PII. It's protected under the Telecom Act of 1996. I analyzed a compliance gap where our system wasn't notifying customers when their contact information was deleted — which violates federal requirements. I traced the pipeline through 5+ repos across 4 organizations and the key finding was that UCC Hub needed zero code changes — the real work was in the notification templates. That analysis saved engineering cycles on our side and I found 3 pre-existing bugs in the process. For OTP encryption, the architecture is encrypt-at-source, decrypt-at-delivery. The deployment order is critical — if you deploy encryption before decryption, customers see 'ENC(...)' text. Every release follows change management: MOP, rollback procedures, UAT validation, and post-deploy CloudWatch queries.",
    },
    {
      topic: 'Production Change Management',
      level: 'expert',
      evidence: [
        'Write MOPs (Method of Procedure) for production releases — step-by-step with verification commands',
        'Deployment order is a safety mechanism: OTP decryption service MUST deploy before encryption service',
        'Multi-region East/West deployment with traffic-routing failover during rolling updates',
        'Found 5 errors in a senior developer\'s deployment runbook before production execution',
        'Props-only hotfix capability: externalized SQL in Spring Cloud Config lets us fix production queries without a code build/deploy',
      ],
      talkingPoint: "Every production deployment I touch has a written MOP, rollback procedures for each service, and post-deploy validation. I took deployment ownership of OTP encryption from a senior developer and found 5 errors in his runbook — wrong cache clear URL, wrong rollback SQL that would fail silently, a nonexistent database column in an INSERT statement, the wrong deployment step order, and an incorrect file count for the West region cluster. The deployment order one is the scariest: if you deploy encryption before decryption, every customer who receives an OTP sees literal encrypted text instead of their verification code. I caught that before production.",
    },
  ],
  stories: [
    {
      title: 'Zero-Code Production Fix',
      prompt: 'Tell me about solving a production issue with minimal risk',
      situation: "Our CPNI notification service was throwing IncorrectResultSizeDataAccessException in production — about 400 errors per day. The root cause: we recently enabled RCS (Rich Communication Services) for CPNI templates. When RCS delivery fails, the system falls back to SMS. This creates a second row in the job_process_details table — one for the RCS attempt, one for the SMS fallback. The code predated RCS and used queryForObject() which expects exactly 1 row. Two rows = exception. No customer communications were actually failing — the messages still delivered via SMS — but error logs were filling up.",
      task: "Fix with the absolute minimum risk. Since no customers were impacted, I chose to be conservative rather than fast.",
      action: "I chose a props-only approach. Our SQL queries are externalized in Spring Cloud Config properties — they're not hardcoded in Java. So I appended 'ORDER BY jpd_id DESC LIMIT 1' to the query property. The newest row (the SMS fallback) always has the correct final delivery status, so returning just that one row gives the correct answer. Zero Java code changes, zero recompilation. Validated against 6 edge cases with live production data to confirm the ORDER BY always returns the right row. When I went to deploy to QA, I discovered the environment had been migrated from Docker Swarm to EKS without anyone updating the documentation. Portainer showed no running services. I had to figure out the new property file naming convention (-eks-qa1 suffix), find the correct CloudWatch log groups (different from what Chalk docs said), and learn that ArgoCD sync alone doesn't restart pods for config-only changes — you need an explicit pod delete or config refresh. I created a comprehensive EKS Deep Dive guide documenting all of this for the team.",
      result: "69 errors/day dropped to 0 instantly after pod restart. Zero code change, zero downtime, zero risk. The EKS guide I wrote prevents anyone else from hitting the same undocumented migration confusion.",
    },
    {
      title: 'Federal Compliance Analysis',
      prompt: 'Tell me about working on compliance-sensitive requirements',
      situation: "Our RTSN (Real-Time Security Notification) system had a compliance gap. Under the Telecom Act of 1996, customers must be notified when their CPNI (Customer Proprietary Network Information) contact information changes. Our system properly notified on additions and updates — but contact deletions generated no notification. This was a federal compliance violation. The fix involved multiple teams across 4 organizations: Charter (us), EDS (owns RTSN), Badger/Quality Resource (handles physical mail fallback), and the template team.",
      task: "Analyze the full pipeline end-to-end across 5+ repositories and determine exactly what changes UCC Hub needs to close the compliance gap.",
      action: "I traced the notification flow from RTSN through the Kafka ingestion path, through CPM processing, through delivery. Analyzed the Handlebars templates, the Kafka payload structure, the CPNI suppression logic, and the Report Generation fallout flow. The key finding: UCC Hub repos are passthroughs for this change — zero code modifications needed on our side. The real work is in the Handlebars notification templates (owned by another team) and the RTSN Kafka payload (owned by EDS). I identified a deduplication requirement — if a customer's contact is both changed and deleted in the same notification window, the display text would duplicate. Designed a template-level solution using {{includes}} and {{#unless}} patterns. Found 3 pre-existing bugs during the analysis: a CPNI Fallout YML mapper bug (sourceName: 'ST' vs SQL alias 'State'), a Dev vs Prod SQL structural difference that nobody had noticed, and a cron timezone issue (UTC vs EDT). Formulated precise questions for the external EDS team with sample payloads showing exactly what we need in the deletion event.",
      result: "Comprehensive 4-phase action plan delivered. The key insight — UCC Hub needs zero code changes — saved our engineering team cycles. 3 pre-existing bugs reported to their respective owners. Federal compliance gap addressed with clear ownership per organization.",
    },
  ],
  gaps: [
    { topic: 'Java 21 (OOP, exceptions, collections)', status: 'strong' },
    { topic: 'SQL (schema design, externalized queries, stored procs)', status: 'strong' },
    { topic: 'Spring Boot / JDBC / Batch / Cache', status: 'strong' },
    { topic: 'Compliance-grade deployments (MOPs, rollback, validation)', status: 'strong' },
    { topic: 'Production debugging & risk management', status: 'strong' },
    { topic: 'Banking terminology (ACH, wire, FedNow, BSA/AML)', status: 'weak', note: 'Know the compliance patterns, study banking-specific terms' },
    { topic: 'BigDecimal financial precision', status: 'weak', note: 'Not a daily task — review before interview' },
    { topic: 'Banking regulations (SOX, GLBA, Dodd-Frank)', status: 'weak', note: 'Know CPNI equivalent but not banking-specific frameworks' },
  ],
};
