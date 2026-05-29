// Wells Fargo HackerRank Cheat Sheet — App Logic

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ===== SQL Patterns =====
const sqlPatternsHTML = `
<div class="section-label">Window Functions</div>
<div class="pattern-grid">
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Second Highest Salary</div>
<div class="card-desc">Two approaches: subquery or window function. DENSE_RANK handles ties.</div>
<pre><code class="language-sql">-- Approach 1: Subquery
SELECT MAX(salary)
FROM employees
WHERE salary &lt; (
  SELECT MAX(salary) FROM employees
);

-- Approach 2: Window function (preferred)
SELECT salary FROM (
  SELECT salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) rnk
  FROM employees
) t WHERE rnk = 2;</code></pre>
<div class="meta"><span class="meta-item">DENSE_RANK</span><span class="meta-item">subquery</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Top Earner Per Department</div>
<div class="card-desc">PARTITION BY splits the ranking per group. Use CTE for readability.</div>
<pre><code class="language-sql">WITH ranked AS (
  SELECT *,
    DENSE_RANK() OVER (
      PARTITION BY department_id
      ORDER BY salary DESC
    ) rnk
  FROM employees
)
SELECT * FROM ranked WHERE rnk = 1;</code></pre>
<div class="meta"><span class="meta-item">PARTITION BY</span><span class="meta-item">CTE</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> LEAD / LAG</div>
<div class="card-desc">Access previous or next row values without self-join. Great for deltas.</div>
<pre><code class="language-sql">SELECT
  employee_id, salary,
  LAG(salary) OVER (ORDER BY hire_date) AS prev_salary,
  LEAD(salary) OVER (ORDER BY hire_date) AS next_salary,
  salary - LAG(salary) OVER (ORDER BY hire_date) AS delta
FROM employees;</code></pre>
<div class="meta"><span class="meta-item">very common</span><span class="meta-item">no self-join needed</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Running Total</div>
<div class="card-desc">Cumulative sum using SUM with ORDER BY in the window frame.</div>
<pre><code class="language-sql">SELECT
  transaction_date, amount,
  SUM(amount) OVER (
    ORDER BY transaction_date
  ) AS running_total,
  SUM(amount) OVER (
    PARTITION BY account_id
    ORDER BY transaction_date
  ) AS account_running_total
FROM transactions;</code></pre>
<div class="meta"><span class="meta-item">cumulative</span><span class="meta-item">per-group variant</span></div>
</div>
</div>
<div class="section-label">Aggregation &amp; Filtering</div>
<div class="pattern-grid">
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Customers With No Orders</div>
<div class="card-desc">LEFT JOIN + IS NULL is the classic anti-join. Also works with NOT EXISTS.</div>
<pre><code class="language-sql">-- LEFT JOIN approach
SELECT c.*
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- NOT EXISTS approach
SELECT * FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.id
);</code></pre>
<div class="meta"><span class="meta-item">anti-join</span><span class="meta-item">NOT EXISTS</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Monthly Aggregation</div>
<div class="card-desc">DATE_TRUNC groups dates into periods. GROUP BY 1 references first SELECT column.</div>
<pre><code class="language-sql">SELECT
  DATE_TRUNC('month', order_date) AS month,
  COUNT(*) AS order_count,
  SUM(amount) AS total_sales,
  AVG(amount) AS avg_order_value
FROM orders
GROUP BY 1
ORDER BY 1;</code></pre>
<div class="meta"><span class="meta-item">DATE_TRUNC</span><span class="meta-item">GROUP BY ordinal</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Find Duplicates</div>
<div class="card-desc">HAVING filters after aggregation — find groups matching a condition.</div>
<pre><code class="language-sql">SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) &gt; 1
ORDER BY cnt DESC;</code></pre>
<div class="meta"><span class="meta-item">GROUP BY + HAVING</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-sql">SQL</span> Multi-CTE Structure</div>
<div class="card-desc">Chain CTEs for complex queries. Each CTE can reference previous ones.</div>
<pre><code class="language-sql">WITH monthly_sales AS (
  SELECT DATE_TRUNC('month', date) AS month,
    SUM(amount) AS total
  FROM orders GROUP BY 1
),
ranked AS (
  SELECT *, RANK() OVER (
    ORDER BY total DESC
  ) rnk FROM monthly_sales
)
SELECT * FROM ranked WHERE rnk &lt;= 3;</code></pre>
<div class="meta"><span class="meta-item">chain CTEs</span><span class="meta-item">readable</span></div>
</div>
</div>
<div class="tip-box">
<strong>Window function syntax:</strong> <code>FUNCTION() OVER (PARTITION BY ... ORDER BY ...)</code><br>
PARTITION BY is optional. ROW_NUMBER = unique; RANK = skips; DENSE_RANK = never skips.
</div>`;

