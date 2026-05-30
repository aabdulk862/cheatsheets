---
title: "Spring"
order: 2
lang: "java"
---

# What is Spring?

- **Spring** is an open-source **Java framework** designed to simplify the development of enterprise-scale applications.
    - **Eliminates Boilerplate Code**: Automatically handles object creation, dependency injection (DI), and wiring.
    - **Configuration Made Easy**: Annotations reduce verbose XML configurations.
    - **Scalable Architecture**: Modular structure ensures seamless integration of new functionalities.
- **Key Concepts in Spring Framework**:
    - **Dependency Injection (DI)**: Automatic injection of object dependencies.
    - **Inversion of Control (IoC) Container**: Central to managing object lifecycles.
    - **Spring Beans**: Objects managed by the IoC container.
    - **Bean Wiring**: Configuring relationships between beans.
- **Spring Modules**: Core components of the Spring Framework
    - **Spring Core**: Provides DI and IoC functionality.
    - **Spring AOP**: Enables Aspect-Oriented Programming for cross-cutting concerns.
    - **Spring MVC**: Simplifies web and RESTful application development.
- **Spring Projects**: Extensions built on top of the Spring Framework:
    - **Spring Boot**: Simplifies setup with defaults, embedded servers, and production-ready tools.
    - **Spring Security**: Manages authentication and authorization.
    - **Spring Data**: Simplifies database operations with repositories.

# What is Spring Boot?

- **Spring Boot** is a project under the Spring framework that simplifies the setup and deployment of Spring-based applications.
- **Key Features and Benefits**:
    - **Embedded Web Server**: Built-in servers like Tomcat, Jetty, or Undertow.
    - **Simplified Configuration**: Uses `application.properties` or `application.yml`.
    - **Starter Dependencies**: Pre-configured dependencies for common functionalities.
    - **Spring Boot Actuator**: Production-ready features like health checks and metrics.
    - **DevTools**: Automatic server restarts and live reload on code changes.
    - **Opinionated Defaults**: Ready-to-use configurations based on best practices.

# What is Spring Initializer?

- **Spring Initializer** is a web-based tool to bootstrap and create a new Spring Boot project quickly.
- **Customizable Project Setup**: Choose Maven or Gradle, Java version, packaging (JAR or WAR).
- **Dependency Selection**: Easily add dependencies like Spring Web, Spring Data, Spring Security.
- **Code Generation**: Generates a pre-configured project structure.
- **IDE Integration**: Accessible from IntelliJ IDEA, Eclipse, or VS Code.

# How would you set up a Spring Boot project?

1. **Spring Initializer**: Go to start.spring.io, configure project details, download ZIP.
2. **Import Project in IDE**: Open `pom.xml` or `build.gradle`.
3. **Configure Properties**:

```java
// application.properties
// server.port=8080
// spring.datasource.url=jdbc:mysql://localhost:3306/mydb
```

4. **Write Code**: Create Main Application Class, define Controllers, Services, Repositories.

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

5. **Run and Test**:

```java
@RestController
@GetMapping("/hello")
public String hello() {
    return "Hello, Spring Boot!";
}
```

# What are Spring Beans?

- **Spring Beans** are objects managed by the **Spring IoC Container**.
- **Bean Lifecycle**: Managed by the Spring container — created on startup, destroyed on shutdown.
- **How to Define Spring Beans:**
    1. **XML Configuration**: `<bean id="myBean" class="com.example.MyClass"/>`
    2. **Java Configuration**: `@Configuration` and `@Bean` annotations.
    3. **Annotation-Driven** (Modern): `@Component`, `@Service`, `@Repository` directly on classes.

```java
@Configuration
public class AppConfig {
    @Bean
    public MyClass myClass() {
        return new MyClass();
    }
}
```

# What Bean Scopes are you aware of?

- **Universal Scopes**:
    1. **Singleton** (Default): Only one instance for the entire Spring container.
    2. **Prototype**: A new instance created every time it is requested.
- **Web-Aware Scopes**:
    1. **Request**: New instance per HTTP request.
    2. **Session**: Single instance per HTTP session.
    3. **Application**: Single instance across the entire `ServletContext`.
    4. **WebSocket**: Single instance per WebSocket connection lifecycle.

# What is Bean Wiring?

- **Bean Wiring** is the process of connecting beans as dependencies of one another.
- **Types of Bean Wiring (Dependency Injection)**:
    1. **Constructor Injection** (Preferred): Ensures all required dependencies are provided during object creation.
    2. **Setter Injection**: More flexible, allows partial dependencies.
    3. **Field Injection** (Not Recommended): Breaks encapsulation.

# What is Autowiring?

- **Autowiring** allows Spring to automatically inject required dependencies without explicit configuration.
- **Types of Autowiring:**

