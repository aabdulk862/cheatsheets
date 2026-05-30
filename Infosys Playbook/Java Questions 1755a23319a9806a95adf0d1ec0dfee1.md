# Java Questions

# What is the difference between JDK, JVM, & JRE?

![image.png](Java%20Questions/image.png)

- **JDK - Java Development Kit**
    - Provides tools to **write** and **compile** Java code.
    - Includes the **compiler** to convert Java code into bytecode for the **JVM**.
    - Contains **development tools**, **debugger**, **documentation tools**, and the **JRE**.
- **JRE - Java Runtime Environment**
    - Enables the **execution** of Java applications.
    - Includes **Java Class Libraries** for essential features.
    - Features a **class loader** to load classes into the **JVM**.
- **JVM - Java Virtual Machine**
    - Runs Java code in a consistent virtual environment across devices.
    - Includes the **JIT compiler** to translate bytecode into machine code during execution.
    - **Platform-specific**: Different JVMs for different operating systems.
- **JIT Compiler (Just-In-Time Compiler)**
    - Part of the JVM that improves performance by converting **bytecode** into **machine code** at runtime.
    - Identifies frequently executed code ("hotspots") and compiles it to machine code.
    - Optimizes execution by caching compiled code and applying runtime optimizations.

---

# What is Java Memory? Describe Stack and Heap

- In Java, memory is divided into two main areas: **stack** and **heap**. These structures serve different purposes in managing memory for an application.
- **Stack Memory**: Manages method calls and their associated local variables, including primitives and references to objects.
    - **LIFO (Last In, First Out)**: The last method pushed onto the stack must finish execution before the previous ones.
    - When a method is called, it is pushed onto the stack. When the method completes, it is popped off the stack.
    - **Main Method**: Always at the bottom of the stack; it starts the application and is the last to finish.
- **Heap Memory:** Stores all objects and their associated instance variables.
    - **Dynamic Memory**: Allocated at runtime.
    - **Object Storage**: Objects are stored in the heap, and reference variables in the stack point to these objects.
    - **String Pool**: A special region within the heap for storing unique String literals.
    - **Created** with the `new` keyword.
    - Without a reference variable, the object becomes eligible for garbage collection.
- **Garbage Collection:** Automatically reclaims memory by removing objects no longer referenced by the program.

---

# What are Wrapper classes?

- Wrapper classes in Java allow primitive types to be used as objects. Since primitives (e.g., `int`, `boolean`, `char`) are not objects, they do not have methods or associated class structures. Wrapper classes bridge this gap by providing object representations of primitives.
- Wrapper class objects are immutable, meaning their values cannot be changed once created.
- **Why Wrapper Classes Are Needed?**
    - Certain APIs and data structures like the **Collections Framework** only accept objects.
    - Wrapper classes provide useful methods for operations like  `parseX()`, `valueOf()`, and `toString()`.
- **Boxing**: The manual conversion of a primitive to its wrapper class.
    - **Autoboxing**: Java automatically converts a primitive into its wrapper class.
- **Unboxing**: The manual conversion of a wrapper class object back to its primitive type.
    - **Autounboxing**: Java automatically converts a wrapper class object to its primitive type.

---

# public static void main(String[] args){}

- The **main method** is the entry point of a Java application. It is where the execution of the program begins. The signature of the main method is:
    - **public**: Allows the method to be accessible from anywhere.
    - **static**: Means that it can be called without creating an instance of the class.
    - **void**: The method does not return any value.
    - **String[] args**: An array of `String` objects that can be passed as command-line arguments to the program.
- If the **main method** is not **static**, the program will compile but fail at runtime, throwing an error
    - The **JVM requires main to be static** so it can invoke it directly without creating an object of the class.
    - If it’s non-static, the JVM won’t know how to start the program since no instance of the class exists.
- The order of **`public static void main`** can be changed, as long as the keywords `public`, `static`, and `void` are present and in valid syntax.
    - The Java compiler allows flexibility in the order of modifiers (`public` and `static`) because their sequence doesn't affect functionality.
    - However, `void` must come before `main` since it specifies the return type of the method, and `main(String[] args)` must remain unchanged as it's the method signature required by the JVM.
    - The conventional order, `public static void main`, is preferred for readability and consistency with common Java coding standards.

---

# What is OOP? Elaborate on the four pillars

- **Abstraction:**  Hides implementation details from the user, focusing instead on what the method or class does, not how it does it.
    - **Key Idea**: Users only interact with the exposed behavior, not the internal workings.
- **Encapsulation:** Protects fields by restricting direct access and providing controlled access via getters and setters.
    - **Key Idea**: Wraps data (fields) and code (methods) into a single unit (class) and controls how the data is accessed or modified.
    - **How to Implement**:
        1. Use the `private` modifier for fields.
        2. Provide `public` getter and setter methods for controlled access.
- **Inheritance:** Enables a class (child) to inherit fields and methods from another class (parent).
    - **Key Idea**: Promotes code reuse and establishes a relationship between classes (e.g., Dog is a subclass of Animal).
    - **How to Implement**:
        1. Use the `extends` keyword for classes.
        2. Use the `implements` keyword for interfaces.
- **Polymorphism:** Allows entities like classes, methods, or objects to take on multiple forms.
    - **Method-based Polymorphism**:
        - **Overloading**: Same method name, different parameter lists.
        - **Overriding**: Same method name and signature, different implementation in a subclass.
    - **Object-based Polymorphism**: A parent type can reference objects of its child types.

---

# Relationship between Class and Object

- **Class**: A class is a blueprint that defines the properties (fields) and behaviors (methods) of objects but does not hold data itself.
- **Object**: An object is an instance of a class that holds specific data and can invoke methods defined in the class.
- **In short, a class defines "what," and an object is "how" it’s realized.**

