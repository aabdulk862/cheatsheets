import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

/**
 * Wells Fargo SWE Interview cheatsheet data.
 * Covers: Java Full Stack, Java Developer, Senior SWE (Levels II–IV)
 * Process: Phone → HackerRank (2 problems, 40-60 min) → 2-3 Technical → Behavioral
 */

export const wellsFargoConfig: CompanyConfig = {
  slug: 'wellsfargo',
  title: 'Wells Fargo SWE — Cheat Sheet',
  subtitle:
    'Phone → HackerRank (2 coding, 40-60 min) → 2-3 Technical Rounds → Behavioral · All Levels',
  accentColor: '#CD1409',
  accentSecondary: '#FFCD11',
  timerMinutes: 60,
  tabs: [
    { id: 'java', label: 'Java/Spring Boot' },
    { id: 'frontend', label: 'React/Angular' },
    { id: 'infra', label: 'Cloud/DevOps' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
  ],
};

// ---------------------------------------------------------------------------
// Java / Spring Boot Patterns
// ---------------------------------------------------------------------------

export const wellsFargoJavaPatterns: PatternSection[] = [
  {
    label: 'Core Java (8/11/17+)',
    cards: [
      {
        title: 'Stream API — Transaction Filtering',
        lang: 'java',
        description:
          'Filter and aggregate transactions using Java Streams with collectors.',
        code: `Map<String, Double> totalByCategory = transactions.stream()
    .filter(t -> t.getAmount() > 0)
    .collect(Collectors.groupingBy(
        Transaction::getCategory,
        Collectors.summingDouble(Transaction::getAmount)
    ));`,
        metaTags: ['streams', 'collectors', 'groupingBy', 'Java 8'],
      },
      {
        title: 'Optional — Null-Safe Account Lookup',
        lang: 'java',
        description:
          'Chain Optional operations to safely retrieve nested account data.',
        code: `Optional<BigDecimal> balance = accountRepository
    .findById(accountId)
    .filter(Account::isActive)
    .map(Account::getBalance)
    .filter(b -> b.compareTo(BigDecimal.ZERO) > 0);`,
        metaTags: ['Optional', 'null safety', 'functional', 'Java 8'],
      },
      {
        title: 'Record + Sealed Interface (Java 17)',
        lang: 'java',
        description:
          'Model payment events with sealed types and pattern matching.',
        code: `sealed interface PaymentEvent permits Approved, Declined, Pending {}
record Approved(String txnId, BigDecimal amount) implements PaymentEvent {}
record Declined(String txnId, String reason) implements PaymentEvent {}
record Pending(String txnId, Instant eta) implements PaymentEvent {}

// Pattern matching (Java 21 preview)
String describe(PaymentEvent evt) {
    return switch (evt) {
        case Approved a -> "Approved: $" + a.amount();
        case Declined d -> "Declined: " + d.reason();
        case Pending p  -> "ETA: " + p.eta();
    };
}`,
        metaTags: ['sealed', 'records', 'pattern matching', 'Java 17'],
      },
      {
        title: 'CompletableFuture — Parallel Calls',
        lang: 'java',
        description:
          'Combine async calls for account balance and transaction history.',
        code: `CompletableFuture<Balance> balanceFuture =
    CompletableFuture.supplyAsync(() -> accountService.getBalance(id));
CompletableFuture<List<Txn>> txnFuture =
    CompletableFuture.supplyAsync(() -> txnService.getHistory(id));

AccountSummary summary = balanceFuture
    .thenCombine(txnFuture, AccountSummary::new)
    .join();`,
        metaTags: ['async', 'CompletableFuture', 'parallel', 'Java 8'],
      },
    ],
  },
  {
    label: 'Spring Boot REST',
    cards: [
      {
        title: 'REST Controller + Validation',
        lang: 'java',
        description:
          'Standard REST endpoint with Bean Validation and ResponseEntity.',
        code: `@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    @PostMapping
    public ResponseEntity<Account> create(
            @Valid @RequestBody CreateAccountRequest req) {
        Account created = accountService.create(req);
        URI location = URI.create("/api/v1/accounts/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getById(@PathVariable Long id) {
        return accountService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}`,
        metaTags: ['REST', 'validation', 'ResponseEntity', 'Spring Boot'],
      },
      {
        title: 'Global Exception Handler',
        lang: 'java',
        description:
          'Centralized error handling with @ControllerAdvice for APIs.',
        code: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            AccountNotFoundException ex) {
        return ResponseEntity.status(404)
            .body(new ErrorResponse("ACCT_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", msg));
    }
}`,
        metaTags: ['exception handling', 'ControllerAdvice', 'REST', 'Spring'],
      },
    ],
  },
  {
    label: 'Spring Cloud & Microservices',
    cards: [
      {
        title: 'Feign Client — Service-to-Service',
        lang: 'java',
        description:
          'Declarative HTTP client for calling downstream payment service.',
        code: `@FeignClient(name = "payment-service", fallback = PaymentFallback.class)
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentResponse processPayment(@RequestBody PaymentRequest req);
}

@Component
class PaymentFallback implements PaymentClient {
    public PaymentResponse processPayment(PaymentRequest req) {
        return PaymentResponse.declined("Service unavailable");
    }
}`,
        metaTags: ['Feign', 'circuit breaker', 'microservices', 'Spring Cloud'],
      },
      {
        title: 'Resilience4j Circuit Breaker',
        lang: 'java',
        description:
          'Protect downstream calls with circuit breaker and fallback.',
        code: `@Service
public class TransferService {

    @CircuitBreaker(name = "transferCB", fallbackMethod = "fallback")
    @Retry(name = "transferRetry")
    public TransferResult transfer(TransferRequest req) {
        return paymentClient.processPayment(req);
    }

    private TransferResult fallback(TransferRequest req, Throwable t) {
        return TransferResult.queued("Retry scheduled: " + t.getMessage());
    }
}`,
        metaTags: ['Resilience4j', 'circuit breaker', 'retry', 'fault tolerance'],
      },
    ],
  },
  {
    label: 'Kafka Messaging',
    cards: [
      {
        title: 'Kafka Producer — Transaction Events',
        lang: 'java',
        description:
          'Publish transaction events to Kafka with Spring KafkaTemplate.',
        code: `@Service
@RequiredArgsConstructor
public class TransactionEventPublisher {

    private final KafkaTemplate<String, TransactionEvent> kafka;

    public void publish(Transaction txn) {
        TransactionEvent event = new TransactionEvent(
            txn.getId(), txn.getType(), txn.getAmount(), Instant.now());
        kafka.send("transactions.completed", txn.getId(), event);
    }
}`,
        metaTags: ['Kafka', 'producer', 'event-driven', 'messaging'],
      },
      {
        title: 'Kafka Consumer — Fraud Detection',
        lang: 'java',
        description:
          'Consume transaction events for real-time fraud scoring.',
        code: `@Component
public class FraudDetectionConsumer {

    @KafkaListener(topics = "transactions.completed",
                   groupId = "fraud-detection")
    public void onTransaction(TransactionEvent event) {
        double score = fraudEngine.score(event);
        if (score > THRESHOLD) {
            alertService.flag(event.txnId(), score);
        }
    }
}`,
        metaTags: ['Kafka', 'consumer', 'listener', 'event-driven'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Frontend (React / Angular) Patterns
// ---------------------------------------------------------------------------

export const wellsFargoFrontendPatterns: PatternSection[] = [
  {
    label: 'React Hooks & State',
    cards: [
      {
        title: 'Custom Hook — Account Data Fetch',
        lang: 'typescript',
        description:
          'Reusable data fetching hook with loading/error states.',
        code: `function useAccount(id: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(\`/api/v1/accounts/\${id}\`, { signal: ctrl.signal })
      .then(r => r.json())
      .then(setAccount)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [id]);

  return { account, loading, error };
}`,
        metaTags: ['hooks', 'useEffect', 'fetch', 'custom hook'],
      },
      {
        title: 'useReducer — Transfer Form State',
        lang: 'typescript',
        description:
          'Complex form state management with useReducer pattern.',
        code: `type State = { from: string; to: string; amount: number; step: 'input' | 'confirm' | 'done' };
type Action =
  | { type: 'SET_FIELD'; field: keyof State; value: string | number }
  | { type: 'CONFIRM' }
  | { type: 'SUBMIT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'CONFIRM': return { ...state, step: 'confirm' };
    case 'SUBMIT': return { ...state, step: 'done' };
  }
}`,
        metaTags: ['useReducer', 'state machine', 'forms', 'React'],
      },
    ],
  },
  {
    label: 'Angular Basics',
    cards: [
      {
        title: 'HTTP Service + RxJS',
        lang: 'typescript',
        description:
          'Angular service with HttpClient and RxJS error handling.',
        code: `@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly api = '/api/v1/accounts';

  constructor(private http: HttpClient) {}

  getBalance(id: string): Observable<Balance> {
    return this.http.get<Balance>(\`\${this.api}/\${id}/balance\`).pipe(
      retry(2),
      catchError(err => {
        console.error('Balance fetch failed', err);
        return throwError(() => new Error('Unable to load balance'));
      })
    );
  }
}`,
        metaTags: ['Angular', 'HttpClient', 'RxJS', 'service'],
      },
      {
        title: 'Reactive Form + Validation',
        lang: 'typescript',
        description:
          'Typed reactive form with custom validators for banking input.',
        code: `this.transferForm = this.fb.group({
  fromAccount: ['', [Validators.required]],
  toAccount: ['', [Validators.required, Validators.pattern(/^\\d{10}$/)]],
  amount: [0, [Validators.required, Validators.min(0.01), Validators.max(50000)]],
});

onSubmit() {
  if (this.transferForm.valid) {
    this.accountService.transfer(this.transferForm.getRawValue()).subscribe();
  }
}`,
        metaTags: ['Angular', 'reactive forms', 'validation', 'FormBuilder'],
      },
    ],
  },
  {
    label: 'REST Integration',
    cards: [
      {
        title: 'Axios Interceptor — JWT Auth',
        lang: 'typescript',
        description:
          'Attach JWT token to outgoing requests with refresh logic.',
        code: `import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const newToken = await refreshToken();
      err.config.headers.Authorization = \`Bearer \${newToken}\`;
      return api(err.config);
    }
    return Promise.reject(err);
  }
);`,
        metaTags: ['axios', 'JWT', 'interceptor', 'auth'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Cloud / DevOps / Infra Patterns
// ---------------------------------------------------------------------------

export const wellsFargoInfraPatterns: PatternSection[] = [
  {
    label: 'Docker & Kubernetes',
    cards: [
      {
        title: 'Multi-Stage Dockerfile (Spring Boot)',
        lang: 'bash',
        description:
          'Optimized container build with layered JARs for fast deploys.',
        code: `FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
        metaTags: ['Docker', 'multi-stage', 'Spring Boot', 'container'],
      },
      {
        title: 'K8s Deployment + HPA',
        lang: 'bash',
        description:
          'Kubernetes deployment with horizontal pod autoscaler for banking APIs.',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: account-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: account-service
  template:
    spec:
      containers:
      - name: account-service
        image: registry.wf.com/account-service:1.2.0
        resources:
          requests: { cpu: "250m", memory: "512Mi" }
          limits: { cpu: "1000m", memory: "1Gi" }
        livenessProbe:
          httpGet: { path: /actuator/health, port: 8080 }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: account-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: account-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }`,
        metaTags: ['Kubernetes', 'HPA', 'deployment', 'OpenShift'],
      },
    ],
  },
  {
    label: 'CI/CD & Terraform',
    cards: [
      {
        title: 'GitHub Actions — Build & Deploy',
        lang: 'bash',
        description:
          'CI pipeline: test, build image, push to registry, deploy to AKS.',
        code: `name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with: { java-version: '17', distribution: 'temurin' }
    - run: ./mvnw verify
    - run: |
        docker build -t registry.wf.com/account-service:\${{ github.sha }} .
        docker push registry.wf.com/account-service:\${{ github.sha }}
    - uses: azure/k8s-deploy@v4
      with:
        manifests: k8s/
        images: registry.wf.com/account-service:\${{ github.sha }}`,
        metaTags: ['GitHub Actions', 'CI/CD', 'Docker', 'AKS'],
      },
      {
        title: 'Terraform — Azure AKS Cluster',
        lang: 'bash',
        description:
          'Provision AKS cluster with managed identity and node pools.',
        code: `resource "azurerm_kubernetes_cluster" "aks" {
  name                = "wf-payments-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "wf-payments"

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_D4s_v3"
  }

  identity { type = "SystemAssigned" }

  network_profile {
    network_plugin = "azure"
    network_policy = "calico"
  }
}`,
        metaTags: ['Terraform', 'Azure', 'AKS', 'IaC'],
      },
    ],
  },
  {
    label: 'Security (OAuth2/JWT)',
    cards: [
      {
        title: 'Spring Security — OAuth2 Resource Server',
        lang: 'java',
        description:
          'Configure JWT-based resource server with role-based access.',
        code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter()))
            )
            .build();
    }

    private JwtAuthenticationConverter jwtConverter() {
        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(
            jwt -> jwt.getClaimAsStringList("roles").stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                .collect(Collectors.toList())
        );
        return converter;
    }
}`,
        metaTags: ['OAuth2', 'JWT', 'Spring Security', 'RBAC'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Likely Questions (Coding + System Design + Behavioral + SQL)
// ---------------------------------------------------------------------------

export const wellsFargoQuestions: QuestionItem[] = [
  {
    name: 'Two Sum',
    diff: 'easy',
    hint: 'Use HashMap to store complement; single pass O(n)',
    lang: 'java',
    code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement))
            return new int[]{map.get(complement), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
  },
  {
    name: 'Valid Parentheses',
    diff: 'easy',
    hint: 'Stack-based: push open, pop on close, check match',
    lang: 'java',
    code: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}`,
  },
  {
    name: 'Merge Two Sorted Lists',
    diff: 'easy',
    hint: 'Dummy head, compare and link, attach remainder',
    lang: 'java',
    code: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
        else { curr.next = l2; l2 = l2.next; }
        curr = curr.next;
    }
    curr.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`,
  },
  {
    name: 'Longest Substring Without Repeating Characters',
    diff: 'medium',
    hint: 'Sliding window with HashSet; shrink left on duplicate',
    lang: 'java',
    code: `public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, max = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right)))
            set.remove(s.charAt(left++));
        set.add(s.charAt(right));
        max = Math.max(max, right - left + 1);
    }
    return max;
}`,
  },
  {
    name: 'LRU Cache',
    diff: 'medium',
    hint: 'LinkedHashMap or doubly-linked list + HashMap',
    lang: 'java',
    code: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`,
  },
  {
    name: 'Binary Tree Level Order Traversal',
    diff: 'medium',
    hint: 'BFS with queue; process level size at each iteration',
    lang: 'java',
    code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        result.add(level);
    }
    return result;
}`,
  },
  {
    name: 'Coin Change (DP)',
    diff: 'medium',
    hint: 'Bottom-up DP; dp[i] = min coins to make amount i',
    lang: 'java',
    code: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (coin <= i)
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  },
  {
    name: 'Design: Scalable Payment System',
    diff: 'hard',
    hint: 'Event-driven, idempotency keys, Kafka, saga pattern',
    lang: 'java',
    code: `// System Design Talking Points:
