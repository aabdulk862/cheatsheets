---
title: "Java"
order: 1
lang: "java"
---

# What is the difference between JDK, JVM, & JRE?

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

# What are Wrapper classes?

- Wrapper classes in Java allow primitive types to be used as objects. Since primitives (e.g., `int`, `boolean`, `char`) are not objects, they do not have methods or associated class structures. Wrapper classes bridge this gap by providing object representations of primitives.
- Wrapper class objects are immutable, meaning their values cannot be changed once created.
- **Why Wrapper Classes Are Needed?**
    - Certain APIs and data structures like the **Collections Framework** only accept objects.
    - Wrapper classes provide useful methods for operations like `parseX()`, `valueOf()`, and `toString()`.
- **Boxing**: The manual conversion of a primitive to its wrapper class.
    - **Autoboxing**: Java automatically converts a primitive into its wrapper class.
- **Unboxing**: The manual conversion of a wrapper class object back to its primitive type.
    - **Autounboxing**: Java automatically converts a wrapper class object to its primitive type.

# public static void main(String[] args){}

- The **main method** is the entry point of a Java application. It is where the execution of the program begins. The signature of the main method is:
    - **public**: Allows the method to be accessible from anywhere.
    - **static**: Means that it can be called without creating an instance of the class.
    - **void**: The method does not return any value.
    - **String[] args**: An array of `String` objects that can be passed as command-line arguments to the program.
- If the **main method** is not **static**, the program will compile but fail at runtime, throwing an error.
    - The **JVM requires main to be static** so it can invoke it directly without creating an object of the class.
    - If it's non-static, the JVM won't know how to start the program since no instance of the class exists.

# What is OOP? Elaborate on the four pillars

- **Abstraction:** Hides implementation details from the user, focusing instead on what the method or class does, not how it does it.
    - **Key Idea**: Users only interact with the exposed behavior, not the internal workings.
- **Encapsulation:** Protects fields by restricting direct access and providing controlled access via getters and setters.
    - **Key Idea**: Wraps data (fields) and code (methods) into a single unit (class) and controls how the data is accessed or modified.
    - **How to Implement**:
        1. Use the `private` modifier for fields.
        2. Provide `public` getter and setter methods for controlled access.
- **Inheritance:** Enables a class (child) to inherit fields and methods from another class (parent).
    - **Key Idea**: Promotes code reuse and establishes a relationship between classes.
    - **How to Implement**:
        1. Use the `extends` keyword for classes.
        2. Use the `implements` keyword for interfaces.
- **Polymorphism:** Allows entities like classes, methods, or objects to take on multiple forms.
    - **Method-based Polymorphism**:
        - **Overloading**: Same method name, different parameter lists.
        - **Overriding**: Same method name and signature, different implementation in a subclass.
    - **Object-based Polymorphism**: A parent type can reference objects of its child types.

# Relationship between Class and Object

- **Class**: A class is a blueprint that defines the properties (fields) and behaviors (methods) of objects but does not hold data itself.
- **Object**: An object is an instance of a class that holds specific data and can invoke methods defined in the class.
- **In short, a class defines "what," and an object is "how" it's realized.**

# What is the role of a Constructor?

- A **constructor** is a special method used to initialize objects. It sets the initial state of an object by assigning values to its fields (variables).
- **Default Constructor**: If no constructor is defined in a class, Java automatically provides a default constructor (no-args constructor). This constructor takes no parameters and calls the constructor of the parent class (`super()`).
- **Custom Constructor**: If you define a constructor with parameters, the default no-args constructor is no longer available. You can define multiple constructors with different parameters (constructor overloading).

# Abstract Class vs Interface

- Both **interfaces** and **abstract classes** are used to define a contract for classes that implement or extend them.
- An **abstract class** serves as a blueprint for other classes. It can contain both abstract methods (without implementation) and concrete methods (with implementation).
    - **Single Inheritance**: A class can extend only one abstract class.
    - **Use abstract classes** if you need to provide common behavior or shared functionality and enforce that subclasses implement certain methods.
- An **interface** defines a contract that classes must follow. It only contains abstract methods (except in Java 8+, where it can contain default methods) and constants.
    - **Multiple Inheritance**: A class can implement multiple interfaces.
    - **Use interfaces** when you want to define a contract that can be implemented by multiple unrelated classes.