**Key Points:**

1. **Blueprint and Instance**: A class is the design; objects are products created from that design.
    
    Example: `Car car1 = new Car();` creates an object of the `Car` class.
    
2. **Data and Behavior**: A class defines fields and methods, while an object stores specific values and performs actions.
3. **Multiple Objects**: A single class can create multiple objects with different states.
    
    Example: `Car car1` and `Car car2` can represent different cars.
    

---

# What is the role of a Constructor?

- A **constructor** is a special method used to initialize objects. It sets the initial state of an object by assigning values to its fields (variables).
    - **Example**: When creating an object for a `Car` class, the constructor might set the initial values for `color`, `make`, and `year`.
- **Default Constructor**: If no constructor is defined in a class, Java automatically provides a default constructor, known as the no-arguments (no-args) constructor. This constructor:
    - Takes no parameters.
    - Calls the constructor of the parent class (`super()`), which is often the `Object` class unless specified otherwise.
- **Custom Constructor**: If you define a constructor with parameters, the default no-args constructor is no longer available. You can define multiple constructors with different parameters (constructor overloading).

---

# **Abstract Class vs Interface**

- Both **interfaces** and **abstract classes** are used to define a contract for classes that implement or extend them, helping to establish consistent behavior. However, they differ in their structure and use cases.
- An **abstract class** serves as a blueprint for other classes. It can contain both abstract methods (methods without implementation) and concrete methods (methods with implementation).
    - **Abstract Methods**: These methods have no body and must be implemented by any concrete subclass.
    - **Concrete Methods**: These methods have a body and can be inherited by subclasses without needing to be overridden.
    - **Instantiation**: You cannot create an object of an abstract class directly. It must be extended by another class.
    - **Single Inheritance**: A class can extend only one abstract class.
    - **Use abstract classes** if you need to provide common behavior or shared functionality (i.e., concrete methods) and enforce that subclasses implement certain methods.
- An **interface** defines a contract that classes must follow. It only contains abstract methods (except in Java 8 and later, where it can contain default methods) and constants.
    - **Abstract Methods**: All methods in an interface are implicitly abstract (until Java 8+).
    - **Default Methods** (Java 8+): An interface can define concrete methods using the `default` keyword.
    - **Fields**: All fields in an interface are `public`, `static`, and `final` by default.
    - **Multiple Inheritance**: A class can implement multiple interfaces, which allows for a form of multiple inheritance in Java.
    - **Instantiation**: You cannot instantiate an interface. It must be implemented by a class.
    - **Use interfaces** when you want to define a contract that can be implemented by multiple classes, especially if those classes are unrelated. Interfaces are more flexible due to the ability to implement multiple interfaces.

---

# Overloading vs Overriding

- **Overloading** occurs when multiple methods in the same class have the same name but differ in the number, type, or order of their parameters.
    - Methods must have the same name.
    - Parameters must be different in number, type, or order.
    - Return type can be the same or different, but it does not distinguish overloaded methods.
    - Overloading happens at **compile-time**, which is why it's considered a **compile-time polymorphism** (or **static polymorphism**).
- **Overriding** occurs when a subclass provides a specific implementation of a method that is already defined in its superclass. The method signature (name, return type, and parameters) must be the same as in the parent class, but the method body (implementation) is different.
    - Methods must have the same name, return type, and parameters as the parent class.
    - The `@Override` annotation is often used to indicate that a method is overriding a method in the parent class (this helps prevent mistakes).
    - Overriding is **dynamic polymorphism** (or **runtime polymorphism**), meaning the method that gets called is determined at **runtime** based on the object type.
    - The `super` keyword can be used to call the parent class method if needed.

---

# **What is a singleton?**

- A **singleton** is a design pattern in which a class ensures that only **one instance** of itself is created and provides a global access point to that instance.
    - **Single Instance**: Ensures only one object is created for the entire application.
    - **Global Access**: The instance is accessible from anywhere in the program.
    - **Controlled Instantiation**: Prevents additional object creation by restricting constructors.
- **Database Connection Manager**
    - In an application, managing database connections is critical. A **singleton** can ensure there is only one connection pool for the entire application, avoiding resource overuse and ensuring consistent access.
- In Spring, **beans are singleton by default**, meaning a single instance of a bean is created and shared across the application context. This ensures efficient resource utilization and consistent behavior.
    - **Service Classes**: Shared services like authentication, logging, or configuration.
    - **DAO Layer**: Shared database access objects to ensure a consistent connectio

---

# Access Modifiers

- **Access Modifiers**: These determine the visibility and accessibility of the method to other classes.
    - **private**: Only accessible within the class.
    - **default**: Accessible within the same package (no modifier specified).
    - **protected**: Accessible within the same package and in subclasses.
    - **public**: Accessible from any class in the project.

---

# **Non-Access Modifiers**

- Methods can also have **non-access modifiers**, which provide additional behaviors or restrictions:
    - **static**: Indicates that the method belongs to the class itself, rather than to instances of the class. This allows the method to be called without creating an object of the class.
    - **final**: Prevents method overriding in subclasses. This is useful when you want to ensure that the behavior defined in the method cannot be changed.
    - **abstract**: Indicates that the method has no implementation in the current class and must be implemented by subclasses. An abstract method is part of an abstract class.

---

# What are the different scopes in java?

- In Java, the **scope** of a variable defines where that variable can be accessed or modified within the code. Understanding variable scopes is essential for managing memory, maintaining clean code, and avoiding unintended variable modifications.
- **Class (Static) Scope**
    - **Definition**: Static variables are declared using the `static` keyword within a class. These variables belong to the class itself, rather than to any specific instance (object) of the class.
    - **Behavior**: The value of a static variable is shared across all instances of the class. Any change made to this variable will reflect across all objects of the class.
