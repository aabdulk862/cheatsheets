/**
 * Lowe's Technical Interview Cheatsheet Data
 * 3 Back-to-Back Technical Panels: Java 8, Microservices/Kafka, Database/Debugging
 * All technical, no behavioral component.
 */
import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

// ─── Company Configuration ───────────────────────────────────────────────────

export const lowesConfig: CompanyConfig = {
  slug: 'lowes',
  title: "Lowe's Technical Interview — Cheat Sheet",
  subtitle:
    'Recruiter Call → 3 Technical Panel Interviews · All Technical, No Behavioral',
  accentColor: '#004990',
  timerMinutes: 90,
  tabs: [
    { id: 'java', label: 'Java 8/Core Patterns' },
    { id: 'micro', label: 'Microservices/Kafka Patterns' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
  ],
};

// ─── Java 8 / Core Patterns ─────────────────────────────────────────────────

export const lowesJavaPatterns: PatternSection[] = [
  {
    label: 'Stream API',
    cards: [
      {
        title: 'Stream map, filter, reduce, collect',
        lang: 'java',
        description:
          'Core Stream pipeline: filter elements, transform with map, reduce to single value, or collect into a collection.',
        code: `List<String> names = List.of("Alice", "Bob", "Charlie", "Dave");

// filter + map + collect
List<String> result = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// [ALICE, CHARLIE, DAVE]

// reduce to single value
int totalLength = names.stream()
    .mapToInt(String::length)
    .reduce(0, Integer::sum);`,
        metaTags: ['stream', 'filter', 'map', 'reduce', 'collect'],
      },
      {
        title: 'map vs flatMap',
        lang: 'java',
        description:
          'map transforms each element 1:1. flatMap flattens nested structures (Stream of Streams) into a single Stream.',
        code: `List<List<Integer>> nested = List.of(
    List.of(1, 2), List.of(3, 4), List.of(5)
);

// map produces Stream<List<Integer>>
List<List<Integer>> mapped = nested.stream()
    .map(list -> list)
    .collect(Collectors.toList());

// flatMap flattens to Stream<Integer>
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5]`,
        metaTags: ['map', 'flatMap', 'stream', 'flatten'],
      },
    ],
  },
  {
    label: 'Lambda Expressions & Functional Interfaces',
    cards: [
      {
        title: 'Lambda Expressions',
        lang: 'java',
        description:
          'Concise syntax for anonymous functions. Used wherever a functional interface is expected.',
        code: `// No params
Runnable r = () -> System.out.println("Hello");

// Single param (parens optional)
Consumer<String> printer = s -> System.out.println(s);

// Multiple params + body
Comparator<String> byLength = (a, b) -> {
    return Integer.compare(a.length(), b.length());
};

// With effectively final variable capture
String prefix = "Hello";
Function<String, String> greeter = name -> prefix + " " + name;`,
        metaTags: ['lambda', 'anonymous', 'functional'],
      },
      {
        title: 'Functional Interfaces: Predicate, Function, Consumer, Supplier',
        lang: 'java',
        description:
          'The four core functional interfaces in java.util.function. Each takes/returns different combinations.',
        code: `// Predicate<T> — takes T, returns boolean
Predicate<Integer> isEven = n -> n % 2 == 0;
boolean result = isEven.test(4); // true

// Function<T, R> — takes T, returns R
Function<String, Integer> toLength = String::length;
int len = toLength.apply("hello"); // 5

// Consumer<T> — takes T, returns void
Consumer<String> log = msg -> System.out.println(msg);
log.accept("logged");

// Supplier<T> — takes nothing, returns T
Supplier<LocalDate> today = LocalDate::now;
LocalDate date = today.get();`,
        metaTags: ['Predicate', 'Function', 'Consumer', 'Supplier'],
      },
      {
        title: 'Method References',
        lang: 'java',
        description:
          'Shorthand for lambdas that call a single method. Four kinds: static, instance, arbitrary object, constructor.',
        code: `// Static method reference
Function<String, Integer> parse = Integer::parseInt;

// Instance method on a specific object
String str = "Hello";
Supplier<Integer> getLen = str::length;

// Instance method on arbitrary object of a type
Function<String, String> upper = String::toUpperCase;

// Constructor reference
Supplier<ArrayList<String>> listFactory = ArrayList::new;

// Usage in streams
List<String> words = List.of("a", "bb", "ccc");
List<Integer> lengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList());`,
        metaTags: ['method-reference', 'static', 'constructor'],
      },
      {
        title: 'Optional',
        lang: 'java',
        description:
          'Container for a value that may be absent. Avoids null checks and NullPointerException.',
        code: `// Creating Optionals
Optional<String> present = Optional.of("value");
Optional<String> empty = Optional.empty();
Optional<String> nullable = Optional.ofNullable(getValue());

// Safe access patterns
String result = nullable
    .map(String::toUpperCase)
    .orElse("DEFAULT");

// Chaining with flatMap (when mapper returns Optional)
Optional<String> city = getUser()
    .flatMap(User::getAddress)
    .flatMap(Address::getCity);

// Conditional execution
nullable.ifPresent(val -> System.out.println(val));

// Throw if absent
String required = nullable
    .orElseThrow(() -> new IllegalStateException("Missing"));`,
        metaTags: ['Optional', 'null-safety', 'flatMap'],
      },
    ],
  },
  {
    label: 'Collections Framework',
    cards: [
      {
        title: 'HashMap Internals: Hashing, Buckets, Resize',
        lang: 'java',
        description:
          'HashMap uses array of buckets. Key hashCode determines bucket index. Resizes at 75% load factor (capacity * 0.75).',
        code: `// Internal structure (simplified)
// Node<K,V>[] table — array of linked-list/tree buckets
// index = hash(key) & (capacity - 1)

Map<String, Integer> map = new HashMap<>(16); // initial capacity 16
map.put("key", 1);
// hash("key") → bucket index
// If bucket occupied → linked list (or tree if > 8 nodes)

// Resize triggers at size > capacity * loadFactor (0.75)
// capacity 16 → resizes when 13th entry added
// New capacity = old * 2, all entries rehashed

// Good hashCode practice
@Override
public int hashCode() {
    return Objects.hash(field1, field2, field3);
}`,
        metaTags: ['HashMap', 'hashing', 'buckets', 'resize'],
      },
      {
        title: 'ConcurrentHashMap',
        lang: 'java',
        description:
          'Thread-safe map using segment-level locking (Java 8+: CAS + synchronized on node). No full-map lock.',
        code: `ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Atomic operations
map.putIfAbsent("counter", 0);
map.compute("counter", (key, val) -> val + 1);
map.merge("counter", 1, Integer::sum);

// Bulk operations (parallel with threshold)
map.forEach(2, (key, val) ->
    System.out.println(key + "=" + val));

long count = map.reduceValues(2, Long::sum);

// vs Collections.synchronizedMap:
// - ConcurrentHashMap: fine-grained locking, better throughput
// - synchronizedMap: single lock on entire map, simpler but slower`,
        metaTags: ['ConcurrentHashMap', 'thread-safe', 'atomic'],
      },
      {
        title: 'ArrayList vs LinkedList',
        lang: 'java',
        description:
          'ArrayList: O(1) random access, O(n) insert/delete mid. LinkedList: O(1) insert/delete at ends, O(n) access.',
        code: `// ArrayList — backed by dynamic array
ArrayList<String> arrayList = new ArrayList<>();
arrayList.add("A");          // O(1) amortized
arrayList.get(0);            // O(1) random access
arrayList.add(0, "B");       // O(n) shift elements
arrayList.remove(0);         // O(n) shift elements

// LinkedList — doubly-linked list
LinkedList<String> linkedList = new LinkedList<>();
linkedList.addFirst("A");    // O(1)
linkedList.addLast("B");     // O(1)
linkedList.get(5);           // O(n) traversal
linkedList.removeFirst();    // O(1)

// Rule of thumb:
// ArrayList for random access, iteration
// LinkedList for frequent add/remove at head/tail (rare in practice)`,
        metaTags: ['ArrayList', 'LinkedList', 'performance'],
      },
      {
        title: 'TreeMap vs HashMap',
        lang: 'java',
        description:
          'HashMap: O(1) avg ops, unordered. TreeMap: O(log n) ops, sorted by key (Red-Black tree).',
        code: `// HashMap — hash table, no ordering
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("banana", 2);
hashMap.put("apple", 1);
// Iteration order: unpredictable

// TreeMap — Red-Black tree, sorted keys
TreeMap<String, Integer> treeMap = new TreeMap<>();
treeMap.put("banana", 2);
treeMap.put("apple", 1);
// Iteration order: apple, banana (natural ordering)

// TreeMap navigation methods
treeMap.firstKey();              // "apple"
treeMap.lastKey();               // "banana"
treeMap.headMap("banana");       // {apple=1}
treeMap.subMap("a", "c");       // range query

// Custom ordering
TreeMap<String, Integer> desc = new TreeMap<>(Comparator.reverseOrder());`,
        metaTags: ['TreeMap', 'HashMap', 'sorted', 'Red-Black'],
      },
      {
        title: 'Fail-Fast vs Fail-Safe Iterators',
        lang: 'java',
        description:
          'Fail-fast iterators throw ConcurrentModificationException if collection modified during iteration. Fail-safe work on copies.',
        code: `// Fail-fast (ArrayList, HashMap, HashSet)
List<String> list = new ArrayList<>(List.of("a", "b", "c"));
Iterator<String> it = list.iterator();
list.add("d"); // structural modification
it.next(); // throws ConcurrentModificationException

// Safe removal during iteration
Iterator<String> safeIt = list.iterator();
while (safeIt.hasNext()) {
    if (safeIt.next().equals("b")) {
        safeIt.remove(); // OK — use iterator's remove()
    }
}

// Fail-safe (ConcurrentHashMap, CopyOnWriteArrayList)
CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>(list);
for (String s : cowList) {
    cowList.add("new"); // No exception — iterates over snapshot
}`,
        metaTags: ['fail-fast', 'fail-safe', 'ConcurrentModification'],
      },
    ],
  },
];


// ─── Microservices / Kafka Patterns ──────────────────────────────────────────

export const lowesMicroPatterns: PatternSection[] = [
  {
    label: 'Kafka Producer & Consumer',
    cards: [
      {
        title: 'Kafka Producer Configuration',
        lang: 'java',
        description:
          'Spring Kafka producer setup with serialization, acks, retries, and idempotence for reliable message delivery.',
        code: `@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}`,
        metaTags: ['Kafka', 'producer', 'Spring', 'config'],
      },
      {
        title: 'Kafka Consumer Configuration',
        lang: 'java',
        description:
          'Spring Kafka consumer with group ID, offset reset, and manual/auto commit strategies.',
        code: `@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        return new DefaultKafkaConsumerFactory<>(props);
    }
}

@Service
public class OrderEventListener {

    @KafkaListener(topics = "orders", groupId = "order-service-group")
    public void handleOrder(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
        Order order = objectMapper.readValue(message, Order.class);
        orderService.process(order);
    }
}`,
        metaTags: ['Kafka', 'consumer', 'listener', 'offset'],
      },
      {
        title: 'Topic Partitioning & Replication',
        lang: 'java',
        description:
          'Kafka topics split into partitions for parallelism. Replication factor ensures fault tolerance across brokers.',
        code: `// Topic creation with AdminClient
@Bean
public NewTopic ordersTopic() {
    return TopicBuilder.name("orders")
        .partitions(6)          // 6 partitions for parallelism
        .replicas(3)            // 3 replicas for fault tolerance
        .config(TopicConfig.RETENTION_MS_CONFIG, "604800000") // 7 days
        .build();
}

// Partition assignment:
// - Messages with same key → same partition (ordering guarantee)
// - Round-robin if no key specified
// - Consumer group: max consumers = number of partitions

// Sending to specific partition via key
kafkaTemplate.send("orders", orderId, orderJson);
// orderId as key ensures all events for same order
// go to same partition → preserves ordering per order`,
        metaTags: ['partition', 'replication', 'topic', 'ordering'],
      },
    ],
  },
  {
    label: 'Inter-Service Communication',
    cards: [
      {
        title: 'Sync REST vs Async Messaging',
        lang: 'java',
        description:
          'REST for synchronous request/response. Kafka/messaging for async event-driven decoupling between services.',
        code: `// Synchronous — REST with RestTemplate/WebClient
@Service
public class InventoryClient {
    private final WebClient webClient;

    public Mono<InventoryResponse> checkStock(String sku) {
        return webClient.get()
            .uri("/api/inventory/{sku}", sku)
            .retrieve()
            .bodyToMono(InventoryResponse.class)
            .timeout(Duration.ofSeconds(3));
    }
}

// Asynchronous — Kafka event-driven
@Service
public class OrderService {
    private final KafkaTemplate<String, String> kafka;

    public void placeOrder(Order order) {
        orderRepository.save(order);
        // Fire-and-forget event — inventory service consumes async
        kafka.send("order-events", order.getId(),
            toJson(new OrderPlacedEvent(order)));
    }
}
// Use sync: need immediate response (query, validation)
// Use async: fire-and-forget, eventual consistency OK`,
        metaTags: ['REST', 'async', 'Kafka', 'WebClient'],
      },
      {
        title: 'Circuit Breaker Pattern',
        lang: 'java',
        description:
          'Prevents cascading failures by short-circuiting calls to failing services. Uses Resilience4j in Spring Boot.',
        code: `// Resilience4j Circuit Breaker configuration
@Configuration
public class ResilienceConfig {

    @Bean
    public CircuitBreakerConfig circuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
            .failureRateThreshold(50)        // open at 50% failure
            .waitDurationInOpenState(Duration.ofSeconds(30))
            .slidingWindowSize(10)
            .minimumNumberOfCalls(5)
            .build();
    }
}

@Service
public class PaymentService {

    @CircuitBreaker(name = "paymentGateway", fallbackMethod = "fallback")
    public PaymentResponse charge(PaymentRequest req) {
        return paymentClient.processPayment(req);
    }

    private PaymentResponse fallback(PaymentRequest req, Throwable t) {
        // Queue for retry, return pending status
        retryQueue.enqueue(req);
        return PaymentResponse.pending(req.getOrderId());
    }
}`,
        metaTags: ['circuit-breaker', 'Resilience4j', 'fallback'],
      },
      {
        title: 'Service Discovery',
        lang: 'java',
        description:
          'Services register with a discovery server (Eureka/Consul). Clients look up instances dynamically instead of hardcoding URLs.',
        code: `// Eureka Server (bootstrap)
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServerApp {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServerApp.class, args);
    }
}

// Service registration (application.yml)
// eureka:
//   client:
//     serviceUrl:
//       defaultZone: http://localhost:8761/eureka/
//   instance:
//     preferIpAddress: true

// Client-side discovery with load balancing
@Configuration
public class WebClientConfig {
    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}

// Usage — reference service by name, not URL
webClient.get()
    .uri("http://inventory-service/api/inventory/{sku}", sku)
    .retrieve()
    .bodyToMono(InventoryResponse.class);`,
        metaTags: ['Eureka', 'discovery', 'load-balancing'],
      },
    ],
  },
  {
    label: 'Database Patterns',
    cards: [
      {
        title: 'PostgreSQL Queries: Joins, Indexing, EXPLAIN',
        lang: 'sql',
        description:
          'Common PostgreSQL patterns: multi-table joins, index creation for performance, and EXPLAIN ANALYZE for query planning.',
        code: `-- Multi-table JOIN with filtering
SELECT o.order_id, c.name, p.product_name, oi.quantity
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC;

-- Create index for frequent query patterns
CREATE INDEX idx_orders_customer_date
ON orders (customer_id, order_date DESC);

-- Partial index for active records only
CREATE INDEX idx_orders_active
ON orders (status) WHERE status = 'ACTIVE';

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42 AND order_date > '2024-01-01';
-- Look for: Seq Scan (bad) vs Index Scan (good)
-- Check: actual rows vs estimated rows`,
        metaTags: ['PostgreSQL', 'JOIN', 'INDEX', 'EXPLAIN'],
      },
      {
        title: 'JPA Entity Mapping',
        lang: 'java',
        description:
          'Hibernate/JPA entity with relationships, cascade, fetch strategies, and lifecycle callbacks.',
        code: `@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
        this.status = OrderStatus.CREATED;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}`,
        metaTags: ['JPA', 'Hibernate', 'entity', 'mapping'],
      },
      {
        title: 'Transaction Management',
        lang: 'java',
        description:
          'Spring @Transactional for declarative TX management. Controls propagation, isolation, and rollback behavior.',
        code: `@Service
public class OrderService {

    @Transactional(
        isolation = Isolation.READ_COMMITTED,
        propagation = Propagation.REQUIRED,
        rollbackFor = Exception.class,
        timeout = 30
    )
    public Order placeOrder(OrderRequest request) {
        // All operations in single transaction
        Order order = new Order();
        order.setCustomer(customerRepo.findById(request.getCustomerId())
            .orElseThrow(() -> new NotFoundException("Customer not found")));

        request.getItems().forEach(item -> {
            inventoryService.decrementStock(item.getSku(), item.getQty());
            order.addItem(mapToOrderItem(item));
        });

        Order saved = orderRepository.save(order);
        paymentService.charge(saved); // rolls back all if this fails
        return saved;
    }

    // Propagation.REQUIRES_NEW — independent transaction
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAuditEvent(String event) {
        auditRepository.save(new AuditLog(event));
    }
}`,
        metaTags: ['transaction', 'Spring', 'isolation', 'rollback'],
      },
      {
        title: 'Connection Pooling (HikariCP)',
        lang: 'java',
        description:
          'HikariCP is the default Spring Boot connection pool. Tuning pool size prevents connection exhaustion under load.',
        code: `// application.yml configuration
// spring:
//   datasource:
//     url: jdbc:postgresql://localhost:5432/lowes_db
//     username: app_user
//     password: \${DB_PASSWORD}
//     hikari:
//       maximum-pool-size: 20
//       minimum-idle: 5
//       idle-timeout: 300000       # 5 min
//       connection-timeout: 20000  # 20 sec
//       max-lifetime: 1800000      # 30 min

// Pool sizing formula:
// connections = (core_count * 2) + effective_spindle_count
// For 4-core server with SSD: ~10 connections

// Monitoring pool health
@Component
public class PoolMetrics {
    @Autowired
    private DataSource dataSource;

    @Scheduled(fixedRate = 60000)
    public void logPoolStats() {
        HikariDataSource hds = (HikariDataSource) dataSource;
        HikariPoolMXBean pool = hds.getHikariPoolMXBean();
        log.info("Active: {}, Idle: {}, Waiting: {}",
            pool.getActiveConnections(),
            pool.getIdleConnections(),
            pool.getThreadsAwaitingConnection());
    }
}`,
        metaTags: ['HikariCP', 'connection-pool', 'PostgreSQL'],
      },
    ],
  },
];


// ─── Likely Questions ────────────────────────────────────────────────────────

export const lowesQuestions: QuestionItem[] = [
  {
    name: 'Stream API: Group and Count',
    diff: 'medium',
    hint: 'Use Collectors.groupingBy with Collectors.counting()',
    lang: 'java',
    code: `// Group a list of strings by their length and count occurrences
public Map<Integer, Long> groupByLength(List<String> words) {
    return words.stream()
        .collect(Collectors.groupingBy(
            String::length,
            Collectors.counting()
        ));
}

// Example: ["hi","hey","hello","ok"] → {2=2, 3=1, 5=1}`,
  },
  {
    name: 'Lambda: Custom Sorting with Comparator',
    diff: 'easy',
    hint: 'Comparator.comparing with thenComparing for multi-field sort',
    lang: 'java',
    code: `// Sort employees by department, then by salary descending
public List<Employee> sortEmployees(List<Employee> employees) {
    return employees.stream()
        .sorted(Comparator
            .comparing(Employee::getDepartment)
            .thenComparing(Employee::getSalary, Comparator.reverseOrder()))
        .collect(Collectors.toList());
}`,
  },
  {
    name: 'Method References: Convert and Collect',
    diff: 'easy',
    hint: 'Use constructor reference with stream map',
    lang: 'java',
    code: `// Convert list of DTOs to entities using constructor reference
public List<OrderEntity> toEntities(List<OrderDTO> dtos) {
    return dtos.stream()
        .map(OrderEntity::fromDTO)  // static method reference
        .filter(Objects::nonNull)   // handle nulls
        .collect(Collectors.toList());
}

// OrderEntity.fromDTO is a static factory method
public static OrderEntity fromDTO(OrderDTO dto) {
    OrderEntity entity = new OrderEntity();
    entity.setId(dto.getId());
    entity.setAmount(dto.getAmount());
    return entity;
}`,
  },
  {
    name: 'map vs flatMap: Nested Optional',
    diff: 'medium',
    hint: 'flatMap avoids Optional<Optional<T>> when mapper returns Optional',
    lang: 'java',
    code: `// Problem: get city name from a user who may not have an address
public String getUserCity(Long userId) {
    return userRepository.findById(userId)       // Optional<User>
        .flatMap(User::getAddress)               // Optional<Address>
        .flatMap(Address::getCity)               // Optional<String>
        .orElse("Unknown");

    // If we used map instead:
    // .map(User::getAddress) → Optional<Optional<Address>> ← WRONG
}

// Rule: use map when mapper returns plain value
//       use flatMap when mapper returns Optional`,
  },
  {
    name: 'HashMap vs ConcurrentHashMap Thread Safety',
    diff: 'medium',
    hint: 'ConcurrentHashMap uses CAS + node-level sync, no null keys/values',
    lang: 'java',
    code: `// Problem: implement a thread-safe word counter
public class WordCounter {
    private final ConcurrentHashMap<String, AtomicLong> counts =
        new ConcurrentHashMap<>();

    public void count(String word) {
        counts.computeIfAbsent(word, k -> new AtomicLong(0))
              .incrementAndGet();
    }

    // Alternative using merge
    public void countWithMerge(String word) {
        counts.merge(word, new AtomicLong(1),
            (existing, newVal) -> {
                existing.incrementAndGet();
                return existing;
            });
    }

    public long getCount(String word) {
        return counts.getOrDefault(word, new AtomicLong(0)).get();
    }
}`,
  },
  {
    name: 'Kafka: Ensure Ordering with Partition Key',
    diff: 'medium',
    hint: 'Same key → same partition → ordering guaranteed within partition',
    lang: 'java',
    code: `// Ensure all events for an order are processed in sequence
@Service
public class OrderEventPublisher {
    private final KafkaTemplate<String, String> kafka;

    public void publishOrderEvent(String orderId, OrderEvent event) {
        // Using orderId as key guarantees all events for this order
        // go to the same partition → consumed in order
        ProducerRecord<String, String> record = new ProducerRecord<>(
            "order-events",    // topic
            null,              // partition (let key decide)
            orderId,           // key — determines partition
            toJson(event)      // value
        );
        kafka.send(record).addCallback(
            result -> log.info("Sent to partition {}",
                result.getRecordMetadata().partition()),
            ex -> log.error("Failed to send event", ex)
        );
    }
}`,
  },
  {
    name: 'Microservice Communication: Retry with Backoff',
    diff: 'hard',
    hint: 'Exponential backoff prevents thundering herd on transient failures',
    lang: 'java',
    code: `// Resilience4j Retry with exponential backoff
@Configuration
public class RetryConfig {

    @Bean
    public Retry inventoryRetry() {
        return Retry.of("inventory", io.github.resilience4j.retry.RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(500))
            .intervalFunction(IntervalFunction.ofExponentialBackoff(500, 2.0))
            .retryExceptions(IOException.class, TimeoutException.class)
            .ignoreExceptions(BusinessException.class)
            .build());
    }
}

@Service
public class InventoryClient {
    private final Retry retry;
    private final WebClient webClient;

    public InventoryResponse checkStock(String sku) {
        return Retry.decorateSupplier(retry, () ->
            webClient.get()
                .uri("/api/inventory/{sku}", sku)
                .retrieve()
                .bodyToMono(InventoryResponse.class)
                .block(Duration.ofSeconds(5))
        ).get();
    }
}`,
  },
  {
    name: 'PostgreSQL: Window Function for Running Total',
    diff: 'medium',
    hint: 'SUM() OVER (ORDER BY ...) computes cumulative sum without GROUP BY',
    lang: 'sql',
    code: `-- Running total of order amounts per customer
SELECT
    customer_id,
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM orders
WHERE order_date >= '2024-01-01'
ORDER BY customer_id, order_date;

-- Rank products by sales within each category
SELECT
    category,
    product_name,
    total_sales,
    RANK() OVER (PARTITION BY category ORDER BY total_sales DESC) AS rank
FROM product_sales;`,
  },
  {
    name: 'Kafka Consumer Group Rebalancing',
    diff: 'hard',
    hint: 'Rebalance triggers when consumers join/leave group; use cooperative sticky assignor',
    lang: 'java',
    code: `// Handle rebalance events for graceful offset management
@Component
public class RebalanceListener implements ConsumerRebalanceListener {

    private final Map<TopicPartition, OffsetAndMetadata> currentOffsets =
        new ConcurrentHashMap<>();

    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        // Commit offsets for partitions being taken away
        log.info("Partitions revoked: {}", partitions);
        consumer.commitSync(currentOffsets);
        currentOffsets.clear();
    }

    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        log.info("Partitions assigned: {}", partitions);
        // Optionally seek to specific offset
        partitions.forEach(p ->
            consumer.seek(p, getLastProcessedOffset(p) + 1));
    }
}

// Config: use cooperative sticky assignor to minimize disruption
// partition.assignment.strategy=
//   org.apache.kafka.clients.consumer.CooperativeStickyAssignor`,
  },
  {
    name: 'JPA N+1 Problem and Solution',
    diff: 'hard',
    hint: 'Use JOIN FETCH or @EntityGraph to load associations in single query',
    lang: 'java',
    code: `// N+1 Problem: 1 query for orders + N queries for items
List<Order> orders = orderRepository.findAll();
orders.forEach(o -> o.getItems().size()); // triggers N lazy loads

// Solution 1: JPQL JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
List<Order> findByStatusWithItems(@Param("status") OrderStatus status);

// Solution 2: @EntityGraph
@EntityGraph(attributePaths = {"items", "items.product"})
List<Order> findByStatus(OrderStatus status);

// Solution 3: Batch fetching (application.yml)
// spring.jpa.properties.hibernate.default_batch_fetch_size: 20

// Verify with SQL logging:
// spring.jpa.show-sql: true
// logging.level.org.hibernate.SQL: DEBUG`,
  },
];


// ─── Game Plan ───────────────────────────────────────────────────────────────

export const lowesGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Panel 1', type: 'Java 8 / Core', minutes: 30, highlight: true },
    { label: 'Panel 2', type: 'Microservices / Kafka', minutes: 30, highlight: true },
    { label: 'Panel 3', type: 'Database / Debugging', minutes: 30, highlight: true },
  ],
  strategies: [
    {
      title: 'Panel 1: Java 8 & Core Java',
      steps: [
        'Open with Stream API fluency — demonstrate map/filter/reduce pipeline',
        'Explain functional interfaces by name (Predicate, Function, Consumer, Supplier)',
        'Show Optional chaining as alternative to null checks',
        'Discuss HashMap internals: hashing, bucket collisions, resize at 0.75 load factor',
        'Compare ConcurrentHashMap vs synchronized collections for thread safety',
        'Use method references wherever possible to show idiomatic Java 8 style',
      ],
      highlightText: 'All 3 interviews are purely technical — no HR/behavioral component',
    },
    {
      title: 'Panel 2: Microservices & Kafka',
      steps: [
        'Start with Kafka fundamentals: topics, partitions, consumer groups, offsets',
        'Explain partition key strategy for ordering guarantees',
        'Contrast sync REST (WebClient) vs async messaging (Kafka) with trade-offs',
        'Describe circuit breaker pattern and when to apply it',
        'Discuss service discovery and client-side load balancing',
        'Mention idempotency and exactly-once semantics for reliability',
      ],
    },
    {
      title: 'Panel 3: Database & Debugging',
      steps: [
        'Demonstrate PostgreSQL query optimization with EXPLAIN ANALYZE',
        'Explain JPA entity relationships and fetch strategies (LAZY vs EAGER)',
        'Discuss transaction isolation levels and when to use each',
        'Show connection pool tuning (HikariCP sizing formula)',
        'For debugging: systematic isolation → read stack trace → divide-and-conquer → verify with logging',
      ],
    },
    {
      title: 'Debugging Strategy',
      steps: [
        'Systematic isolation: reproduce the issue in the smallest possible scope',
        'Read stack traces carefully — identify the first frame in your code',
        'Divide-and-conquer: binary search through code path to narrow root cause',
        'Verify assumptions with targeted logging at decision points',
        'Check external dependencies: DB connections, Kafka broker status, network timeouts',
        'Use thread dumps for concurrency issues, heap dumps for memory leaks',
      ],
      highlightText: 'Always explain your debugging thought process out loud during the interview',
    },
  ],
  keywords: [
    'Stream API',
    'Lambda',
    'Optional',
    'HashMap',
    'ConcurrentHashMap',
    'Kafka',
    'Partitions',
    'Consumer Groups',
    'Circuit Breaker',
    'Service Discovery',
    'PostgreSQL',
    'JPA',
    'Transactions',
    'HikariCP',
    'EXPLAIN ANALYZE',
    'Microservices',
  ],
};
