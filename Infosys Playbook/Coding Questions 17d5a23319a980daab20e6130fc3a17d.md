# Coding Questions

# Merge two sorted int Arrays, keeping each value in ascending numberical order

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

**`MergeTwoSortedArray` Method**:

- Takes two integer arrays (`array1` and `array2`) as input.
- Creates a `mergedArray` with a length equal to the sum of both arrays.
- Uses two pointers (`j` for `array1` and `k` for `array2`) to traverse both arrays.
- Iterates over `mergedArray`:
    - Adds the smaller element of the two current positions (`array1[j]` or `array2[k]`) to `mergedArray`.
    - Moves the respective pointer (`j` or `k`) forward.
    - Handles cases where one array is fully traversed by continuing with the other.

---

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

1. **Count occurrences**:
    - A `HashMap` (`countMap`) is used to store the count of each element.
    - For each element in the array, we get its current count (defaulting to 0 if it's not in the map), increment it by 1, and update the map.
2. **Collect unique values**:
    - We iterate over the keys of `countMap`. If the count of a key is 1, it’s added to the `uniqueValues` list.
3. **Return result**:
    - The list `uniqueValues` contains all elements that appear only once in the array.

---

# Convert an Array of Strings to be all uppercase

```java
public class ConvertToUpperCase {
    public static void main(String[] args) {
        String[] strings = {"hello", "world", "java"};
        
        for (int i = 0; i < strings.length; i++) {
            strings[i] = strings[i].toUpperCase();
        }
        
        // Print the result
        for (String str : strings) {
            System.out.println(str);
        }
    }
}
```

- **Simple Loop**: Iterates through the array and modifies each element in place by converting it to uppercase using `toUpperCase()`

---

# Write a method to delete whitespace in a String

```java
public static String removeWhitespace(String input) {
        if (input == null) {
            return null; // Handle null input safely
        }
        return input.replaceAll("\\s", "");
   }
```

- **`replaceAll("\\s", "")`:**
    - `\\s` is a regex pattern that matches any whitespace character (spaces, tabs, newlines, etc.).
    - `""` replaces matched whitespace with an empty string, effectively removing it.
- **`if (input == null)`:**
    - Checks for null input to avoid a `NullPointerException`.

---

# Write a method to find the factorial of a number

```java
public static int findFactorial(int n){
		if(n == 0 || n == 1){
			return 1;
		} else {
			return n * findFactorial(n-1);
		}
}
```

- **Base Case**: `if (n == 0 || n == 1)`
    - When `n` is 0 or 1, the factorial is defined as `1`. The method returns `1` in this case, stopping further recursion.
- **Recursive Case**: `return n * findFactorial(n - 1)`
    - For values of `n` greater than 1, the method multiplies `n` by the factorial of `(n - 1)`. This recursive call continues until the base case is reached.

---

# Find the lowest and greatest number in an Array

```java
public static void findLowestAndGreatest(int [] arr){
		int low = Integer.MAX_VALUE;
		int high = Integer.MIN_VALUE;
		for(int i : arr){
			if(i< low){
					low = i;
			}
			if(i > high){
					high = i;
			}
		}
		System.out.println("Lowest value = " + low + " Greatest value = " + high);
}
```

- **Initialization**:
    - `low` starts at the largest possible integer (`Integer.MAX_VALUE`).
    - `high` starts at the smallest possible integer (`Integer.MIN_VALUE`).
- **Iteration**:
    - For each number in the array:
        - If the number is smaller than `low`, update `low`.
        - If the number is larger than `high`, update `high`.
- **Output**:
    - After the loop, `low` contains the smallest value, and `high` contains the largest value.
    - Prints both values.

---

# Switch two variables without the use of a third variable

```java
public static void main(String[] args) {
    int a = 5;
    int b = 10;
    System.out.println("Before swapping: a = " + a + ", b = " + b);
    // Swap using arithmetic operations
    a = a + b; // a now becomes 15
    b = a - b; // b becomes 5
    a = a - b; // a becomes 10
    System.out.println("After swapping: a = " + a + ", b = " + b);
}
```

1. **Step 1**: `a = a + b`
    - The sum of `a` and `b` is stored in `a`.
    - `a` becomes `15` (if `a = 5` and `b = 10`).
2. **Step 2**: `b = a - b`
    - Subtract the original `b` from the new `a` (which is `a + b`).
    - `b` becomes `5` (original value of `a`).
3. **Step 3**: `a = a - b`
    - Subtract the new `b` (which is the original value of `a`) from the new `a` (which is the sum).
    - `a` becomes `10` (original value of `b`).

---

# Write a Java Class with static and instance methods

```java
public class BankAccount {
    private String accountHolderName;
    private double balance;
    private static double interestRate = 2.5; // Shared across all accounts

    // Constructor
    public BankAccount(String accountHolderName, double initialBalance) {
        this.accountHolderName = accountHolderName;
        this.balance = initialBalance;
    }

    // Instance method to deposit money
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println(amount + " deposited. New balance: " + balance);
        } else {
            System.out.println("Invalid deposit amount.");
        }
    }

    // Instance method to withdraw money
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println(amount + " withdrawn. New balance: " + balance);
        } else {
            System.out.println("Invalid withdrawal amount.");
        }
    }

    // Instance method to check balance
    public double getBalance() {
        return balance;
    }

    // Static method to set the interest rate (shared by all accounts)
    public static void setInterestRate(double newRate) {
        if (newRate > 0) {
            interestRate = newRate;
            System.out.println("Interest rate updated to " + interestRate + "%.");
        } else {
            System.out.println("Invalid interest rate.");
        }
    }

    // Static method to get the current interest rate
    public static double getInterestRate() {
        return interestRate;
    }

}
```

---

# Bubble Sort

**Bubble Sort** is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The process is repeated until the list is sorted.

### Algorithm

1. Compare each pair of adjacent elements from the beginning of the array and, if they are in the wrong order, swap them.
2. Repeat the process for all elements except the last one.
3. Repeat the process for all elements except the last two.
4. Continue this until the array is sorted.

### Time Complexity

- **Best Case:** $O(n)$  (when the array is already sorted)
- **Average Case:** $O(n^2)$
- **Worst Case:**  $O(n^2)$

### Space Complexity

- **$O(1)$** (in-place sorting)

```java
 public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j + 1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            // If no two elements were swapped by inner loop, then break
            if (!swapped) {
                break;
            }
        }
    }
```

- **Outer loop**:
    - Runs `n-1` times (where `n` is the array length).
    - Ensures that each element "bubbles" to its correct position.
- **Inner loop**:
    - Compares adjacent elements (`arr[j]` and `arr[j + 1]`).
    - Swaps them if they are in the wrong order.
- **Swap logic**:
    - `int temp = arr[j]` stores the current element temporarily.
    - `arr[j] = arr[j + 1]` moves the next element to the current position.
    - `arr[j + 1] = temp` places the original element in the next position.
- **Optimization (swapped flag)**:
    - If no swaps occur during a pass, break out of the loop early (array is sorted).

---

# Linear Search

---

# Writing lambda expressions

- **Lambda expressions** in Java provide a concise way to represent a method (or function) as an object. They allow developers to write functional-style code without the boilerplate syntax of traditional anonymous classes.
    - Lambdas are especially useful when passing behavior (such as operations or logic) as parameters to methods or when performing operations on collections.
- **The general syntax of a lambda expression is:**
    
    ```java
    (parameter(s)) -> expression
    ```
    
    - **parameter(s)**: The input parameters (can be zero or more).
    - **expression**: The logic or body of the function, which can be a single expression or a block of code.
- **Functional Interface**: Lambda expressions can only be used with interfaces that have just one abstract method, known as functional interfaces. These interfaces can be found in the `java.util.function` package.
    - **Predicate**: Takes one argument and returns a boolean (`boolean test(T t)`).
    - **Consumer**: Takes one argument and returns no result (`void accept(T t)`).
    - **Supplier**: Takes no arguments and returns a result (`T get()`).
    - **Function**: Takes one argument and returns a result (`R apply(T t)`).
    - **BiFunction**: Takes two arguments and returns a result (`R apply(T t, U u)`).
- **No Parameters:**  A `Runnable` functional interface is implemented, and the lambda expression has no parameters.
    
    ```java
    Runnable r = () -> System.out.println("Hello, World!");
    r.run();  // Outputs: Hello, World!
    
    ```
    
- **One Parameter:** A `Consumer` interface is used, which accepts a single parameter (`String`) and performs an action (printing the string).
    
    ```java
    Consumer<String> print = str -> System.out.println(str);
    print.accept("Hello, Lambda!");  // Outputs: Hello, Lambda!
    ```
    
- **Multiple Parameters:**  A `BiFunction` functional interface is used, which takes two parameters (`a` and `b`) and returns their sum.
    
    ```java
    BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
    System.out.println(add.apply(3, 5));  // Outputs: 8
    ```
    
- **Block Body (Multiple Statements):** A `Function` interface is used, where the lambda expression has multiple statements inside a block.
    
    ```java
    Function<Integer, Integer> square = x -> {
        int result = x * x;
        return result;
    };
    System.out.println(square.apply(4));  // Outputs: 16
    ```
    
- **Returning a Value:** A `Supplier` interface is used, which doesn't take any arguments but returns a value (a string in this case).
    
    ```java
    Supplier<String> getMessage = () -> "Hello from Supplier!";
    System.out.println(getMessage.get());  // Outputs: Hello from Supplier!
    ```
    
- **Using Lambda with Collections:** Using the `forEach` method on a list with a lambda expression to print each name.
    
    ```java
    List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
    names.forEach(name -> System.out.println(name));
    
    ```
    
- **Key Points:**
    - **Functional Interfaces**: Lambda expressions in Java are used with functional interfaces (interfaces with a single abstract method).
    - **Simplification**: Lambda expressions make the code more concise and readable, especially for short, one-off implementations.
    - **Type Inference**: Java can infer the type of parameters in lambda expressions, so they are often shorter than traditional method implementations.

---

# All types of SQL joins

### Example Tables:

- **Table A (Employees)**:
    
    
    | id | name |
    | --- | --- |
    | 1 | Alice |
    | 2 | Bob |
    | 3 | Charlie |
- **Table B (Departments)**:
    
    
    | id | employee_id | department |
    | --- | --- | --- |
    | 1 | 1 | HR |
    | 2 | 2 | IT |
    | 3 | 4 | Marketing |

### 1. **INNER JOIN**

- **Returns**: Only the rows where there's a match in both tables.
    
    ```sql
    SELECT A.name, B.department
    FROM A
    INNER JOIN B ON A.id = B.employee_id;
    ```
    
- **Result**:
    
    
    | name | department |
    | --- | --- |
    | Alice | HR |
    | Bob | IT |

### 2. **LEFT JOIN (LEFT OUTER JOIN)**

- **Returns**: All rows from the left table and matched rows from the right table (NULL if no match).
    
    ```sql
    SELECT A.name, B.department
    FROM A
    LEFT JOIN B ON A.id = B.employee_id;
    ```
    
- **Result**:
    
    
    | name | department |
    | --- | --- |
    | Alice | HR |
    | Bob | IT |
    | Charlie | NULL |

### 3. **RIGHT JOIN (RIGHT OUTER JOIN)**

- **Returns**: All rows from the right table and matched rows from the left table (NULL if no match).
    
    ```sql
    SELECT A.name, B.department
    FROM A
    RIGHT JOIN B ON A.id = B.employee_id;
    ```
    
- **Result**:
    
    
    | name | department |
    | --- | --- |
    | Alice | HR |
    | Bob | IT |
    | NULL | Marketing |

### 4. **FULL JOIN (FULL OUTER JOIN)**

- **Returns**: All rows when there’s a match in either table, or NULL if no match.
    
    ```sql
    SELECT A.name, B.department
    FROM A
    FULL JOIN B ON A.id = B.employee_id;
    ```
    
- **Result**:
    
    
    | name | department |
    | --- | --- |
    | Alice | HR |
    | Bob | IT |
    | Charlie | NULL |
    | NULL | Marketing |

### 5. **CROSS JOIN**

- **Returns**: The Cartesian product of both tables (all possible combinations).
    
    ```sql
    SELECT A.name, B.department
    FROM A
    CROSS JOIN B;
    ```
    
- **Result**:
    
    
    | name | department |
    | --- | --- |
    | Alice | HR |
    | Alice | IT |
    | Alice | Marketing |
    | Bob | HR |
    | Bob | IT |
    | Bob | Marketing |
    | Charlie | HR |
    | Charlie | IT |
    | Charlie | Marketing |

---

# Spring Data JPA model class with annotations

```java
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.Table;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented ID
    @Column(name = "id") // Maps the id column
    private Long id;

    @Column(name = "name", nullable = false) // Maps the name column
    private String name;

    @Column(name = "email", unique = true, nullable = false) // Maps the email column
    private String email;

    @ManyToOne
    @JoinColumn(name = "department_id") // Foreign key reference to the Department table
    private Department department;

    // Constructors, getters, setters
    public Employee() {}

    public Employee(String name, String email, Department department) {
        this.name = name;
        this.email = email;
        this.department = department;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
```

---

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

    // Method to handle GET request to retrieve an employee by ID
    @GetMapping("/employee/{id}")
    public String getEmployee(@PathVariable("id") Long id, Model model) {
        // Retrieve the employee from the service layer
        Employee employee = employeeService.getEmployeeById(id);

        // Add employee to the model so it can be accessed in the view
        if (employee != null) {
            model.addAttribute("employee", employee);
            return "employeeDetails";  // Returns the view name (employeeDetails.html)
        } else {
            model.addAttribute("error", "Employee not found");
            return "error";  // Returns an error view if employee not found
        }
    }
}

```

---