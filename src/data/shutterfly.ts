import type {
  CompanyConfig,
  PatternSection,
  QuestionItem,
  GamePlanConfig,
} from './types';

/**
 * Shutterfly cheatsheet data.
 * 39 Known Problems — 5 Easy, 25 Medium, 9 Hard
 * Top Topics: Array, Hash Table, DP, String, Math
 */

export const shutterflyConfig: CompanyConfig = {
  slug: 'shutterfly',
  title: 'Shutterfly Coding Assessment — Cheat Sheet',
  subtitle:
    '39 Known Problems — 5 Easy, 25 Medium, 9 Hard · Top Topics: Array, Hash Table, DP, String, Math',
  accentColor: '#6B2D8B',
  accentSecondary: '#00B2A9',
  timerMinutes: 90,
  tabs: [
    { id: 'arrays', label: 'Array/String Patterns' },
    { id: 'dp', label: 'DP/Math Patterns' },
    { id: 'questions', label: 'Likely Questions' },
    { id: 'plan', label: 'Game Plan' },
  ],
};

// ---------------------------------------------------------------------------
// Array/String Patterns
// ---------------------------------------------------------------------------

export const shutterflyArrayPatterns: PatternSection[] = [
  {
    label: 'Two Pointers',
    cards: [
      {
        title: 'Two Sum II — Sorted Array',
        lang: 'java',
        description:
          'Use left/right pointers converging toward center. Move left up if sum too small, right down if too large.',
        code: `public int[] twoSum(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int sum = nums[lo] + nums[hi];
        if (sum == target) return new int[]{lo + 1, hi + 1};
        else if (sum < target) lo++;
        else hi--;
    }
    return new int[]{-1, -1};
}`,
        metaTags: ['two pointers', 'sorted array', 'O(n)'],
      },
      {
        title: 'Container With Most Water',
        lang: 'java',
        description:
          'Maximize area between two lines. Move the shorter pointer inward since it limits height.',
        code: `public int maxArea(int[] height) {
    int lo = 0, hi = height.length - 1, max = 0;
    while (lo < hi) {
        int area = Math.min(height[lo], height[hi]) * (hi - lo);
        max = Math.max(max, area);
        if (height[lo] < height[hi]) lo++;
        else hi--;
    }
    return max;
}`,
        metaTags: ['two pointers', 'greedy', 'O(n)'],
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
          'Expand window right, shrink left when duplicate found. Track last-seen index in a map.',
        code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int max = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c)) {
            left = Math.max(left, map.get(c) + 1);
        }
        map.put(c, right);
        max = Math.max(max, right - left + 1);
    }
    return max;
}`,
        metaTags: ['sliding window', 'hash map', 'O(n)'],
      },
      {
        title: 'Minimum Window Substring',
        lang: 'java',
        description:
          'Expand right to satisfy condition, shrink left to minimize. Track character frequencies.',
        code: `public String minWindow(String s, String t) {
    int[] need = new int[128];
    for (char c : t.toCharArray()) need[c]++;
    int left = 0, count = t.length(), minLen = Integer.MAX_VALUE, start = 0;
    for (int right = 0; right < s.length(); right++) {
        if (need[s.charAt(right)]-- > 0) count--;
        while (count == 0) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                start = left;
            }
            if (++need[s.charAt(left)] > 0) count++;
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
}`,
        metaTags: ['sliding window', 'frequency', 'O(n)'],
      },
    ],
  },
  {
    label: 'Prefix Sum',
    cards: [
      {
        title: 'Subarray Sum Equals K',
        lang: 'java',
        description:
          'Store prefix sums in a map. For each index, check if (currentSum - k) exists in the map.',
        code: `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1);
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}`,
        metaTags: ['prefix sum', 'hash map', 'O(n)'],
      },
    ],
  },
  {
    label: 'Hash Table Frequency Counting',
    cards: [
      {
        title: 'Top K Frequent Elements',
        lang: 'java',
        description:
          'Count frequencies with a map, then use bucket sort by frequency for O(n) solution.',
        code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    List<Integer>[] buckets = new List[nums.length + 1];
    for (var entry : freq.entrySet()) {
        int f = entry.getValue();
        if (buckets[f] == null) buckets[f] = new ArrayList<>();
        buckets[f].add(entry.getKey());
    }

    int[] res = new int[k];
    int idx = 0;
    for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
        if (buckets[i] != null) {
            for (int val : buckets[i]) {
                if (idx >= k) break;
                res[idx++] = val;
            }
        }
    }
    return res;
}`,
        metaTags: ['hash map', 'bucket sort', 'frequency', 'O(n)'],
      },
      {
        title: 'Group Anagrams',
        lang: 'java',
        description:
          'Use sorted string or character count as hash key to group anagrams together.',
        code: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}`,
        metaTags: ['hash map', 'anagram', 'sorting', 'O(n·k log k)'],
      },
    ],
  },
  {
    label: 'Monotonic Stack (Hard)',
    cards: [
      {
        title: 'Trapping Rain Water',
        lang: 'java',
        description:
          'Use a decreasing stack. When a taller bar is found, pop and compute trapped water between boundaries.',
        code: `public int trap(int[] height) {
    Deque<Integer> stack = new ArrayDeque<>();
    int water = 0;
    for (int i = 0; i < height.length; i++) {
        while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
            int bottom = stack.pop();
            if (stack.isEmpty()) break;
            int left = stack.peek();
            int w = i - left - 1;
            int h = Math.min(height[i], height[left]) - height[bottom];
            water += w * h;
        }
        stack.push(i);
    }
    return water;
}`,
        metaTags: ['monotonic stack', 'trapping rain water', 'O(n)'],
      },
    ],
  },
  {
    label: 'Heap / Stream Processing (Hard)',
    cards: [
      {
        title: 'Find Median from Data Stream',
        lang: 'java',
        description:
          'Maintain a max-heap for lower half and min-heap for upper half. Balance sizes after each insert.',
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
        metaTags: ['heap', 'median', 'data stream', 'O(log n)'],
      },
    ],
  },
  {
    label: 'Expression Parsing (Hard)',
    cards: [
      {
        title: 'Basic Calculator',
        lang: 'java',
        description:
          'Use a stack to handle parentheses. Track current sign and push/pop sign context on parens.',
        code: `public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int result = 0, num = 0, sign = 1;
    stack.push(sign);
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+' || c == '-') {
            result += sign * num;
            num = 0;
            sign = stack.peek() * (c == '+' ? 1 : -1);
        } else if (c == '(') {
            stack.push(sign);
        } else if (c == ')') {
            stack.pop();
        }
    }
    return result + sign * num;
}`,
        metaTags: ['stack', 'expression parsing', 'calculator', 'O(n)'],
      },
    ],
  },
];


// ---------------------------------------------------------------------------
// DP / Math Patterns
// ---------------------------------------------------------------------------

export const shutterflyDpPatterns: PatternSection[] = [
  {
    label: '1D Dynamic Programming',
    cards: [
      {
        title: 'House Robber',
        lang: 'java',
        description:
          'Classic 1D DP: at each house decide to rob (skip prev) or skip. dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
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
        metaTags: ['1D DP', 'house robber', 'O(n)'],
      },
      {
        title: 'Word Break',
        lang: 'java',
        description:
          'dp[i] = true if s[0..i) can be segmented using dictionary words. Check all valid suffixes.',
        code: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}`,
        metaTags: ['1D DP', 'word break', 'O(n²)'],
      },
      {
        title: 'Longest Increasing Subsequence',
        lang: 'java',
        description:
          'Patience sorting with binary search. Maintain tails array where tails[i] is smallest tail of IS of length i+1.',
        code: `public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int pos = Collections.binarySearch(tails, num);
        if (pos < 0) pos = -(pos + 1);
        if (pos == tails.size()) tails.add(num);
        else tails.set(pos, num);
    }
    return tails.size();
}`,
        metaTags: ['1D DP', 'binary search', 'LIS', 'O(n log n)'],
      },
    ],
  },
  {
    label: '2D Dynamic Programming',
    cards: [
      {
        title: 'Longest Palindromic Substring',
        lang: 'java',
        description:
          'Expand around center for each index. Check both odd and even length palindromes.',
        code: `public String longestPalindrome(String s) {
    int start = 0, maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(s, i, i);
        int len2 = expand(s, i, i + 1);
        int len = Math.max(len1, len2);
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
        metaTags: ['2D DP', 'palindrome', 'expand around center', 'O(n²)'],
      },
      {
        title: 'Longest Arithmetic Subsequence',
        lang: 'java',
        description:
          'dp[i][diff] = length of longest arithmetic subsequence ending at i with given difference.',
        code: `public int longestArithSeqLength(int[] nums) {
    int n = nums.length, max = 2;
    Map<Integer, Integer>[] dp = new HashMap[n];
    for (int i = 0; i < n; i++) {
        dp[i] = new HashMap<>();
        for (int j = 0; j < i; j++) {
            int diff = nums[i] - nums[j];
            int prev = dp[j].getOrDefault(diff, 1);
            dp[i].put(diff, prev + 1);
            max = Math.max(max, dp[i].get(diff));
        }
    }
    return max;
}`,
        metaTags: ['2D DP', 'arithmetic subsequence', 'O(n²)'],
      },
    ],
  },
  {
    label: 'Interval DP',
    cards: [
      {
        title: 'Burst Balloons',
        lang: 'java',
        description:
          'dp[l][r] = max coins from bursting balloons in range (l, r). Choose last balloon to burst in each subrange.',
        code: `public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] arr = new int[n + 2];
    arr[0] = arr[n + 1] = 1;
    for (int i = 0; i < n; i++) arr[i + 1] = nums[i];

    int[][] dp = new int[n + 2][n + 2];
    for (int len = 1; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            for (int k = l; k <= r; k++) {
                dp[l][r] = Math.max(dp[l][r],
                    dp[l][k - 1] + arr[l - 1] * arr[k] * arr[r + 1] + dp[k + 1][r]);
            }
        }
    }
    return dp[1][n];
}`,
        metaTags: ['interval DP', 'burst balloons', 'O(n³)'],
      },
    ],
  },
  {
    label: 'Math Patterns',
    cards: [
      {
        title: 'Modular Arithmetic — Power Mod',
        lang: 'java',
        description:
          'Fast exponentiation with modulus. Used in combinatorics and large number problems.',
        code: `public long powerMod(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}`,
        metaTags: ['math', 'modular arithmetic', 'O(log n)'],
      },
      {
        title: 'Kth Factor of N',
        lang: 'java',
        description:
          'Iterate from 1 to sqrt(n) collecting factors. If k-th not found in first half, compute from second half.',
        code: `public int kthFactor(int n, int k) {
    List<Integer> factors = new ArrayList<>();
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) factors.add(i);
    }
    int size = factors.size();
    // Check if sqrt(n) is a perfect square (avoid duplicate)
    if (factors.get(size - 1) * factors.get(size - 1) == n) size--;
    int total = 2 * size - (factors.get(factors.size() - 1) * factors.get(factors.size() - 1) == n ? 1 : 0);
    if (k > total) return -1;
    if (k <= factors.size()) return factors.get(k - 1);
    return n / factors.get(total - k);
}`,
        metaTags: ['math', 'factors', 'O(√n)'],
      },
      {
        title: 'Combinatorics — nCr with Pascal Triangle',
        lang: 'java',
        description:
          'Build Pascal triangle row by row. C(n,r) = C(n-1,r-1) + C(n-1,r). Avoids overflow for moderate n.',
        code: `public int nCr(int n, int r) {
    if (r > n - r) r = n - r; // optimization
    long result = 1;
    for (int i = 0; i < r; i++) {
        result = result * (n - i) / (i + 1);
    }
    return (int) result;
}