// ===== Java Patterns =====
const javaPatternsHTML = `
<div class="section-label">HashMap Patterns</div>
<div class="pattern-grid">
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Two Sum</div>
<div class="card-desc">Store complement in map. Single pass O(n). Most common WF question.</div>
<pre><code class="language-java">public int[] twoSum(int[] nums, int target) {
    Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();
    for (int i = 0; i &lt; nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need))
            return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}</code></pre>
<div class="meta"><span class="meta-item">O(n) time</span><span class="meta-item">O(n) space</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Frequency Count</div>
<div class="card-desc">HashMap for general use, int[26] for lowercase letters only.</div>
<pre><code class="language-java">// General frequency map
Map&lt;Character, Integer&gt; freq = new HashMap&lt;&gt;();
for (char c : str.toCharArray())
    freq.merge(c, 1, Integer::sum);

// Anagram check with int[26]
int[] count = new int[26];
for (char c : s.toCharArray()) count[c - 'a']++;
for (char c : t.toCharArray()) count[c - 'a']--;
return Arrays.stream(count).allMatch(x -&gt; x == 0);</code></pre>
<div class="meta"><span class="meta-item">merge()</span><span class="meta-item">getOrDefault()</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Group Anagrams</div>
<div class="card-desc">Sort each string as key. computeIfAbsent creates list on first access.</div>
<pre><code class="language-java">public List&lt;List&lt;String&gt;&gt; groupAnagrams(String[] strs) {
    Map&lt;String, List&lt;String&gt;&gt; map = new HashMap&lt;&gt;();
    for (String s : strs) {
        char[] c = s.toCharArray();
        Arrays.sort(c);
        map.computeIfAbsent(new String(c), k -&gt; new ArrayList&lt;&gt;()).add(s);
    }
    return new ArrayList&lt;&gt;(map.values());
}</code></pre>
<div class="meta"><span class="meta-item">computeIfAbsent</span><span class="meta-item">O(n·k log k)</span></div>
</div>
</div>
<div class="section-label">Sliding Window &amp; Search</div>
<div class="pattern-grid">
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Longest Unique Substring</div>
<div class="card-desc">Expand right, shrink left on conflict. Map tracks last index.</div>
<pre><code class="language-java">public int lengthOfLongestSubstring(String s) {
    Map&lt;Character, Integer&gt; last = new HashMap&lt;&gt;();
    int left = 0, max = 0;
    for (int right = 0; right &lt; s.length(); right++) {
        char c = s.charAt(right);
        if (last.containsKey(c))
            left = Math.max(left, last.get(c) + 1);
        last.put(c, right);
        max = Math.max(max, right - left + 1);
    }
    return max;
}</code></pre>
<div class="meta"><span class="meta-item">O(n)</span><span class="meta-item">no inner while loop</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Binary Search</div>
<div class="card-desc">Use left + (right - left) / 2 to avoid overflow.</div>
<pre><code class="language-java">public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left &lt;= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] &lt; target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}</code></pre>
<div class="meta"><span class="meta-item">O(log n)</span><span class="meta-item">overflow-safe</span></div>
</div>
</div>
<div class="section-label">Heap, Graph &amp; Linked List</div>
<div class="pattern-grid">
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Heap — Top K</div>
<div class="card-desc">Min-heap of size K keeps the K largest. peek() = Kth largest.</div>
<pre><code class="language-java">PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;&gt;();
for (int num : nums) {
    pq.offer(num);
    if (pq.size() &gt; k) pq.poll();
}
return pq.peek();</code></pre>
<div class="meta"><span class="meta-item">O(n log k)</span><span class="meta-item">reported WF topic</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> BFS Template</div>
<div class="card-desc">Level-order traversal. Shortest path in unweighted graphs.</div>
<pre><code class="language-java">Queue&lt;Integer&gt; q = new LinkedList&lt;&gt;();
boolean[] visited = new boolean[n];
q.offer(start); visited[start] = true;
while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i &lt; size; i++) {
        int node = q.poll();
        for (int next : graph[node])
            if (!visited[next]) { visited[next] = true; q.offer(next); }
    }
}</code></pre>
<div class="meta"><span class="meta-item">shortest path</span><span class="meta-item">level order</span></div>
</div>
<div class="card">
<div class="card-title"><span class="badge badge-java">Java</span> Reverse Linked List</div>
<div class="card-desc">Three-pointer technique. Draw it out: prev ← curr → next.</div>
<pre><code class="language-java">public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr; curr = next;
    }
    return prev;
}</code></pre>
<div class="meta"><span class="meta-item">O(n) time</span><span class="meta-item">O(1) space</span></div>
</div>
</div>`;

