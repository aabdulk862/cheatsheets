---
title: "Coding"
order: 7
lang: "java"
---

# Merge two sorted int Arrays, keeping each value in ascending numerical order

```java
import java.util.Arrays;

public class MergeSortedArray {

  public static int[] MergeTwoSortedArray(int[] array1, int[] array2) {
    final int[] mergedArray = new int[array1.length + array2.length];
    int j = 0, k = 0;
    for (int i = 0; i < mergedArray.length; i++) {
      if (j != array1.length && (k == array2.length || array1[j] < array2[k])) {
        mergedArray[i] = array1[j];
        j++;
      } else {
        mergedArray[i] = array2[k];
        k++;
      }
    }
    return mergedArray;
  }

  public static void main(String[] args) {
    int[] arr = MergeTwoSortedArray(new int[]{1,1,8,9,10}, new int[]{1,2,8,9,11,15,16});
    Arrays.stream(arr).forEach(System.out::println);
  }
}
```

- Uses two pointers (`j` for array1, `k` for array2) to traverse both arrays.
- Adds the smaller element at each step to the merged array.
- Handles cases where one array is fully traversed.

# Find the values in an Array that occur only once

```java
public static List<Integer> findUniqueValues(int[] arr) {
    Map<Integer, Integer> countMap = new HashMap<>();

    // Count occurrences of each element
    for (int num : arr) {
        int count = countMap.getOrDefault(num, 0);
        count = count + 1;
        countMap.put(num, count);
    }

    // Collect values that appear only once
    List<Integer> uniqueValues = new ArrayList<>();
    for (int num : countMap.keySet()) {
        if (countMap.get(num) == 1) {
            uniqueValues.add(num);
        }
    }

    return uniqueValues;
}
```

- Uses a `HashMap` to count occurrences of each element.
- Collects elements with count of 1 into the result list.

# Convert an Array of Strings to be all uppercase

```java
public class ConvertToUpperCase {
    public static void main(String[] args) {
        String[] strings = {"hello", "world", "java"};

        for (int i = 0; i < strings.length; i++) {
            strings[i] = strings[i].toUpperCase();
        }

        for (String str : strings) {
            System.out.println(str);
        }
    }
}
```

- Iterates through the array and modifies each element in place using `toUpperCase()`.

# Write a method to delete whitespace in a String

```java
public static String removeWhitespace(String input) {
    if (input == null) {
        return null;
    }
    return input.replaceAll("\\s", "");
}
```

- `\\s` is a regex pattern matching any whitespace character (spaces, tabs, newlines).
- `""` replaces matched whitespace with empty string.

# Write a method to find the factorial of a number

```java
public static int findFactorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * findFactorial(n - 1);
    }
}
```

- **Base Case**: When `n` is 0 or 1, return 1.
- **Recursive Case**: Multiply `n` by factorial of `(n - 1)`.

# Find the lowest and greatest number in an Array

```java
public static void findLowestAndGreatest(int[] arr) {
    int low = Integer.MAX_VALUE;
    int high = Integer.MIN_VALUE;
    for (int i : arr) {
        if (i < low) {
            low = i;
        }
        if (i > high) {
            high = i;
        }
    }
    System.out.println("Lowest value = " + low + " Greatest value = " + high);
}
```

- Initialize `low` to `MAX_VALUE` and `high` to `MIN_VALUE`.
- Single pass through array updating both values.

# Switch two variables without the use of a third variable

```java
public static void main(String[] args) {
    int a = 5;
    int b = 10;
    System.out.println("Before swapping: a = " + a + ", b = " + b);

    a = a + b; // a becomes 15
    b = a - b; // b becomes 5
    a = a - b; // a becomes 10

    System.out.println("After swapping: a = " + a + ", b = " + b);
}
```

- Uses arithmetic operations to swap without a temporary variable.

# Write a Java Class with static and instance methods

```java
public class BankAccount {
    private String accountHolderName;
    private double balance;
    private static double interestRate = 2.5;

    public BankAccount(String accountHolderName, double initialBalance) {
        this.accountHolderName = accountHolderName;
        this.balance = initialBalance;
    }

    // Instance method
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println(amount + " deposited. New balance: " + balance);
        }
    }

    // Instance method
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println(amount + " withdrawn. New balance: " + balance);
        }
    }

    // Static method - shared across all instances
    public static void setInterestRate(double newRate) {
        if (newRate > 0) {
            interestRate = newRate;
        }
    }

    public static double getInterestRate() {
        return interestRate;
    }
}
```

# Bubble Sort

- Repeatedly compares adjacent elements and swaps them if in wrong order.
- **Time Complexity**: Best O(n), Average/Worst O(n²). **Space**: O(1).

```java
public static void bubbleSort(int[] arr) {
    int n = arr.length;
    boolean swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break; // Optimization: already sorted
    }
}
```

# Writing lambda expressions

- **Lambda expressions** provide a concise way to represent a method as an object.
- **Syntax**: `(parameter(s)) -> expression`
- **Functional Interfaces**: Predicate, Consumer, Supplier, Function, BiFunction.

```java
// No Parameters
Runnable r = () -> System.out.println("Hello, World!");

// One Parameter
Consumer<String> print = str -> System.out.println(str);

// Multiple Parameters
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

// Block Body
Function<Integer, Integer> square = x -> {
    int result = x * x;
    return result;
};

// Using with Collections
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(name -> System.out.println(name));
```

# All types of SQL joins

```sql
-- INNER JOIN: Only matching rows from both tables
SELECT A.name, B.department
FROM A INNER JOIN B ON A.id = B.employee_id;

-- LEFT JOIN: All from left, matching from right (NULL if no match)
SELECT A.name, B.department
FROM A LEFT JOIN B ON A.id = B.employee_id;

-- RIGHT JOIN: All from right, matching from left (NULL if no match)
SELECT A.name, B.department
FROM A RIGHT JOIN B ON A.id = B.employee_id;

-- FULL JOIN: All rows from both tables (NULL for unmatched)
SELECT A.name, B.department
FROM A FULL JOIN B ON A.id = B.employee_id;

-- CROSS JOIN: Cartesian product (all combinations)
SELECT A.name, B.department
FROM A CROSS JOIN B;
```

# Spring Data JPA model class with annotations

```java
import javax.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public Employee() {}

    public Employee(String name, String email, Department department) {
        this.name = name;
        this.email = email;
        this.department = department;
    }

    // Getters and setters
}
```

# Spring MVC controller method

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employee/{id}")
    public String getEmployee(@PathVariable("id") Long id, Model model) {
        Employee employee = employeeService.getEmployeeById(id);

        if (employee != null) {
            model.addAttribute("employee", employee);
            return "employeeDetails";
        } else {
            model.addAttribute("error", "Employee not found");
            return "error";
        }
    }
}
```
