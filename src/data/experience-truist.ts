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
      situation: 'queryForObject() was throwing IncorrectResultSizeDataAccessException because adding RCS to CPNI templates created a second database row (RCS attempt + SMS fallback). Code expected exactly 1 row. About 400 errors per day in production.',
      task: 'Fix with the absolute minimum risk. No customer communications were failing — just error logs filling up — so the fix needed to be conservative.',
      action: 'Chose props-only approach: our SQL is externalized in Spring Cloud Config, so I appended ORDER BY jpd_id DESC LIMIT 1 to the query property. Validated against 6 edge cases with live production data. Discovered the QA environment had been migrated from Docker Swarm to EKS without updating documentation — had to figure out the new config file naming and deployment process. Created an EKS Deep Dive guide for the team.',
      result: '69 errors/day → 0 instantly. Zero code change, zero downtime. EKS guide prevents future team confusion. Demonstrated lowest-risk fix strategy.',
    },
    {
      title: 'Federal Compliance Analysis',
      prompt: 'Tell me about working on compliance-sensitive requirements',
      situation: 'Our RTSN system violated the Telecom Act of 1996 by not notifying customers when their contact information was deleted. Only additions and updates generated notifications. Multiple external teams involved.',
      task: 'Analyze the full pipeline end-to-end and determine what changes UCC Hub needs to close the compliance gap.',
      action: 'Traced through 5+ repos spanning 4 organizations. Found the key insight: UCC Hub repos are passthroughs that need zero code changes — the real work is in Handlebars notification templates owned by another team. Identified a deduplication requirement and designed a template-level solution. Found 3 pre-existing bugs during analysis. Formulated precise questions for the external EDS team with sample payloads.',
      result: 'Comprehensive 4-phase action plan delivered. Zero UCC Hub code changes identified — saved our team engineering cycles. 3 pre-existing bugs reported. Federal compliance gap addressed.',
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