// ===== Question Data =====
const sqlQs = [
  {
    name: "Second highest salary",
    diff: "medium",
    hint: "MAX subquery or DENSE_RANK",
    lang: "sql",
    code: "SELECT MAX(salary)\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- Or: DENSE_RANK() OVER (ORDER BY salary DESC) = 2",
  },
  {
    name: "Top earner per department",
    diff: "medium",
    hint: "DENSE_RANK PARTITION BY dept",
    lang: "sql",
    code: "WITH r AS (\n  SELECT *, DENSE_RANK() OVER (\n    PARTITION BY dept_id ORDER BY salary DESC\n  ) rnk FROM employees\n)\nSELECT * FROM r WHERE rnk = 1;",
  },
  {
    name: "Customers with no transactions",
    diff: "easy",
    hint: "LEFT JOIN + WHERE IS NULL",
    lang: "sql",
    code: "SELECT c.*\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;",
  },
  {
    name: "Monthly revenue summary",
    diff: "medium",
    hint: "DATE_TRUNC + SUM + GROUP BY",
    lang: "sql",
    code: "SELECT DATE_TRUNC('month', order_date) month,\n  COUNT(*) orders, SUM(amount) total\nFROM orders\nGROUP BY 1 ORDER BY 1;",
  },
  {
    name: "Running total by date",
    diff: "medium",
    hint: "SUM OVER (ORDER BY date)",
    lang: "sql",
    code: "SELECT date, amount,\n  SUM(amount) OVER (ORDER BY date) running_total\nFROM transactions;",
  },
  {
    name: "LEAD/LAG salary delta",
    diff: "medium",
    hint: "LAG() OVER (ORDER BY ...)",
    lang: "sql",
    code: "SELECT id, salary,\n  salary - LAG(salary) OVER (ORDER BY salary) delta\nFROM employees;",
  },
  {
    name: "Find duplicate emails",
    diff: "easy",
    hint: "GROUP BY HAVING COUNT > 1",
    lang: "sql",
    code: "SELECT email, COUNT(*) cnt\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;",
  },
  {
    name: "Dedup with ROW_NUMBER",
    diff: "medium",
    hint: "ROW_NUMBER PARTITION BY + rn = 1",
    lang: "sql",
    code: "WITH d AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY email ORDER BY created_at DESC\n  ) rn FROM users\n)\nSELECT * FROM d WHERE rn = 1;",
  },
];
const easyQs = [
  {
    name: "Two Sum",
    diff: "easy",
    hint: "HashMap complement lookup",
    lang: "java",
    code: "public int[] twoSum(int[] nums, int target) {\n    Map<Integer,Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int need = target - nums[i];\n        if (map.containsKey(need))\n            return new int[]{map.get(need), i};\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}",
  },
  {
    name: "Valid Anagram",
    diff: "easy",
    hint: "int[26] frequency array",
    lang: "java",
    code: "public boolean isAnagram(String s, String t) {\n    int[] count = new int[26];\n    for (char c : s.toCharArray()) count[c-'a']++;\n    for (char c : t.toCharArray()) count[c-'a']--;\n    for (int x : count) if (x != 0) return false;\n    return true;\n}",
  },
  {
    name: "Contains Duplicate",
    diff: "easy",
    hint: "HashSet.add() returns false if exists",
    lang: "java",
    code: "public boolean containsDuplicate(int[] nums) {\n    Set<Integer> seen = new HashSet<>();\n    for (int n : nums)\n        if (!seen.add(n)) return true;\n    return false;\n}",
  },
  {
    name: "Best Time to Buy & Sell Stock",
    diff: "easy",
    hint: "Track min price, update max profit",
    lang: "java",
    code: "public int maxProfit(int[] prices) {\n    int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n    for (int price : prices) {\n        minPrice = Math.min(minPrice, price);\n        maxProfit = Math.max(maxProfit, price - minPrice);\n    }\n    return maxProfit;\n}",
  },
  {
    name: "Valid Parentheses",
    diff: "easy",
    hint: "Stack — push expected close",
    lang: "java",
    code: "public boolean isValid(String s) {\n    Deque<Character> stack = new ArrayDeque<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(') stack.push(')');\n        else if (c == '{') stack.push('}');\n        else if (c == '[') stack.push(']');\n        else if (stack.isEmpty() || stack.pop() != c)\n            return false;\n    }\n    return stack.isEmpty();\n}",
  },
];
const mediumQs = [
  {
    name: "Longest Substring Without Repeating",
    diff: "medium",
    hint: "Sliding window + HashMap",
    lang: "java",
    code: "public int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> last = new HashMap<>();\n    int left = 0, max = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right);\n        if (last.containsKey(c))\n            left = Math.max(left, last.get(c) + 1);\n        last.put(c, right);\n        max = Math.max(max, right - left + 1);\n    }\n    return max;\n}",
  },
  {
    name: "Group Anagrams",
    diff: "medium",
    hint: "HashMap sorted-str key",
    lang: "java",
    code: "public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String,List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] c = s.toCharArray();\n        Arrays.sort(c);\n        map.computeIfAbsent(new String(c),\n            k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}",
  },
  {
    name: "Top K Frequent Elements",
    diff: "medium",
    hint: "Freq map + min-heap size K",
    lang: "java",
    code: "Map<Integer,Integer> freq = new HashMap<>();\nfor (int n : nums) freq.merge(n, 1, Integer::sum);\nPriorityQueue<Integer> pq = new PriorityQueue<>(\n    Comparator.comparingInt(freq::get));\nfor (int n : freq.keySet()) {\n    pq.offer(n);\n    if (pq.size() > k) pq.poll();\n}",
  },
  {
    name: "Number of Islands",
    diff: "medium",
    hint: "DFS/BFS flood fill",
    lang: "java",
    code: "public int numIslands(char[][] grid) {\n    int count = 0;\n    for (int i = 0; i < grid.length; i++)\n        for (int j = 0; j < grid[0].length; j++)\n            if (grid[i][j] == '1') {\n                dfs(grid, i, j);\n                count++;\n            }\n    return count;\n}",
  },
  {
    name: "Kth Largest Element",
    diff: "medium",
    hint: "Min-heap of size K",
    lang: "java",
    code: "PriorityQueue<Integer> pq = new PriorityQueue<>();\nfor (int n : nums) {\n    pq.offer(n);\n    if (pq.size() > k) pq.poll();\n}\nreturn pq.peek();",
  },
  {
    name: "Reverse Linked List",
    diff: "easy",
    hint: "Three-pointer: prev, curr, next",
    lang: "java",
    code: "ListNode prev = null, curr = head;\nwhile (curr != null) {\n    ListNode next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n}\nreturn prev;",
  },
  {
    name: "Merge Two Sorted Lists",
    diff: "easy",
    hint: "Dummy head + compare",
    lang: "java",
    code: "ListNode dummy = new ListNode(0), curr = dummy;\nwhile (l1 != null && l2 != null) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n}\ncurr.next = (l1 != null) ? l1 : l2;\nreturn dummy.next;",
  },
];