```java
// By Type - @Autowired on constructor
@Component
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

```java
// By Qualifier - when multiple beans of same type exist
@Autowired
@Qualifier("primaryPaymentService")
private PaymentService paymentService;
```

# What is the purpose of the @Component annotation?

- The `@Component` annotation marks a class as a Spring bean, making it eligible for automatic detection and registration.
- Specialized versions: `@Service`, `@Repository`, `@Controller` for service, repository, and controller layers.

```java
@Component
public class UserService {
    // Spring will automatically register this as a bean
}
```

# What are some annotations you've used?

## Core Annotations

- **@Component**: Marks a class as a Spring bean.
- **@Controller / @Service / @Repository**: Layer-specific bean annotations.
- **@SpringBootApplication**: Marks the main class as a Spring Boot application.
- **@Autowired**: Denotes a dependency for injection.
- **@Scope**: Defines the bean scope.

## Spring MVC Annotations

- **@RestController**: Combines `@Controller` and `@ResponseBody`.
- **@RequestMapping**: Defines base URL for a controller.
- **@GetMapping, @PostMapping, @PutMapping, @DeleteMapping**: HTTP method mappings.
- **@RequestBody / @PathVariable / @RequestParam**: Data extraction annotations.
- **@CrossOrigin**: Configures CORS.

## Spring Data Annotations

- **@Entity**: Marks a class as a DB table.
- **@Table / @Column**: Customizes DB table/column properties.
- **@Id / @GeneratedValue**: Primary key configuration.
- **@ManyToOne / @OneToMany / @ManyToMany**: Relationship annotations.
- **@Transactional**: Marks a method for transactional behavior.
- **@Query / @Param**: Custom SQL queries in repository methods.

# Describe Spring MVC Controllers

- **Spring MVC** handles HTTP requests using the **Model-View-Controller** design pattern.
- **Core Components**:
    1. **DispatcherServlet**: Front controller that handles incoming HTTP requests.
    2. **HandlerMapping**: Maps requests to the correct controller.
    3. **Controller Layer**: Classes annotated with `@Controller` that handle HTTP requests.
    4. **ResponseEntity**: Builds HTTP responses with status code and body.
- **Application Flow**: HTTP Request → DispatcherServlet → HandlerMapping → Controller → Response

# How would you handle HTTP calls/mappings using Spring?

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://example.com")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping("/items/{id}")
    public Item getItem(@PathVariable int id) {
        return itemService.getItemById(id);
    }

    @PostMapping("/items")
    public String createItem(@RequestBody Item item) {
        itemService.createItem(item);
        return "Item created: " + item.getName();
    }

    @PutMapping("/items/{id}")
    public String updateItem(@PathVariable int id, @RequestBody Item item) {
        itemService.updateItem(id, item);
        return "Item " + id + " updated: " + item.getName();
    }

    @DeleteMapping("/items/{id}")
    public String deleteItem(@PathVariable int id) {
        itemService.deleteItem(id);
        return "Item " + id + " deleted";
    }
}
```

# What is Spring Data? What are the JPA annotations?

- **Spring Data JPA** provides an easy way to interact with relational databases, reducing boilerplate code.
- **JPA** (Java Persistence API) maps Java objects to database tables.
- **Key JPA Annotations**: `@Entity`, `@Table`, `@Column`, `@Id`, `@GeneratedValue`
- **Repository Hierarchy**: Repository → CrudRepository → JpaRepository

# How do you handle database interactions with Spring Data?

```java
// 1. Define Entity
@Entity
public class Item { /* fields */ }

// 2. Create Repository
public interface ItemRepository extends JpaRepository<Item, Long> { }

// 3. Use Repository
@Service
public class ItemService {
    @Autowired private ItemRepository itemRepository;
}

// 4. Custom Queries
@Query("SELECT i FROM Item i WHERE i.price > :price")
List<Item> findItemsAbovePrice(@Param("price") double price);
```

# What is RestTemplate? What does it let us do?

- **RestTemplate** is a class in Spring for making HTTP requests to external RESTful APIs.
- Supports `GET`, `POST`, `PUT`, `DELETE` methods.
- Being replaced by **WebClient** in newer Spring versions (non-blocking, reactive).

```java
RestTemplate restTemplate = new RestTemplate();
String url = "http://localhost:8080/api/resource";
String response = restTemplate.getForObject(url, String.class);
```

- **Key Methods**: `getForObject()`, `postForObject()`, `put()`, `delete()`

# What are Spring Bean Validators?

- **Spring Bean Validators** validate properties of Java beans using annotations.
- **Common Annotations**: `@NotNull`, `@Size(min, max)`, `@Email`, `@Pattern(regex)`

```java
public class User {
    @NotNull
    private String name;

    @Email
    private String email;

    @Size(min = 8, max = 20)
    private String password;
}
```

- **Triggering Validation** with `@Valid`:

```java
@PostMapping("/register")
public ResponseEntity<String> register(@RequestBody @Valid User user) {
    return ResponseEntity.ok("User registered successfully");
}
```
