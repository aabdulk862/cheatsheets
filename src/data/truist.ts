import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

// ─── Company Configuration ───────────────────────────────────────────────────

export const truistConfig: CompanyConfig = {
  slug: 'truist',
  title: 'Truist Technical Interview — Cheat Sheet',
  subtitle:
    'Recruiter Screen → Technical Interview(s) · Java, SQL, Banking Domain Focus',
  accentColor: '#532E8A',
  timerMinutes: 60,
  tabs: [
    { id: 'java-sql', label: 'Java/SQL Patterns' },
    { id: 'banking', label: 'Banking Domain Patterns' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
    { id: 'experience', label: 'My Experience' },
    { id: 'design', label: 'System Design' },
    { id: 'intro', label: 'Intro/Why' },
    { id: 'stories', label: 'Story Router' },
  ],
};

// ─── Java / SQL Patterns ─────────────────────────────────────────────────────

export const truistJavaSqlPatterns: PatternSection[] = [
  // ── Core Java ──
  {
    label: 'Core Java — OOP & Collections',
    cards: [
      {
        title: 'OOP Principles — Encapsulation & Inheritance',
        lang: 'java',
        description:
          'Demonstrates encapsulation with private fields and inheritance for a banking account hierarchy.',
        code: `public abstract class Account {
    private String accountId;
    private BigDecimal balance;

    public Account(String accountId, BigDecimal balance) {
        this.accountId = accountId;
        this.balance = balance;
    }

    public BigDecimal getBalance() { return balance; }

    protected void setBalance(BigDecimal amt) {
        this.balance = amt;
    }

    public abstract BigDecimal calculateInterest();
}

public class SavingsAccount extends Account {
    private static final BigDecimal RATE = new BigDecimal("0.025");

    public SavingsAccount(String id, BigDecimal bal) {
        super(id, bal);
    }

    @Override
    public BigDecimal calculateInterest() {
        return getBalance().multiply(RATE);
    }
}`,
        metaTags: ['OOP', 'encapsulation', 'inheritance', 'abstract'],
      },
      {
        title: 'Exception Handling — Custom Banking Exception',
        lang: 'java',
        description:
          'Custom checked exception with error codes for financial transaction failures.',
        code: `public class InsufficientFundsException extends Exception {
    private final String accountId;
    private final BigDecimal requested;
    private final BigDecimal available;

    public InsufficientFundsException(
            String accountId, BigDecimal requested, BigDecimal available) {
        super(String.format("Account %s: requested %s but only %s available",
                accountId, requested, available));
        this.accountId = accountId;
        this.requested = requested;
        this.available = available;
    }

    public String getAccountId() { return accountId; }
    public BigDecimal getRequested() { return requested; }
    public BigDecimal getAvailable() { return available; }
}

// Usage
public void withdraw(BigDecimal amount) throws InsufficientFundsException {
    if (amount.compareTo(balance) > 0) {
        throw new InsufficientFundsException(accountId, amount, balance);
    }
    balance = balance.subtract(amount);
}`,
        metaTags: ['exception', 'checked', 'custom', 'banking'],
      },
      {
        title: 'Generics — Type-Safe Repository Pattern',
        lang: 'java',
        description:
          'Generic repository interface for type-safe CRUD operations on banking entities.',
        code: `public interface Repository<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
}

public class AccountRepository implements Repository<Account, String> {
    private final Map<String, Account> store = new ConcurrentHashMap<>();

    @Override
    public Optional<Account> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public List<Account> findAll() {
        return new ArrayList<>(store.values());
    }

    @Override
    public Account save(Account account) {
        store.put(account.getAccountId(), account);
        return account;
    }

    @Override
    public void deleteById(String id) {
        store.remove(id);
    }
}`,
        metaTags: ['generics', 'repository', 'type-safe', 'CRUD'],
      },
      {
        title: 'Collections — Sorting & Grouping Transactions',
        lang: 'java',
        description:
          'Using Collections API to sort, filter, and group financial transactions.',
        code: `List<Transaction> transactions = getTransactions();

// Sort by amount descending
transactions.sort(Comparator.comparing(Transaction::getAmount).reversed());

// Group by transaction type
Map<TransactionType, List<Transaction>> grouped = transactions.stream()
    .collect(Collectors.groupingBy(Transaction::getType));

// Find total debits
BigDecimal totalDebits = transactions.stream()
    .filter(t -> t.getType() == TransactionType.DEBIT)
    .map(Transaction::getAmount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);

// Get top 5 largest credits
List<Transaction> topCredits = transactions.stream()
    .filter(t -> t.getType() == TransactionType.CREDIT)
    .sorted(Comparator.comparing(Transaction::getAmount).reversed())
    .limit(5)
    .collect(Collectors.toList());`,
        metaTags: ['Collections', 'streams', 'grouping', 'sorting'],
      },
    ],
  },
  // ── Multithreading ──
  {
    label: 'Multithreading & Concurrency',
    cards: [
      {
        title: 'Synchronized — Thread-Safe Account Operations',
        lang: 'java',
        description:
          'Using synchronized blocks to ensure atomic balance updates in concurrent banking operations.',
        code: `public class ThreadSafeAccount {
    private BigDecimal balance;
    private final Object lock = new Object();

    public void transfer(ThreadSafeAccount target, BigDecimal amount)
            throws InsufficientFundsException {
        // Acquire locks in consistent order to prevent deadlock
        Object firstLock = System.identityHashCode(this) < System.identityHashCode(target)
                ? this.lock : target.lock;
        Object secondLock = firstLock == this.lock ? target.lock : this.lock;

        synchronized (firstLock) {
            synchronized (secondLock) {
                if (this.balance.compareTo(amount) < 0) {
                    throw new InsufficientFundsException(
                        "src", amount, this.balance);
                }
                this.balance = this.balance.subtract(amount);
                target.balance = target.balance.add(amount);
            }
        }
    }
}`,
        metaTags: ['synchronized', 'thread-safe', 'deadlock', 'transfer'],
      },
      {
        title: 'ExecutorService — Batch Transaction Processing',
        lang: 'java',
        description:
          'Using ExecutorService to process batches of transactions concurrently with controlled parallelism.',
        code: `public class BatchProcessor {
    private final ExecutorService executor =
        Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());

    public List<TransactionResult> processBatch(List<Transaction> batch) {
        List<Future<TransactionResult>> futures = batch.stream()
            .map(txn -> executor.submit(() -> processTransaction(txn)))
            .collect(Collectors.toList());

        return futures.stream()
            .map(f -> {
                try {
                    return f.get(30, TimeUnit.SECONDS);
                } catch (TimeoutException e) {
                    return TransactionResult.timeout();
                } catch (Exception e) {
                    return TransactionResult.error(e.getMessage());
                }
            })
            .collect(Collectors.toList());
    }

    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}`,
        metaTags: ['ExecutorService', 'batch', 'Future', 'timeout'],
      },
      {
        title: 'CompletableFuture — Async Account Enrichment',
        lang: 'java',
        description:
          'Composing async operations to enrich account data from multiple services.',
        code: `public CompletableFuture<EnrichedAccount> enrichAccount(String accountId) {
    CompletableFuture<Account> accountFuture =
        CompletableFuture.supplyAsync(() -> accountService.findById(accountId));

    CompletableFuture<CreditScore> creditFuture =
        CompletableFuture.supplyAsync(() -> creditService.getScore(accountId));

    CompletableFuture<List<Transaction>> txnFuture =
        CompletableFuture.supplyAsync(() -> txnService.getRecent(accountId));

    return accountFuture.thenCombine(creditFuture, (account, score) ->
        new EnrichedAccount(account, score))
        .thenCombine(txnFuture, (enriched, txns) -> {
            enriched.setRecentTransactions(txns);
            return enriched;
        })
        .exceptionally(ex -> {
            log.error("Failed to enrich account {}: {}", accountId, ex.getMessage());
            return EnrichedAccount.fallback(accountId);
        });
}`,
        metaTags: ['CompletableFuture', 'async', 'compose', 'non-blocking'],
      },
    ],
  },
  // ── Design Patterns ──
  {
    label: 'Design Patterns',
    cards: [
      {
        title: 'Singleton — Database Connection Pool',
        lang: 'java',
        description:
          'Thread-safe Singleton using double-checked locking for a shared connection pool.',
        code: `public class ConnectionPool {
    private static volatile ConnectionPool instance;
    private final HikariDataSource dataSource;

    private ConnectionPool() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/truist_db");
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        this.dataSource = new HikariDataSource(config);
    }

    public static ConnectionPool getInstance() {
        if (instance == null) {
            synchronized (ConnectionPool.class) {
                if (instance == null) {
                    instance = new ConnectionPool();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}`,
        metaTags: ['Singleton', 'connection-pool', 'thread-safe'],
      },
      {
        title: 'Factory — Transaction Type Creation',
        lang: 'java',
        description:
          'Factory pattern to create different transaction processors based on type.',
        code: `public interface TransactionProcessor {
    TransactionResult process(Transaction txn);
}

public class TransactionProcessorFactory {
    private static final Map<TransactionType, Supplier<TransactionProcessor>>
        registry = new EnumMap<>(TransactionType.class);

    static {
        registry.put(TransactionType.WIRE, WireTransferProcessor::new);
        registry.put(TransactionType.ACH, AchProcessor::new);
        registry.put(TransactionType.INTERNAL, InternalTransferProcessor::new);
        registry.put(TransactionType.BILL_PAY, BillPayProcessor::new);
    }

    public static TransactionProcessor create(TransactionType type) {
        Supplier<TransactionProcessor> supplier = registry.get(type);
        if (supplier == null) {
            throw new IllegalArgumentException(
                "No processor registered for type: " + type);
        }
        return supplier.get();
    }
}`,
        metaTags: ['Factory', 'registry', 'transaction', 'polymorphism'],
      },
      {
        title: 'Observer — Transaction Event Notification',
        lang: 'java',
        description:
          'Observer pattern for notifying multiple services when a transaction completes.',
        code: `public interface TransactionObserver {
    void onTransactionCompleted(TransactionEvent event);
}

public class TransactionEventBus {
    private final List<TransactionObserver> observers = new CopyOnWriteArrayList<>();

    public void subscribe(TransactionObserver observer) {
        observers.add(observer);
    }

    public void unsubscribe(TransactionObserver observer) {
        observers.remove(observer);
    }

    public void publish(TransactionEvent event) {
        observers.forEach(obs -> {
            try {
                obs.onTransactionCompleted(event);
            } catch (Exception e) {
                log.error("Observer failed: {}", e.getMessage());
            }
        });
    }
}

// Observers
public class AuditLogger implements TransactionObserver { /* ... */ }
public class FraudDetector implements TransactionObserver { /* ... */ }
public class NotificationService implements TransactionObserver { /* ... */ }`,
        metaTags: ['Observer', 'event-bus', 'decoupled', 'notification'],
      },
    ],
  },
  // ── SQL Patterns ──
  {
    label: 'SQL — Multi-Table Joins',
    cards: [
      {
        title: 'INNER, LEFT, RIGHT & Self-Joins',
        lang: 'sql',
        description:
          'Common join patterns for banking data: customer-account relationships and manager hierarchies.',
        code: `-- INNER JOIN: Customers with active accounts
SELECT c.customer_id, c.full_name, a.account_number, a.balance
FROM customers c
INNER JOIN accounts a ON c.customer_id = a.customer_id
WHERE a.status = 'ACTIVE';

-- LEFT JOIN: All customers, including those without accounts
SELECT c.customer_id, c.full_name, a.account_number
FROM customers c
LEFT JOIN accounts a ON c.customer_id = a.customer_id;

-- RIGHT JOIN: All accounts, including orphaned ones
SELECT c.full_name, a.account_number, a.balance
FROM customers c
RIGHT JOIN accounts a ON c.customer_id = a.customer_id;

-- Self-Join: Employee-manager hierarchy
SELECT e.employee_name AS employee,
       m.employee_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;`,
        metaTags: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'self-join'],
      },
    ],
  },
  {
    label: 'SQL — Window Functions',
    cards: [
      {
        title: 'Window Functions for Financial Analysis',
        lang: 'sql',
        description:
          'ROW_NUMBER, RANK, running totals, and moving averages for transaction analysis.',
        code: `-- Running balance per account
SELECT account_id, txn_date, amount,
    SUM(amount) OVER (
        PARTITION BY account_id
        ORDER BY txn_date
        ROWS UNBOUNDED PRECEDING
    ) AS running_balance
FROM transactions;

-- Rank customers by total deposits
SELECT customer_id, total_deposits,
    DENSE_RANK() OVER (ORDER BY total_deposits DESC) AS deposit_rank
FROM (
    SELECT customer_id, SUM(amount) AS total_deposits
    FROM transactions WHERE type = 'CREDIT'
    GROUP BY customer_id
) sub;

-- 30-day moving average of daily transaction volume
SELECT txn_date, daily_volume,
    AVG(daily_volume) OVER (
        ORDER BY txn_date
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS moving_avg_30d
FROM daily_transaction_summary;`,
        metaTags: ['window', 'RANK', 'running-total', 'moving-average'],
      },
    ],
  },
  {
    label: 'SQL — Transaction Isolation & Stored Procedures',
    cards: [
      {
        title: 'Transaction Isolation Levels',
        lang: 'sql',
        description:
          'Demonstrates READ COMMITTED, REPEATABLE READ, and SERIALIZABLE for financial integrity.',
        code: `-- READ COMMITTED (default in PostgreSQL)
-- Prevents dirty reads; each statement sees latest committed data
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
    SELECT balance FROM accounts WHERE account_id = 'A001';
    -- Another transaction may commit between these statements
    UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A001';
COMMIT;

-- REPEATABLE READ
-- Snapshot at start of transaction; prevents non-repeatable reads
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
    SELECT balance FROM accounts WHERE account_id = 'A001'; -- sees snapshot
    -- Same query returns same result even if others commit
    SELECT balance FROM accounts WHERE account_id = 'A001'; -- same value
COMMIT;

-- SERIALIZABLE (strongest — use for critical financial operations)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
    SELECT SUM(balance) FROM accounts WHERE branch_id = 'BR01';
    -- Guarantees no phantom reads; transactions appear sequential
COMMIT;`,
        metaTags: ['isolation', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
      },
      {
        title: 'Stored Procedure — Fund Transfer',
        lang: 'sql',
        description:
          'Atomic fund transfer stored procedure with validation and audit logging.',
        code: `CREATE OR REPLACE PROCEDURE transfer_funds(
    p_from_account VARCHAR(20),
    p_to_account   VARCHAR(20),
    p_amount       NUMERIC(15,2),
    p_reference    VARCHAR(50)
)
LANGUAGE plpgsql AS $$
DECLARE
    v_from_balance NUMERIC(15,2);
BEGIN
    -- Lock rows to prevent concurrent modification
    SELECT balance INTO v_from_balance
    FROM accounts WHERE account_id = p_from_account
    FOR UPDATE;

    IF v_from_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds: available %, requested %',
            v_from_balance, p_amount;
    END IF;

    UPDATE accounts SET balance = balance - p_amount
    WHERE account_id = p_from_account;

    UPDATE accounts SET balance = balance + p_amount
    WHERE account_id = p_to_account;

    INSERT INTO audit_log (action, from_acct, to_acct, amount, reference, ts)
    VALUES ('TRANSFER', p_from_account, p_to_account, p_amount,
            p_reference, NOW());
END;
$$;`,
        metaTags: ['stored-procedure', 'transfer', 'atomic', 'audit'],
      },
    ],
  },
  {
    label: 'SQL — Financial Data Queries',
    cards: [
      {
        title: 'Loan Aggregation & Interest Rate Calculations',
        lang: 'sql',
        description:
          'Aggregate loan portfolio data with weighted average interest rates and maturity analysis.',
        code: `-- Loan portfolio summary by product type
SELECT
    loan_type,
    COUNT(*) AS loan_count,
    SUM(principal) AS total_principal,
    SUM(principal * interest_rate) / SUM(principal) AS weighted_avg_rate,
    AVG(remaining_term_months) AS avg_remaining_term
FROM loans
WHERE status = 'ACTIVE'
GROUP BY loan_type
ORDER BY total_principal DESC;

-- Monthly interest accrual calculation
SELECT
    l.loan_id,
    l.principal,
    l.interest_rate,
    (l.principal * l.interest_rate / 12) AS monthly_interest,
    l.principal + (l.principal * l.interest_rate / 12) AS balance_after_accrual
FROM loans l
WHERE l.next_payment_date <= CURRENT_DATE + INTERVAL '30 days';`,
        metaTags: ['loan', 'aggregation', 'interest-rate', 'portfolio'],
      },
      {
        title: 'Account Balance Reconciliation',
        lang: 'sql',
        description:
          'Reconcile account balances against transaction history to detect discrepancies.',
        code: `-- Reconciliation: compare stored balance vs computed balance
WITH computed_balances AS (
    SELECT
        account_id,
        SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END)
            AS computed_balance
    FROM transactions
    WHERE status = 'COMPLETED'
    GROUP BY account_id
)
SELECT
    a.account_id,
    a.balance AS stored_balance,
    cb.computed_balance,
    a.balance - cb.computed_balance AS discrepancy
FROM accounts a
JOIN computed_balances cb ON a.account_id = cb.account_id
WHERE ABS(a.balance - cb.computed_balance) > 0.01
ORDER BY ABS(a.balance - cb.computed_balance) DESC;`,
        metaTags: ['reconciliation', 'balance', 'discrepancy', 'audit'],
      },
    ],
  },
  // ── REST API Patterns ──
  {
    label: 'REST API Patterns',
    cards: [
      {
        title: 'API Versioning Strategy',
        lang: 'java',
        description:
          'URI-based versioning with backward compatibility for banking APIs.',
        code: `@RestController
@RequestMapping("/api/v2/accounts")
public class AccountControllerV2 {

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponseV2> getAccount(
            @PathVariable String accountId) {
        Account account = accountService.findById(accountId);
        return ResponseEntity.ok(AccountResponseV2.from(account));
    }
}

// Version negotiation via header (alternative approach)
@GetMapping(value = "/{id}",
    headers = "X-API-Version=2",
    produces = "application/vnd.truist.account.v2+json")
public ResponseEntity<AccountResponseV2> getAccountV2(
        @PathVariable String id) {
    return ResponseEntity.ok(accountService.getV2(id));
}`,
        metaTags: ['versioning', 'REST', 'backward-compatible'],
      },
      {
        title: 'Pagination — Cursor-Based for Transactions',
        lang: 'java',
        description:
          'Cursor-based pagination for large transaction histories with stable ordering.',
        code: `@GetMapping("/{accountId}/transactions")
public ResponseEntity<PagedResponse<TransactionDto>> getTransactions(
        @PathVariable String accountId,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(required = false) String cursor) {

    List<Transaction> transactions = transactionService
        .findByAccount(accountId, cursor, limit + 1);

    boolean hasMore = transactions.size() > limit;
    if (hasMore) transactions = transactions.subList(0, limit);

    String nextCursor = hasMore
        ? transactions.get(transactions.size() - 1).getId()
        : null;

    return ResponseEntity.ok(new PagedResponse<>(
        transactions.stream().map(TransactionDto::from).toList(),
        nextCursor,
        hasMore
    ));
}`,
        metaTags: ['pagination', 'cursor', 'transactions', 'REST'],
      },
      {
        title: 'Structured Error Responses',
        lang: 'java',
        description:
          'Consistent error response format with error codes, messages, and retry guidance.',
        code: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientFunds(
            InsufficientFundsException ex) {
        ErrorResponse error = new ErrorResponse(
            "INSUFFICIENT_FUNDS",
            ex.getMessage(),
            Map.of("accountId", ex.getAccountId(),
                   "requested", ex.getRequested().toString(),
                   "available", ex.getAvailable().toString()),
            false  // retryable
        );
        return ResponseEntity.status(422).body(error);
    }

    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleServiceUnavailable(
            ServiceUnavailableException ex) {
        ErrorResponse error = new ErrorResponse(
            "SERVICE_UNAVAILABLE",
            "Downstream service temporarily unavailable",
            Map.of("retryAfterSeconds", "30"),
            true   // retryable
        );
        return ResponseEntity.status(503)
            .header("Retry-After", "30")
            .body(error);
    }
}`,
        metaTags: ['error-handling', 'REST', 'retry', 'structured'],
      },
      {
        title: 'Idempotency in Financial Transactions',
        lang: 'java',
        description:
          'Idempotency key pattern to prevent duplicate financial transactions on retry.',
        code: `@PostMapping("/transfers")
public ResponseEntity<TransferResponse> createTransfer(
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @RequestBody TransferRequest request) {

    // Check if this request was already processed
    Optional<TransferResponse> existing =
        idempotencyStore.find(idempotencyKey);
    if (existing.isPresent()) {
        return ResponseEntity.ok(existing.get()); // Return cached result
    }

    // Process the transfer
    TransferResponse response = transferService.execute(request);

    // Store result keyed by idempotency key (TTL: 24 hours)
    idempotencyStore.save(idempotencyKey, response, Duration.ofHours(24));

    return ResponseEntity.status(201).body(response);
}`,
        metaTags: ['idempotency', 'financial', 'duplicate-prevention'],
      },
    ],
  },
];


// ─── Banking Domain Patterns ─────────────────────────────────────────────────

export const truistBankingPatterns: PatternSection[] = [
  {
    label: 'ACID Compliance',
    cards: [
      {
        title: 'ACID Properties in Practice',
        lang: 'java',
        description:
          'Implementing ACID-compliant transactions with Spring @Transactional for banking operations.',
        code: `@Service
public class TransferService {

    @Transactional(isolation = Isolation.SERIALIZABLE,
                   rollbackFor = Exception.class)
    public TransferResult executeTransfer(TransferRequest req) {
        // Atomicity: all-or-nothing
        Account source = accountRepo.findByIdForUpdate(req.getFromAccount());
        Account target = accountRepo.findByIdForUpdate(req.getToAccount());

        // Consistency: validate business rules
        if (source.getBalance().compareTo(req.getAmount()) < 0) {
            throw new InsufficientFundsException(source.getId(),
                req.getAmount(), source.getBalance());
        }

        // Isolation: SERIALIZABLE prevents phantom reads
        source.debit(req.getAmount());
        target.credit(req.getAmount());

        accountRepo.save(source);
        accountRepo.save(target);

        // Durability: committed to DB on method return
        auditService.logTransfer(req, TransferStatus.COMPLETED);
        return new TransferResult(req.getReferenceId(), TransferStatus.COMPLETED);
    }
}`,
        metaTags: ['ACID', 'Transactional', 'atomicity', 'isolation'],
      },
    ],
  },
  {
    label: 'Data Integrity Constraints',
    cards: [
      {
        title: 'Foreign Keys, Unique & Check Constraints',
        lang: 'sql',
        description:
          'Database-level integrity constraints for financial data: FK relationships, uniqueness, and value checks.',
        code: `CREATE TABLE accounts (
    account_id    VARCHAR(20) PRIMARY KEY,
    customer_id   VARCHAR(20) NOT NULL,
    account_type  VARCHAR(20) NOT NULL,
    balance       NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status        VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    opened_date   DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Foreign key: every account belongs to a customer
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),

    -- Unique: one checking account per customer
    CONSTRAINT uq_one_checking_per_customer
        UNIQUE (customer_id, account_type)
        WHERE account_type = 'CHECKING',

    -- Check: balance cannot go negative for savings
    CONSTRAINT chk_savings_balance
        CHECK (account_type != 'SAVINGS' OR balance >= 0),

    -- Check: valid status values
    CONSTRAINT chk_status
        CHECK (status IN ('ACTIVE', 'CLOSED', 'FROZEN', 'PENDING'))
);`,
        metaTags: ['FK', 'unique', 'check', 'constraints', 'integrity'],
      },
    ],
  },
  {
    label: 'Audit Logging',
    cards: [
      {
        title: 'Comprehensive Audit Trail',
        lang: 'java',
        description:
          'AOP-based audit logging capturing who, what, when for every financial operation.',
        code: `@Aspect
@Component
public class AuditAspect {

    private final AuditRepository auditRepo;

    @Around("@annotation(Auditable)")
    public Object auditOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        AuditEntry entry = new AuditEntry();
        entry.setTimestamp(Instant.now());
        entry.setUser(SecurityContextHolder.getContext()
            .getAuthentication().getName());
        entry.setOperation(joinPoint.getSignature().getName());
        entry.setParameters(sanitize(joinPoint.getArgs()));

        try {
            Object result = joinPoint.proceed();
            entry.setStatus("SUCCESS");
            entry.setResult(sanitize(result));
            return result;
        } catch (Exception e) {
            entry.setStatus("FAILURE");
            entry.setErrorMessage(e.getMessage());
            throw e;
        } finally {
            auditRepo.save(entry); // Always persist audit trail
        }
    }

    private String sanitize(Object obj) {
        // Mask sensitive fields (SSN, account numbers)
        return AuditSanitizer.mask(obj);
    }
}`,
        metaTags: ['audit', 'AOP', 'compliance', 'traceability'],
      },
    ],
  },
  {
    label: 'Regulatory Awareness — SOX, PCI-DSS, KYC/AML',
    cards: [
      {
        title: 'SOX Auditability — Change Control',
        lang: 'java',
        description:
          'Implementing SOX-compliant change tracking with immutable audit records and separation of duties.',
        code: `@Entity
@Table(name = "change_requests")
public class ChangeRequest {
    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String requestedBy;    // Developer who made the change

    @Column(nullable = false)
    private String approvedBy;     // Must be different from requestedBy

    @Column(nullable = false)
    private Instant requestedAt;

    private Instant approvedAt;

    @Enumerated(EnumType.STRING)
    private ChangeStatus status;   // PENDING, APPROVED, REJECTED, DEPLOYED

    @Column(columnDefinition = "TEXT")
    private String changeDescription;

    @PrePersist
    public void validateSeparationOfDuties() {
        if (requestedBy.equals(approvedBy)) {
            throw new ComplianceViolationException(
                "SOX: Requester and approver must be different");
        }
    }
}`,
        metaTags: ['SOX', 'audit', 'separation-of-duties', 'compliance'],
      },
      {
        title: 'PCI-DSS — Sensitive Data Handling',
        lang: 'java',
        description:
          'PCI-DSS compliant card data handling: tokenization, encryption at rest, and access logging.',
        code: `@Service
public class CardDataService {

    private final TokenVault tokenVault;
    private final EncryptionService encryption;

    // Never store raw card numbers — tokenize immediately
    public String tokenizeCard(String cardNumber) {
        // Validate format before processing
        if (!LuhnValidator.isValid(cardNumber)) {
            throw new InvalidCardException("Failed Luhn check");
        }
        // Store encrypted in vault, return opaque token
        String encrypted = encryption.encrypt(cardNumber);
        return tokenVault.store(encrypted);
    }

    // Mask for display: show only last 4 digits
    public String maskCardNumber(String token) {
        String decrypted = tokenVault.retrieve(token);
        String raw = encryption.decrypt(decrypted);
        return "****-****-****-" + raw.substring(raw.length() - 4);
    }

    // PCI-DSS: Log all access to cardholder data
    @Auditable(level = "PCI")
    public CardDetails retrieveForProcessing(String token, String reason) {
        // Requires explicit business reason for access
        return new CardDetails(tokenVault.retrieve(token));
    }
}`,
        metaTags: ['PCI-DSS', 'tokenization', 'encryption', 'masking'],
      },
      {
        title: 'KYC/AML — Customer Verification',
        lang: 'java',
        description:
          'Know Your Customer and Anti-Money Laundering checks during account onboarding.',
        code: `@Service
public class KycAmlService {

    public VerificationResult verifyCustomer(CustomerApplication app) {
        List<ComplianceCheck> checks = new ArrayList<>();

        // KYC: Identity verification
        checks.add(verifyIdentity(app.getSsn(), app.getDateOfBirth()));

        // KYC: Address verification
        checks.add(verifyAddress(app.getAddress()));

        // AML: Screen against sanctions lists (OFAC, EU, UN)
        checks.add(screenSanctionsList(app.getFullName(), app.getCountry()));

        // AML: Politically Exposed Person (PEP) check
        checks.add(checkPepStatus(app.getFullName()));

        boolean allPassed = checks.stream()
            .allMatch(c -> c.getStatus() == CheckStatus.PASSED);

        return new VerificationResult(
            allPassed ? VerificationStatus.APPROVED : VerificationStatus.REVIEW,
            checks
        );
    }
}`,
        metaTags: ['KYC', 'AML', 'sanctions', 'compliance'],
      },
    ],
  },
  {
    label: 'Secure Coding Patterns',
    cards: [
      {
        title: 'Parameterized Queries — SQL Injection Prevention',
        lang: 'java',
        description:
          'Always use parameterized queries to prevent SQL injection in financial applications.',
        code: `// WRONG — vulnerable to SQL injection
String query = "SELECT * FROM accounts WHERE id = '" + userInput + "'";

// CORRECT — parameterized query with PreparedStatement
public Optional<Account> findById(String accountId) {
    String sql = "SELECT account_id, balance, status FROM accounts WHERE account_id = ?";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setString(1, accountId);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            return Optional.of(mapRow(rs));
        }
        return Optional.empty();
    }
}