// ===== Plan Panel =====
const planHTML = `
<div class="section-label">Time Allocation</div>
<div class="plan-grid">
<div class="plan-card"><div class="plan-q">Q1</div><div class="plan-type">SQL</div><div class="plan-time">8</div><div class="plan-unit">min</div></div>
<div class="plan-card"><div class="plan-q">Q2</div><div class="plan-type">SQL</div><div class="plan-time">10</div><div class="plan-unit">min</div></div>
<div class="plan-card highlight"><div class="plan-q">Q3</div><div class="plan-type">Coding</div><div class="plan-time">22</div><div class="plan-unit">min</div></div>
<div class="plan-card highlight"><div class="plan-q">Q4</div><div class="plan-type">Coding</div><div class="plan-time">30</div><div class="plan-unit">min</div></div>
</div>
<div class="tip-box" style="margin-top:12px"><strong>5 min buffer</strong> — review, edge cases, or if Q4 runs long. Never leave a question blank.</div>
<div class="section-label" style="margin-top:1.75rem">Strategy</div>
<div class="strategy-grid">
<div class="strategy-card"><h3>Hard Question Protocol</h3><ol>
<li>Read carefully — identify input/output format</li>
<li>Write brute force first — pass sample tests</li>
<li>Optimize only if time allows</li>
<li>Handle edge cases: empty, single element, duplicates, negatives</li>
</ol><span class="highlight-text">A working O(n²) beats an unfinished O(n log n)</span></div>
<div class="strategy-card"><h3>Before Submitting</h3><ol>
<li>Test with the provided examples</li>
<li>Try edge case: empty/null input</li>
<li>Try edge case: single element</li>
<li>Check for off-by-one errors</li>
<li>Verify return type matches expected</li>
</ol></div>
</div>
<div class="section-label" style="margin-top:1.75rem">Complexity Quick Reference</div>
<div class="strategy-card"><table class="complexity-table">
<thead><tr><th>Input Size (n)</th><th>Max Complexity</th><th>Approach</th></tr></thead>
<tbody>
<tr><td>n ≤ 20</td><td>O(2ⁿ)</td><td>Backtracking, bitmask</td></tr>
<tr><td>n ≤ 500</td><td>O(n³)</td><td>Triple nested loops, DP</td></tr>
<tr><td>n ≤ 10⁴</td><td>O(n²)</td><td>Brute force pairs</td></tr>
<tr><td>n ≤ 10⁶</td><td>O(n log n)</td><td>Sort + binary search</td></tr>
<tr><td>n ≤ 10⁸</td><td>O(n)</td><td>Linear scan, two pointers</td></tr>
</tbody></table></div>
<div class="section-label" style="margin-top:1.75rem">Must-Know Topics</div>
<div class="keyword-grid">
<span class="kw">HashMap</span><span class="kw">HashSet</span><span class="kw">PriorityQueue</span>
<span class="kw">sliding window</span><span class="kw">two pointers</span><span class="kw">binary search</span>
<span class="kw">BFS / DFS</span><span class="kw">linked list</span><span class="kw">ROW_NUMBER</span>
<span class="kw">DENSE_RANK</span><span class="kw">LEAD / LAG</span><span class="kw">WITH (CTE)</span>
<span class="kw">LEFT JOIN IS NULL</span><span class="kw">GROUP BY HAVING</span><span class="kw">DATE_TRUNC</span>
</div>`;