- **Instance (Object) Scope**
    - **Definition**: Instance variables are non-static variables declared within a class. These variables are tied to a specific instance (object) of the class.
    - **Behavior**: Each object of the class has its own copy of these variables, and changes to the variable are specific to that particular object. Modifications to the instance variable do not affect other objects of the same class.
- **Method Scope**
    - **Definition**: Variables declared within a method (including method parameters) are accessible only within that method. These are considered **local variables** and are temporary, existing only while the method is executing.
    - **Behavior**: Once the method execution ends, the local variables are discarded.
- **Block Scope**
    - **Definition**: Variables declared inside a block of code (such as inside `if` statements, loops, or other control structures) are accessible only within that block. This is a more specific form of method scope.
    - **Behavior**: These variables are created and exist only during the execution of the block and are destroyed once the block finishes executing.
- **Static Variables**:
    - Declared with the `static` keyword.
    - Shared by all instances of the class.
    - Can be accessed directly using the class name (`ClassName.variable`).
- **Non-static (Instance) Variables**:
    - Belong to a specific instance of the class.
    - Each object has its own copy.
    - Must be accessed through an object (`object.variable`).

---

# **How do exceptions and errors differ?**

- **Errors** are serious issues that the application **cannot recover from**. These typically indicate a problem in the environment or system that requires fixing in the code or setup.
    - `OutOfMemoryError`: The JVM has run out of memory.
    - `StackOverflowError`: The stack is full, often due to excessive recursion.
- **Exceptions** are issues that the application **can recover from**, given proper handling.
    - **Checked Exceptions** (Compile time)
    - **Unchecked Exceptions** (Runtime)

---

# Tell me about the 2 different kinds of exceptions

- **Checked Exceptions** are exceptions the compiler enforces you to handle before running the program. They are **checked** during compile time.
    - `IOException`: Occurs when there's an issue with input/output operations, such as file reading/writing.
    - `FileNotFoundException`: Raised when trying to access a file that does not exist.
    - `ClassNotFoundException`: Raised when a specified class cannot be found.
- **Unchecked Exceptions** occur at runtime and are not checked by the compiler. They often indicate programming errors.
    - `ArithmeticException`: Division by zero or similar arithmetic issues.
    - `NullPointerException`: Trying to use an object reference that is `null`.
    - `ArrayIndexOutOfBoundsException`: Accessing an array with an invalid index.

---

# **How do you handle exceptions?**

- You handle exceptions in Java using **try-catch-finally blocks**:
    - **Try Block**: Code that might throw an exception is placed here.
    - **Catch Block**: Handles specific exceptions that occur in the try block. Multiple catch blocks can handle different exception types.
    - **Finally Block**: Optional. Runs after the try/catch, regardless of whether an exception occurred. Often used for cleanup tasks.

---

# **How to create custom exceptions?**

- You can create your own exceptions by extending the `Exception` or `RuntimeException` class.
- **Example of a Custom Exception:**
    
    ```java
    class CustomException extends Exception {
        public CustomException(String message) {
            super(message);
        }
    }
    ```
    
- **Throwing a Custom Exception:**
    
    ```java
    if (someCondition) {
        throw new CustomException("Custom error occurred");
    }
    ```
    
- **`throw`**: Used to **explicitly throw an exception** from within a method or block of code.
    - It creates an exception instance and transfers control to the nearest **catch block** or the calling method.
- **`throws`**: Used in the **method signature** to declare that a method **might throw** one or more exceptions.
    - It doesn’t throw the exception but **indicates** that the calling method should handle the exception.

---

# **Difference between `final` and `finally`**

- **`final`**
    - A **modifier** used to apply restrictions in Java.
    - Can be applied to variables, methods, and classes.
- **`finally`**
    - A **block of code** that is always executed after a try-catch block, whether an exception is thrown or not.
    - Used for **cleanup activities** such as closing resources (files, database connections).

---

# Collections API

- The Java **Collections Framework** is a set of interfaces and classes designed to store and manipulate groups of objects efficiently. It provides powerful tools for managing dynamic data structures like **Lists, Sets, Queues, and Maps**, offering features beyond the static, fixed-size nature of arrays.
    - **Iterable Interface**: The root of the hierarchy. Provides the ability to iterate over a collection.
    - **Collection Interface**: Extends `Iterable` and is implemented by most collections.
    - **Collections Class**: A utility class with static methods for sorting, searching, and modifying collections.
        
        ![image.png](Java%20Questions/image%201.png)
        
- **Key Questions for Choosing a Collection**
    1. Does the collection allow duplicates?
    2. Does the collection allow `null` values?
    3. Does the collection maintain insertion order?
    4. Does the collection support fast lookups?

---

# Data Structures

### **Lists**

- **Overview**: Ordered collection, supports duplicates and `null` values. Allows indexed access to elements.
    - **ArrayList**: Backed by a dynamic array, best for frequent read operations and appending elements. Slower for inserting or removing in the middle. Resizable dynamically.
        
        ```java
        import java.util.ArrayList;
        
        public class ArrayListExample {
            public static void main(String[] args) {
                ArrayList<String> names = new ArrayList<>();
                names.add("Alice");  // Add to the end
                names.add("Bob");
                System.out.println(names);  // Output: [Alice, Bob]
        
                names.add(1, "Charlie");  // Insert at index 1
                names.remove("Bob");      // Remove by value
                System.out.println(names);  // Output: [Alice, Charlie]
            }
        }
        ```
        
    - **LinkedList**: Backed by a doubly linked list. Suitable for frequent insertions or deletions in the middle, but slower for random access.
        
        ```java
        import java.util.LinkedList;
        
        public class LinkedListExample {
            public static void main(String[] args) {
                LinkedList<Integer> numbers = new LinkedList<>();
                numbers.addFirst(10);  // Add at the beginning
                numbers.add(20);       // Add at the end
                numbers.add(1, 15);    // Add at index 1
                numbers.removeFirst(); // Remove the first element
                System.out.println(numbers);  // Output: [15, 20]
            }
        }
        ```
        

