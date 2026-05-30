import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

/**
 * Bank of America HireVue OA cheatsheet data.
 * Format: 90 min — Self-Intro + 2 Coding (Easy + Medium) + Explanation Video + Fitment
 */

export const bofaConfig: CompanyConfig = {
  slug: 'bofa',
  title: 'Bank of America HireVue OA — Cheat Sheet',
  subtitle:
    'HireVue OA — 90 min · Self-Intro + 2 Coding (Easy + Medium) + Explanation Video + Fitment',
  accentColor: '#012169',
  accentSecondary: '#E31837',
  timerMinutes: 90,
  tabs: [
    { id: 'sql', label: 'SQL Patterns' },
    { id: 'java', label: 'Java/Core Patterns' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
  ],
};

// ---------------------------------------------------------------------------
// SQL Patterns
// ---------------------------------------------------------------------------

export const bofaSqlPatterns: PatternSection[] = [
  {
    label: 'Window Functions',
    cards: [
      {
        title: 'Second Highest Salary (DENSE_RANK)',
        lang: 'sql',
        description:
          'Use DENSE_RANK to find the Nth highest salary without gaps in ranking.',
        code: `SELECT salary
FROM (
  SELECT salary,
         DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 2;`,
        metaTags: ['DENSE_RANK', 'window function', 'Nth highest', 'subquery'],
      },
      {
        title: 'ROW_NUMBER for Top-N per Group',
        lang: 'sql',
        description:
          'Partition by department and rank employees within each group.',
        code: `SELECT department_id, employee_name, salary
FROM (
  SELECT department_id, employee_name, salary,
         ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
         ) AS rn
  FROM employees
) ranked
WHERE rn <= 3;`,
        metaTags: ['ROW_NUMBER', 'PARTITION BY', 'top-N', 'ranking'],
      },
    ],
  },
  {
    label: 'Aggregation',
    cards: [
      {
        title: 'COUNT with GROUP BY',
        lang: 'sql',
        description:
          'Count employees per department, filtering groups with HAVING.',
        code: `SELECT department_id,
       COUNT(*) AS emp_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5
ORDER BY emp_count DESC;`,
        metaTags: ['COUNT', 'GROUP BY', 'HAVING', 'aggregation'],
      },
    ],
  },
  {
    label: 'Common Table Expressions (CTEs)',
    cards: [
      {
        title: 'CTE for Readable Subqueries',
        lang: 'sql',
        description:
          'Break complex queries into named steps using WITH clause.',
        code: `WITH dept_avg AS (
  SELECT department_id,
         AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
)
SELECT e.employee_name, e.salary, d.avg_salary
FROM employees e
JOIN dept_avg d ON e.department_id = d.department_id
WHERE e.salary > d.avg_salary;`,
        metaTags: ['CTE', 'WITH', 'readability', 'subquery'],
      },
    ],
  },
  {
    label: 'LEFT JOIN IS NULL',
    cards: [
      {
        title: 'Employees with No Manager',
        lang: 'sql',
        description:
          'Find rows with no matching record using LEFT JOIN + IS NULL pattern.',
        code: `SELECT e.employee_id, e.employee_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
WHERE m.employee_id IS NULL;`,
        metaTags: ['LEFT JOIN', 'IS NULL', 'anti-join', 'self-join'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Java / Core Patterns
// ---------------------------------------------------------------------------

export const bofaJavaPatterns: PatternSection[] = [
  {
    label: 'Arrays',
    cards: [
      {
        title: 'Two Sum (HashMap)',
        lang: 'java',
        description:
          'Find two indices whose values sum to target using a hash map for O(n) lookup.',
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No solution");
}`,
        metaTags: ['HashMap', 'two sum', 'O(n)', 'complement'],
      },
      {
        title: 'Second Largest Element',
        lang: 'java',
        description:
          'Single-pass algorithm tracking the two largest values. Returns -1 if no distinct second largest exists.',
        code: `public int secondLargest(int[] arr) {
    if (arr.length < 2) return -1;
    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;
    for (int num : arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num != first) {
            second = num;
        }
    }
    return second == Integer.MIN_VALUE ? -1 : second;
}`,
        metaTags: ['arrays', 'single-pass', 'tracking', 'O(n)'],
      },
    ],
  },
  {
    label: 'Linked Lists',
    cards: [
      {
        title: 'Reverse a Linked List',
        lang: 'java',
        description:
          'Iteratively reverse a singly linked list using three pointers.',
        code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
        metaTags: ['linked list', 'reversal', 'iterative', 'pointers'],
      },
      {
        title: 'Merge Two Sorted Lists',
        lang: 'java',
        description:
          'Merge two sorted linked lists into one sorted list using a dummy head.',
        code: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`,
        metaTags: ['linked list', 'merge', 'sorted', 'dummy node'],
      },
    ],
  },
  {
    label: 'String Manipulation',
    cards: [
      {
        title: 'String Reversal',
        lang: 'java',
        description:
          'Reverse a string in-place using two-pointer swap technique.',
        code: `public String reverseString(String s) {
    char[] chars = s.toCharArray();
    int left = 0, right = chars.length - 1;
    while (left < right) {
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
    return new String(chars);
}`,
        metaTags: ['string', 'reversal', 'two-pointer', 'in-place'],
      },
      {
        title: 'Palindrome Check',
        lang: 'java',
        description:
          'Check if a string reads the same forwards and backwards.',
        code: `public boolean isPalindrome(String s) {
    String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    int left = 0, right = cleaned.length() - 1;
    while (left < right) {
        if (cleaned.charAt(left) != cleaned.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
        metaTags: ['palindrome', 'two-pointer', 'string', 'validation'],
      },
    ],
  },
  {
    label: 'Sliding Window',
    cards: [
      {
        title: 'Longest Substring Without Repeating Characters',
        lang: 'java',
        description:
          'Sliding window with a HashSet to track unique characters in current window.',
        code: `public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right))) {
            set.remove(s.charAt(left));
            left++;
        }
        set.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        metaTags: ['sliding window', 'HashSet', 'substring', 'O(n)'],
      },
    ],
  },
  {
    label: 'Core Java Concepts',
    cards: [
      {
        title: 'OOP Principles',
        lang: 'java',
        description:
          'Four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction.',
        code: `// Encapsulation — private fields + public getters/setters
public class Account {
    private double balance;
    public double getBalance() { return balance; }
}

// Inheritance — extends keyword
public class SavingsAccount extends Account {
    private double interestRate;
}

// Polymorphism — method overriding
@Override
public double calculateInterest() {
    return getBalance() * interestRate;
}

// Abstraction — abstract class or interface
public abstract class Shape {
    abstract double area();
}`,
        metaTags: ['OOP', 'encapsulation', 'inheritance', 'polymorphism'],
      },
      {
        title: 'Collections Framework',
        lang: 'java',
        description:
          'Key interfaces: List, Set, Map. Common implementations and when to use each.',
        code: `// List — ordered, allows duplicates
List<String> list = new ArrayList<>();  // O(1) random access
List<String> linked = new LinkedList<>(); // O(1) insert/delete

// Set — no duplicates
Set<String> hashSet = new HashSet<>();   // O(1) lookup
Set<String> treeSet = new TreeSet<>();   // sorted, O(log n)

// Map — key-value pairs
Map<String, Integer> map = new HashMap<>(); // O(1) get/put
Map<String, Integer> sorted = new TreeMap<>(); // sorted keys

// Iteration
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}`,
        metaTags: ['Collections', 'List', 'Set', 'Map', 'HashMap'],
      },
      {
        title: 'Multithreading Basics',
        lang: 'java',
        description:
          'Thread creation, synchronization, and ExecutorService for thread pools.',
        code: `// Creating threads
Thread t = new Thread(() -> System.out.println("Running"));
t.start();

// Synchronized method
public synchronized void increment() {
    count++;
}

// ExecutorService thread pool
ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> processTask());
executor.shutdown();

// Wait for completion
executor.awaitTermination(60, TimeUnit.SECONDS);`,
        metaTags: ['threads', 'synchronized', 'ExecutorService', 'concurrency'],
      },
      {
        title: 'Exception Handling',
        lang: 'java',
        description:
          'Checked vs unchecked exceptions, try-catch-finally, custom exceptions.',
        code: `// Checked — must handle or declare (IOException, SQLException)
// Unchecked — RuntimeException subclasses (NullPointer, ArrayIndex)

try {
    int result = divide(a, b);
} catch (ArithmeticException e) {
    System.err.println("Division by zero: " + e.getMessage());
} finally {
    // Always executes — cleanup resources
}

// Custom exception
public class InsufficientFundsException extends Exception {
    private final double amount;
    public InsufficientFundsException(double amount) {
        super("Insufficient funds: " + amount);
        this.amount = amount;
    }
}`,
        metaTags: ['exceptions', 'try-catch', 'checked', 'unchecked'],
      },
      {
        title: 'String vs StringBuilder vs StringBuffer',
        lang: 'java',
        description:
          'String is immutable; StringBuilder is mutable and fast; StringBuffer is thread-safe.',
        code: `// String — immutable, creates new object on modification
String s = "hello";
s = s + " world"; // new String object created

// StringBuilder — mutable, NOT thread-safe, faster
StringBuilder sb = new StringBuilder("hello");
sb.append(" world"); // modifies in place
String result = sb.toString();

// StringBuffer — mutable, thread-safe (synchronized), slower
StringBuffer buf = new StringBuffer("hello");
buf.append(" world"); // thread-safe append

// Use StringBuilder for single-threaded string building
// Use StringBuffer only when shared across threads`,
        metaTags: ['String', 'StringBuilder', 'StringBuffer', 'immutable'],
      },
      {
        title: 'JVM / JDK / JRE',
        lang: 'java',
        description:
          'JVM executes bytecode; JRE = JVM + libraries; JDK = JRE + dev tools.',
        code: `/*
 * JVM (Java Virtual Machine)
 *   - Executes .class bytecode
 *   - Platform-specific (Windows/Mac/Linux JVM)
 *   - Handles memory management (GC), class loading
 *
 * JRE (Java Runtime Environment)
 *   - JVM + standard class libraries (java.lang, java.util, etc.)
 *   - Enough to RUN Java programs
 *
 * JDK (Java Development Kit)
 *   - JRE + development tools (javac, jar, javadoc, jdb)
 *   - Needed to COMPILE and develop Java programs
 *
 * Hierarchy: JDK ⊃ JRE ⊃ JVM
 */`,
        metaTags: ['JVM', 'JDK', 'JRE', 'bytecode', 'runtime'],
      },
    ],
  },
];


// ---------------------------------------------------------------------------
// Likely Questions
// ---------------------------------------------------------------------------

export const bofaQuestions: QuestionItem[] = [
  {
    name: 'Second Largest Element in Array',
    diff: 'easy',
    hint: 'Track first and second largest in a single pass',
    lang: 'java',
    code: `public int secondLargest(int[] arr) {
    if (arr.length < 2) return -1;
    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;
    for (int num : arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num != first) {
            second = num;
        }
    }
    return second == Integer.MIN_VALUE ? -1 : second;
}`,
  },
  {
    name: 'String Reversal',
    diff: 'easy',
    hint: 'Two-pointer swap from both ends toward the center',
    lang: 'java',
    code: `public String reverseString(String s) {
    char[] chars = s.toCharArray();
    int left = 0, right = chars.length - 1;
    while (left < right) {
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
    return new String(chars);
}`,
  },
  {
    name: 'Palindrome Check',
    diff: 'easy',
    hint: 'Clean non-alphanumeric chars, then compare from both ends',
    lang: 'java',
    code: `public boolean isPalindrome(String s) {
    String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    int left = 0, right = cleaned.length() - 1;
    while (left < right) {
        if (cleaned.charAt(left) != cleaned.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
  },
  {
    name: 'Fibonacci (Iterative + Recursive)',
    diff: 'easy',
    hint: 'Iterative is O(n); recursive is O(2^n) without memoization',
    lang: 'java',
    code: `// Iterative — O(n) time, O(1) space
public int fibIterative(int n) {
    if (n <= 1) return n;
    int prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

// Recursive — O(2^n) time (exponential without memo)
public int fibRecursive(int n) {
    if (n <= 1) return n;
    return fibRecursive(n - 1) + fibRecursive(n - 2);
}`,
  },
  {
    name: 'Longest Substring Without Repeating Characters',
    diff: 'medium',
    hint: 'Sliding window with HashSet to track current window chars',
    lang: 'java',
    code: `public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right))) {
            set.remove(s.charAt(left));
            left++;
        }
        set.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },
  {
    name: 'Reverse a Linked List',
    diff: 'easy',
    hint: 'Use three pointers: prev, curr, next — iterate and flip links',
    lang: 'java',
    code: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
  },
  {
    name: 'Pattern Printing (Right Triangle)',
    diff: 'easy',
    hint: 'Nested loops: outer for rows, inner for columns up to row number',
    lang: 'java',
    code: `public void printPattern(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            System.out.print("* ");
        }
        System.out.println();
    }
}
// Output for n=4:
// *
// * *
// * * *
// * * * *`,
  },
  {
    name: 'SQL: Second Highest Salary',
    diff: 'medium',
    hint: 'DENSE_RANK window function avoids gaps in ranking',
    lang: 'sql',
    code: `SELECT salary
FROM (
  SELECT salary,
         DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 2;

-- Alternative without window function:
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`,
  },
  {
    name: 'SQL: Employees with No Manager',
    diff: 'easy',
    hint: 'LEFT JOIN employees to itself on manager_id, filter WHERE NULL',
    lang: 'sql',
    code: `-- Using LEFT JOIN IS NULL (anti-join pattern)
SELECT e.employee_id, e.employee_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
WHERE m.employee_id IS NULL;

-- Alternative using NOT EXISTS:
SELECT employee_id, employee_name
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM employees m
  WHERE m.employee_id = e.manager_id
);`,
  },
  {
    name: 'Two Sum',
    diff: 'easy',
    hint: 'HashMap stores complement → index for O(n) single-pass lookup',
    lang: 'java',
    code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No two sum solution");
}`,
  },
];

// ---------------------------------------------------------------------------
// Game Plan
// ---------------------------------------------------------------------------

export const bofaGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Self-Intro', type: 'Video', minutes: 10, highlight: false },
    { label: 'Q1', type: 'Coding (Easy)', minutes: 25, highlight: true },
    { label: 'Q2', type: 'Coding (Medium)', minutes: 30, highlight: true },
    { label: 'Explain', type: 'Video Explanation', minutes: 15, highlight: false },
    { label: 'Fitment', type: 'Behavioral', minutes: 10, highlight: false },
  ],
  strategies: [
    {
      title: 'Coding Question Approach',
      steps: [
        'Read the problem fully — identify input/output types and constraints',
        'State your approach out loud before coding (brute force → optimized)',
        'Write clean code with meaningful variable names',
        'Trace through a small example to verify correctness',
        'Analyze time and space complexity',
        'Handle edge cases: empty input, single element, duplicates',
      ],
    },
    {
      title: 'Video Explanation Strategy',
      steps: [
        'Start with a brief problem restatement in your own words',
        'Explain your thought process: why you chose this approach',
        'Walk through the code line by line at a steady pace',
        'Mention trade-offs: time vs space, alternative approaches',
        'Conclude with complexity analysis and potential improvements',
      ],
      highlightText:
        'Speak clearly and at a measured pace — pretend you are teaching a peer.',
    },
    {
      title: 'Self-Intro Video Tips',
      steps: [
        'Keep it under 2 minutes — concise and structured',
        'Cover: name, background, relevant experience, why BofA',
        'Mention a specific project that shows problem-solving skills',
        'End with enthusiasm about the role and team',
      ],
    },
    {
      title: 'Fitment Question Approach',
      steps: [
        'Use STAR format: Situation, Task, Action, Result',
        'Prepare stories for teamwork, conflict resolution, and leadership',
        'Tie answers back to BofA values: responsible growth, client focus',
      ],
    },
  ],
  keywords: [
    'DENSE_RANK',
    'HashMap',
    'Sliding Window',
    'Linked List',
    'String Manipulation',
    'OOP',
    'Collections',
    'Multithreading',
    'SQL Joins',
    'CTEs',
    'Window Functions',
    'Two Sum',
    'Palindrome',
    'Fibonacci',
    'Exception Handling',
    'StringBuilder',
  ],
};