// CORRECT — Spring JPA (parameterized by default)
@Query("SELECT a FROM Account a WHERE a.customerId = :customerId AND a.status = :status")
List<Account> findByCustomerAndStatus(
    @Param("customerId") String customerId,
    @Param("status") AccountStatus status);`,
        metaTags: ['SQL-injection', 'parameterized', 'PreparedStatement'],
      },
      {
        title: 'Input Validation & Data Masking',
        lang: 'java',
        description:
          'Validate all inputs at API boundary and mask sensitive data in logs and responses.',
        code: `// Input validation at controller level
@PostMapping("/accounts")
public ResponseEntity<?> createAccount(
        @Valid @RequestBody AccountRequest request) {
    // @Valid triggers javax.validation annotations
    return ResponseEntity.ok(accountService.create(request));
}

public class AccountRequest {
    @NotBlank @Size(max = 100)
    private String customerName;

    @Pattern(regexp = "\\\\d{9}", message = "SSN must be 9 digits")
    private String ssn;

    @DecimalMin("0.00") @DecimalMax("999999999.99")
    private BigDecimal initialDeposit;
}

// Data masking utility for logs
public class DataMasker {
    public static String maskSsn(String ssn) {
        return "***-**-" + ssn.substring(ssn.length() - 4);
    }

