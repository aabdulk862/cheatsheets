# Spring Questions

# What is Spring?

- **Spring** is an open-source **Java framework** designed to simplify the development of enterprise-scale applications. It provides tools and abstractions for modularity, scalability, and maintainability:
    - **Eliminates Boilerplate Code**: Automatically handles object creation, dependency injection (DI), and wiring.
    - **Configuration Made Easy**: Annotations reduce verbose XML configurations.
    - **Scalable Architecture**: Modular structure ensures seamless integration of new functionalities.
    - **Framework Extensions**: Spring Boot accelerates development with embedded servers and production-ready features.
- **Key Concepts in Spring Framework**:
    - **Dependency Injection (DI)**: Automatic injection of object dependencies.
    - **Inversion of Control (IoC) Container**: Central to managing object lifecycles.
    - **Spring Beans**: Objects managed by the IoC container.
    - **Bean Wiring**: Configuring relationships between beans.
- **Spring Framework**: The core project offering foundational modules for application development.
- **Spring Modules**: Core components of the **Spring Framework**
    - **Spring Core**: Provides DI and IoC functionality; the foundation of the framework.
    - **Spring AOP**: Enables Aspect-Oriented Programming for cross-cutting concerns (e.g., logging).
    - **Spring MVC**: Simplifies web and RESTful application development.
- **Spring Projects**: Extensions built on top of the **Spring Framework**, such as:
    - **Spring Boot**: Simplifies setup with defaults, embedded servers, and production-ready tools.
    - **Spring Security**: Manages authentication and authorization.
    - **Spring Data**: Simplifies database operations with repositories for relational and non-relational databases.

---

# What is Spring Boot?

- **Spring Boot** is a project under the **Spring framework** that simplifies the setup and deployment of Spring-based applications.
    - It allows developers to create standalone applications with minimal configuration, focusing on convention over configuration.
    - This makes it ideal for rapid application development, as it abstracts much of the setup work and provides sensible defaults.
- **Key Features and Benefits of Spring Boot**
    - **Embedded Web Server**: Comes with built-in servers like Tomcat, Jetty, or Undertow, eliminating external web server setup.
    - **Simplified Configuration**: Uses `application.properties` or `application.yml` for straightforward, minimal configuration with sensible defaults.
    - **Starter Dependencies**: Pre-configured dependencies for common functionalities (e.g., Actuator, DevTools), simplifying project setup.
    - **Spring Boot Actuator**: Offers production-ready features like health checks, metrics, and app info via endpoints (e.g., `/actuator/health`, `/actuator/info`).
    - **DevTools**: Enhances development with features like automatic server restarts and live reload on code changes.
    - **Opinionated Defaults**: Provides ready-to-use configurations based on best practices, allowing developers to focus on application logic.

---

# What is Spring Initializer?

- **Spring Initializer** is a web-based tool provided by Spring to bootstrap and create a new Spring Boot project quickly and efficiently.
- **Customizable Project Setup**:
    - Choose project type: **Maven** or **Gradle**.
    - Select Java version, packaging **(JAR or WAR)**, and project metadata **(group, artifact, etc.)**.
- **Dependency Selection**:
    - Easily add dependencies like Spring Web, Spring Data, Spring Security, etc., which will be pre-configured in the project.
- **Code Generation**:
    - Generates a pre-configured project structure with `pom.xml` or `build.gradle` files based on selected dependencies.
- **IDE Integration**:
    - Can be accessed directly from popular IDEs like IntelliJ IDEA, Eclipse, or Visual Studio Code.

---

# How would you set up a Spring Boot project?