### **Stacks**

- **Overview**: Follows the LIFO (Last In, First Out) principle. Used in scenarios like backtracking, recursion, and undo operations.
    - **Stack**: A legacy Java class that provides operations like `push()`, `pop()`, and `peek()`.
        
        ```java
        import java.util.Stack;
        
        public class StackExample {
            public static void main(String[] args) {
                Stack<Integer> stack = new Stack<>();
                stack.push(1);  // Push an element
                stack.push(2);
                System.out.println(stack.peek());  // Output: 2 (top of the stack)
                System.out.println(stack.pop());  // Output: 2 (removes top)
            }
        }
        ```
        
    - **LinkedList as a Stack**: You can use the `addFirst()` method to push elements onto the stack and `removeFirst()` or `peekFirst()` for popping or peeking, respectively. This leverages the doubly linked list's ability to efficiently add or remove elements at the head.
        
        ```java
        import java.util.LinkedList;
        
        public class LinkedListAsStackExample {
            public static void main(String[] args) {
                LinkedList<Integer> stack = new LinkedList<>();
        
                // Push elements onto the stack
                stack.addFirst(10);  // Add to the top
                stack.addFirst(20);
                stack.addFirst(30);
        
                System.out.println(stack);  // Output: [30, 20, 10]
        
                // Peek at the top element
                System.out.println("Top Element: " + stack.peekFirst());  // Output: 30
        
                // Pop elements from the stack
                System.out.println("Popped: " + stack.removeFirst());  // Output: 30
                System.out.println("Popped: " + stack.removeFirst());  // Output: 20
        
                System.out.println(stack);  // Output: [10]
            }
        }
        ```
        

### **Sets**

- **Overview**: Unordered collection, does not allow duplicates. At most one `null` element allowed (implementation-dependent).
    - **HashSet**: Uses a hash table for storage, providing fast operations (`O(1)` for add, remove, and contains). Does not maintain order.
        
        ```java
        import java.util.HashSet;
        
        public class HashSetExample {
            public static void main(String[] args) {
                HashSet<String> colors = new HashSet<>();
                colors.add("Red");
                colors.add("Blue");
                colors.add("Red");  // Duplicate, ignored
                System.out.println(colors);  // Output: [Red, Blue] (order not guaranteed)
            }
        }
        ```
        
    - **TreeSet**: Maintains elements in sorted order using a red-black tree. Slower than `HashSet`.
        
        ```java
        import java.util.TreeSet;
        
        public class TreeSetExample {
            public static void main(String[] args) {
                TreeSet<Integer> numbers = new TreeSet<>();
                numbers.add(30);
                numbers.add(10);
                numbers.add(20);
                System.out.println(numbers);  // Output: [10, 20, 30] (sorted order)
            }
        }
        ```
        

### **Queues**

- **Overview**: Follows FIFO (First In, First Out) principle, designed for ordered data processing.
    - **PriorityQueue**: Dequeues elements based on priority rather than insertion order. Default is natural ordering but can use custom comparators.
        
        ```java
        import java.util.PriorityQueue;
        
        public class PriorityQueueExample {
            public static void main(String[] args) {
                PriorityQueue<Integer> queue = new PriorityQueue<>();
                queue.add(30);
                queue.add(10);
                queue.add(20);
                System.out.println(queue.poll());  // Output: 10 (lowest priority removed first)
            }
        }
        ```
        
    - **LinkedList (as a Queue)**: Implements the `Queue` interface. Provides methods like `offer()` (add) and `poll()` (remove).
        
        ```java
        import java.util.LinkedList;
        
        public class LinkedListQueueExample {
            public static void main(String[] args) {
                LinkedList<String> queue = new LinkedList<>();
                queue.offer("Task1");  // Add to the queue
                queue.offer("Task2");
                System.out.println(queue.poll());  // Output: Task1 (FIFO behavior)
            }
        }
        ```
        

### **Maps**

- **Overview**: Stores data as key-value pairs. Keys must be unique, values can be duplicated. Allows fast retrieval by key.
    - **HashMap**: Backed by a hash table. Does not maintain order. Allows one `null` key and multiple `null` values.
        
        ```java
        import java.util.HashMap;
        
        public class HashMapExample {
            public static void main(String[] args) {
                HashMap<Integer, String> map = new HashMap<>();
                map.put(1, "Alice");
                map.put(2, "Bob");
                map.put(1, "Charlie");  // Overwrites value for key 1
                System.out.println(map);  // Output: {1=Charlie, 2=Bob}
            }
        }
        ```
        
    - **TreeMap**: Maintains keys in sorted order using a red-black tree. Useful when a sorted key set is required.
        
        ```java
        import java.util.TreeMap;
        
        public class TreeMapExample {
            public static void main(String[] args) {
                TreeMap<Integer, String> map = new TreeMap<>();
                map.put(2, "Bob");
                map.put(1, "Alice");
                map.put(3, "Charlie");
                System.out.println(map);  // Output: {1=Alice, 2=Bob, 3=Charlie} (keys sorted)
            }
        }
        ```
        
    - **Hashtable**: Synchronized version of `HashMap`. Does not allow `null` keys or values. Slower due to thread-safety.
        
        ```java
        import java.util.Hashtable;
        
        public class HashtableExample {
            public static void main(String[] args) {
                Hashtable<Integer, String> table = new Hashtable<>();
                table.put(1, "Alice");
                table.put(2, "Bob");
                System.out.println(table);  // Output: {1=Alice, 2=Bob}
        
                table.remove(2);  // Remove key 2
                System.out.println("After Removal: " + table);  // Output: {1=Alice}
            }
        }
        ```
        