    public static String maskAccount(String acctNum) {
        return "****" + acctNum.substring(acctNum.length() - 4);
    }

    public static String maskEmail(String email) {
        int atIdx = email.indexOf('@');
        return email.charAt(0) + "***" + email.substring(atIdx);
    }
}`,
        metaTags: ['validation', 'masking', 'input-sanitization', 'security'],
      },
    ],
  },
];


// ─── Likely Questions ────────────────────────────────────────────────────────

export const truistQuestions: QuestionItem[] = [
  {
    name: 'Explain OOP Pillars with Banking Examples',
    diff: 'easy',
    hint: 'Encapsulation, Inheritance, Polymorphism, Abstraction',
    lang: 'java',
    code: `/*
 * 4 Pillars of OOP — Banking Context
 *
 * 1. ENCAPSULATION: Private balance field with controlled access
 *    - Account.balance is private; only deposit()/withdraw() modify it
 *
 * 2. INHERITANCE: SavingsAccount extends Account
 *    - Reuses common fields (id, balance) and adds interest logic
 *
 * 3. POLYMORPHISM: Different account types calculate interest differently
 *    - account.calculateInterest() dispatches to correct implementation
 *
 * 4. ABSTRACTION: Account is abstract — cannot instantiate directly
 *    - Defines contract (calculateInterest) without implementation
 */