// Generate all combinations (Subsets-style)
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(res, new ArrayList<>(), 1, n, k);
    return res;
}

private void backtrack(List<List<Integer>> res, List<Integer> curr, int start, int n, int k) {
    if (curr.size() == k) { res.add(new ArrayList<>(curr)); return; }
    for (int i = start; i <= n - (k - curr.size()) + 1; i++) {
        curr.add(i);
        backtrack(res, curr, i + 1, n, k);
        curr.remove(curr.size() - 1);
    }
}`,
        metaTags: ['math', 'combinatorics', 'backtracking', 'nCr'],
      },
    ],
  },
];


// ---------------------------------------------------------------------------
// Likely Questions (minimum 11 known Shutterfly problems)
// ---------------------------------------------------------------------------

export const shutterflyQuestions: QuestionItem[] = [
  {
    name: 'Find Peak Element',
    diff: 'medium',
    hint: 'Binary search — move toward the side with a larger neighbor.',
    lang: 'java',
    code: `public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
  },
  {
    name: 'Next Permutation',
    diff: 'medium',
    hint: 'Find rightmost ascent, swap with next larger, reverse suffix.',
    lang: 'java',
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
    while (l < r) { swap(a, l++, r--); }
}`,
  },
  {
    name: 'Rotate Image',
    diff: 'medium',
    hint: 'Transpose matrix then reverse each row for 90° clockwise rotation.',
    lang: 'java',
    code: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    // Reverse each row
    for (int[] row : matrix) {
        int l = 0, r = n - 1;
        while (l < r) {
            int tmp = row[l]; row[l] = row[r]; row[r] = tmp;
            l++; r--;
        }
    }
}`,
  },
  {
    name: 'Subsets',
    diff: 'medium',
    hint: 'Backtracking: include or exclude each element. 2^n total subsets.',
    lang: 'java',
    code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(res, new ArrayList<>(), nums, 0);
    return res;
}