// 1. API Gateway -> Payment Service -> Kafka -> Ledger Service
// 2. Idempotency: unique txn_id per request, check before processing
// 3. Saga pattern: Payment -> Fraud Check -> Debit -> Credit -> Notify
// 4. Compensation: reverse on failure at any step
// 5. Data: PostgreSQL for ACID ledger, Redis for dedup cache
// 6. Scale: partition Kafka by account_id, shard DB by region
// 7. Observability: distributed tracing (Jaeger), metrics (Prometheus)

@Entity
public class PaymentLedger {
    @Id private UUID id;
    private String idempotencyKey;  // prevent duplicate processing
    private BigDecimal amount;
    @Enumerated private PaymentStatus status; // PENDING, COMPLETED, FAILED
    private Instant createdAt;
}`,
  },
  {
    name: 'Design: Real-Time Fraud Detection',
    diff: 'hard',
    hint: 'Stream processing, ML scoring, sub-100ms latency SLA',
    lang: 'java',
    code: `// Architecture:
// 1. Kafka Streams consumes transaction events in real-time
// 2. Feature extraction: velocity, geo, amount deviation
// 3. ML model (served via REST or embedded) scores risk 0-1
// 4. Rules engine: hard blocks (stolen card) + soft flags (review)
// 5. Decision in <100ms; async enrichment for case management
// 6. Storage: time-series DB for patterns, graph DB for networks

