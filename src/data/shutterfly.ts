import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

/**
 * Shutterfly Software Engineer II — Interview Cheat Sheet
 * Interview Format: Phone Screen → 2 Technical Rounds (Java/Architecture) → Managerial
 * Real Stack: PHP, Java, Node.js, Python | AWS (ECS, EC2, S3, SQS, Aurora) | Docker | Terraform
 * Scale: 80M users, 75+ PB image library, 100k req/min peak, 300 services across 40+ app suites
 * Also: 39 Known LeetCode Problems — 5 Easy, 25 Medium, 9 Hard
 */

export const shutterflyConfig: CompanyConfig = {
  slug: 'shutterfly',
  title: 'Shutterfly SWE II — Interview Cheat Sheet',
  subtitle:
    'Phone Screen → 2 Technical Rounds (Java + Architecture) → Managerial · 80M users · 75+ PB on AWS',
  accentColor: '#6B2D8B',
  accentSecondary: '#00B2A9',
  timerMinutes: 60,
  tabs: [
    { id: 'backend', label: 'Backend/Architecture' },
    { id: 'cloud', label: 'AWS/Infra' },
    { id: 'coding', label: 'Coding Problems' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
    { id: 'experience', label: 'My Experience' },
    { id: 'design', label: 'System Design' },
    { id: 'intro', label: 'Intro/Why' },
    { id: 'stories', label: 'Story Router' },
  ],
};

// ---------------------------------------------------------------------------
// Backend / Architecture Patterns
// ---------------------------------------------------------------------------

export const shutterflyBackendPatterns: PatternSection[] = [
  {
    label: 'Shutterfly Architecture Context',
    cards: [
      {
        title: 'Shutterfly System Overview',
        lang: 'bash',
        description:
          'Key facts: 80M users, 75+ PB image library on S3, 100k req/min peak, 300 services across 40+ app suites. Migrated 80% to ECS, 20% EC2.',
        code: `# Shutterfly Infrastructure (from AWS Case Study 2025)
# ─────────────────────────────────────────────────────
# Scale: 80 million users, 75+ petabyte consumer image library
# Traffic: 100,000 API requests/minute during peak season
# Services: 300 services across 40+ application suites
# Compute: 80% Amazon ECS (containers), 20% Amazon EC2
# Storage: S3 (images + archival), FSx for NetApp ONTAP
# Database: Aurora PostgreSQL, DynamoDB, ElastiCache (Redis)
# Search: AWS OpenSearch (migrated from ElasticSearch)
# CDN: CloudFront
# Monitoring: Grafana, Splunk, AppDynamics
# IaC: Terraform, Docker
# Languages: Java, PHP (Symfony), Node.js, Python
# CI/CD: Containerized pipeline → ECS deployments
# Divisions: Consumer (Shutterfly/Snapfish/Spoonflower), Lifetouch, SBS`,
        metaTags: ['architecture', 'scale', 'AWS', 'ECS', '75PB'],
      },
    ],
  },
  {
    label: 'Spring Boot REST APIs',
    cards: [
      {
        title: 'RESTful Controller with Validation',
        lang: 'java',
        description:
          'Standard Spring Boot REST controller with request validation, proper HTTP status codes, and exception handling.',
        code: `@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        OrderDto created = orderService.create(request);
        URI location = URI.create("/api/v1/orders/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(OrderNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
}`,
        metaTags: ['spring boot', 'REST', 'controller', 'validation'],
      },
      {
        title: 'Service Layer + Domain Events',
        lang: 'java',
        description:
          'Service layer with @Transactional, domain logic isolation, event publishing for async consumers.',
        code: `@Service
@Transactional(readOnly = true)
public class PhotoAlbumService {

    private final AlbumRepository albumRepo;
    private final SqsTemplate sqsTemplate;

    @Transactional
    public AlbumDto create(CreateAlbumRequest request) {
        Album album = Album.builder()
            .userId(request.getUserId())
            .title(request.getTitle())
            .status(AlbumStatus.ACTIVE)
            .build();

        Album saved = albumRepo.save(album);

        // Publish event for async thumbnail generation
        sqsTemplate.send("album-events",
            new AlbumCreatedEvent(saved.getId(), saved.getUserId()));

        return AlbumMapper.toDto(saved);
    }

    public Page<AlbumDto> findByUser(Long userId, Pageable pageable) {
        return albumRepo.findByUserId(userId, pageable)
            .map(AlbumMapper::toDto);
    }
}`,
        metaTags: ['service layer', 'transactional', 'domain events', 'SQS'],
      },
    ],
  },
  {
    label: 'PostgreSQL / Aurora',
    cards: [
      {
        title: 'Spring Data JPA with Aurora PostgreSQL',
        lang: 'java',
        description:
          'Repository pattern with custom JPQL, native queries, and PostgreSQL-specific features.',
        code: `@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    @Query("""
        SELECT p FROM Photo p
        JOIN FETCH p.tags
        WHERE p.albumId = :albumId
        AND p.status = 'ACTIVE'
        ORDER BY p.uploadedAt DESC
        """)
    List<Photo> findByAlbum(@Param("albumId") Long albumId);

    @Query(value = """
        SELECT date_trunc('month', uploaded_at) AS month,
               COUNT(*) AS photo_count,
               SUM(file_size_bytes) AS total_bytes
        FROM photos
        WHERE user_id = :userId AND uploaded_at >= :since
        GROUP BY month ORDER BY month DESC
        """, nativeQuery = true)
    List<MonthlyStats> getMonthlyStats(
        @Param("userId") Long userId,
        @Param("since") LocalDateTime since);
}`,
        metaTags: ['JPA', 'Aurora PostgreSQL', 'repository', 'JPQL'],
      },
      {
        title: 'Connection Pool + Read Replicas',
        lang: 'java',
        description:
          'HikariCP for Aurora PostgreSQL with read/write splitting for scale.',
        code: `// application.yml
// spring.datasource.hikari:
//   maximum-pool-size: 20
//   minimum-idle: 5
//   connection-timeout: 30000
//   max-lifetime: 1800000

@Configuration
public class DataSourceConfig {
    @Bean @Primary
    public DataSource routingDataSource(
            @Qualifier("writer") DataSource writer,
            @Qualifier("reader") DataSource reader) {
        var routing = new ReadWriteRoutingDataSource();
        routing.setTargetDataSources(Map.of(
            "writer", writer, "reader", reader));
        routing.setDefaultTargetDataSource(writer);
        return routing;
    }
}

// Usage: @Transactional(readOnly = true) routes to reader
// @Transactional routes to writer endpoint`,
        metaTags: ['HikariCP', 'Aurora', 'read replicas', 'connection pool'],
      },
    ],
  },
  {
    label: 'Microservices & Domain Services',
    cards: [
      {
        title: 'Domain-Driven Aggregate with Optimistic Locking',
        lang: 'java',
        description:
          'Aggregate root pattern with state transitions and domain events for async processing.',
        code: `@Entity
public class PhotoOrder {  // Aggregate Root
    @Id @GeneratedValue private Long id;
    @Enumerated(EnumType.STRING) private OrderStatus status;
    @OneToMany(cascade = CascadeType.ALL) private List<OrderItem> items;
    @Version private Long version;  // Optimistic locking

    public void submit() {
        if (status != OrderStatus.DRAFT)
            throw new IllegalStateException("Only drafts can be submitted");
        this.status = OrderStatus.SUBMITTED;
        registerEvent(new OrderSubmittedEvent(this.id));
    }

    public void fulfill() {
        if (status != OrderStatus.SUBMITTED)
            throw new IllegalStateException("Order not submitted");
        this.status = OrderStatus.FULFILLED;
        registerEvent(new OrderFulfilledEvent(this.id));
    }
}

// Async event listener — publishes to RabbitMQ after commit
@TransactionalEventListener(phase = AFTER_COMMIT)
public void onSubmitted(OrderSubmittedEvent event) {
    rabbitTemplate.convertAndSend("order.exchange",
        "order.submitted", event);
}`,
        metaTags: ['DDD', 'aggregate root', 'optimistic locking', 'events'],
      },
    ],
  },
  {
    label: 'GraphQL (plus)',
    cards: [
      {
        title: 'Spring GraphQL with DataLoader',
        lang: 'java',
        description:
          'GraphQL resolver with N+1 prevention via DataLoader batch loading.',
        code: `@Controller
public class AlbumGraphqlController {

    @QueryMapping
    public List<Album> albums(@Argument Long userId, @Argument int limit) {
        return albumService.findByUser(userId, limit);
    }

    @SchemaMapping(typeName = "Album", field = "photos")
    public CompletableFuture<List<Photo>> photos(
            Album album,
            DataLoader<Long, List<Photo>> photoLoader) {
        return photoLoader.load(album.getId());
    }

    @MutationMapping
    public Album createAlbum(@Valid @Argument AlbumInput input) {
        return albumService.create(input);
    }
}
// schema: type Album { id: ID!, title: String!, photos: [Photo!]! }`,
        metaTags: ['GraphQL', 'Spring', 'DataLoader', 'N+1'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Cloud / Infrastructure Patterns
// ---------------------------------------------------------------------------

export const shutterflyCloudPatterns: PatternSection[] = [
  {
    label: 'AWS Services (S3, SQS, ECS, Aurora, CloudFront)',
    cards: [
      {
        title: 'S3 Pre-signed URLs for Image Upload (75PB scale)',
        lang: 'java',
        description:
          'Direct client upload to S3 via pre-signed URLs. Shutterfly stores 75+ PB of images this way.',
        code: `@Service
public class ImageUploadService {
    private final S3Presigner presigner;

    public PresignedUrlResponse generateUploadUrl(String fileName) {
        String key = "uploads/" + UUID.randomUUID() + "/" + fileName;

        PutObjectRequest putReq = PutObjectRequest.builder()
            .bucket("sfly-prod-images")
            .key(key)
            .contentType("image/jpeg")
            .build();

        PresignedPutObjectRequest presigned = presigner.presignPutObject(
            PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putReq)
                .build());

        return new PresignedUrlResponse(presigned.url().toString(), key);
    }
}
// Flow: Client → API (presign) → S3 direct upload
//       S3 Event → SQS → Worker (thumbnails, metadata)`,
        metaTags: ['S3', 'pre-signed URL', 'upload', '75PB'],
      },
      {
        title: 'SQS Event-Driven Processing',
        lang: 'java',
        description:
          'Async message processing with SQS: decouple upload from thumbnail generation and metadata extraction.',
        code: `// Producer — triggered by S3 event or service
@Service
public class PhotoEventPublisher {
    private final SqsTemplate sqsTemplate;

    public void publishUploadComplete(PhotoUploadedEvent event) {
        sqsTemplate.send(to -> to
            .queue("photo-processing")
            .payload(event)
            .header("eventType", "PHOTO_UPLOADED")
        );
    }
}

// Consumer — generates thumbnails, extracts EXIF
@SqsListener("photo-processing")
public void handlePhotoUploaded(
        @Payload PhotoUploadedEvent event,
        @Header("eventType") String type) {
    log.info("Processing photo {} for user {}", event.key(), event.userId());

    // Generate multiple thumbnail sizes
    thumbnailService.generate(event.bucket(), event.key());

    // Extract and store metadata (EXIF, dimensions, GPS)
    metadataService.extract(event);
}`,
        metaTags: ['SQS', 'async', 'event-driven', 'thumbnails'],
      },
    ],
  },
  {
    label: 'ECS Container Deployments',
    cards: [
      {
        title: 'ECS Task Definition & Service (80% of Shutterfly)',
        lang: 'bash',
        description:
          'Shutterfly runs 80% of workloads on ECS. Containerized services with auto-scaling.',
        code: `# Terraform — ECS Service
resource "aws_ecs_service" "photos_api" {
  name            = "photos-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.photos_api.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnets
    security_groups = [aws_security_group.ecs.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.photos.arn
    container_name   = "photos-api"
    container_port   = 8080
  }
}

# Auto-scaling based on request count
resource "aws_appautoscaling_target" "photos" {
  max_capacity       = 20
  min_capacity       = 3
  resource_id        = "service/\${aws_ecs_cluster.main.name}/photos-api"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}`,
        metaTags: ['ECS', 'Fargate', 'Terraform', 'auto-scaling'],
      },
    ],
  },
  {
    label: 'RabbitMQ Messaging',
    cards: [
      {
        title: 'RabbitMQ with Dead-Letter Queue & Retry',
        lang: 'java',
        description:
          'Pub/sub with topic exchange, DLQ for failed messages, and manual ack for reliability.',
        code: `@Configuration
public class RabbitConfig {
    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange("order.exchange");
    }

    @Bean
    public Queue orderQueue() {
        return QueueBuilder.durable("order.processing")
            .withArgument("x-dead-letter-exchange", "order.dlx")
            .withArgument("x-dead-letter-routing-key", "order.dead")
            .withArgument("x-message-ttl", 60000)
            .build();
    }
}

// Consumer with manual ack
@RabbitListener(queues = "order.processing")
public void process(OrderEvent event, Channel channel,
                    @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
    try {
        fulfillmentService.process(event);
        channel.basicAck(tag, false);
    } catch (RetryableException e) {
        channel.basicNack(tag, false, true);  // requeue
    } catch (Exception e) {
        channel.basicNack(tag, false, false); // send to DLQ
    }
}`,
        metaTags: ['RabbitMQ', 'DLQ', 'topic exchange', 'manual ack'],
      },
    ],
  },
  {
    label: 'Terraform & CI/CD',
    cards: [
      {
        title: 'Terraform Module — Aurora + S3 + SQS',
        lang: 'bash',
        description:
          'Infrastructure as code matching Shutterfly stack: Aurora PostgreSQL, S3, SQS with DLQ.',
        code: `resource "aws_rds_cluster" "main" {
  cluster_identifier     = "sfly-\${var.env}"
  engine                 = "aurora-postgresql"
  engine_version         = "15.4"
  database_name          = "shutterfly"
  master_username        = var.db_username
  master_password        = var.db_password
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 16
  }
}

resource "aws_sqs_queue" "photo_processing" {
  name                       = "photo-processing-\${var.env}"
  visibility_timeout_seconds = 60
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.photo_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_s3_bucket" "images" {
  bucket = "sfly-images-\${var.env}"
}`,
        metaTags: ['Terraform', 'Aurora', 'S3', 'SQS', 'IaC'],
      },
    ],
  },
  {
    label: 'Testing (CI/CD)',
    cards: [
      {
        title: 'Integration Test with Testcontainers',
        lang: 'java',
        description:
          'Full integration test with real PostgreSQL + LocalStack (S3/SQS) in containers.',
        code: `@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class PhotoServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:15");

    @Container
    static LocalStackContainer localstack =
        new LocalStackContainer(DockerImageName.parse("localstack/localstack:3"))
            .withServices(S3, SQS);

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("aws.endpoint", () -> localstack.getEndpoint().toString());
    }

    @Autowired TestRestTemplate restTemplate;

    @Test
    void uploadFlow_generatesPresignedUrl() {
        var response = restTemplate.postForEntity(
            "/api/v1/photos/upload-url?fileName=test.jpg",
            null, PresignedUrlResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().url()).contains("sfly-images");
    }
}`,
        metaTags: ['Testcontainers', 'integration test', 'LocalStack', 'CI/CD'],
      },
    ],
  },
  {
    label: 'AI/LLM Integration',
    cards: [
      {
        title: 'Photo Auto-Tagging with LLM',
        lang: 'python',
        description:
          'Shutterfly uses AI for photo tagging, smart albums, product descriptions. Key use case for the role.',
        code: `import openai
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
async def tag_photo(image_url: str) -> list[str]:
    """Auto-tag photos for smart albums and search."""
    response = await openai.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "List descriptive tags for this photo. Return JSON array."},
                {"type": "image_url", "image_url": {"url": image_url}}
            ]
        }],
        max_tokens=100,
    )
    return json.loads(response.choices[0].message.content)

# Batch with concurrency limit (respect rate limits)
async def process_album(photos: list[str]) -> list[list[str]]:
    sem = asyncio.Semaphore(5)
    async def limited(url):
        async with sem:
            return await tag_photo(url)
    return await asyncio.gather(*[limited(p) for p in photos])`,
        metaTags: ['LLM', 'photo tagging', 'AI', 'vision API'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Coding Problems — Top Shutterfly LeetCode (from InterviewSolver, ranked by frequency)
// ---------------------------------------------------------------------------

export const shutterflyCodePatterns: PatternSection[] = [
  {
    label: 'Trees & Graphs (High Frequency)',
    cards: [
      {
        title: 'Lowest Common Ancestor of Binary Tree (94%)',
        lang: 'java',
        description:
          '#2 most asked. Recursively check left/right subtrees. If both return non-null, current node is LCA.',
        code: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
        metaTags: ['tree', 'DFS', 'LCA', '94% frequency'],
      },
      {
        title: 'Number of Islands II (79%) — Union-Find',
        lang: 'java',
        description:
          'Dynamic grid with add-land operations. Use Union-Find to merge adjacent islands efficiently.',
        code: `public List<Integer> numIslands2(int m, int n, int[][] positions) {
    int[] parent = new int[m * n];
    int[] rank = new int[m * n];
    Arrays.fill(parent, -1);
    List<Integer> result = new ArrayList<>();
    int count = 0;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

    for (int[] pos : positions) {
        int id = pos[0] * n + pos[1];
        if (parent[id] != -1) { result.add(count); continue; }
        parent[id] = id;
        count++;
        for (int[] d : dirs) {
            int nr = pos[0] + d[0], nc = pos[1] + d[1];
            int nid = nr * n + nc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && parent[nid] != -1) {
                int px = find(parent, id), py = find(parent, nid);
                if (px != py) { union(parent, rank, px, py); count--; }
            }
        }
        result.add(count);
    }
    return result;
}

private int find(int[] p, int x) {
    while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
    return x;
}

private void union(int[] p, int[] r, int x, int y) {
    if (r[x] < r[y]) p[x] = y;
    else if (r[x] > r[y]) p[y] = x;
    else { p[y] = x; r[x]++; }
}`,
        metaTags: ['union-find', 'graph', 'islands', '79% frequency'],
      },
      {
        title: 'Longest Increasing Path in a Matrix (74%)',
        lang: 'java',
        description:
          'DFS + memoization. From each cell, try 4 directions where next value is strictly greater.',
        code: `private int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

public int longestIncreasingPath(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int[][] memo = new int[m][n];
    int max = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            max = Math.max(max, dfs(matrix, memo, i, j));
    return max;
}

private int dfs(int[][] matrix, int[][] memo, int r, int c) {
    if (memo[r][c] != 0) return memo[r][c];
    int best = 1;
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < matrix.length && nc >= 0 && nc < matrix[0].length
                && matrix[nr][nc] > matrix[r][c]) {
            best = Math.max(best, 1 + dfs(matrix, memo, nr, nc));
        }
    }
    return memo[r][c] = best;
}`,
        metaTags: ['DFS', 'memoization', 'matrix', '74% frequency'],
      },
    ],
  },
  {
    label: 'Arrays & Binary Search (High Frequency)',
    cards: [
      {
        title: 'Find Peak Element (84%)',
        lang: 'java',
        description:
          'Binary search — move toward the side with a larger neighbor. O(log n).',
        code: `public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
        metaTags: ['binary search', 'peak', '84% frequency'],
      },
      {
        title: 'Next Permutation (81%)',
        lang: 'java',
        description:
          'Find rightmost ascent, swap with next larger element, reverse suffix.',
        code: `public void nextPermutation(int[] nums) {
    int i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = nums.length - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums, i, j);
    }
    reverse(nums, i + 1, nums.length - 1);
}

private void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}
private void reverse(int[] a, int l, int r) {
    while (l < r) swap(a, l++, r--);
}`,
        metaTags: ['array', 'permutation', '81% frequency'],
      },
      {
        title: 'Find K Closest Elements (62%)',
        lang: 'java',
        description:
          'Binary search for the left bound of the k-length window closest to target.',
        code: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        // Compare distances of window boundaries
        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
        else hi = mid;
    }
    List<Integer> result = new ArrayList<>();
    for (int i = lo; i < lo + k; i++) result.add(arr[i]);
    return result;
}`,
        metaTags: ['binary search', 'sliding window', '62% frequency'],
      },
    ],
  },
  {
    label: 'Dynamic Programming (High Frequency)',
    cards: [
      {
        title: 'K Inverse Pairs Array (94%) — Hard',
        lang: 'java',
        description:
          'dp[n][k] = # of arrays of [1..n] with exactly k inverse pairs. Use prefix sums for O(nk).',
        code: `public int kInversePairs(int n, int k) {
    int MOD = 1_000_000_007;
    int[][] dp = new int[n + 1][k + 1];
    dp[0][0] = 1;
    for (int i = 1; i <= n; i++) {
        long[] prefix = new long[k + 2];
        for (int j = 0; j <= k; j++)
            prefix[j + 1] = prefix[j] + dp[i - 1][j];
        for (int j = 0; j <= k; j++) {
            long val = prefix[j + 1] - prefix[Math.max(0, j - i + 1)];
            dp[i][j] = (int)(val % MOD);
        }
    }
    return dp[n][k];
}`,
        metaTags: ['DP', 'prefix sum', 'inverse pairs', '94% frequency'],
      },
      {
        title: 'House Robber (54%)',
        lang: 'java',
        description:
          'Classic 1D DP. dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space-optimize to two vars.',
        code: `public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
        metaTags: ['DP', 'house robber', '54% frequency'],
      },
      {
        title: 'Best Time to Buy and Sell Stock IV (35%) — Hard',
        lang: 'java',
        description:
          'At most k transactions. dp[t][i] = max profit with t transactions up to day i.',
        code: `public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (k >= n / 2) { // unlimited transactions
        int profit = 0;
        for (int i = 1; i < n; i++)
            profit += Math.max(0, prices[i] - prices[i - 1]);
        return profit;
    }
    int[][] dp = new int[k + 1][n];
    for (int t = 1; t <= k; t++) {
        int maxDiff = -prices[0];
        for (int i = 1; i < n; i++) {
            dp[t][i] = Math.max(dp[t][i - 1], prices[i] + maxDiff);
            maxDiff = Math.max(maxDiff, dp[t - 1][i] - prices[i]);
        }
    }
    return dp[k][n - 1];
}`,
        metaTags: ['DP', 'stock', 'k transactions', '35% frequency'],
      },
    ],
  },
  {
    label: 'Design & Stream (High Frequency)',
    cards: [
      {
        title: 'Moving Average from Data Stream (76%)',
        lang: 'java',
        description:
          'Sliding window with a queue. Maintain running sum for O(1) average.',
        code: `class MovingAverage {
    private Queue<Integer> queue = new LinkedList<>();
    private int maxSize;
    private double sum = 0;

    public MovingAverage(int size) { this.maxSize = size; }

    public double next(int val) {
        queue.offer(val);
        sum += val;
        if (queue.size() > maxSize) sum -= queue.poll();
        return sum / queue.size();
    }
}`,
        metaTags: ['design', 'queue', 'sliding window', '76% frequency'],
      },
      {
        title: 'Find Median from Data Stream (55%) — Hard',
        lang: 'java',
        description:
          'Two heaps: max-heap for lower half, min-heap for upper half. Balance after each insert.',
        code: `class MedianFinder {
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> hi = new PriorityQueue<>();

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        return lo.size() > hi.size()
            ? lo.peek()
            : (lo.peek() + hi.peek()) / 2.0;
    }
}`,
        metaTags: ['heap', 'median', 'data stream', '55% frequency'],
      },
      {
        title: 'Random Pick Index (86%) — Reservoir Sampling',
        lang: 'java',
        description:
          '#4 most asked. Pick random index of target value with equal probability using reservoir sampling.',
        code: `class Solution {
    private int[] nums;
    private Random rand = new Random();

    public Solution(int[] nums) { this.nums = nums; }

    public int pick(int target) {
        int result = -1, count = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                count++;
                if (rand.nextInt(count) == 0) result = i;
            }
        }
        return result;
    }
}`,
        metaTags: ['reservoir sampling', 'random', '86% frequency'],
      },
    ],
  },
  {
    label: 'String & Backtracking',
    cards: [
      {
        title: 'Longest Palindromic Substring (64%)',
        lang: 'java',
        description:
          'Expand around center for odd/even lengths. O(n²) time, O(1) space.',
        code: `public String longestPalindrome(String s) {
    int start = 0, maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    return s.substring(start, start + maxLen);
}

private int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
        l--; r++;
    }
    return r - l - 1;
}`,
        metaTags: ['string', 'palindrome', 'expand around center', '64%'],
      },
      {
        title: 'Subsets (76%)',
        lang: 'java',
        description:
          'Backtracking: include or exclude each element. 2^n total subsets.',
        code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(res, new ArrayList<>(), nums, 0);
    return res;
}

private void backtrack(List<List<Integer>> res, List<Integer> curr,
                       int[] nums, int start) {
    res.add(new ArrayList<>(curr));
    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(res, curr, nums, i + 1);
        curr.remove(curr.size() - 1);
    }
}`,
        metaTags: ['backtracking', 'subsets', '76% frequency'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Likely Interview Questions — Mix of Technical + Behavioral (55% behavioral per research)
// ---------------------------------------------------------------------------

export const shutterflyQuestions: QuestionItem[] = [
  {
    name: 'Design image upload system for 80M users (System Design)',
    diff: 'hard',
    hint: 'Pre-signed S3 URLs → SQS → ECS workers for thumbnails → Aurora metadata → CloudFront delivery.',
    lang: 'java',
    code: `// Shutterfly's actual architecture:
// 1. Client requests pre-signed URL from API (Spring Boot on ECS)
// 2. Client uploads directly to S3 (75+ PB image library)
// 3. S3 event notification → SQS message
// 4. ECS worker consumes message:
//    - Generate thumbnails (multiple sizes)
//    - Extract EXIF metadata (GPS, date, camera)
//    - AI tagging (faces, places, events)
// 5. Store metadata in Aurora PostgreSQL
// 6. Serve via CloudFront CDN (100k req/min at peak)

// Key decisions:
// - Pre-signed URLs avoid server as upload bottleneck
// - SQS decouples upload from processing (async)
// - ECS auto-scales workers based on queue depth
// - Read replicas for read-heavy photo browsing
// - OpenSearch for full-text + tag-based search`,
  },
  {
    name: 'Explain async messaging patterns and when to use each',
    diff: 'medium',
    hint: 'Point-to-point (SQS), pub/sub (SNS+SQS fan-out), RabbitMQ topics, DLQ for poison messages.',
    lang: 'java',
    code: `// Shutterfly uses both SQS and RabbitMQ:
// ─────────────────────────────────────────
// SQS: Simple queue for decoupling services
//   - Photo processing pipeline (upload → thumbnail → metadata)
//   - Order fulfillment events
//   - Redrive policy: 3 retries → DLQ

// RabbitMQ: Complex routing with topic exchanges
//   - order.created.* → fulfillment, notification, analytics
//   - photo.tagged.* → search indexing, album suggestions
//   - Manual ack for reliable processing

// Idempotency (critical at 100k req/min):
@SqsListener("photo-processing")
public void handle(PhotoEvent event) {
    String dedupKey = event.messageId();
    if (redis.setIfAbsent(dedupKey, "1", Duration.ofHours(24))) {
        processPhoto(event);  // Only process once
    }
}`,
  },
  {
    name: 'How would you improve performance of a photo e-commerce site?',
    diff: 'medium',
    hint: 'CDN (CloudFront), image lazy loading, DB read replicas, caching (ElastiCache/Redis), OpenSearch.',
    lang: 'java',
    code: `// Performance strategy for 100k req/min:
// 1. CDN: CloudFront for all static assets + images
// 2. Caching: ElastiCache (Redis) for hot data
//    - User sessions, album metadata, product configs
//    - Cache-aside pattern with TTL
// 3. Database: Aurora read replicas for browse queries
// 4. Search: OpenSearch for product/photo search
// 5. Async: Offload heavy work to SQS + workers
// 6. Container scaling: ECS auto-scale on CPU/request count

@Cacheable(value = "albums", key = "#userId")
public List<AlbumDto> getAlbums(Long userId) {
    return albumRepo.findByUserId(userId).stream()
        .map(AlbumMapper::toDto).toList();
}

@CacheEvict(value = "albums", key = "#userId")
@Transactional
public AlbumDto createAlbum(Long userId, CreateAlbumRequest req) {
    // ... invalidate cache on write
}`,
  },
  {
    name: 'Walk me through migrating from monolith to microservices',
    diff: 'hard',
    hint: 'Strangler fig pattern, bounded contexts, Shutterfly has 300 services across 40+ app suites.',
    lang: 'bash',
    code: `# Shutterfly's real migration journey:
# - Started cloud migration 2018, chose AWS as strategic partner
# - Evacuated colocated data center in 2021
# - Migrated 2000 VMs → 1200 (40% reduction via right-sizing)
# - 80% to ECS containers, 20% to EC2
# - Now: 300 services across 40+ application suites
#
# Strangler Fig approach:
# 1. Identify bounded context (Photos, Orders, Users, Print)
# 2. Build new service in ECS behind same API gateway
# 3. Route traffic gradually (canary deployment)
# 4. Each service owns its data (no shared DB)
# 5. Communicate via SQS/RabbitMQ events
# 6. Decommission old code once traffic fully shifted
#
# Result: 25% cost reduction, zero high-severity incidents,
# completed 6 months ahead of schedule`,
  },
  {
    name: 'Tell me about a time you overcame a technical obstacle (Behavioral)',
    diff: 'easy',
    hint: 'STAR format. Focus on initiative, hands-on debugging, and communication with non-technical stakeholders.',
    lang: 'bash',
    code: `# STAR Framework (55% of Shutterfly interviews are behavioral):
#
# Situation: Production latency spike during peak photo season
# Task: Identify root cause, fix within SLA, prevent recurrence
# Action:
#   - Checked Grafana dashboards → connection pool exhaustion
#   - Traced to slow queries missing indexes on photos table
#   - Added composite index (user_id, status, created_at)
#   - Implemented connection pool monitoring in CloudWatch
# Result:
#   - P99 latency dropped from 3s to 200ms
#   - Added alerting, documented runbook for team
#   - Presented findings to non-technical PM and QA
#
# Key Shutterfly values to hit:
# - "80-100% hands-on coding" → show you debug/code yourself
# - "Strong initiative and follow-through"
# - "Balancing multiple priorities effectively"
# - "Explain technical designs to non-technical team members"`,
  },
  {
    name: 'Describe your experience with AI-assisted development tools',
    diff: 'easy',
    hint: 'Claude Code, GitHub Copilot — explicitly listed in job req. Show practical workflow integration.',
    lang: 'bash',
    code: `# Job posting explicitly requires:
# "Experience working with Claude Code, GitHub Copilot
#  or other AI-assisted development tools"
#
# Practical answer framework:
# 1. Code generation: boilerplate, CRUD, test scaffolding
# 2. Code review: catch bugs, security issues, style violations
# 3. Refactoring: extract methods, simplify complex logic
# 4. Debugging: explain stack traces, suggest fixes
# 5. Documentation: generate Javadoc, API docs, ADRs
#
# Key principles to emphasize:
# - Always review AI output (don't blindly accept)
# - AI excels at repetitive tasks → human focuses on design
# - Pair with strong CI/CD as safety net
# - Use for test generation to increase coverage
#
# Shutterfly context: Senior SWEs there use Claude Code
# for "LLM-powered feature development" in production`,
  },
  {
    name: 'How do you ensure code quality in a Kanban team?',
    diff: 'easy',
    hint: 'WIP limits, CI/CD pipeline, code reviews, Testcontainers, Definition of Done.',
    lang: 'bash',
    code: `# Shutterfly uses Kanban (mentioned in job posting):
#
# Quality practices:
# 1. CI Pipeline: lint → unit tests → integration tests → build
# 2. Code review: required PR approval before merge
# 3. Testing pyramid:
#    - Unit: JUnit 5 + Mockito (fast, isolated)
#    - Integration: Testcontainers (real Postgres, LocalStack)
#    - E2E: smoke tests post-deploy
# 4. Kanban specifics:
#    - WIP limits (max 2-3 items in progress per dev)
#    - Definition of Done: tests pass, reviewed, docs updated
#    - Continuous delivery (no sprint boundaries)
# 5. Monitoring: alerts on error rates, latency (Grafana/Splunk)
#
# Collaboration emphasis:
# "Ability to present and explain technical designs and
#  business requirements to other team members"
# → Regular demos to QA, BAs, PMs`,
  },
  {
    name: 'Design a RESTful API for photo album management',
    diff: 'medium',
    hint: 'CRUD + pagination + proper HTTP verbs/status codes. Think about the photo upload sub-resource.',
    lang: 'java',
    code: `// RESTful API design for Shutterfly-like photo albums:
// GET    /api/v1/albums?page=0&size=20       → 200 (paginated list)
// GET    /api/v1/albums/{id}                 → 200 or 404
// POST   /api/v1/albums                     → 201 + Location header
// PUT    /api/v1/albums/{id}                → 200 or 404
// DELETE /api/v1/albums/{id}                → 204 or 404
// POST   /api/v1/albums/{id}/photos/upload  → 200 (returns presigned URL)
// GET    /api/v1/albums/{id}/photos?page=0  → 200 (paginated photos)

@GetMapping
public ResponseEntity<Page<AlbumDto>> listAlbums(
        @AuthenticationPrincipal User user,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    Pageable pageable = PageRequest.of(page, size,
        Sort.by("createdAt").descending());
    return ResponseEntity.ok(
        albumService.findByUser(user.getId(), pageable));
}`,
  },
  {
    name: 'How would you handle a production outage? (Behavioral)',
    diff: 'medium',
    hint: 'Incident response: detect (monitoring), mitigate, root cause, postmortem. Show ownership.',
    lang: 'bash',
    code: `# Incident Response Framework:
#
# 1. DETECT (Grafana/Splunk/AppDynamics alerts)
#    - Error rate spike, latency increase, queue depth growing
#
# 2. MITIGATE (first priority = restore service)
#    - Scale up ECS tasks if capacity issue
#    - Roll back deployment if recent change
#    - Circuit breaker to isolate failing dependency
#
# 3. ROOT CAUSE
#    - Correlate timing with deployments, config changes
#    - Check CloudWatch metrics, application logs
#    - Database slow query log, connection pool stats
#
# 4. FIX & PREVENT
#    - Deploy fix with hotfix branch
#    - Add monitoring/alerting for the failure mode
#    - Write postmortem (blameless) with action items
#
# Shutterfly context: "Zero high-severity incidents"
# after their migration — they take reliability seriously`,
  },
  {
    name: 'Explain Docker containerization and ECS deployment',
    diff: 'medium',
    hint: 'Shutterfly migrated 80% to ECS. Dockerfile → ECR → Task Definition → Service → ALB.',
    lang: 'bash',
    code: `# Shutterfly's ECS deployment pipeline:
# 1. Developer pushes to main branch
# 2. CI builds Docker image:
FROM eclipse-temurin:21-jre-alpine
COPY target/app.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

# 3. Push to ECR (Elastic Container Registry)
# 4. Update ECS Task Definition with new image tag
# 5. ECS Service performs rolling deployment:
#    - Start new tasks with new image
#    - Health check via ALB target group
#    - Drain connections from old tasks
#    - Terminate old tasks
# 6. Auto-scaling: scale on CPU, memory, or ALB request count
#
# Key ECS concepts:
# - Task Definition = container blueprint (image, CPU, memory, env vars)
# - Service = ensures N tasks running, handles rolling deploys
# - Cluster = logical grouping of services
# - Fargate = serverless (no EC2 management)`,
  },
];

// ---------------------------------------------------------------------------
// Game Plan — Phone Screen → 2 Technical → Managerial (per Glassdoor)
// ---------------------------------------------------------------------------

export const shutterflyGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Behavioral/STAR', type: 'Stories + Values', minutes: 25, highlight: true },
    { label: 'Java/Spring/AWS', type: 'Technical Discussion', minutes: 20, highlight: true },
    { label: 'Architecture', type: 'System Design Chat', minutes: 10, highlight: false },
    { label: 'AI Tools', type: 'LLM/Claude/Copilot', minutes: 5, highlight: false },
  ],
  strategies: [
    {
      title: '1-Hour Panel: 2 Principal Engineers + Sr Director',
      steps: [
        'This is NOT a coding exam — it\'s a conversation with senior engineers',
        'Expect: behavioral first, then walk-through-code/architecture discussion',
        'Recruiter confirmed: "combination of technical and behavioral questions"',
        'Glassdoor May 2026: "behavioral questions first, then coding walkthrough"',
        'Have 5-6 UCC Hub stories ready — they want enterprise-scale experience',
        'Panel: Swathi Voruganti, David DeCesare, Kevin Stagg',
      ],
      highlightText: 'Lead with stories about systems you\'ve actually built and owned',
    },
    {
      title: 'Behavioral — 40% of Interview (STAR Method)',
      steps: [
        '"Tell me about a project you\'re proud of" → Error Categorization or Service Extraction',
        '"Describe a production issue" → PSA NPE (16K msgs/hr, traced async, 20 tests)',
        '"How do you design a new service?" → REST, DB, async events, testing, monitoring',
        '"Why microservices over monolith?" → UCC Hub context + Appointment Service extraction',
        '"Tell me about ownership" → OTP deployment handoff, found 5 runbook errors',
        '"How do you collaborate?" → Error categorization: 4+ teams, BI changed schema 3x',
      ],
      highlightText: 'Your biggest advantage: "I worked on 40+ microservices at Charter, not a CRUD app"',
    },
    {
      title: 'Technical Discussion — 35% (Not Whiteboard)',
      steps: [
        'Spring Boot: @Cacheable proxy gotchas, dual persistence (JDBC/JPA), externalized SQL',
        'Kafka: 22 consumers, 3 clusters, batch mode, per-message error isolation, @Async fallback',
        'RabbitMQ: circuit breaker parking, chained transaction manager, per-channel queues',
        'Production debugging: CloudWatch regex queries, 25,890 NPEs quantified in a day',
        'AWS: "I interact with EKS, S3, CloudWatch, Pinpoint — understand how SQS/RDS/API Gateway fit"',
        'If asked to walk through code: use PSA NPE fix (Collectors.toMap null crash)',
      ],
      highlightText: 'Don\'t fake deep AWS — say "I use EKS/S3/CloudWatch daily, understand the rest architecturally"',
    },
    {
      title: 'AI Tools — Almost Guaranteed (in JD)',
      steps: [
        'JD explicitly mentions: Claude Code, GitHub Copilot, LLMs',
        'Your answer: built verified knowledge base for 40+ microservices as LLM context',
        'Authored custom steering files for code generation accuracy',
        'Designed CI pipeline to detect documentation drift when service code changes',
        'Use AI for: debugging (paste stack traces), test generation, architecture exploration',
        'Productivity: "LLM tools with proper context generate production-quality code for our patterns"',
      ],
      highlightText: 'This is YOUR differentiator — most candidates haven\'t operationalized AI tooling',
    },
  ],
  keywords: [
    'Java',
    'Spring Boot',
    'AWS EKS',
    'S3',
    'SQS',
    'Kafka',
    'RabbitMQ',
    'microservices',
    'production incidents',
    'STAR method',
    'system ownership',
    'AI/LLM',
    'Claude Code',
    'Copilot',
    'Docker',
    'ArgoCD',
    'CloudWatch',
    'event-driven',
    'service extraction',
    'Spring Batch',
  ],
};