---

# Array vs ArrayList

- **Array**:
    - Fixed size, defined at creation.
    - Can store both primitives and objects.
    - Faster for fixed-size data due to less overhead.
    - No additional utility methods (e.g., no `add`, `remove`, or `sort`).
    - More memory-efficient for static data.
    - Suitable when size and type are known and won't change.
- **ArrayList**:
    - Dynamic size, grows or shrinks as needed.
    - Can only store objects (primitives require wrapper classes through autoboxing).
    - Slightly slower due to resizing and dynamic memory allocation.
    - Offers utility methods like `add()`, `remove()`, and `size()`.
    - Requires extra memory for dynamic resizing.
    - Ideal when the collection size can change dynamically.

---

# How can I remove duplicate elements from a List?

1. **Using a `Set`**:
    - Convert the `List` to a `Set` (which does not allow duplicates), then back to a `List`.
    - **Example**:
        
        ```java
        import java.util.ArrayList;
        import java.util.HashSet;
        import java.util.List;
        import java.util.Set;
        
        public class RemoveDuplicates {
            public static void main(String[] args) {
                List<String> list = new ArrayList<>();
                list.add("A");
                list.add("B");
                list.add("A");
        
                Set<String> set = new HashSet<>(list);
                List<String> uniqueList = new ArrayList<>(set);
        
                System.out.println(uniqueList);  // Output: [A, B]
            }
        }
        ```
        
2. **Using `Stream` API**:
    - Use `distinct()` to filter out duplicates.
    - **Example**:
        
        ```java
        import java.util.ArrayList;
        import java.util.List;
        import java.util.stream.Collectors;
        
        public class RemoveDuplicates {
            public static void main(String[] args) {
                List<Integer> list = new ArrayList<>();
                list.add(1);
                list.add(2);
                list.add(1);
        
                List<Integer> uniqueList = list.stream().distinct().collect(Collectors.toList());
        
                System.out.println(uniqueList);  // Output: [1, 2]
            }
        }
        ```
        
3. **Using `List` Iteration**:
    - Iterate through the `List` and add elements to a `Set` while checking for duplicates.
    - **Example**:
        
        ```java
        import java.util.ArrayList;
        import java.util.HashSet;
        import java.util.List;
        import java.util.Set;
        
        public class RemoveDuplicates {
            public static void main(String[] args) {
                List<String> list = new ArrayList<>();
                list.add("A");
                list.add("B");
                list.add("A");
        
                Set<String> seen = new HashSet<>();
                List<String> uniqueList = new ArrayList<>();
        
                for (String item : list) {
        			       // Add returns false if element already exists
                    if (seen.add(item)) {  
                        uniqueList.add(item);
                    }
                }
        
                System.out.println(uniqueList);  // Output: [A, B]
            }
        }
        ```
        
4. **Using `LinkedHashSet`**:
    - A `LinkedHashSet` preserves insertion order while removing duplicates.
    - **Example**:
        
        ```java
        import java.util.ArrayList;
        import java.util.LinkedHashSet;
        import java.util.List;
        
        public class RemoveDuplicates {
            public static void main(String[] args) {
                List<String> list = new ArrayList<>();
                list.add("C");
                list.add("A");
                list.add("C");
        
                List<String> uniqueList = new ArrayList<>(new LinkedHashSet<>(list));
        
                System.out.println(uniqueList);  // Output: [C, A]
            }
        }
        ```
        

---

# HashTable vs HashMap?

- **HashTable**
    - **Thread-Safety**: Synchronized, meaning it is thread-safe and multiple threads can access it concurrently without additional synchronization. However, synchronization makes it slower.
    - **Nulls**: Does not allow `null` keys or values. Any attempt to insert `null` will result in a `NullPointerException`.
    - **Performance**: Slower than `HashMap` due to synchronization overhead, which makes it less suitable for single-threaded environments or high-performance needs.
    - **Iteration**: Uses `Enumeration` for iterating, which is part of the older API. `Enumeration` is considered outdated and less efficient than `Iterator`.
    - **Introduced**: Java 1.0, part of the legacy collection framework (`java.util` package). Considered outdated and is rarely used in modern Java programming.
- **HashMap**
    - **Thread-Safety**: Not synchronized, meaning it is not thread-safe by default. If thread safety is needed, external synchronization or `ConcurrentHashMap` should be used.
    - **Nulls**: Allows one `null` key and multiple `null` values.
    - **Performance**: Generally faster than `HashTable` due to the lack of synchronization overhead.
    - **Iteration**: Uses `Iterator` for iterating over elements, which is more modern and flexible compared to `Enumeration`.
    - **Introduced**: Java 1.2, part of the modern collections framework (`java.util` package).

---

# What is an Optional?

- **Optional** is a container object introduced in Java 8 that may or may not contain a value. It is used to avoid `NullPointerExceptions` by explicitly handling cases where a value might be absent.
    - **Empty or Present**: `Optional` can either contain a value (present) or be empty (no value).
    - **Avoid Null**: Helps to reduce the use of `null` and explicit null checks.
    - **Functional Style**: Supports functional operations like `map()`, `filter()`, and `ifPresent()`.
- **Common Methods:**
    - **`empty()`**: Returns an empty `Optional`.
    - **`of(T value)`**: Returns an `Optional` with a non-null value.
    - **`ofNullable(T value)`**: Returns an `Optional` that may contain a value or be empty.
    - **`get()`**: Retrieves the value, throws `NoSuchElementException` if absent.
    - **`isPresent()`**: Returns `true` if a value is present.
    - **`ifPresent(Consumer<? super T> action)`**: Executes an action if a value is present.
    - **`orElse(T other)`**: Returns the value if present, otherwise returns the provided default value.
