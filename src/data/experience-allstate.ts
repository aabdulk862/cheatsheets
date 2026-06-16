import type { ExperiencePanelConfig } from './types';

export const allstateExperience: ExperiencePanelConfig = {
  mappings: [
    {
      topic: 'Test-First Development',
      level: 'proficient',
      evidence: [
        'Wrote 20 tests for the PSA NPE fix — captured actual failing production payloads from CloudWatch logs and encoded them as test fixtures',
        'Tests covered: both NPE crash vectors, null list input, empty list, single null element in middle, mixed nulls and values, all nulls, minimal valid payload, and full MapStruct integration',
        'Every test failed against the existing code (Red), then passed with my minimal fix (Green)',
        'Consciously rejected a simpler fix (filter nulls) because it would change downstream behavior — testable difference between "message fails properly" vs "message succeeds with missing data"',
        'Dismissed an Amazon Q automated code review suggestion with documented reasoning rather than blindly adding defensive code',
      ],
      talkingPoint: "For the PSA bug, I captured actual failing production payloads from CloudWatch and used them as test fixtures. I wrote 20 tests covering both NPE vectors, null lists, empty lists, nulls at different positions, and end-to-end MapStruct integration. Every test failed against the existing code first. Then I implemented the minimal fix — a HashMap.put() loop replacing Collectors.toMap(). The interesting decision was why I rejected the simpler approach. I could have just filtered out null values before collecting — one line, cleaner looking. But I traced downstream and found that filtering would make the message appear successful with missing data. Preserving nulls lets downstream validation catch them and create a proper failed record. That's a testable behavioral difference, and I verified it in my test suite. Amazon Q also flagged a potential issue in my code — I analyzed the specific execution path, determined it was a false positive because MapStruct's generated code calls my method before the flagged line could ever execute, and dismissed it with a documented comment.",
    },
    {
      topic: 'Clean Code Across Multiple Services',
      level: 'expert',
      evidence: [
        'Modified 42 error-generating call sites across 3 repositories (CPM, Ingestion API, Publisher) with a consistent pattern',
        'Pattern: lookup serial ID from DB → get pipe-delimited prefix → prepend to error description',
        'Design is extensible: adding a new error category = INSERT one row into the DB + reference the ID at the call site',
        'Backward compatible: old records without a pipe character are treated as uncategorized — nothing breaks',
        'Used Yoda conditions (constant on left) to prevent NPEs: "Wildfire".equalsIgnoreCase(value) returns false on null instead of crashing',
      ],
      talkingPoint: "I modified 42 call sites across 3 microservices with a consistent pattern. Each error-generating spot now looks up a serial ID from a cached database table, gets the structured prefix, and prepends it. The design is deliberately simple and extensible — if someone needs to add a new error category next month, they INSERT one row into the table and reference the ID. No code changes to the infrastructure. It's also backward compatible — old error records that don't have a pipe character are just treated as uncategorized. BI parses the new format with split('|', 4) and gets Category, SubCategory, Rule, and the original error text.",
    },
    {
      topic: 'Spring Service Architecture',
      level: 'expert',
      evidence: [
        'Built the Appointment Service from scratch as a standalone Spring Boot microservice — REST APIs + RabbitMQ messaging only',
        'Implemented @Cacheable for error category lookups — understood proxy self-invocation limitation (calling a @Cacheable method from the same class bypasses the cache)',
        'Spring Cloud Config externalized SQL: fix production queries without code deployment',
        'Dual persistence pattern: JDBC for high-throughput batch paths, JPA for single-record convenience — switchable at runtime via a config flag',
      ],
      talkingPoint: "I built a microservice from scratch — the Appointment Service. Clean constructor injection, no circular dependencies, just REST endpoints and RabbitMQ messaging. For the error categorization, I used @Cacheable on the repository so the 75-row config table loads once and gives O(1) lookups forever after. One gotcha I documented for the team: if you call a @Cacheable method from within the same class, the Spring proxy is bypassed and you hit the database every time. You have to call it from outside the bean for the cache to work. I also use a dual persistence pattern — JDBC NamedParameterJdbcTemplate for batch performance, JPA for single-record convenience. A runtime config flag switches between them.",
    },
    {
      topic: 'Pair Programming Readiness',
      level: 'proficient',
      evidence: [
        'Coordinated code across 4+ parallel workstreams — stored proc developer, arbitration team, BI analysts, and QA',
        'Adapted when BI changed the ID scheme 3 times mid-sprint — maintained cross-reference tables, caught 10 rules they missed',
        'Incorporated code review feedback: switched from ConcurrentHashMap to Spring @Cacheable based on team input',
        'Comfortable explaining trade-offs out loud: "we could filter nulls here but that changes downstream behavior in ways that are hard to detect"',
      ],
      talkingPoint: "I'm comfortable thinking out loud and explaining my reasoning. When I was deciding between filtering nulls or preserving them, I walked through the downstream path explaining: if we filter, the template parameter map is missing keys. Downstream code checks containsKey — it's not there, so it skips the field. The message processes successfully but with incomplete data. No failed record. No alert. Nobody ever knows. If we preserve nulls, downstream validation catches them and creates a proper failed record. That's the kind of trade-off discussion I'd have with a pairing partner.",
    },
  ],
  stories: [
    {
      title: 'Test-First Production Bug Fix',
      prompt: 'Walk me through your TDD workflow',
      situation: 'A production NPE was silently dropping 16,000 messages per hour. Two crash vectors existed in a MapStruct mapper — one in a Collectors.toMap() call, one in a null.equalsIgnoreCase() comparison.',
      task: 'Fix with comprehensive test coverage that prevents recurrence, using actual production data.',
      action: 'Pulled failing payloads from CloudWatch logs. Wrote 20 tests first — all failed against current code (Red). Implemented minimal fix: HashMap.put() loop and Yoda condition (Green). Rejected simpler filter approach because it would change observable behavior. Dismissed Amazon Q false positive with documented reasoning.',
      result: 'Zero NPEs post-deploy. 20 regression tests encoded with real prod payloads. Trade-off documented for future engineers.',
    },
    {
      title: 'Adapting to Rapid Requirement Changes',
      prompt: 'Tell me about a time requirements changed mid-sprint',
      situation: 'BI team changed the error categorization ID scheme 3 separate times during implementation — from 58 rules to 57, then expanded to 74. Each change invalidated previous INSERT statements and code references.',
      task: 'Remap all implementation without missing the release deadline, while multiple teams worked in parallel.',
      action: 'Maintained a cross-reference table (old IDs → new IDs). Regenerated all SQL INSERT statements each time. Verified all 94 error patterns still mapped correctly to the new scheme. Caught 10 rules BI missed in their own spreadsheet. Communicated impact immediately on each change rather than silently absorbing scope.',
      result: 'Delivered on schedule despite 3 scope changes. All 94 patterns validated. BI acknowledged the rules I caught that they missed.',
    },
  ],
  gaps: [
    { topic: 'Java 21 / Spring Boot (production depth)', status: 'strong' },
    { topic: 'Testing with real production data', status: 'strong' },
    { topic: 'Clean code at scale (42 sites, 3 repos)', status: 'strong' },
    { topic: 'Spring Cache & proxy awareness', status: 'strong' },
    { topic: 'Collaborative development (4+ teams)', status: 'strong' },
    { topic: 'Formal TDD live demo', status: 'partial', note: 'Test-first for bugs — practice live kata (String Calculator, Roman Numerals)' },
    { topic: 'XP-style pairing (switching driver/navigator)', status: 'partial', note: 'Collaborative but not formal XP — practice think-aloud for 30+ min' },
    { topic: 'Mockito advanced APIs', status: 'partial', note: 'Review ArgumentCaptor, verify(times()), custom matchers' },
  ],
};