1. **Spring Initializer**:
    - Go to [start.spring.io](https://start.spring.io/).
    - Provide project details:
        - **Project Type**: Maven or Gradle.
        - **Group ID**: The root package name (e.g., `com.example`).
        - **Artifact ID**: The project name.
        - **Java Version**: Select the desired Java version.
        - **Packaging**: Choose **JAR** (default) or **WAR** (if deploying to a servlet container).
    - Download the generated ZIP, extract it, and open in your IDE.
2. **Import Project in IDE**:
    - For Maven: Open `pom.xml`.
    - For Gradle: Open `build.gradle`.
    - Wait for dependencies to resolve.
3. **Configure Properties**:
    - Edit `src/main/resources/application.properties` or `application.yml`.
        
        ```
        server.port=8080
        spring.datasource.url=jdbc:mysql://localhost:3306/mydb
        spring.datasource.username=root
        spring.datasource.password=password
        ```
        
4. **Write Code**:
    - Create Main Application Class
    - Define Controllers, Services, and Repositories. Use annotations like `@RestController`, `@Service`, and `@Repository`.
        
        ```java
        @SpringBootApplication
        public class MyApplication {
            public static void main(String[] args) {
                SpringApplication.run(MyApplication.class, args);
            }
        }
        ```
        
5. **Run the Application**:
    - Run the main class in your IDE or use the terminal.
    - Access via `http://localhost:8080`.
6. **Test Endpoints**:
    - Example endpoint:
        
        ```java
        @RestController
        @GetMapping("/hello")
        public String hello() {
            return "Hello, Spring Boot!";
        }
        ```
        
    - Test with Postman or a browser at `http://localhost:8080/hello`.

---

# What are Spring Beans?

- **Spring Beans** are objects managed by the **Spring IoC (Inversion of Control) Container**.
    - These beans are essential for **Dependency Injection (DI)** in Spring, where the container manages the lifecycle and dependencies of beans.
    - Beans can be defined in various ways, with the most common method being **annotations**.
- **Bean Lifecycle**: The lifecycle of beans is managed by the Spring container.
    - When the application starts, Spring creates and initializes beans based on the configuration.
    - When the application stops, Spring handles the destruction of beans.
- **How to Define Spring Beans:**
    1. **XML Configuration** (Traditional):
        - Define beans in `applicationContext.xml` with `<bean>` tags.
            
            ```xml
            <bean id="myBean" class="com.example.MyClass"/>
            ```
            
    2. **Java Configuration**:
        - Use `@Configuration` and `@Bean` annotations in a Java class.
            
            ```java
            @Configuration
            public class AppConfig {
                @Bean
                public MyClass myClass() {
                    return new MyClass();
                }
            }
            ```
            
    3. **Annotation-Driven Configuration** (Modern & Common):
        - Use annotations like `@Component`, `@Service`, or `@Repository` directly on classes to auto-register them in the Spring context.

---

# What Bean Scopes are you aware of?

- **Bean Scope** defines how many instances of a bean can be created and where those instances are used.
    - **Two Universal Scopes** (used in all applications).
    - **Four Web-Aware Scopes** (specific to web-based applications that handle HTTP requests).
- **Universal Scopes**
    1. **Singleton** *(Default)*
        - Only one instance of the bean exists for the entire Spring container.
        - This is based on the **Singleton Design Pattern**, which ensures there is only one instance of a class at a time.
        - **Key Concept:** Multiple calls to the same bean will always return the same instance.
    2. **Prototype**
        - A new instance of the bean is created every time it is requested.
        - This allows beans to have unique state with each call.
- **Web-Aware Scopes** *(Not Covered in Depth)*
    1. **Request**
        - A new bean instance is created for every HTTP request.
    2. **Session**
        - A single bean instance is maintained for the duration of an HTTP session.
    3. **Application**
        - A single bean instance is shared across the entire `ServletContext`.
    4. **WebSocket**
        - A single bean instance is created for the lifecycle of a WebSocket connection.

---

# What is Bean Wiring?

- **Bean Wiring** is the process of connecting beans as dependencies of one another.
- **Data Dependency:** A class might rely on another class for data.
    - `Employee` needs a `Role`.
    - `Book` needs an `Author`.
- **Method Access:** A class might need to use the methods of another class.
    - A `Controller` class needs a `Service` class, which in turn needs a `DAO` class.
- **Types of Bean Wiring (Dependency Injection)**
    1. **Constructor Injection** *(Preferred)*
        - Ensures all required dependencies are provided during object creation.
    2. **Setter Injection**
        - More flexible and allows partial dependencies to be injected.
        - **Default** in `applicationContext.xml`based beans.
    3. **Field Injection** *(Not Recommended)*
        - Breaks encapsulation, making it less maintainable.

---

# What is Autowiring?

- **Autowiring** in Spring is a feature that allows Spring to automatically inject the required dependencies into beans without the need for explicit configuration in the Spring context. In other words, Spring automatically wires beans based on type or other criteria, simplifying the process of dependency injection.
- **Advantages:**
    - Reduces manual configuration.
    - Makes code cleaner and more maintainable.
- **Disadvantages:**
    - **Ambiguity**: If multiple beans match, Spring needs a clear indicator (e.g., `@Qualifier`).
    - **Spring Dependency**: Beans must be managed by the Spring container.
- **Types of Autowiring:**
    1. **By Type**: `@Autowired` on a field, constructor, or setter to inject a matching bean by type.
        
        ```java
        @Component
        public class UserService {
            private final UserRepository userRepository;
        
            @Autowired
            public UserService(UserRepository userRepository) {
                this.userRepository = userRepository;
            }
        }
        ```
        
    2. **By Name**: Injects a bean based on the name of the property. The name of the bean defined in the Spring container must match the name of the field or property in the class.
        
        ```java
        @Component
        public class OrderService {
            private PaymentService paymentService;
        
            @Autowired
            public void setPaymentService(PaymentService paymentService) {
                this.paymentService = paymentService;
            }
        }
        ```
        
    3. **By Qualifier**: Use `@Qualifier` to specify which bean to inject when multiple beans of the same type exist.
        
        ```java
        @Autowired
        @Qualifier("primaryPaymentService")
        private PaymentService paymentService;
        ```
        

---

# What is the purpose of the @Component annotation?

- The `@Component` annotation in Spring is used to mark a class as a Spring bean, making it eligible for automatic detection and registration in the Spring application context. This allows Spring to manage the lifecycle and dependencies of the class.
    - **Bean Definition**: It defines a Spring-managed bean. By annotating a class with `@Component`, Spring automatically detects and registers it as a bean during component scanning.
    - **Dependency Injection**: The bean can then be injected into other beans using dependency injection, allowing Spring to manage its lifecycle and dependencies.
- `@Component` is typically used for generic beans, while specialized versions of it like `@Service`, `@Repository`, and `@Controller` are used for service, repository, and controller layers respectively.
- **Example:**
    - Spring will automatically register `UserService` as a bean in the application context.
    
    ```java
    @Component
    public class UserService {
        // class definition
    }
    ```
    

---

# What are some annotations you've used?

### **Core Annotations**

- **@Component:** Marks a class as a Spring bean, typically used for Model classes or non-Controller/Service/DAO components.
- **@Controller:** Marks a class as a Spring bean for Controller classes. Often replaced with `@RestController` in Spring MVC.
- **@Service:** Marks a class as a Spring bean for Service classes.
- **@Repository:** Marks a class as a Spring bean for DAO classes (or DAO interfaces).
- **@SpringBootApplication:** Marks the main class to indicate that the application is a Spring Boot application. Usually auto-generated.
- **@ComponentScan:** Tells Spring where to look for beans to register in the Spring container.
- **@Autowired:** Denotes a dependency for injection, placed above a constructor or setter for automatic injection.
- **@Scope:** Defines the bean scope (default is "singleton"). Typically used to change to "prototype" scope (not commonly used in full-stack apps).

### **Spring MVC Annotations**

- **@RestController:** Combines `@Controller` and `@ResponseBody` to make a class a bean and automatically convert HTTP responses to JSON. Preferred for controllers.
- **@RequestMapping:** Defines the base URL for a controller, mapping HTTP requests to endpoints.
- **@GetMapping, @PostMapping, @PutMapping, @DeleteMapping:** Used to map specific HTTP methods (GET, POST, PUT, DELETE) to controller methods.
- **@CrossOrigin:** Configures Cross-Origin Resource Sharing (CORS) to control which origins can send requests to the API.
- **@ResponseBody:** Converts HTTP response data to JSON (usually not needed with `@RestController`).
- **@RequestBody:** Converts HTTP request data to JSON, typically used in method parameters (POST, PUT).
- **@PathVariable:** Extracts data from the URI of an HTTP request.
- **@RequestParam:** Extracts data from query parameters in the URL (though not typically covered in full-stack apps).

### **Spring Data Annotations**

- **@EntityScan:** Tells Spring to look for DB entities (marked with `@Entity`) in a specified package (usually Models).
- **@EnableJpaRepositories:** Enables `JpaRepository` usage in a specific package (typically for DAOs).
- **@Entity:** Marks a class as a DB table (typically a model class).
- **@Table:** Customizes DB table properties (e.g., renames the table).
- **@Column:** Customizes DB column properties (e.g., name, constraints). Defaults are applied if omitted.
- **@Id:** Marks a field as the primary key in a table.
- **@GeneratedValue:** Specifies how the primary key ID is generated, used with `@Id`.
- **@ManyToOne:** Defines a many-to-one relationship (child side) in a DB.
- **@JoinColumn:** Used with `@ManyToOne` to specify the parent table’s primary key field.
- **@OneToMany:** Defines a one-to-many relationship (parent side).
- **@ManyToMany:** Defines a many-to-many relationship between two tables, applied to both sides.
- **@JoinTable:** Specifies the join table for a many-to-many relationship.
- **@Transactional:** Marks a method for transactional behavior, especially for Spring Data methods.
- **@NoRepositoryBean:** Used for creating a base repository interface to provide common methods for child repositories.
- **@Query:** Defines custom SQL queries in repository methods.
- **@Param:** Passes parameters to custom queries defined with `@Query`.
- **@Transient:** Marks a field to be ignored by the data store (not persisted to the DB).

---

# Describe Spring MVC Controllers.

- **Spring MVC** (also known as **Spring Web**) is a framework used to handle HTTP requests, often leveraging the **Model-View-Controller (MVC)** design pattern.
    - It offers an organized way to manage frontend and backend interactions, using annotations to simplify configuration and routing.
    - Much like **Javalin**, Spring MVC abstracts the underlying servlets, making it easier to manage HTTP traffic.
- **Model-View-Controller (MVC) Design Pattern**
    - **Model**: Represents the data, typically entities or objects in the application.
    - **View**: The user-facing component, where the data is presented (e.g., a webpage).
    - **Controller**: The component that handles HTTP requests and interacts with the **Model** to build a response.
- **Core Components in Spring MVC**
    1. **DispatcherServlet**
        - The **front controller** of Spring MVC. It handles incoming HTTP requests and dispatches them to the appropriate controller method.
    2. **HandlerMapping**
        - An interface responsible for mapping incoming HTTP requests to the correct controller. The common implementation is `RequestMappingHandlerMapping`, which scans the application for `@RequestMapping`, `@GetMapping`, `@PostMapping`, etc.
    3. **Controller Layer**
        - Classes annotated with `@Controller` that handle HTTP requests. These classes contain methods that correspond to specific routes, annotated with `@RequestMapping` or `@GetMapping`/`@PostMapping` to define the endpoint and HTTP verb.
    4. **ResponseEntity**
        - Used to build and return HTTP responses with a specific status code and body content. It replaces mechanisms like `ctx.status()` and `ctx.result()` used in Javalin.

![image.png](Spring%20Questions/image.png)

- **Spring MVC Application Flow**
    1. **HTTP Request**: When the **Tomcat server** receives an HTTP request, it forwards it to the **DispatcherServlet**.
    2. **DispatcherServlet**: It consults the **HandlerMapping** to find which controller method matches the request’s URI (endpoint).
    3. **Controller**: The selected controller method processes the request and may call services or interact with the database (via DAOs, for example).
    4. **Building the Response**: After processing, the controller prepares the response, often involving data serialization (e.g., to JSON).
    5. **ViewResolver**: If the response requires a view (e.g., HTML), the **DispatcherServlet** may consult a **ViewResolver** to render the appropriate view (this isn’t typically needed for APIs).
    6. **Returning the Response**: The **DispatcherServlet** returns the response back to the **Tomcat server**, which forwards it to the client (e.g., the frontend or Postman).
    7. **Lifecycle Repeat**: The cycle begins again with each new HTTP request.

---

# How would you handle HTTP calls/mappings using Spring?

- To handle HTTP calls in Spring, you typically use **Spring MVC** annotations in **controller classes**.
- **Core Annotations:**
    - **`@RestController`**: Combines `@Controller` and `@ResponseBody`, automatically converting responses to JSON.
    - **`@RequestMapping`**: Base URL mapping for a controller.
    - **`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`**: Handle HTTP GET, POST, PUT, DELETE requests, respectively.
- **Data Handling:**
    - **`@PathVariable`**: Extracts data from the URL.
    - **`@RequestParam`**: Extracts query parameters.
    - **`@RequestBody`**: Maps the request body to a Java object.
- **Error Handling:**
    - **`@ControllerAdvice`**: Global exception handling.
- **Cross-Origin Configuration:**
    - **`@CrossOrigin`**: Configures CORS for cross-origin requests.
- **Example:**
    
    ```java
    @RestController
    @RequestMapping("/api")
    @CrossOrigin(origins = "http://example.com")  // CORS configuration
    public class ItemController {
    
        // Injecting a service to handle business logic (e.g., itemService)
        @Autowired
        private ItemService itemService;
    
        // Handle GET request
        @GetMapping("/items/{id}")
        public Item getItem(@PathVariable int id) {
            return itemService.getItemById(id);
        }
    
        // Handle POST request
        @PostMapping("/items")
        public String createItem(@RequestBody Item item) {
            itemService.createItem(item);
            return "Item created: " + item.getName();
        }
    
        // Handle PUT request
        @PutMapping("/items/{id}")
        public String updateItem(@PathVariable int id, @RequestBody Item item) {
            itemService.updateItem(id, item);
            return "Item " + id + " updated: " + item.getName();
        }
    
        // Handle DELETE request
        @DeleteMapping("/items/{id}")
        public String deleteItem(@PathVariable int id) {
            itemService.deleteItem(id);
            return "Item " + id + " deleted";
        }
    }
    ```
    

---

# What is Spring Data? What are the JPA annotations?

- **Spring Data JPA** is part of the Spring Data family of projects, designed to provide an easy and consistent way to interact with relational databases.
    - It significantly reduces the amount of boilerplate code required for data access layers by abstracting away common tasks like CRUD operations, query creation, and relationship management.
    - By leveraging the **Java Persistence API (JPA)**, Spring Data JPA offers a powerful, standardized way to map Java objects to database tables, and it allows you to manage the persistence layer with minimal effort and configuration.
- **JPA**, or **Java Persistence API**, is a specification for managing relational data in Java applications. It enables you to map Java objects (entities) to database tables, and it provides a standard way to perform CRUD operations (Create, Read, Update, Delete) on these entities.
    - **Annotations for mapping entities**: JPA defines **annotations** to help you define and customize how Java classes correspond to database tables.
    - **EntityManager**: The `EntityManager` interface is the primary API for interacting with the persistence context. It handles CRUD operations and queries for entity objects, and it manages transactions.
    - **JPA Providers**: JPA itself is a specification, and providers like **Hibernate** implement this specification, abstracting much of the underlying database interaction.
- **Key JPA Annotations:**
    - **`@Entity`**: Marks a Java class as a JPA entity to be mapped to a database table.
    - **`@Table`**: Defines the table name and schema for the entity (defaults to the class name if omitted).
    - **`@Column`**: Maps a class field to a database column, allowing customization (e.g., `nullable`, `unique`).
    - **`@Id`**: Denotes the primary key field for the entity.
    - **`@GeneratedValue`**: Defines how the primary key is generated (e.g., `AUTO`, `IDENTITY`).
- **Spring Data JPA** follows a well-organized interface hierarchy to handle repositories:
    1. **Repository**: This is the most basic interface in Spring Data. It defines some general methods for repository operations but is not specifically designed for JPA or any other data access mechanism.
        - `save()`, `findAll()`, `findById()`, etc.
    2. **CrudRepository**: This interface extends `Repository` and provides more specific methods for CRUD operations, such as `save()`, `delete()`, and `findOne()`. It's a simple interface for basic data access.
        - It is ideal for use cases where you don’t need complex queries or additional features.
    3. **JpaRepository**: This is the most commonly used interface and extends `CrudRepository`. It provides additional JPA-specific methods like pagination and batch operations.
        - You can easily create your own custom repository interfaces that extend `JpaRepository` to get methods such as `findAll(Pageable pageable)` or `flush()`, which commits any changes to the database.

---

# How do you handle database interactions with Spring Data?

- In Spring Data, database interactions are handled through **repositories**, which abstract the persistence layer, enabling easy CRUD operations. Here's a concise overview of how to handle database interactions with Spring Data:
    1. **Define Entity**: Use `@Entity` to map a class to a table.
        
        ```java
        @Entity
        public class Item { ... }
        ```
        
    2. **Create Repository**: Extend `JpaRepository` for CRUD operations.
        
        ```java
        public interface ItemRepository extends JpaRepository<Item, Long> { ... }
        ```
        
    3. **Use Repository**: Autowire it in services or controllers.
        
        ```java
        @Service
        public class ItemService {
            @Autowired private ItemRepository itemRepository;
        }
        ```
        
    4. **Custom Queries**: Define custom queries with `@Query` if needed.
        
        ```java
        @Query("SELECT i FROM Item i WHERE i.price > :price")
        List<Item> findItemsAbovePrice(@Param("price") double price);
        ```
        

---

# What is RestTemplate? What does it let us do?

- **RestTemplate** is a class in Spring that provides functionalities to make HTTP requests and interact with external RESTful APIs.
    - It supports various HTTP methods such as `GET`, `POST`, `PUT`, and `DELETE`.
    - While it was commonly used in earlier versions of Spring, **RestTemplate** is being gradually replaced by **WebClient** in newer versions of Spring, which offers non-blocking, reactive API capabilities.
- **RestTemplate vs. Spring MVC Controller**
    - **RestTemplate**: A client-side HTTP client used for making requests to external APIs, typically for consuming services.
    - **Spring MVC Controller**: A server-side component responsible for handling incoming HTTP requests and providing responses, typically for exposing APIs to clients.
- **Example:**
    
    ```java
    import org.springframework.web.client.RestTemplate;
    
    public class RestTemplateExample {
    
        public static void main(String[] args) {
            // Instantiate RestTemplate
            RestTemplate restTemplate = new RestTemplate();
    
            // Define the URL of the API
            String url = "http://localhost:8080/api/resource";
    
            // Send the GET request and store the response as a String
            String response = restTemplate.getForObject(url, String.class);
    
            // Print the response
            System.out.println("Response: " + response);
        }
    }
    ```
    
- **Key Methods of RestTemplate**
    - **`getForObject()`**: Used for sending `GET` requests and receiving a response as a Java object.
    - **`postForObject()`**: Used for sending `POST` requests and receiving a response as a Java object.
    - **`put()`**: Sends a `PUT` request, typically for updating resources.
    - **`delete()`**: Sends a `DELETE` request to remove resources.
- When to Use RestTemplate
    - **Synchronous API Calls**: When your application needs to make blocking, synchronous calls to external services.
    - **Legacy Applications**: In older Spring applications, or when working with existing code that uses `RestTemplate`.
- As of Spring 5, **WebClient** is the preferred choice for making HTTP requests in modern Spring applications due to its support for asynchronous, non-blocking communication.
    - While **RestTemplate** is still valid, for new applications, it’s recommended to use **WebClient** for better performance and scalability in a reactive environment.

---

# What are Spring Bean Validators?

- **Spring Bean Validators** are used to validate the properties of Java beans (objects) to ensure they meet specified constraints before being processed.
    - This is part of the **Bean Validation** framework in Spring, often utilizing **JSR-303/JSR-380** (Hibernate Validator being a common implementation).
- **Key Features**:
    - **Annotations**: Spring Bean Validators use annotations like `@NotNull`, `@Size`, `@Email`, etc., to specify validation rules on the fields of a bean.
    - **Automatic Validation**: Validation can be automatically triggered before bean usage (e.g., in controllers or service methods).
    - **Integration with Spring**: Integrated with Spring’s validation mechanism, allowing for seamless validation in web forms, API requests, etc.
- **Common Validation Annotations**:
    - **`@NotNull`**: Ensures the field is not null.
    - **`@Size(min, max)`**: Validates the size of a string or collection.
    - **`@Email`**: Validates that a string is in the form of an email address.
    - **`@Pattern(regex)`**: Validates that a string matches a regular expression.
- **Example:**
    
    ```java
    import javax.validation.constraints.*;
    
    public class User {
    
        @NotNull
        private String name;
    
        @Email
        private String email;
    
        @Size(min = 8, max = 20)
        private String password;
    
        // Getters and setters
    }
    ```
    
- **Triggering Validation**: To trigger validation, you can use `@Valid` in a controller method or service to validate incoming objects:
    
    ```java
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid User user) {
        // Validation occurs before reaching this point
        return ResponseEntity.ok("User registered successfully");
    }
    ```
    

---