- **Fetching an Entity from the Database**
    - **Repository**
        
        ```java
        import org.springframework.data.jpa.repository.JpaRepository;
        import java.util.Optional;
        
        public interface UserRepository extends JpaRepository<User, Long> {
            Optional<User> findByEmail(String email);
        }
        ```
        
        - `findByEmail(String email)` returns an `Optional<User>`.
        - This prevents `null` from being directly returned and ensures we handle the possibility of the user not being found.
    - **Service**
        
        ```java
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.stereotype.Service;
        
        @Service
        public class UserService {
        
            @Autowired
            private UserRepository userRepository;
        
            public String getUserFullNameByEmail(String email) {
                return userRepository.findByEmail(email)
                        .map(user -> user.getFirstName() + " " + user.getLastName())
                        .orElse("User not found");
            }
        }
        ```
        
        - The `map` function transforms the `Optional<User>` into the user’s full name.
        - The `orElse` method provides a fallback value if the `Optional` is empty (i.e., user not found).

---

# Garbage Collection

- **Purpose**: Automatically reclaims memory by removing objects no longer referenced by the program.
    - **Performance**: Prevents memory leaks by cleaning up unreferenced objects.
    - **Memory Management**: Frees heap space, ensuring the program runs efficiently.
- **Key Features**:
    - **Automatic**: Java handles memory cleanup behind the scenes.
    - **Eligibility**: An object becomes eligible for garbage collection when no reference variable points to it.
    - **Garbage Collection Trigger**: Suggested using `System.gc()`, but there’s no guarantee it will run immediately.
    - **Finalize Method**: Used by the garbage collector to perform cleanup before an object is removed from memory.
- Example
    
    ```java
    public class GarbageCollectionExample {
        public static void main(String[] args) {
            // Creating objects
            ExampleObject obj1 = new ExampleObject("Object 1");
            ExampleObject obj2 = new ExampleObject("Object 2");
    
            // Nullifying references
            obj1 = null; // obj1 is now eligible for garbage collection
    
            // Creating another object
            ExampleObject obj3 = new ExampleObject("Object 3");
    
            // Reassigning obj2
            obj2 = obj3; 
           // The original reference to "Object 2" is now eligible for garbage collection
    
            // Suggesting garbage collection
            System.gc(); // Suggest JVM to run garbage collection
    
            System.out.println("End of program.");
        }
    }
    
    class ExampleObject {
        private String name;
    
        public ExampleObject(String name) {
            this.name = name;
        }
    
        @Override
        protected void finalize() {
            System.out.println(name + " is being garbage collected.");
        }
    }
    ```
    

---

# How to compare (equate) two objects in Java?

- The `==` operator checks **reference equality**, meaning it checks if two references point to the same object in memory.
    - This is not suitable for comparing the content of two objects.
- The `equals()` method checks **content equality**, meaning it compares the actual values of the objects, not their memory addresses.
    - This method should be overridden in custom classes to define what it means for two objects to be equal.

---

# **Threads/Runnable**

- **Threads** allow a program to perform multiple tasks simultaneously, improving efficiency and responsiveness by running processes concurrently. This enables programs to handle long or complex tasks in the background without disrupting the main execution flow.
    - A **thread** is essentially a lightweight process that runs independently of other processes. In the context of the JVM, every Java program you run is executed by a thread.
- **Thread States in Java:**
    1. **New**: Thread is created but not yet started. Example: `Thread t = new Thread();`
    2. **Runnable**: Thread is ready to run or running, awaiting system resources.
    3. **Blocked**: Thread waits for a synchronized block or method due to resource or lock unavailability.
    4. **Waiting**: Thread indefinitely waits for another thread to perform a specific action (e.g., `wait()`).
    5. **Timed Waiting**: Thread waits for a specified time before resuming (e.g., `sleep(long millis)`).
    6. **Terminated**: Thread has completed execution and is no longer active.
- **Extend the `Thread` Class**:
    - Create a new class that extends the `Thread` class.
    - Override the `run()` method to define the code that will execute when the thread is started.
        
        ```java
        class MyThread extends Thread {
            public void run() {
                System.out.println("Thread is running");
            }
        }
        
        public class Main {
            public static void main(String[] args) {
                MyThread thread1 = new MyThread();
                thread1.start(); // Starting the thread
            }
        }
        ```
        
- **Implement the `Runnable` Interface**:
    - Create a new class that implements the `Runnable` interface.
    - Implement the `run()` method, which contains the code that will be executed by the thread.
    - This approach allows a class to extend other classes as well since Java supports only single inheritance.
        
        ```java
        class MyRunnable implements Runnable {
            public void run() {
                System.out.println("Thread is running");
            }
        }
        
        public class Main {
            public static void main(String[] args) {
                MyRunnable task = new MyRunnable();
                Thread thread1 = new Thread(task);
                thread1.start(); // Starting the thread
            }
        }
        ```
        

---

# **Lambdas/Functional Interfaces.**

- **Lambda expressions** in Java provide a concise way to represent a method (or function) as an object. They allow developers to write functional-style code without the boilerplate syntax of traditional anonymous classes.
    - Lambdas are especially useful when passing behavior (such as operations or logic) as parameters to methods or when performing operations on collections.
- **The general syntax of a lambda expression is:**
    
    ```java
    (parameter(s)) -> expression
    ```
    
    - **parameter(s)**: The input parameters (can be zero or more).
    - **expression**: The logic or body of the function, which can be a single expression or a block of code.
