# Allstate — Experience Mapping (Deep)

> Interview: Recruiter Screen → Technical Coding → Pair Programming/TDD Round  
> Tabs: TDD Patterns | Java/Spring Patterns | Likely Questions | Game Plan

---

## TDD Patterns

### Test-First Evidence — 31+ Tests Written

**PSA NPE Fix (20 tests):**
- Both NPE vectors covered: `templateParamsConversion()` null crash + `customTemplateName()` null equalsIgnoreCase
- Real prod payloads as test fixtures (captured from CloudWatch logs)
- Edge cases: null list, empty list, single null element, mixed nulls/values, all nulls, minimal valid payload
- Integration: MapStruct-generated impl tested end-to-end (not just interface)
- Regression safety: exact failing payloads encoded so bug can never recur
- Dismissed Amazon Q false positive with documented reasoning (chose not to add unnecessary defensive code)

**Error Categorization Testing:**
- Verified correct ID mapping at each of 42 call sites
- Validated pipe-delimiter format matches BI's `split("|", 4)` parser
- Tested `resolveProcReason()` parsing: with pipe, without pipe, null, empty string
- Cache behavior: first call loads, subsequent calls hit cache

**Talking Point:** "For the PSA fix, I captured actual failing payloads from CloudWatch production logs and encoded them as test fixtures. I had 20 tests covering: both NPE vectors, null lists, empty lists, mixed nulls, minimal valid payloads, and end-to-end MapStruct integration. Every test failed first against the current code (Red), then passed with my minimal fix (Green)."

---

### Testing Patterns Demonstrated

| Pattern | Evidence |
|---|---|
| **Test fixtures from prod** | Real AOM payloads from CloudWatch as test input |
| **Boundary testing** | `Collectors.toMap()` with 0, 1, many items; null at first/middle/last position |
| **Edge case exhaustion** | null, empty, missing fields, unexpected types, minimal valid |
| **Integration testing** | MapStruct-generated impl (not mocked interface) |
| **Regression encoding** | Exact prod payloads that triggered bugs — guarantees non-recurrence |
| **Decision testing** | Chose NOT to filter nulls because it changes downstream behavior (testable difference) |
| **False positive handling** | Dismissed Amazon Q suggestion with documented reasoning instead of blindly adding code |

---

### Pair Programming Readiness

**Evidence of collaborative development:**
- Coordinated with Shankar (OTP encryption — code review + deployment handoff)
- Coordinated with Gopi (stored procedure format integration — `ID| text` parsing)
- Coordinated with Sai (CPNI investigation — traced call chain together)
- Coordinated with Jena/Smruti (arbitration — parallel workstream convergence)
- Adapted to BI team's requirement changes 3 times mid-sprint without friction
- Code review feedback incorporated across 3 separate MRs in 3 repos

**How I'd approach pair programming:**
1. Start by discussing expected behavior ("what should the test assert?")
2. Write the test first — agree on interface before implementation
3. Think out loud while navigating unfamiliar code ("I see this calls X, which probably does Y")
4. Welcome pushback — explain trade-offs explicitly ("we could filter nulls, but that changes downstream...")

---

## Java/Spring Patterns

### Clean Code at Scale — 42 Call Sites

**Pattern Applied Consistently:**
```java
// Before (freeform text, unstructured):
setErrorDescription("TEMPLATE/SYSPRINAGENT not enabled for communication");

// After (structured, categorized):
setErrorDescription(extractCategoryConfig.getDescription(86) + dynamicText);
// Produces: "Extraction|Template Error|Template Not Enabled|TEMPLATE/SYSPRINAGENT..."
```

**Design decisions for clean code:**
- `ExtractCategoryConfig`: thin wrapper over `JobDetailsDAO` — single responsibility
- `@Cacheable("extractCategoryMappings")` on DAO: O(1) after first access, ~75 rows static config
- Two integration patterns: direct ID reference (code-owned) vs proc parsing (DB-developer-owned)
- New error = INSERT row + use ID at call site (no code changes to existing infrastructure)
- Fallback: if no pipe in string, existing behavior unchanged (backward compatible)

---

### Spring Boot Service Design — EXPERT