// ===== Render Questions (solution at top) =====
function renderQList(items) {
  return items
    .map((q) => {
      const escaped = esc(q.code);
      return `<div class="q-card" data-name="${q.name.toLowerCase()}" data-hint="${q.hint.toLowerCase()}">
<div class="q-card-header"><span class="q-name">${q.name}</span><span class="q-hint">${q.hint}</span><span class="badge badge-${q.diff}">${q.diff}</span></div>
<div class="q-card-body"><pre><code class="language-${q.lang}">${escaped}</code></pre></div>
</div>`;
    })
    .join("");
}

// ===== Build Page =====
document.getElementById("app").innerHTML = `
<div class="header">
<div class="header-left">
<h1>Wells Fargo HackerRank — Master Cheat Sheet</h1>
<p>4 questions · 75 minutes · Q1–Q2 SQL · Q3–Q4 Java coding</p>
</div>
<div class="header-right">
<span class="timer-display" id="timer">75:00</span>
<button class="timer-btn" id="timer-btn" onclick="toggleTimer()">Start</button>
</div>
</div>
<div class="tabs" role="tablist">
<button class="tab-btn active" role="tab" onclick="switchTab('sql', this)">SQL Patterns</button>
<button class="tab-btn" role="tab" onclick="switchTab('java', this)">Java Patterns</button>
<button class="tab-btn" role="tab" onclick="switchTab('questions', this)">Likely Questions</button>
<button class="tab-btn" role="tab" onclick="switchTab('plan', this)">Game Plan</button>
</div>
<div id="tab-sql" class="panel active">${sqlPatternsHTML}</div>
<div id="tab-java" class="panel">${javaPatternsHTML}</div>
<div id="tab-questions" class="panel">
<div class="search-bar"><input type="text" class="search-input" placeholder="Filter questions..." oninput="filterQuestions(this.value)"></div>
<div class="section-label">SQL — Reported High Frequency</div>
<div class="q-list">${renderQList(sqlQs)}</div>
<div class="section-label" style="margin-top:1.25rem">Coding — Easy</div>
<div class="q-list">${renderQList(easyQs)}</div>
<div class="section-label" style="margin-top:1.25rem">Coding — Medium</div>
<div class="q-list">${renderQList(mediumQs)}</div>
</div>
<div id="tab-plan" class="panel">${planHTML}</div>
`;

// ===== Tab switching =====
function switchTab(name, btn) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  btn.classList.add("active");
}

// ===== Timer =====
let timerInterval = null,
  timeLeft = 75 * 60;
function toggleTimer() {
  const btn = document.getElementById("timer-btn");
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    btn.textContent = "Resume";
  } else {
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.textContent = "Done";
        document.getElementById("timer").style.color = "#d71e28";
      }
      const min = Math.floor(timeLeft / 60),
        sec = timeLeft % 60;
      document.getElementById("timer").textContent =
        min + ":" + sec.toString().padStart(2, "0");
    }, 1000);
    btn.textContent = "Pause";
  }
}

// ===== Filter =====
function filterQuestions(query) {
  const q = query.toLowerCase();
  document.querySelectorAll(".q-card").forEach((card) => {
    const name = card.getAttribute("data-name");
    const hint = card.getAttribute("data-hint");
    card.style.display = name.includes(q) || hint.includes(q) ? "" : "none";
  });
}