- **Functional Interface**: Lambda expressions can only be used with interfaces that have just one abstract method, known as functional interfaces. These interfaces can be found in the `java.util.function` package.

### **Common Functional Interfaces:**

1. **`Predicate<T>`**
    - Takes a parameter and returns a boolean.
    - **Use**: Filtering data based on conditions.
    - Example: Check if a string starts with "A":
        
        ```java
        Predicate<String> startsWithA = name -> name.startsWith("A");
        System.out.println(startsWithA.test("Alice")); // Output: true
        System.out.println(startsWithA.test("Bob"));   // Output: false
        ```
        
2. **`Function<T, R>`**
    - Takes a parameter of type `T` and returns a result of type `R`.
    - **Use**: Transforming data.
    - Example: Convert a string to uppercase:
        
        ```java
        Function<String, String> toUpperCase = s -> s.toUpperCase();
        System.out.println(toUpperCase.apply("hello")); // Output: HELLO
        ```
        
3. **`Consumer<T>`**
    - Takes a parameter and performs an operation, returning nothing (void).
    - **Use**: Side-effect operations like printing or updating state.
    - Example: Print the length of a string:
        
        ```java
        Consumer<String> printLength = name -> System.out.println(name.length());
        printLength.accept("Alice"); // Output: 5
        printLength.accept("Bob");   // Output: 3
        ```
        
4. **`Supplier<T>`**
    - Takes no parameters and returns a result of type `T`.
    - **Use**: Providing or generating data.
    - Example: Generate a random number:
        
        ```java
        Supplier<Double> randomNumber = () -> Math.random();
        System.out.println(randomNumber.get()); 
        // Output: A random number between 0.0 and 1.0
        ```
        
5. **`UnaryOperator<T>`**
    - A special `Function` where input and output types are the same.
    - **Use**: Operations on single values.
    - Example: Square an integer:
        
        ```java
        UnaryOperator<Integer> square = n -> n * n;
        System.out.println(square.apply(5)); // Output: 25
        ```
        
    

---

# **What is the Reflection API?**

- The **Reflection API** in Java is a powerful tool that allows you to inspect and manipulate classes, methods, fields, constructors, and more at runtime. It is part of the `java.lang.reflect` package and is commonly used when you need to:
    1. **Inspecting Class Structure**:
        
        Reflection allows you to inspect a class's methods, fields, constructors, and its inheritance structure at runtime.
        
        - **Methods**: Retrieve method details (parameters, return types).
        - **Fields**: Access field types and values.
        - **Constructors**: Inspect and invoke constructors.
        - **Inheritance**: Obtain information about a class's superclass and implemented interfaces.
    2. **Dynamically Creating Instances**:
        
        Reflection allows you to create class instances dynamically at runtime.
        
        ```java
        Class<?> cls = Class.forName("com.example.MyClass");
        Object obj = cls.getDeclaredConstructor().newInstance();
        ```
        
    3. **Invoking Methods Dynamically**:
        
        Reflection enables method invocation without knowing them at compile time.
        
        ```java
        Method method = obj.getClass().getMethod("methodName");
        method.invoke(obj);
        ```
        
    4. **Modifying Field Values**:
        
        You can access and modify fields, even private ones, at runtime.
        
        ```java
        Field field = obj.getClass().getDeclaredField("fieldName");
        field.setAccessible(true);  // Allow access to private fields
        field.set(obj, newValue);
        ```
        
- **Advantages**:
    - Reflection is powerful for frameworks, dependency injection, and dynamic behavior.
    - It allows you to write code that can adapt to different classes and objects at runtime.
- **Cautions**:
    - **Performance Overhead**: Reflection can be slower than normal code due to the additional processing required.
    - **Security Risks**: It can bypass normal access control (e.g., private methods and fields), which can be a security risk.
    - **Complexity**: Overusing reflection can lead to code that’s harder to understand and maintain, as it bypasses compile-time checks.

---

# **What is method reference syntax?**

- In Java, **method references** provide a shorthand notation for invoking methods through lambda expressions. They allow for more concise and readable code when you already have a method that matches the signature of a functional interface.
    - `ClassName::methodName`
- **Reference to a static method**:
    - **Syntax**: `ClassName::staticMethodName`
        
        ```java
        class MathOperations {
            public static int square(int x) {
                return x * x;
            }
        }
        
        public class Main {
            public static void main(String[] args) {
                Function<Integer, Integer> squareFunc = MathOperations::square;
                System.out.println(squareFunc.apply(5));  // Output: 25
            }
        }
        ```
        
- **Reference to an instance method of a specific object**:
    - **Syntax**: `instance::instanceMethodName`
        
        ```java
        class Printer {
            public void printMessage(String message) {
                System.out.println(message);
            }
        }
        
        public class Main {
            public static void main(String[] args) {
                Printer printer = new Printer();
                Consumer<String> printFunc = printer::printMessage;
                printFunc.accept("Hello, World!");  // Output: Hello, World!
            }
        }
        ```
        
- **Reference to an instance method of an arbitrary object of a particular type**:
    - Syntax: `ClassName::instanceMethodName`
        
        ```java
        java
        Copy code
        class StringOperations {
            public int compareLength(String s1, String s2) {
                return s1.length() - s2.length();
            }
        }
        
        public class Main {
            public static void main(String[] args) {
                Comparator<String> comparator = String::compareToIgnoreCase;
                System.out.println(comparator.compare("apple", "banana"));  // Output: negative value
            }
        }
        
        ```
        
- **Reference to a constructor**:
    - Syntax: `ClassName::new`
        
        ```java
        class Person {
            String name;
            Person(String name) {
                this.name = name;
            }
        }
        
        public class Main {
            public static void main(String[] args) {
                Supplier<Person> personSupplier = Person::new;
                Person person = personSupplier.get();
            }
        }
        ```
        