// Key metrics to discuss:
// - False positive rate vs. fraud loss tradeoff
// - P99 latency under load
// - Model retraining cadence (daily/weekly)`,
  },
  {
    name: 'SQL: Running Balance by Account',
    diff: 'medium',
    hint: 'Window SUM with ORDER BY date, PARTITION BY account',
    lang: 'sql',
    code: `SELECT account_id,
       txn_date,
       amount,
       SUM(amount) OVER (
           PARTITION BY account_id
           ORDER BY txn_date
           ROWS UNBOUNDED PRECEDING
       ) AS running_balance
FROM transactions
ORDER BY account_id, txn_date;`,
  },
  {
    name: 'SQL: Duplicate Transaction Detection',
    diff: 'easy',
    hint: 'GROUP BY key fields, HAVING COUNT > 1',
    lang: 'sql',
    code: `SELECT account_id, amount, merchant, txn_date, COUNT(*) AS cnt
FROM transactions
WHERE txn_date >= CURRENT_DATE - INTERVAL '1 day'
GROUP BY account_id, amount, merchant, txn_date
HAVING COUNT(*) > 1;`,
  },
  {
    name: 'Behavioral: Tell me about a time you handled a conflict',
    diff: 'easy',
    hint: 'STAR format; emphasize teamwork, ethics, resolution',
    lang: 'java',
    code: `// STAR Framework for Wells Fargo Behavioral:
// SITUATION: Sprint planning disagreement on API design approach
// TASK: Align team on REST vs GraphQL for new dashboard service
// ACTION: Organized tech spike, created comparison matrix,
//         facilitated discussion focusing on client needs
// RESULT: Team chose REST for simplicity, delivered 1 week early
//
// Wells Fargo Values to weave in:
// - Ethics & Integrity: "I prioritized transparency..."
// - Customer Focus: "We chose what served the customer best..."
// - Teamwork: "I brought both sides together..."
// - Accountability: "I owned the decision and its outcomes..."`,
  },
  {
    name: 'Behavioral: Describe a time you improved a process',
    diff: 'easy',
    hint: 'Show initiative, measurable impact, banking context helps',
    lang: 'java',
    code: `// STAR Framework:
// SITUATION: CI pipeline took 45 minutes, blocking deploys
// TASK: Reduce build time to enable faster releases
// ACTION: Parallelized test suites, added Docker layer caching,
//         implemented incremental builds for unchanged modules
// RESULT: Build time reduced to 12 minutes (73% improvement),
//         team deployed 3x more frequently
//
// Tie to Wells Fargo:
// - "In a regulated environment, fast feedback loops
//    help catch compliance issues earlier"
// - "Accountability: I tracked metrics and reported progress"`,
  },
  {
    name: 'Graph: Number of Islands',
    diff: 'medium',
    hint: 'BFS/DFS from each unvisited land cell; count components',
    lang: 'java',
    code: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(grid, i, j);
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length
            || grid[i][j] == '0') return;
    grid[i][j] = '0';
    dfs(grid, i - 1, j); dfs(grid, i + 1, j);
    dfs(grid, i, j - 1); dfs(grid, i, j + 1);
}`,
  },
];

// ---------------------------------------------------------------------------
// Game Plan
// ---------------------------------------------------------------------------

export const wellsFargoGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Phone Screen', type: 'Behavioral', minutes: 30, highlight: false },
    { label: 'HackerRank Q1', type: 'Coding', minutes: 20, highlight: true },
    { label: 'HackerRank Q2', type: 'Coding', minutes: 25, highlight: true },
    { label: 'Technical Round 1', type: 'Java/Spring', minutes: 45, highlight: false },
    { label: 'Technical Round 2', type: 'System Design', minutes: 45, highlight: false },
    { label: 'Behavioral Panel', type: 'STAR Stories', minutes: 30, highlight: false },
  ],
  strategies: [
    {
      title: 'Contract Path (Staffing Firm → WF)',
      steps: [
        'Respond to recruiter (Genesis10, Compunnel, Synechron) within 24hr',
        'Confirm: W2 rate ($41-70/hr), hybrid 3/2, location (Charlotte/Dallas/Chandler)',
        'Staffing firm does initial screen (resume walkthrough, 15 min)',
        'Wells Fargo technical team conducts 2-3 rounds directly',
        'Expect HackerRank link within 48hr of staffing screen',
        'Timeline: 3-6 weeks offer to start',
      ],
      highlightText: 'Contract roles skip some rounds — often 2 tech + 1 behavioral',
    },
    {
      title: 'HackerRank / CoderPad Strategy',
      steps: [
        'Two problems in 40-60 min — aim for both complete',
        'Easy-medium LeetCode difficulty; arrays, strings, trees most common',
        'Read ALL test cases before coding; edge cases matter',
        'Java preferred — use Streams/Collections API fluently',
        'Run against samples first, then submit; partial credit exists',
        'If stuck on #2, get brute force working then optimize',
      ],
      highlightText: '4 LeetCode-style questions reported — get at least 3 right',
    },
    {
      title: 'Technical Rounds (Java/Spring Focus)',
      steps: [
        'Know Spring Boot annotations cold: @RestController, @Service, @Transactional',
        'Be ready for microservices patterns: circuit breaker, saga, event sourcing',
        'System design (senior): payment system, fraud detection, notification service',
        'Explain trade-offs: SQL vs NoSQL, sync vs async, monolith vs micro',
        'Mention banking-specific: PCI compliance, data encryption at rest/in transit',
      ],
      highlightText: 'Two tech rounds and one HR round, all reported as "easy"',
    },
    {
      title: 'Behavioral Panel',
      steps: [
        'Prepare 4-5 STAR stories covering: conflict, failure, leadership, process improvement',
        'Align with Wells Fargo values: ethics, accountability, teamwork, customer focus, inclusion',
        'Panel format: 2-3 interviewers alternate asking questions',
        'Ask thoughtful questions about digital transformation, tech modernization',
        'Reference their multi-cloud strategy (Azure primary, GCP for AI) to show research',
      ],
      highlightText: 'Values-based: ethics and integrity are non-negotiable themes',
    },
  ],
  keywords: [
    'Java 17',
    'Spring Boot',
    'Spring Cloud',
    'Kafka',
    'Microservices',
    'REST API',
    'OAuth2/JWT',
    'Docker',
    'Kubernetes',
    'Azure',
    'React',
    'Angular',
    'PostgreSQL',
    'CI/CD',
    'System Design',
    'STAR Method',
    'Event-Driven',
    'Terraform',
  ],
};
