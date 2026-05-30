import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

/**
 * Allstate interview cheatsheet data.
 * Focus: TDD, Pair Programming, Java/Spring Boot, Clean Code.
 * Process: Recruiter Screen → Technical Coding → Pair Programming/TDD Round
 */

// ─── Company Configuration ───────────────────────────────────────────────────

export const allstateConfig: CompanyConfig = {
  slug: 'allstate',
  title: 'Allstate Technical Interview — Cheat Sheet',
  subtitle: 'Recruiter Screen → Technical Coding → Pair Programming/TDD Round',
  accentColor: '#003DA5',
  accentSecondary: '#FF6900',
  timerMinutes: 60,
  tabs: [
    { id: 'tdd', label: 'TDD Patterns' },
    { id: 'java', label: 'Java/Spring Patterns' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
  ],
};

// ─── TDD Pattern Sections ────────────────────────────────────────────────────

export const allstateTddPatterns: PatternSection[] = [
  {
    label: 'Red-Green-Refactor Cycle',
    cards: [
      {
        title: 'Red-Green-Refactor',
        lang: 'java',
        description:
          'The core TDD loop: write a failing test (Red), make it pass with minimal code (Green), then improve the design (Refactor).',
        code: `// 1. RED — Write a failing test
@Test
void shouldAddTwoNumbers() {
    Calculator calc = new Calculator();
    assertEquals(5, calc.add(2, 3)); // Fails: class doesn't exist
}

// 2. GREEN — Minimal implementation
public class Calculator {
    public int add(int a, int b) {
        return a + b; // Just enough to pass
    }
}

// 3. REFACTOR — Improve design (extract, rename, simplify)
// No duplication here, but in real code: extract methods,
// rename for clarity, remove magic numbers.`,
        metaTags: ['TDD', 'Red-Green-Refactor', 'JUnit 5'],
      },
    ],
  },
  {
    label: 'Test-First Development with JUnit 5',
    cards: [
      {
        title: 'JUnit 5 Test Structure',
        lang: 'java',
        description:
          'Standard JUnit 5 test class with lifecycle annotations, nested tests, and parameterized tests.',
        code: `import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

@DisplayName("UserService Tests")
class UserServiceTest {

    private UserService service;

    @BeforeEach
    void setUp() {
        service = new UserService(new InMemoryUserRepo());
    }

    @Test
    @DisplayName("should create user with valid email")
    void shouldCreateUserWithValidEmail() {
        User user = service.create("alice@example.com");
        assertNotNull(user.getId());
        assertEquals("alice@example.com", user.getEmail());
    }

    @ParameterizedTest
    @CsvSource({"'', false", "'bad', false", "'a@b.com', true"})
    void shouldValidateEmail(String email, boolean expected) {
        assertEquals(expected, service.isValidEmail(email));
    }

    @Nested
    @DisplayName("when user already exists")
    class WhenUserExists {
        @Test
        void shouldThrowOnDuplicateEmail() {
            service.create("bob@example.com");
            assertThrows(DuplicateEmailException.class,
                () -> service.create("bob@example.com"));
        }
    }
}`,
        metaTags: ['JUnit 5', 'test-first', 'parameterized', 'nested'],
      },
    ],
  },
  {
    label: 'Mocking with Mockito',
    cards: [
      {
        title: 'Mockito Mocking & Verification',
        lang: 'java',
        description:
          'Use Mockito to isolate units under test by mocking dependencies, stubbing return values, and verifying interactions.',
        code: `import static org.mockito.Mockito.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private PaymentGateway paymentGateway;

    @Mock
    private InventoryService inventory;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldProcessOrderWhenPaymentSucceeds() {
        // Arrange (stub)
        when(inventory.isAvailable("SKU-123", 2)).thenReturn(true);
        when(paymentGateway.charge(anyDouble())).thenReturn(true);

        // Act
        Order order = orderService.place("SKU-123", 2);

        // Assert
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        verify(paymentGateway).charge(49.98);
        verify(inventory).reserve("SKU-123", 2);
    }

    @Test
    void shouldRejectOrderWhenOutOfStock() {
        when(inventory.isAvailable("SKU-123", 2)).thenReturn(false);

        assertThrows(OutOfStockException.class,
            () -> orderService.place("SKU-123", 2));

        verify(paymentGateway, never()).charge(anyDouble());
    }
}`,
        metaTags: ['Mockito', 'mocking', 'verify', 'stubbing'],
      },
    ],
  },
  {
    label: 'Assertion Patterns',
    cards: [
      {
        title: 'AssertJ Fluent Assertions',
        lang: 'java',
        description:
          'Fluent assertion patterns with AssertJ for readable, expressive test assertions beyond basic assertEquals.',
        code: `import static org.assertj.core.api.Assertions.*;

@Test
void shouldReturnFilteredUsers() {
    List<User> users = service.findActiveUsers();

    assertThat(users)
        .isNotEmpty()
        .hasSize(3)
        .extracting(User::getEmail)
        .containsExactlyInAnyOrder(
            "alice@example.com",
            "bob@example.com",
            "carol@example.com"
        );
}

@Test
void shouldThrowWithMessage() {
    assertThatThrownBy(() -> service.findById(null))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("ID must not be null");
}

@Test
void shouldSatisfyMultipleConditions() {
    User user = service.create("dave@example.com");

    assertThat(user).satisfies(u -> {
        assertThat(u.getId()).isPositive();
        assertThat(u.getEmail()).contains("@");
        assertThat(u.getCreatedAt()).isBeforeOrEqualTo(Instant.now());
    });
}`,
        metaTags: ['AssertJ', 'assertions', 'fluent', 'testing'],
      },
    ],
  },
];

// ─── Java/Spring Pattern Sections ────────────────────────────────────────────

export const allstateJavaPatterns: PatternSection[] = [
  {
    label: 'REST Controller Structure',
    cards: [
      {
        title: 'Spring REST Controller',
        lang: 'java',
        description:
          'Standard Spring Boot REST controller with request mapping, path variables, request body validation, and response entities.',
        code: `@RestController
@RequestMapping("/api/v1/policies")
@Validated
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    public ResponseEntity<List<PolicyDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<PolicyDto> policies = policyService.findAll(page, size);
        return ResponseEntity.ok(policies.getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyDto> getById(@PathVariable Long id) {
        return policyService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PolicyDto> create(
            @Valid @RequestBody CreatePolicyRequest request) {
        PolicyDto created = policyService.create(request);
        URI location = URI.create("/api/v1/policies/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }
}`,
        metaTags: ['REST', 'Spring Boot', 'controller', 'CRUD'],
      },
    ],
  },
  {
    label: 'Service Layer with Dependency Injection',
    cards: [
      {
        title: 'Service Layer with Constructor DI',
        lang: 'java',
        description:
          'Service class using constructor injection for testability, with transactional boundaries and business logic separation.',
        code: `@Service
@Transactional(readOnly = true)
public class ClaimService {

    private final ClaimRepository claimRepo;
    private final PolicyRepository policyRepo;
    private final NotificationService notifier;

    // Constructor injection — preferred over @Autowired field injection
    public ClaimService(ClaimRepository claimRepo,
                        PolicyRepository policyRepo,
                        NotificationService notifier) {
        this.claimRepo = claimRepo;
        this.policyRepo = policyRepo;
        this.notifier = notifier;
    }

    @Transactional
    public Claim fileClaim(Long policyId, ClaimRequest request) {
        Policy policy = policyRepo.findById(policyId)
            .orElseThrow(() -> new PolicyNotFoundException(policyId));

        if (!policy.isActive()) {
            throw new InactivePolicyException(policyId);
        }

        Claim claim = Claim.builder()
            .policy(policy)
            .amount(request.getAmount())
            .description(request.getDescription())
            .status(ClaimStatus.PENDING)
            .build();

        Claim saved = claimRepo.save(claim);
        notifier.sendClaimFiled(saved);
        return saved;
    }
}`,
        metaTags: ['service', 'DI', 'constructor injection', 'transactional'],
      },
    ],
  },
  {
    label: 'Exception Handling',
    cards: [
      {
        title: 'Global Exception Handler',
        lang: 'java',
        description:
          'Centralized exception handling with @ControllerAdvice, custom exceptions, and structured error responses.',
        code: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors().stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .toList();

        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            LocalDateTime.now(),
            errors
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            LocalDateTime.now()
        );
        return ResponseEntity.status(500).body(error);
    }
}`,
        metaTags: ['exception handling', 'ControllerAdvice', 'error response'],
      },
    ],
  },
  {
    label: 'Integration Testing',
    cards: [
      {
        title: 'Spring Boot Integration Test',
        lang: 'java',
        description:
          'Full integration test with @SpringBootTest, MockMvc, and test database for end-to-end API verification.',
        code: `@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Rolls back after each test
class PolicyControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PolicyRepository policyRepo;

    @Test
    void shouldCreateAndRetrievePolicy() throws Exception {
        String json = """
            {
                "holderName": "Jane Doe",
                "type": "AUTO",
                "premium": 150.00
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/v1/policies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.holderName").value("Jane Doe"))
            .andExpect(jsonPath("$.id").isNumber())
            .andReturn();

        Long id = JsonPath.read(result.getResponse()
            .getContentAsString(), "$.id");

        mockMvc.perform(get("/api/v1/policies/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.type").value("AUTO"));
    }

    @Test
    void shouldReturn404ForMissingPolicy() throws Exception {
        mockMvc.perform(get("/api/v1/policies/9999"))
            .andExpect(status().isNotFound());
    }
}`,
        metaTags: ['integration test', 'MockMvc', 'SpringBootTest'],
      },
    ],
  },
  {
    label: 'Refactoring Techniques',
    cards: [
      {
        title: 'Extract Method',
        lang: 'java',
        description:
          'Extract a block of code into a named method to improve readability and enable reuse.',
        code: `// BEFORE: Long method with mixed concerns
public double calculateTotal(Order order) {
    double subtotal = 0;
    for (LineItem item : order.getItems()) {
        subtotal += item.getPrice() * item.getQuantity();
    }
    double tax = subtotal * 0.08;
    double discount = order.hasPromo() ? subtotal * 0.1 : 0;
    return subtotal + tax - discount;
}

// AFTER: Extracted methods with clear names
public double calculateTotal(Order order) {
    double subtotal = calculateSubtotal(order);
    double tax = calculateTax(subtotal);
    double discount = calculateDiscount(order, subtotal);
    return subtotal + tax - discount;
}

private double calculateSubtotal(Order order) {
    return order.getItems().stream()
        .mapToDouble(i -> i.getPrice() * i.getQuantity())
        .sum();
}

private double calculateTax(double subtotal) {
    return subtotal * TAX_RATE;
}

private double calculateDiscount(Order order, double subtotal) {
    return order.hasPromo() ? subtotal * PROMO_RATE : 0;
}`,
        metaTags: ['refactoring', 'extract method', 'clean code'],
      },
      {
        title: 'Replace Conditional with Polymorphism',
        lang: 'java',
        description:
          'Eliminate complex switch/if-else chains by using polymorphism and the Strategy pattern.',
        code: `// BEFORE: Switch on type
public double calculatePremium(Policy policy) {
    switch (policy.getType()) {
        case AUTO: return policy.getValue() * 0.05;
        case HOME: return policy.getValue() * 0.03;
        case LIFE: return policy.getValue() * 0.02;
        default: throw new IllegalArgumentException();
    }
}

// AFTER: Polymorphic strategy
public interface PremiumCalculator {
    double calculate(Policy policy);
}

public class AutoPremiumCalculator implements PremiumCalculator {
    public double calculate(Policy policy) {
        return policy.getValue() * 0.05;
    }
}

// Usage with DI
@Service
public class PremiumService {
    private final Map<PolicyType, PremiumCalculator> calculators;

    public double calculatePremium(Policy policy) {
        return calculators.get(policy.getType()).calculate(policy);
    }
}`,
        metaTags: ['refactoring', 'polymorphism', 'strategy pattern'],
      },
      {
        title: 'Introduce Parameter Object',
        lang: 'java',
        description:
          'Group related parameters into a value object to reduce method signature complexity.',
        code: `// BEFORE: Too many parameters
public List<Policy> search(String holderName, String type,
        LocalDate startDate, LocalDate endDate,
        Double minPremium, Double maxPremium) {
    // ...
}

// AFTER: Parameter object
public record PolicySearchCriteria(
    String holderName,
    PolicyType type,
    LocalDate startDate,
    LocalDate endDate,
    Double minPremium,
    Double maxPremium
) {
    public static PolicySearchCriteria byHolder(String name) {
        return new PolicySearchCriteria(name, null, null, null, null, null);
    }
}

public List<Policy> search(PolicySearchCriteria criteria) {
    return policyRepo.findAll(toSpecification(criteria));
}`,
        metaTags: ['refactoring', 'parameter object', 'value object'],
      },
    ],
  },
  {
    label: 'SOLID Principles',
    cards: [
      {
        title: 'SOLID in Practice',
        lang: 'java',
        description:
          'SOLID principles applied in a Spring Boot context: SRP, OCP, LSP, ISP, DIP demonstrated with real patterns.',
        code: `// S — Single Responsibility: One reason to change
@Service
public class ClaimValidator { /* only validation logic */ }

@Service
public class ClaimProcessor { /* only processing logic */ }

// O — Open/Closed: Open for extension, closed for modification
public interface NotificationChannel {
    void send(String message, String recipient);
}
// Add new channels without modifying existing code
@Component class EmailChannel implements NotificationChannel { ... }
@Component class SmsChannel implements NotificationChannel { ... }

// L — Liskov Substitution: Subtypes are substitutable
// Any NotificationChannel works wherever the interface is expected

// I — Interface Segregation: Clients depend only on what they use
public interface Readable { Policy read(Long id); }
public interface Writable { Policy save(Policy p); }
// Clients inject only the interface they need

// D — Dependency Inversion: Depend on abstractions
@Service
public class ClaimService {
    private final ClaimRepository repo; // interface, not impl
    public ClaimService(ClaimRepository repo) {
        this.repo = repo;
    }
}`,
        metaTags: ['SOLID', 'clean code', 'design principles'],
      },
    ],
  },
  {
    label: 'Code Smell Identification',
    cards: [
      {
        title: 'Common Code Smells & Fixes',
        lang: 'java',
        description:
          'Identify and fix code smells: Long Method, Feature Envy, God Class, Primitive Obsession, and Shotgun Surgery.',
        code: `// SMELL 1: Long Method — method does too many things
// Fix: Extract Method (break into smaller focused methods)

// SMELL 2: Feature Envy — method uses another class's data more
// than its own
// BAD:
public double getDiscountedPrice(Customer c) {
    if (c.getType() == PREMIUM && c.getYears() > 5
            && c.getOrders() > 100) {
        return price * 0.8;
    }
    return price;
}
// FIX: Move logic to Customer class
public double getDiscountedPrice(Customer c) {
    return price * c.getDiscountMultiplier();
}

// SMELL 3: God Class — class has too many responsibilities
// Fix: Extract Class — split into focused collaborators

// SMELL 4: Primitive Obsession — using primitives for domain concepts
// BAD: String email, String phone, double amount
// FIX: Value objects
public record Email(String value) {
    public Email {
        if (!value.matches(".+@.+\\\\..+"))
            throw new IllegalArgumentException("Invalid email");
    }
}

// SMELL 5: Shotgun Surgery — one change requires edits in many classes
// Fix: Move Method / Inline Class to consolidate related logic`,
        metaTags: ['code smells', 'refactoring', 'clean code', 'anti-patterns'],
      },
    ],
  },
];

// ─── Likely Questions ────────────────────────────────────────────────────────

export const allstateQuestions: QuestionItem[] = [
  {
    name: 'Explain Red-Green-Refactor to a Non-Practitioner',
    diff: 'easy',
    hint: 'Use an analogy: write a recipe, cook it, then improve the recipe',
    lang: 'java',
    code: `/*
 * Red-Green-Refactor explained simply:
 *
 * 1. RED: Write a test that describes what you WANT the code to do.
 *    It fails because the code doesn't exist yet. This is intentional —
 *    it proves your test can actually detect failure.
 *
 * 2. GREEN: Write the SIMPLEST code that makes the test pass.
 *    Don't over-engineer. Just satisfy the test.
 *
 * 3. REFACTOR: Now that it works, clean it up.
 *    Remove duplication, improve names, simplify logic.
 *    Run tests again to confirm nothing broke.
 *
 * Analogy: Writing an essay
 *   - RED: Write the thesis statement (what you want to say)
 *   - GREEN: Write a rough draft that supports the thesis
 *   - REFACTOR: Edit for clarity, remove redundancy, polish
 *
 * Key benefit: You always have working, tested code.
 * You never go more than a few minutes without a green bar.
 */

// Example: FizzBuzz TDD
@Test void shouldReturnFizzForMultiplesOf3() {
    assertEquals("Fizz", fizzBuzz(3));
    assertEquals("Fizz", fizzBuzz(9));
}

// Minimal green:
String fizzBuzz(int n) {
    if (n % 3 == 0) return "Fizz";
    return String.valueOf(n);
}`,
  },
  {
    name: 'Handling Disagreements About Testing Approach',
    diff: 'medium',
    hint: 'Focus on collaboration: listen, propose experiment, defer to data',
    lang: 'java',
    code: `/*
 * Scenario: Your pair partner wants to write the implementation first,
 * then add tests. You prefer test-first. How do you handle it?
 *
 * Strategy:
 * 1. LISTEN first — understand their reasoning
 *    "What's your concern with writing the test first here?"
 *
 * 2. ACKNOWLEDGE their perspective
 *    "I see — you want to explore the design space before committing
 *     to a test structure. That makes sense for complex problems."
 *
 * 3. PROPOSE a small experiment
 *    "How about we try test-first for the next 10 minutes?
 *     If it feels awkward, we can switch approaches."
 *
 * 4. FIND middle ground
 *    - Spike (explore without tests) → then TDD the real impl
 *    - Write a high-level acceptance test first, then code freely
 *    - Alternate: they drive implementation, you drive tests
 *
 * 5. DEFER to data
 *    "Let's try both on small pieces and see which gives us
 *     more confidence in the code."
 *
 * Key principles:
 * - Never make it personal or dogmatic
 * - The goal is working, well-tested software — not "winning"
 * - Pair programming is about shared ownership
 */`,
  },
  {
    name: 'Determining What to Test',
    diff: 'medium',
    hint: 'Test behavior not implementation; focus on boundaries and contracts',
    lang: 'java',
    code: `/*
 * What to test — a decision framework:
 *
 * 1. TEST BEHAVIOR, NOT IMPLEMENTATION
 *    - Test what the method DOES, not HOW it does it
 *    - If you refactor internals, tests should still pass
 *
 * 2. PRIORITIZE by risk:
 *    - Business logic (calculations, rules, state transitions)
 *    - Edge cases (null, empty, boundary values)
 *    - Integration points (DB, APIs, external services)
 *
 * 3. SKIP:
 *    - Trivial getters/setters (unless they have logic)
 *    - Framework code (Spring already tests @GetMapping works)
 *    - Private methods directly (test through public API)
 */

// Example: What to test for a ClaimService
@Test void shouldRejectClaimExceedingPolicyLimit() { ... }
@Test void shouldCalculateDeductibleCorrectly() { ... }
@Test void shouldTransitionStatusFromPendingToApproved() { ... }
@Test void shouldNotifyAdjusterOnHighValueClaim() { ... }

// What NOT to test:
// - That Spring injects the dependency (framework's job)
// - That JPA saves to DB (integration test covers this)
// - The exact SQL generated (brittle, implementation detail)

/*
 * Test Pyramid:
 *   /\\    E2E (few, slow, high confidence)
 *  /  \\   Integration (some, medium speed)
 * /____\\  Unit (many, fast, focused)
 */`,
  },
  {
    name: 'TDD Kata: String Calculator',
    diff: 'medium',
    hint: 'Classic TDD kata — add numbers from a delimited string',
    lang: 'java',
    code: `// String Calculator Kata — TDD approach
// Rule: "1,2,3" → 6, "" → 0, supports custom delimiters

// Step 1: Empty string returns 0
@Test void emptyStringReturnsZero() {
    assertEquals(0, calculator.add(""));
}

// Step 2: Single number returns itself
@Test void singleNumberReturnsValue() {
    assertEquals(1, calculator.add("1"));
}

// Step 3: Two numbers comma-separated
@Test void twoNumbersReturnSum() {
    assertEquals(3, calculator.add("1,2"));
}

// Implementation evolves with each test:
public class StringCalculator {
    public int add(String numbers) {
        if (numbers.isEmpty()) return 0;

        String delimiter = ",";
        String body = numbers;

        // Custom delimiter: "//[delimiter]\\n[numbers]"
        if (numbers.startsWith("//")) {
            int nlIndex = numbers.indexOf("\\n");
            delimiter = Pattern.quote(numbers.substring(2, nlIndex));
            body = numbers.substring(nlIndex + 1);
        }

        return Arrays.stream(body.split(delimiter + "|\\\\n"))
            .mapToInt(Integer::parseInt)
            .peek(n -> { if (n < 0) throw new IllegalArgumentException(
                "Negatives not allowed: " + n); })
            .filter(n -> n <= 1000)
            .sum();
    }
}`,
  },
  {
    name: 'Design a REST API for Insurance Claims',
    diff: 'hard',
    hint: 'RESTful resources, proper HTTP verbs, status codes, validation',
    lang: 'java',
    code: `// REST API Design for Claims Management

// Resource: /api/v1/claims
// POST   /api/v1/claims          → Create new claim (201)
// GET    /api/v1/claims          → List claims with pagination (200)
// GET    /api/v1/claims/{id}     → Get claim details (200 / 404)
// PATCH  /api/v1/claims/{id}     → Update claim (200 / 404)
// POST   /api/v1/claims/{id}/approve → Approve claim (200)
// POST   /api/v1/claims/{id}/deny    → Deny claim (200)

@RestController
@RequestMapping("/api/v1/claims")
public class ClaimController {

    @PostMapping
    public ResponseEntity<ClaimResponse> create(
            @Valid @RequestBody CreateClaimRequest req) {
        ClaimResponse claim = claimService.create(req);
        return ResponseEntity
            .created(URI.create("/api/v1/claims/" + claim.getId()))
            .body(claim);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ClaimResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ClaimStatus status) {
        return ResponseEntity.ok(claimService.findAll(page, size, status));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ClaimResponse> approve(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequest req) {
        return ResponseEntity.ok(claimService.approve(id, req));
    }
}

// Error response structure
public record ErrorResponse(
    int status,
    String message,
    LocalDateTime timestamp,
    List<String> details
) {}`,
  },
  {
    name: 'Refactoring Legacy Code Safely',
    diff: 'hard',
    hint: 'Characterization tests first, then small safe refactoring steps',
    lang: 'java',
    code: `/*
 * Strategy for refactoring legacy code without breaking things:
 *
 * 1. CHARACTERIZATION TESTS — capture current behavior
 *    Write tests that document what the code ACTUALLY does,
 *    even if that behavior seems wrong. This is your safety net.
 *
 * 2. SMALL STEPS — one refactoring at a time
 *    - Extract Method
 *    - Rename for clarity
 *    - Introduce Parameter Object
 *    - Replace conditional with polymorphism
 *    Run tests after EVERY step.
 *
 * 3. SEAM IDENTIFICATION — find places to inject test doubles
 */

// Example: Refactoring a legacy premium calculator
// Step 1: Write characterization test
@Test void legacyBehavior_autoPolicyAge5() {
    // Documents current behavior (even if "wrong")
    assertEquals(450.0, legacyCalc.calculate("AUTO", 5, 10000));
}

// Step 2: Extract method
private double getBaseRate(String type) {
    return switch (type) {
        case "AUTO" -> 0.05;
        case "HOME" -> 0.03;
        default -> 0.04;
    };
}

// Step 3: Introduce interface for testability
public interface RateProvider {
    double getRate(String policyType, int yearsActive);
}

// Step 4: Replace legacy code with new implementation
// Tests still pass → safe to continue`,
  },
  {
    name: 'Distributed Systems: Event-Driven Architecture',
    diff: 'hard',
    hint: 'Eventual consistency, event sourcing, saga pattern for transactions',
    lang: 'java',
    code: `/*
 * Key distributed systems concepts for insurance domain:
 *
 * 1. EVENT-DRIVEN ARCHITECTURE
 *    - Services communicate via events (async, decoupled)
 *    - Event: "ClaimFiled", "PolicyUpdated", "PaymentProcessed"
 *    - Enables eventual consistency across microservices
 *
 * 2. SAGA PATTERN — distributed transactions
 *    - No single DB transaction spans services
 *    - Each step has a compensating action for rollback
 */

// Saga: Process Claim Payment
// Step 1: Validate claim → Step 2: Reserve funds → Step 3: Issue payment
// If Step 3 fails → Compensate: Release funds → Mark claim as failed

@Service
public class ClaimPaymentSaga {

    public void execute(Long claimId) {
        try {
            Claim claim = claimService.validate(claimId);
            String reservationId = fundService.reserve(claim.getAmount());
            paymentService.issue(claim, reservationId);
            claimService.markPaid(claimId);
        } catch (PaymentFailedException e) {
            fundService.release(e.getReservationId());
            claimService.markFailed(claimId, e.getMessage());
            eventBus.publish(new ClaimPaymentFailed(claimId));
        }
    }
}

/*
 * 3. IDEMPOTENCY — safe retries
 *    - Use idempotency keys for payment operations
 *    - Deduplication at the consumer level
 *
 * 4. CIRCUIT BREAKER — prevent cascade failures
 *    - If payment service is down, fail fast
 *    - Retry with exponential backoff
 */`,
  },
  {
    name: 'Web Security: OWASP Top 10 in Spring Boot',
    diff: 'medium',
    hint: 'SQL injection, XSS, CSRF, auth — and how Spring mitigates them',
    lang: 'java',
    code: `/*
 * Key web security patterns for Spring Boot applications:
 */

// 1. SQL Injection Prevention — Use parameterized queries
@Query("SELECT p FROM Policy p WHERE p.holderName = :name")
List<Policy> findByHolder(@Param("name") String name);
// NEVER: "SELECT * FROM policy WHERE name = '" + name + "'"

// 2. XSS Prevention — Escape output, validate input
@PostMapping("/claims")
public ResponseEntity<Claim> create(
        @Valid @RequestBody CreateClaimRequest req) {
    // @Valid triggers Bean Validation
    // Spring's Jackson serializer escapes HTML by default
    return ResponseEntity.ok(claimService.create(req));
}

// Input validation with Bean Validation
public record CreateClaimRequest(
    @NotBlank @Size(max = 200) String description,
    @Positive @DecimalMax("1000000") BigDecimal amount,
    @NotNull Long policyId
) {}

// 3. CSRF Protection — Spring Security enables by default
@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.csrfTokenRepository(
                CookieCsrfTokenRepository.withHttpOnlyFalse()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated())
            .build();
    }
}

// 4. Authentication — JWT + Spring Security
// 5. Rate Limiting — Bucket4j or Spring Cloud Gateway
// 6. Secrets Management — Never hardcode; use env vars or Vault`,
  },
];

// ─── Game Plan Configuration ─────────────────────────────────────────────────

export const allstateGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Phase 1', type: 'Understand Requirements', minutes: 8, highlight: true },
    { label: 'Phase 2', type: 'Write First Failing Test', minutes: 7 },
    { label: 'Phase 3', type: 'Implement (Green)', minutes: 15, highlight: true },
    { label: 'Phase 4', type: 'Refactor & Add Tests', minutes: 15 },
    { label: 'Phase 5', type: 'Pair Programming Collab', minutes: 10 },
    { label: 'Phase 6', type: 'Review & Discuss', minutes: 5 },
  ],
  strategies: [
    {
      title: 'TDD Round Strategy (Red-Green-Refactor)',
      steps: [
        'Read the problem statement carefully — identify inputs, outputs, and edge cases',
        'Write the simplest failing test that captures one requirement (RED)',
        'Implement the minimum code to make the test pass (GREEN)',
        'Look for duplication or unclear naming — refactor while tests stay green',
        'Add the next test for the next requirement — repeat the cycle',
        'Communicate your thought process aloud as you work through each cycle',
      ],
      highlightText: 'Never go more than 2-3 minutes without a green bar',
    },
    {
      title: 'Pair Programming Strategy',
      steps: [
        'Communicate constantly — narrate what you are thinking and why',
        'Think aloud: verbalize your approach before writing code',
        'Ask clarifying questions early — "Should this handle null inputs?"',
        'Propose ideas as suggestions, not commands — "What if we tried...?"',
        'When refactoring collaboratively, explain the smell you see and suggest a fix',
        'Switch driver/navigator roles naturally — offer to let your partner drive',
        'If you disagree, propose a small experiment rather than debating',
      ],
      highlightText: 'The interviewer is evaluating collaboration as much as code quality',
    },
  ],
  keywords: [
    'TDD',
    'Red-Green-Refactor',
    'JUnit 5',
    'Mockito',
    'Spring Boot',
    'REST API',
    'Dependency Injection',
    'Clean Code',
    'SOLID',
    'Pair Programming',
    'Refactoring',
    'Code Smells',
    'Integration Testing',
    'Exception Handling',
    'Design Patterns',
  ],
};