# Overloading vs Overriding

- **Overloading** occurs when multiple methods in the same class have the same name but differ in the number, type, or order of their parameters.
    - Overloading happens at **compile-time** (static polymorphism).
- **Overriding** occurs when a subclass provides a specific implementation of a method already defined in its superclass.
    - Overriding is **dynamic polymorphism** (runtime polymorphism), meaning the method called is determined at runtime based on the object type.
    - The `@Override` annotation is used to indicate overriding.
    - The `super` keyword can be used to call the parent class method.

# What is a singleton?

- A **singleton** is a design pattern in which a class ensures that only **one instance** of itself is created and provides a global access point to that instance.
    - **Single Instance**: Ensures only one object is created for the entire application.
    - **Global Access**: The instance is accessible from anywhere in the program.
    - **Controlled Instantiation**: Prevents additional object creation by restricting constructors.
- In Spring, **beans are singleton by default**, meaning a single instance of a bean is created and shared across the application context.

# Access Modifiers

- **Access Modifiers** determine the visibility and accessibility of the method to other classes.
    - **private**: Only accessible within the class.
    - **default**: Accessible within the same package (no modifier specified).
    - **protected**: Accessible within the same package and in subclasses.
    - **public**: Accessible from any class in the project.

# Non-Access Modifiers

- Methods can also have **non-access modifiers**, which provide additional behaviors or restrictions:
    - **static**: Indicates that the method belongs to the class itself, rather than to instances of the class.
    - **final**: Prevents method overriding in subclasses.
    - **abstract**: Indicates that the method has no implementation in the current class and must be implemented by subclasses.

# What are the different scopes in java?

- In Java, the **scope** of a variable defines where that variable can be accessed or modified within the code.
- **Class (Static) Scope**: Static variables are declared using the `static` keyword. The value is shared across all instances of the class.
- **Instance (Object) Scope**: Instance variables are non-static variables tied to a specific instance. Each object has its own copy.
- **Method Scope**: Variables declared within a method are accessible only within that method (local variables).
- **Block Scope**: Variables declared inside a block (e.g., `if` statements, loops) are accessible only within that block.

# How do exceptions and errors differ?

- **Errors** are serious issues that the application **cannot recover from**.
    - `OutOfMemoryError`: The JVM has run out of memory.
    - `StackOverflowError`: The stack is full, often due to excessive recursion.
- **Exceptions** are issues that the application **can recover from**, given proper handling.
    - **Checked Exceptions** (Compile time)
    - **Unchecked Exceptions** (Runtime)

# Tell me about the 2 different kinds of exceptions

- **Checked Exceptions** are exceptions the compiler enforces you to handle before running the program. They are checked during compile time.
    - `IOException`, `FileNotFoundException`, `ClassNotFoundException`
- **Unchecked Exceptions** occur at runtime and are not checked by the compiler. They often indicate programming errors.
    - `ArithmeticException`, `NullPointerException`, `ArrayIndexOutOfBoundsException`

# How do you handle exceptions?

- You handle exceptions in Java using **try-catch-finally blocks**:
    - **Try Block**: Code that might throw an exception is placed here.
    - **Catch Block**: Handles specific exceptions that occur in the try block.
    - **Finally Block**: Optional. Runs after the try/catch, regardless of whether an exception occurred. Often used for cleanup tasks.

# How to create custom exceptions?

- You can create your own exceptions by extending the `Exception` or `RuntimeException` class.

```java
class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }
}
```

- **`throw`**: Used to explicitly throw an exception from within a method or block of code.
- **`throws`**: Used in the method signature to declare that a method might throw one or more exceptions.

# Difference between final and finally

- **`final`**: A modifier used to apply restrictions. Can be applied to variables, methods, and classes.
- **`finally`**: A block of code that is always executed after a try-catch block, whether an exception is thrown or not. Used for cleanup activities.

# Collections API

- The Java **Collections Framework** is a set of interfaces and classes designed to store and manipulate groups of objects efficiently. It provides tools for managing dynamic data structures like **Lists, Sets, Queues, and Maps**.
    - **Iterable Interface**: The root of the hierarchy. Provides the ability to iterate over a collection.
    - **Collection Interface**: Extends `Iterable` and is implemented by most collections.
    - **Collections Class**: A utility class with static methods for sorting, searching, and modifying collections.