---

# **What are streams?**

- Streams provide a powerful and flexible way to process sequences of elements, like those in a collection, file, or array. They allow you to perform various operations on data without modifying the original data source.
    - **Streams do not store data**: They process data from a source (like a file or data structure) and perform operations on it.
    - **Streams do not change the original data**: Instead, they transform the data and return a result.
    - **Streams operate lazily**, meaning intermediate operations are only executed when a terminal operation is invoked.
- Streams are composed of two types of operations: **Intermediate Operations** and **Terminal Operations**.

---

# **Intermediate vs Terminal Operations**

- **Intermediate Operations:** transform a stream into another stream. They do not trigger the processing of elements until a terminal operation is invoked.
    - **map()**: Applies a function to each element of the stream.
        
        **Example**: Converting a list of integers to their squares:
        
        ```java
        List<Integer> squaredList = numbers.stream().map(x -> x * x).collect(Collectors.toList());
        ```
        
    - **filter()**: Filters elements of the stream based on a given condition.
        
        **Example**: Filtering out even numbers:
        
        ```java
        List<Integer> evenList = numbers.stream().filter(x -> x % 2 == 0).collect(Collectors.toList());
        ```
        
    - **sorted()**: Sorts the elements in their natural order or using a custom comparator.
        
        **Example**: Sorting a list of strings alphabetically:
        
        ```java
        List<String> sortedList = strings.stream().sorted().collect(Collectors.toList());
        ```
        
- **Terminal Operations:** produce a final result, and once invoked, they terminate the stream pipeline.
    - **collect()**: Collects the elements of the stream into a specific collection (like List, Set, etc.).
        
        **Example**: Collecting elements into a List:
        
        ```java
        List<Integer> collectedList = numbers.stream().collect(Collectors.toList());
        ```
        
    - **toList()**: A shortcut method for collecting stream elements into a list.
        
        **Example**:
        
        ```java
        List<String> list = stream.toList();
        ```
        
    - **findFirst()**: Returns the first element of the stream.
        
        **Example**:
        
        ```java
        Optional<Integer> first = numbers.stream().findFirst();
        ```
        
    - **forEach()**: Performs a given action on each element and then terminates the stream.
        
        **Example**: Printing each element of the stream:
        
        ```java
        numbers.stream().forEach(System.out::println)
        ```
        
    - **average()**: Returns the average of the elements in the stream (useful for numerical data).
        
        **Example**:
        
        ```java
        OptionalDouble avg = numbers.stream().mapToInt(Integer::intValue).average();
        ```
        
    - **reduce()**: Reduces the elements to a single value using an associative accumulation function.
        
        **Example**: Summing elements in the stream:
        
        ```java
        int sum = numbers.stream().reduce(0, (a, b) -> a + b);
        ```
        

---

# **What is unit testing? How do we do it in Java?**

- **Unit testing** is a software testing technique where individual units or components of a software are tested in isolation from the rest of the application. The goal is to verify that each unit functions correctly.
    - **Automates testing**: Ensures functionality is verified regularly.
    - **Improves code quality**: Detects bugs early, supports regression testing.
- **How to Perform Unit Testing:**
    1. **JUnit Framework**: Use JUnit for writing and running tests.
    2. **Steps**:
        - **Add JUnit Dependency** (in `pom.xml` for Maven or `build.gradle` for Gradle).
        - **Create Test Class**: Write test methods marked with `@Test`.
        - **Assertions**: Use methods like `assertEquals` to validate results.
    3. **Example**:
        
        ```java
        import static org.junit.jupiter.api.Assertions.*;
        import org.junit.jupiter.api.Test;
        
        public class CalculatorTest {
            public int add(int a, int b) {
                return a + b;
            }
        
            @Test
            public void testAdd() {
                assertEquals(5, add(2, 3));
            }
        }
        ```
        
    4. **Running Tests**: Run tests through an IDE or via commands (`mvn test`, `gradle test`).

---

# **How do you write logs in Java?**

- A **logger** is an object in a logging framework that allows an application to record log messages. It helps track events during the execution of an application for debugging, monitoring, and auditing purposes.
    - **Logging Levels**: Loggers categorize messages by severity, such as `DEBUG`, `INFO`, `WARN`, `ERROR`, or `FATAL`.
    - **Loggers in Frameworks**: Loggers are used in logging libraries (like `java.util.logging`, Log4j, SLF4J) to output messages to various destinations (console, file, database).
    - **Logger Configuration**: You can configure loggers to specify what level of messages to record, where to store the logs, and the format of the logs.
- In Java, logging is typically done using the **`java.util.logging`** package or external libraries like **Log4j** or **SLF4J**. Here's a concise overview of how to write logs in Java using these methods:
- **Using Java Util Logging:**
    1. **Setup Logger**:
        
        ```java
        import java.util.logging.*;
        
        public class LoggerExample {
            private static final Logger logger = Logger.getLogger(LoggerExample.class.getName());
        
            public static void main(String[] args) {
                logger.info("This is an info log.");
                logger.warning("This is a warning log.");
                logger.severe("This is an error log.");
            }
        }
        
        ```
        
- **Using Log4j (more powerful, widely used):**
    1. **Add dependency (Maven)**:
        
        ```xml
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>2.x</version>
        </dependency>
        ```
        
    2. **Create Logger**:
        
        ```java
        import org.apache.logging.log4j.LogManager;
        import org.apache.logging.log4j.Logger;
        
        public class Log4jExample {
            private static final Logger logger = LogManager.getLogger(Log4jExample.class);
        
            public static void main(String[] args) {
                logger.info("Info log");
                logger.error("Error log");
            }
        }
        ```
        

---