public abstract class Account {
    private BigDecimal balance;

    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        this.balance = this.balance.add(amount);
    }

    public abstract BigDecimal calculateInterest();
}

public class CheckingAccount extends Account {
    @Override
    public BigDecimal calculateInterest() {
        return BigDecimal.ZERO; // No interest on checking
    }
}

public class SavingsAccount extends Account {
    private static final BigDecimal RATE = new BigDecimal("0.02");

    @Override
    public BigDecimal calculateInterest() {
        return getBalance().multiply(RATE);
    }
}`,
  },
  {
    name: 'Exception Handling: Checked vs Unchecked',
    diff: 'easy',
    hint: 'When to use each type in financial applications',
    lang: 'java',
    code: `/*
 * Checked Exceptions: Recoverable conditions the caller MUST handle
 * - InsufficientFundsException, AccountNotFoundException
 * - Forces caller to have a recovery strategy
 *
 * Unchecked (Runtime) Exceptions: Programming errors
 * - NullPointerException, IllegalArgumentException
 * - Indicate bugs, not business conditions
 */

// Checked — caller must handle or declare
public class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String msg) { super(msg); }
}

// Usage: forces handling at compile time
public void processWithdrawal(String acctId, BigDecimal amount) {
    try {
        accountService.withdraw(acctId, amount);
    } catch (InsufficientFundsException e) {
        // Business recovery: notify customer, suggest lower amount
        notificationService.sendInsufficientFundsAlert(acctId);
    } catch (AccountNotFoundException e) {
        // Different recovery path
        log.error("Account not found: {}", acctId);
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}

// Best practices in banking:
// 1. Use checked for business conditions (insufficient funds, account locked)
// 2. Use unchecked for programming errors (null args, invalid state)
// 3. Never catch Exception/Throwable broadly in financial code
// 4. Always log exception context for audit trail`,
  },
  {
    name: 'Generics: Bounded Type Parameters',
    diff: 'medium',
    hint: 'Upper/lower bounds for type-safe financial calculations',
    lang: 'java',
    code: `// Upper bound: T must extend Comparable (for sorting financial instruments)
public static <T extends Comparable<T>> T findMax(List<T> items) {
    return items.stream()
        .max(Comparator.naturalOrder())
        .orElseThrow(() -> new NoSuchElementException("Empty list"));
}

// Wildcard with upper bound: read-only access to any Number subtype
public static BigDecimal sumBalances(List<? extends Number> balances) {
    return balances.stream()
        .map(n -> new BigDecimal(n.toString()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);
}

// Wildcard with lower bound: write access (producer extends, consumer super)
public static void addAccounts(List<? super SavingsAccount> list) {
    list.add(new SavingsAccount("SA001", BigDecimal.valueOf(1000)));
}

// Generic method with multiple bounds
public <T extends Account & Auditable> void processAuditableAccount(T account) {
    account.calculateInterest();  // Account method
    account.getAuditTrail();      // Auditable method
}`,
  },
  {
    name: 'SQL: Complex JOIN with Aggregation',
    diff: 'medium',
    hint: 'Multi-table join with GROUP BY and HAVING for financial reporting',
    lang: 'sql',
    code: `-- Find customers with total deposits > $100K across all accounts
-- who have made at least 5 transactions in the last 90 days
SELECT
    c.customer_id,
    c.full_name,
    COUNT(DISTINCT a.account_id) AS account_count,
    SUM(a.balance) AS total_balance,
    COUNT(t.transaction_id) AS recent_txn_count
FROM customers c
INNER JOIN accounts a ON c.customer_id = a.customer_id
LEFT JOIN transactions t ON a.account_id = t.account_id
    AND t.txn_date >= CURRENT_DATE - INTERVAL '90 days'
WHERE a.status = 'ACTIVE'
GROUP BY c.customer_id, c.full_name
HAVING SUM(a.balance) > 100000
   AND COUNT(t.transaction_id) >= 5
ORDER BY total_balance DESC;`,
  },
  {
    name: 'SQL: Window Functions & Transaction Isolation',
    diff: 'hard',
    hint: 'Combine window functions with proper isolation for reporting',
    lang: 'sql',
    code: `-- Monthly transaction summary with running totals and percentile ranking
-- Use REPEATABLE READ to ensure consistent snapshot for the report
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;

WITH monthly_summary AS (
    SELECT
        account_id,
        DATE_TRUNC('month', txn_date) AS month,
        SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END) AS credits,
        SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END) AS debits,
        COUNT(*) AS txn_count
    FROM transactions
    WHERE txn_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY account_id, DATE_TRUNC('month', txn_date)
)
SELECT
    account_id,
    month,
    credits,
    debits,
    credits - debits AS net_flow,
    SUM(credits - debits) OVER (
        PARTITION BY account_id ORDER BY month
        ROWS UNBOUNDED PRECEDING
    ) AS cumulative_net,
    PERCENT_RANK() OVER (
        PARTITION BY month ORDER BY credits - debits
    ) AS percentile_rank
FROM monthly_summary
ORDER BY account_id, month;

COMMIT;`,
  },
  {
    name: 'Design a RESTful Account Management API',
    diff: 'medium',
    hint: 'Resource naming, HTTP methods, status codes, versioning',
    lang: 'java',
    code: `/*
 * RESTful API Design Principles for Banking:
 *
 * Resources: /api/v1/accounts, /api/v1/accounts/{id}/transactions
 * HTTP Methods: GET (read), POST (create), PUT (full update), PATCH (partial)
 * Status Codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request,
 *               401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict,
 *               422 Unprocessable Entity, 429 Too Many Requests
 */

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    @GetMapping
    public ResponseEntity<PagedResponse<AccountDto>> listAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(accountService.findAll(page, size));
    }

    @PostMapping
    public ResponseEntity<AccountDto> createAccount(
            @Valid @RequestBody CreateAccountRequest request) {
        AccountDto created = accountService.create(request);
        URI location = URI.create("/api/v1/accounts/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AccountDto> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(accountService.updateStatus(id, request));
    }

    // Idempotent transfer with Idempotency-Key header
    @PostMapping("/{id}/transfers")
    public ResponseEntity<TransferResponse> transfer(
            @PathVariable String id,
            @RequestHeader("Idempotency-Key") String key,
            @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.status(201)
            .body(transferService.execute(id, key, request));
    }
}`,
  },
  {
    name: 'Agile/SDLC in Regulated Banking Environment',
    diff: 'easy',
    hint: 'Sprint ceremonies, user stories, CI/CD with compliance gates',
    lang: 'java',
    code: `/*
 * Agile in Banking — Key Talking Points:
 *
 * SPRINT CEREMONIES:
 * - Sprint Planning: Size stories with compliance overhead factored in
 * - Daily Standup: Flag regulatory blockers early
 * - Sprint Review: Demo to business + compliance stakeholders
 * - Retrospective: Include security/compliance improvements
 *
 * USER STORIES (banking format):
 * "As a compliance officer, I want all fund transfers logged with
 *  timestamps and user IDs, so that we meet SOX audit requirements."
 *
 * Acceptance Criteria (Given/When/Then):
 * Given a transfer of any amount
 * When the transfer completes or fails
 * Then an immutable audit record is created within 100ms
 * And the record includes: user, timestamp, amount, accounts, status
 *
 * CI/CD IN REGULATED ENVIRONMENTS:
 * 1. Feature branch → PR with mandatory code review (4-eyes principle)
 * 2. Automated gates: unit tests, SAST scan, dependency vulnerability check
 * 3. Integration environment with synthetic data (never production data)
 * 4. Change Advisory Board (CAB) approval for production deploys
 * 5. Blue-green deployment with instant rollback capability
 * 6. Post-deploy: smoke tests + monitoring alerts
 *
 * Definition of Done (banking):
 * - Code reviewed by 2+ engineers
 * - Unit + integration tests passing
 * - Security scan clean (no Critical/High findings)
 * - Audit logging verified
 * - Documentation updated
 * - Change ticket approved
 */`,
  },
  {
    name: 'Implement Thread-Safe Transfer with Deadlock Prevention',
    diff: 'hard',
    hint: 'Lock ordering, timeout, and rollback for concurrent transfers',
    lang: 'java',
    code: `public class ConcurrentTransferService {
    private final Map<String, ReentrantLock> accountLocks =
        new ConcurrentHashMap<>();

    public TransferResult transfer(String fromId, String toId, BigDecimal amount)
            throws TransferException {

        // Consistent lock ordering by account ID to prevent deadlock
        String firstId = fromId.compareTo(toId) < 0 ? fromId : toId;
        String secondId = fromId.compareTo(toId) < 0 ? toId : fromId;

        ReentrantLock firstLock = accountLocks.computeIfAbsent(
            firstId, k -> new ReentrantLock());
        ReentrantLock secondLock = accountLocks.computeIfAbsent(
            secondId, k -> new ReentrantLock());

        boolean acquired = false;
        try {
            // Try with timeout to avoid indefinite blocking
            acquired = firstLock.tryLock(5, TimeUnit.SECONDS);
            if (!acquired) throw new TransferException("Timeout acquiring lock");

            acquired = secondLock.tryLock(5, TimeUnit.SECONDS);
            if (!acquired) throw new TransferException("Timeout acquiring lock");

            // Critical section: perform transfer
            Account source = accountRepo.findById(fromId);
            Account target = accountRepo.findById(toId);

            if (source.getBalance().compareTo(amount) < 0) {
                throw new InsufficientFundsException(fromId, amount,
                    source.getBalance());
            }

            source.debit(amount);
            target.credit(amount);
            accountRepo.save(source);
            accountRepo.save(target);

            return TransferResult.success(fromId, toId, amount);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new TransferException("Transfer interrupted");
        } finally {
            if (secondLock.isHeldByCurrentThread()) secondLock.unlock();
            if (firstLock.isHeldByCurrentThread()) firstLock.unlock();
        }
    }
}`,
  },
];