- **Key Questions for Choosing a Collection**:
    1. Does the collection allow duplicates?
    2. Does the collection allow `null` values?
    3. Does the collection maintain insertion order?
    4. Does the collection support fast lookups?

# Data Structures

## Lists

- **Overview**: Ordered collection, supports duplicates and `null` values. Allows indexed access.
    - **ArrayList**: Backed by a dynamic array, best for frequent read operations. Resizable dynamically.
    - **LinkedList**: Backed by a doubly linked list. Suitable for frequent insertions or deletions.

```java
import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add(1, "Charlie");
        names.remove("Bob");
        System.out.println(names);  // Output: [Alice, Charlie]
    }
}
```

## Stacks

- **Overview**: Follows the LIFO (Last In, First Out) principle. Used in backtracking, recursion, and undo operations.

```java
import java.util.Stack;

public class StackExample {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(1);
        stack.push(2);
        System.out.println(stack.peek());  // Output: 2
        System.out.println(stack.pop());   // Output: 2
    }
}
```

## Sets

- **Overview**: Unordered collection, does not allow duplicates.
    - **HashSet**: Uses a hash table, fast operations (`O(1)`). Does not maintain order.
    - **TreeSet**: Maintains elements in sorted order using a red-black tree.

```java
import java.util.HashSet;

public class HashSetExample {
    public static void main(String[] args) {
        HashSet<String> colors = new HashSet<>();
        colors.add("Red");
        colors.add("Blue");
        colors.add("Red");  // Duplicate, ignored
        System.out.println(colors);  // Output: [Red, Blue]
    }
}
```

## Queues

- **Overview**: Follows FIFO (First In, First Out) principle.
    - **PriorityQueue**: Dequeues elements based on priority rather than insertion order.

```java
import java.util.PriorityQueue;

public class PriorityQueueExample {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.add(30);
        queue.add(10);
        queue.add(20);
        System.out.println(queue.poll());  // Output: 10
    }
}
```

## Maps

- **Overview**: Stores data as key-value pairs. Keys must be unique, values can be duplicated.
    - **HashMap**: Does not maintain order. Allows one `null` key and multiple `null` values.
    - **TreeMap**: Maintains keys in sorted order.
    - **Hashtable**: Synchronized, does not allow `null` keys or values.

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

# Array vs ArrayList

- **Array**: Fixed size, can store both primitives and objects, faster for fixed-size data, no utility methods.
- **ArrayList**: Dynamic size, can only store objects (autoboxing for primitives), offers utility methods like `add()`, `remove()`, and `size()`.

# How can I remove duplicate elements from a List?

1. **Using a `Set`**: Convert the `List` to a `Set` then back to a `List`.
2. **Using `Stream` API**: Use `distinct()` to filter duplicates.
3. **Using `LinkedHashSet`**: Preserves insertion order while removing duplicates.

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "A"));
Set<String> set = new HashSet<>(list);
List<String> uniqueList = new ArrayList<>(set);
```

```java
List<Integer> uniqueList = list.stream().distinct().collect(Collectors.toList());
```

# HashTable vs HashMap?

- **HashTable**: Thread-safe (synchronized), does not allow `null` keys or values, slower, uses `Enumeration`, introduced in Java 1.0.
- **HashMap**: Not synchronized, allows one `null` key and multiple `null` values, faster, uses `Iterator`, introduced in Java 1.2.

# What is an Optional?

- **Optional** is a container object introduced in Java 8 that may or may not contain a value. Used to avoid `NullPointerExceptions`.
- **Common Methods**: `empty()`, `of(T value)`, `ofNullable(T value)`, `get()`, `isPresent()`, `ifPresent()`, `orElse(T other)`

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

```java
public String getUserFullNameByEmail(String email) {
    return userRepository.findByEmail(email)
            .map(user -> user.getFirstName() + " " + user.getLastName())
            .orElse("User not found");
}
```

# Garbage Collection

- **Purpose**: Automatically reclaims memory by removing objects no longer referenced by the program.
- **Key Features**:
    - **Automatic**: Java handles memory cleanup behind the scenes.
    - **Eligibility**: An object becomes eligible for garbage collection when no reference variable points to it.
    - **`System.gc()`**: Suggests garbage collection, but no guarantee it will run immediately.

```java
public class GarbageCollectionExample {
    public static void main(String[] args) {
        ExampleObject obj1 = new ExampleObject("Object 1");
        ExampleObject obj2 = new ExampleObject("Object 2");
        obj1 = null; // obj1 is now eligible for garbage collection
        ExampleObject obj3 = new ExampleObject("Object 3");
        obj2 = obj3; // Original "Object 2" is now eligible for GC
        System.gc();
    }
}
```

# How to compare (equate) two objects in Java?

- The `==` operator checks **reference equality** — whether two references point to the same object in memory.
- The `equals()` method checks **content equality** — compares the actual values of the objects. Should be overridden in custom classes.

# Threads/Runnable

- **Threads** allow a program to perform multiple tasks simultaneously.
- **Thread States**: New, Runnable, Blocked, Waiting, Timed Waiting, Terminated.
- **Two ways to create threads**:

```java
// Extend Thread class
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
}