**Evidence:**
- Built standalone Appointment Service from scratch: REST + RabbitMQ, stripped 4 dependency trees (Kafka, S3, Batch, Glympse)
- Implemented `@Cacheable` across 3 services with proper `CacheConfig` registration
- Spring Cloud Config: externalized SQL enables props-only hotfixes
- Jasypt: `@EnableEncryptableProperties` for encrypted DB credentials and OTP secrets
- Dual persistence: JDBC mode for batch performance, JPA mode for convenience (runtime switchable)
- `@Async` with custom thread pool + fallback pattern (not default `SimpleAsyncTaskExecutor`)
- Understood proxy self-invocation limitation: `@Cacheable` on method called from same class = cache bypassed

**Talking Point:** "I'm aware of Spring proxy pitfalls. `@Cacheable` on a method only works when called from outside the class — self-invocation bypasses the proxy. Same issue killed a `@TimeLimiter` annotation I found on a private method. I documented these for the team and structured my cache calls to always go through the proxy."

---

### Design for Testability

**Evidence:**
- `ExtractCategoryConfig` is injectable — mock the repository in tests, verify correct prefix for each ID
- MapStruct interface with `@Named` default methods — unit test conversion logic without generated impl
- Dual persistence (JDBC/JPA) — each testable independently
- Circuit breaker state exposed via endpoints — testable integration
- Spring Batch steps individually testable (ItemReader, ItemProcessor, ItemWriter can be unit tested)
- Config-driven behavior (feature flags) — tests can verify both paths

---

## Behavioral

### "Describe your TDD workflow"
"I capture production conditions as test input. For the PSA fix, I pulled failing payloads from CloudWatch, wrote 20 tests that all failed against current code, then implemented the minimal fix — a `HashMap.put()` loop replacing `Collectors.toMap()`. The refactoring step was minimal because the bug was a missing null guard, not a design problem. I consciously rejected a simpler `.filter()` approach because it would change downstream behavior in a way that's hard to test for."

### "How do you handle changing requirements?"
"During error categorization, BI changed the ID scheme 3 times — from 58 rules to 57, then expanded to 74. Each time, I maintained a cross-reference (old→new IDs), regenerated SQL INSERT statements, and verified the 94 error patterns still mapped correctly to the new IDs. I caught 10 rules BI missed in their own spreadsheet. Communication was key — I flagged impacts immediately rather than silently absorbing scope creep."

### "How do you approach pair programming?"
"I think out loud and make my reasoning visible. For the null-preservation decision, I'd say: 'We have two options — filter nulls before collection (simpler) or preserve them with HashMap.put(). Let me trace what happens downstream in each case.' Then I'd walk through the code showing that filtered nulls = missing keys = message appears successful = no failed job record = silent data loss. That's the kind of reasoning I'd share with a pairing partner."

### "Tell me about a time you disagreed with a tool/process"
"Amazon Q flagged my PSA fix for a potential null issue. I analyzed the specific execution path — the MapStruct generated code calls `templateParamsConversion()` before `customTemplateName()`, so the null would be handled by my fix before reaching the flagged line. I dismissed it with a documented comment explaining why, rather than adding unnecessary defensive code that would obscure the actual logic."

---

## Gap Analysis

### Strong Matches
- Java 21 / Spring Boot (daily production, deep internals)
- Testing (31+ tests, real prod data, edge case exhaustion, regression encoding)
- Clean code (consistent patterns across 42 sites, backward compatible)
- Spring Cache, Config, Batch understanding
- Collaborative development (multi-team coordination, code review cycles)
- Design for testability (injectable dependencies, config-driven, proxy-aware)

### Partial Matches
- Formal TDD (wrote tests first for bug fixes; may not always test-first for new features)
- Pair programming (collaborative but not formal XP-style pairing)
- Mockito advanced (used, but should review ArgumentCaptor, custom matchers)

### Study Priorities
1. **Live TDD kata practice** — String Calculator, Roman Numerals, Bowling with timer
2. **JUnit 5 API review** — `@ParameterizedTest`, `@Nested`, `assertAll`, `assertThrows`
3. **Mockito depth** — `verify(times(n))`, `ArgumentCaptor`, `@InjectMocks`, `doReturn` vs `when`
4. **Think-aloud practice** — narrate while coding for 30+ min continuously
5. **Refactoring patterns** — Extract Method, Rename, Replace Conditional with Polymorphism