// ─── Game Plan ───────────────────────────────────────────────────────────────

export const truistGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Q1', type: 'Java Core', minutes: 12, highlight: true },
    { label: 'Q2', type: 'Java Concurrency', minutes: 10 },
    { label: 'Q3', type: 'SQL Queries', minutes: 12, highlight: true },
    { label: 'Q4', type: 'SQL Transactions', minutes: 8 },
    { label: 'Q5', type: 'Banking Domain', minutes: 10 },
    { label: 'Q6', type: 'REST API Design', minutes: 8 },
  ],
  strategies: [
    {
      title: 'Banking Domain Terminology',
      steps: [
        'Reference ACID properties when discussing any data modification',
        'Mention audit trails and SOX compliance when explaining logging decisions',
        'Use terms like "idempotency" and "eventual consistency" for distributed operations',
        'Cite PCI-DSS when discussing sensitive data handling (card numbers, SSNs)',
        'Reference KYC/AML when discussing customer onboarding or transaction monitoring',
        'Frame concurrency answers around "financial integrity" and "data consistency"',
      ],
      highlightText: 'Weave domain terms naturally — don\'t force them',
    },
    {
      title: 'Agile Methodology Talking Points',
      steps: [
        'Sprint ceremonies: planning (with compliance sizing), standup, review with stakeholders, retro',
        'User stories: "As a [compliance officer/customer/auditor], I want... so that..."',
        'CI/CD in regulated environments: 4-eyes review, SAST gates, CAB approval, blue-green deploys',
        'Definition of Done includes security scan, audit logging verification, and change ticket',
        'Emphasize traceability: every code change linked to a user story linked to a business requirement',
      ],
      highlightText: 'Show you understand compliance adds process overhead — and why it matters',
    },
    {
      title: 'Recommended Question Order',
      steps: [
        'Start with Java fundamentals — build confidence with OOP, Collections, exception handling',
        'Move to multithreading/concurrency — demonstrate depth with synchronized, ExecutorService',
        'Transition to SQL — show proficiency with joins, window functions, isolation levels',
        'Connect to banking domain — tie technical answers to financial use cases',
        'Close with architecture/design — REST API patterns, idempotency, error handling',
        'Throughout: reference real banking scenarios (transfers, reconciliation, audit)',
      ],
      highlightText: 'Java → SQL → Domain: build from technical foundation to business context',
    },
  ],
  keywords: [
    'ACID',
    'SOX',
    'PCI-DSS',
    'KYC/AML',
    'idempotency',
    'transaction isolation',
    'audit logging',
    'parameterized queries',
    'CompletableFuture',
    'ExecutorService',
    'window functions',
    'stored procedures',
    'data masking',
    'reconciliation',
    'separation of duties',
    'blue-green deployment',
  ],
};