// Implement Runnable interface
class MyRunnable implements Runnable {
    public void run() {
        System.out.println("Thread is running");
    }
}
```

# Lambdas/Functional Interfaces

- **Lambda expressions** provide a concise way to represent a method as an object.
- **Syntax**: `(parameter(s)) -> expression`
- **Common Functional Interfaces**:

```java
// Predicate - takes parameter, returns boolean
Predicate<String> startsWithA = name -> name.startsWith("A");

// Function - takes parameter, returns result
Function<String, String> toUpperCase = s -> s.toUpperCase();

// Consumer - takes parameter, returns nothing
Consumer<String> printLength = name -> System.out.println(name.length());

// Supplier - takes nothing, returns result
Supplier<Double> randomNumber = () -> Math.random();
```

# What is the Reflection API?

- The **Reflection API** allows you to inspect and manipulate classes, methods, fields, constructors at runtime. Part of `java.lang.reflect`.

```java
Class<?> cls = Class.forName("com.example.MyClass");
Object obj = cls.getDeclaredConstructor().newInstance();

Method method = obj.getClass().getMethod("methodName");
method.invoke(obj);

Field field = obj.getClass().getDeclaredField("fieldName");
field.setAccessible(true);
field.set(obj, newValue);
```

- **Cautions**: Performance overhead, security risks, increased complexity.

# What is method reference syntax?

- **Method references** provide shorthand notation for invoking methods through lambda expressions.
- **Syntax**: `ClassName::methodName`

```java
// Static method reference
Function<Integer, Integer> squareFunc = MathOperations::square;

// Instance method reference
Consumer<String> printFunc = printer::printMessage;

// Constructor reference
Supplier<Person> personSupplier = Person::new;
```

# What are streams?

- Streams provide a powerful way to process sequences of elements. They allow operations on data without modifying the original data source.
    - Streams do not store data
    - Streams do not change the original data
    - Streams operate lazily — intermediate operations execute only when a terminal operation is invoked

# Intermediate vs Terminal Operations

- **Intermediate Operations** transform a stream into another stream (lazy):

```java
// map - applies function to each element
List<Integer> squared = numbers.stream().map(x -> x * x).collect(Collectors.toList());

// filter - filters based on condition
List<Integer> even = numbers.stream().filter(x -> x % 2 == 0).collect(Collectors.toList());

// sorted - sorts elements
List<String> sorted = strings.stream().sorted().collect(Collectors.toList());
```

- **Terminal Operations** produce a final result:

```java
// collect - collects into a collection
List<Integer> list = numbers.stream().collect(Collectors.toList());

// forEach - performs action on each element
numbers.stream().forEach(System.out::println);

// reduce - reduces to single value
int sum = numbers.stream().reduce(0, (a, b) -> a + b);
```

# What is unit testing? How do we do it in Java?

- **Unit testing** verifies that individual units or components function correctly in isolation.
- **JUnit Framework** is used for writing and running tests in Java.

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

# How do you write logs in Java?

- Logging is done using `java.util.logging`, **Log4j**, or **SLF4J**.

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