private void backtrack(List<List<Integer>> res, List<Integer> curr, int[] nums, int start) {
    res.add(new ArrayList<>(curr));
    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(res, curr, nums, i + 1);
        curr.remove(curr.size() - 1);
    }
}`,
  },
  {
    name: 'Longest Increasing Subsequence',
    diff: 'medium',
    hint: 'Patience sorting: maintain tails array with binary search for O(n log n).',
    lang: 'java',
    code: `public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int pos = Collections.binarySearch(tails, num);
        if (pos < 0) pos = -(pos + 1);
        if (pos == tails.size()) tails.add(num);
        else tails.set(pos, num);
    }
    return tails.size();
}`,
  },
  {
    name: 'House Robber',
    diff: 'medium',
    hint: 'DP: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space-optimize to two vars.',
    lang: 'java',
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
  },
  {
    name: 'Word Break',
    diff: 'medium',
    hint: 'DP: dp[i] = can s[0..i) be segmented? Check all j < i where dp[j] && dict has s[j..i).',
    lang: 'java',
    code: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}`,
  },
  {
    name: 'Trapping Rain Water',
    diff: 'hard',
    hint: 'Monotonic stack or two-pointer approach. Water at i = min(maxL, maxR) - height[i].',
    lang: 'java',
    code: `public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left];
            left++;
        } else {
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`,
  },
  {
    name: 'Find Median from Data Stream',
    diff: 'hard',
    hint: 'Two heaps: max-heap for lower half, min-heap for upper half. Balance after each insert.',
    lang: 'java',
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
  },
  {
    name: 'Basic Calculator',
    diff: 'hard',
    hint: 'Stack for sign context. Push sign on open paren, pop on close. Process digits and +/-.',
    lang: 'java',
    code: `public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int result = 0, num = 0, sign = 1;
    stack.push(sign);
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+' || c == '-') {
            result += sign * num;
            num = 0;
            sign = stack.peek() * (c == '+' ? 1 : -1);
        } else if (c == '(') {
            stack.push(sign);
        } else if (c == ')') {
            stack.pop();
        }
    }
    return result + sign * num;
}`,
  },
  {
    name: 'First Missing Positive',
    diff: 'hard',
    hint: 'Cyclic sort: place each num at index num-1. First index where nums[i] != i+1 is the answer.',
    lang: 'java',
    code: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int tmp = nums[nums[i] - 1];
            nums[nums[i] - 1] = nums[i];
            nums[i] = tmp;
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
  },
  {
    name: 'Two Sum',
    diff: 'easy',
    hint: 'Hash map: store complement. One-pass O(n) solution.',
    lang: 'java',
    code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int comp = target - nums[i];
        if (map.containsKey(comp)) return new int[]{map.get(comp), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
  },
  {
    name: 'Valid Parentheses',
    diff: 'easy',
    hint: 'Stack: push open brackets, pop and match on close brackets.',
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
];


// ---------------------------------------------------------------------------
// Game Plan — 90 min across 39 problems (5 Easy, 25 Medium, 9 Hard)
// ---------------------------------------------------------------------------

export const shutterflyGamePlan: GamePlanConfig = {
  allocations: [
    { label: 'Easy (5)', type: 'Easy Problems', minutes: 10, highlight: false },
    { label: 'Medium (25)', type: 'Medium Problems', minutes: 50, highlight: true },
    { label: 'Hard (9)', type: 'Hard Problems', minutes: 30, highlight: true },
  ],
  strategies: [
    {
      title: 'Time Strategy — 90 Minutes for 39 Problems',
      steps: [
        'Skim all 39 problems first (2 min) — identify freebies and hard ones',
        'Solve 5 Easy problems quickly (~2 min each = 10 min total)',
        'Attack 25 Medium problems (~2 min each = 50 min total) — use pattern recognition',
        'Attempt 9 Hard problems with remaining time (~3.3 min each = 30 min total)',
        'If stuck on a Hard, skip and return — never spend >5 min on one problem',
        'Reserve last 3 minutes for review and fixing edge cases',
      ],
      highlightText: '~2.3 min average per problem — speed is critical',
    },
    {
      title: 'Pattern Recognition Strategy',
      steps: [
        'Read problem → identify data structure (array, string, graph, tree)',
        'Map to known pattern: two pointers, sliding window, DP, backtracking, stack',
        'Write solution skeleton first, then fill in details',
        'Test with the simplest example mentally before coding',
        'Handle edge cases: empty input, single element, duplicates',
      ],
    },
    {
      title: 'Difficulty Tier Approach',
      steps: [
        'Easy: direct implementation — hash map lookups, simple iterations, basic math',
        'Medium: one key insight needed — identify the trick (DP state, pointer direction, window condition)',
        'Hard: combine 2+ techniques — monotonic stack + math, DP + binary search, heap + sorting',
        'If a Medium feels like a Hard, move on — come back with fresh eyes',
      ],
    },
  ],
  keywords: [
    'two pointers',
    'sliding window',
    'dynamic programming',
    'hash table',
    'prefix sum',
    'binary search',
    'backtracking',
    'monotonic stack',
    'heap',
    'greedy',
    'math',
    'combinatorics',
    'string manipulation',
    'interval DP',
    'cyclic sort',
    'expression parsing',
  ],
};
