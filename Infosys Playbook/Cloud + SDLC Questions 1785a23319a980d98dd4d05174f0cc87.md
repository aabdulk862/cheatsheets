# Cloud + SDLC Questions

# What is Agile?

- Agile is an adaptive software development methodology that emphasizes **collaboration**, **flexibility**, **customer feedback**, and delivering **incremental** progress.
    - Unlike traditional development approaches, Agile focuses on delivering small, functional pieces of software frequently, ensuring that projects can adapt quickly to changing requirements.
    - The methodology relies on collaboration between cross-functional teams, stakeholders, and customers to ensure that software continuously meets user needs and expectations.
- **Core Elements of Agile**
    1. **Iterative Development**
        - Development is done in small, time-boxed iterations, usually called **sprints**, where each iteration produces a working product increment.
    2. **Incremental Delivery**
        - Software is delivered in pieces (increments), with each one adding more functionality and value to the product.
    3. **Collaboration**
        - Agile emphasizes ongoing communication between team members, stakeholders, and customers to ensure that the product meets user needs.
    4. **Customer Focus**
        - Continuous feedback is integrated throughout development to ensure the software aligns with the customer's vision and requirements.
    5. **Self-organizing Teams**
        - Agile promotes teams that are self-sufficient and can organize their own work and decision-making.
    6. **Flexibility**
        - Agile encourages teams to adapt to changing requirements and market conditions, even during later stages of development.
- **Common Agile Frameworks**
    1. **Scrum**
        - Scrum is a framework that uses short, time-boxed sprints (typically 2-4 weeks) to manage project tasks. Teams hold regular meetings (called ceremonies) and use a **Product Backlog** to prioritize tasks. Scrum involves roles like:
            - **Product Owner**: Prioritizes features in the Product Backlog.
            - **Scrum Master**: Facilitates the Scrum process and removes obstacles.
            - **Development Team**: Delivers the increment of work each sprint.
    2. **Kanban**
        - Kanban focuses on visualizing and managing workflow. It uses a **Kanban board** with columns representing different stages of the process (e.g., "To Do," "In Progress," "Done"). This helps teams identify bottlenecks and continuously optimize the flow of tasks.
    3. **Extreme Programming (XP)**
        - Extreme Programming emphasizes technical practices like **pair programming**, **test-driven development (TDD)**, and **continuous integration** to improve software quality.

---

# What are the Scrum Ceremonies in Agile?

- **Scrum ceremonies** (meetings) allow teams to plan, inspect, and adapt their work. These are the key ceremonies in Scrum:
    1. **Sprint Planning**
        - At the start of each sprint, the team meets to select items from the **Product Backlog** to work on during the sprint. The team often **story points** the tasks and decides which can be completed in the upcoming sprint.
    2. **Daily Scrum (Daily Stand-up)**
        - This is a brief daily meeting where team members share updates on their progress, highlight any obstacles (blockers), and synchronize efforts. This is typically held at the same time each day and is limited to 15 minutes.
    3. **Sprint Review**
        - At the end of the sprint, the team demonstrates the work completed during the sprint. Stakeholders provide feedback, and the team discusses what was achieved and what can be improved.
    4. **Sprint Retrospective**
        - After the Sprint Review, the team holds a **retrospective** to reflect on the sprint. They discuss what went well, identify areas for improvement, and create an action plan for enhancing future sprints. This ceremony fosters a culture of continuous improvement.

---

# What Agile processes have you used?

1. **Task Management and Collaboration with Trello**
    - Our team used Trello to organize tasks, manage workflows, and track progress.
    - We created boards with lists such as **"To Do," "In Progress," "Review," and "Done"** to visually monitor task statuses.
2. **Sprint Planning**
    - The project was divided into sprints, each with specific goals and deliverables.
    - Before each sprint, we held a planning session to prioritize tasks and estimate their complexity.
3. **Daily Standups**
    - We conducted brief daily meetings to update the team on progress, discuss challenges, and align goals.
4. **Retrospectives**
    - At the end of each sprint, we held a retrospective meeting to reflect on what went well, what didn’t, and how to improve in the next sprint.
    - This iterative feedback loop helped us refine our process and address blockers effectively.
5. **Continuous Integration and Delivery (CI/CD)**
    - We used version control with Git to maintain a clean workflow, and pull requests were reviewed regularly to ensure quality.
    - AWS was leveraged for seamless deployment and testing of updates in real-time.
6. **Role-Based Collaboration**
    - Each team member had defined roles, like frontend development, backend development, and project management, ensuring clear ownership of tasks.
7. **Iterative Development**
    - We followed an iterative approach to build features incrementally, ensuring continuous feedback and alignment with project goals.

---

# What AWS services have you used?

- **AWS Services and CI/CD Pipeline**
    1. **Amazon S3 (Simple Storage Service)**
        - Used for hosting the client-side React application.
        - Enabled seamless deployment of static assets like CSS, JavaScript, and images.
        - Delivered high availability and low latency for frontend resources.
    2. **Amazon EC2 (Elastic Compute Cloud)**
        - Hosted the backend Spring Boot application.
        - Provided scalable compute capacity for the server-side.
        - Allowed secure configuration and management of the backend environment.
    3. **Amazon RDS (Relational Database Service)**
        - Hosted the PostgreSQL database for the application.
        - Provided a secure, scalable, and highly available relational database.
        - Supported real-time data management for user accounts, envelopes, and transactions.
    4. **Jenkins Pipeline for CI/CD**
        - Automated the build, test, and deployment processes for both frontend and backend.
        - **Pipeline Workflow**:
            1. **Source Code Management**: Pulled code changes from GitHub.
            2. **Build Stage**:
                - For the backend, used Maven to build the Spring Boot application.
                - For the frontend, ran Node.js scripts to build the React application.
            3. **Test Stage**:
                - Ran unit tests for backend services and frontend components.
            4. **Deploy Stage**:
                - Deployed the frontend to S3 as a static website.
                - Deployed the backend to an EC2 instance using SSH and deployment scripts.
                - Configured the backend to interact with the RDS-hosted PostgreSQL database.
            5. **Post-Deployment Verification**:
                - Automated checks to ensure proper application functionality, including connectivity to the RDS database.
    
    By leveraging these AWS services and integrating a Jenkins CI/CD pipeline, the team ensured secure, scalable, and efficient application deployment with minimal downtime.
    

---

# How do you host projects on AWS?

### **Frontend Hosting: Using Amazon S3**

1. **Create an S3 Bucket**
    - Log in to the AWS Management Console and create an S3 bucket with a unique name.
    - Enable "Static Website Hosting" in the bucket properties.
2. **Upload Frontend Build Files**
    - Build your frontend project (e.g., `npm run build` for React).
    - Upload the static files (HTML, CSS, JS) to the S3 bucket.
3. **Configure Bucket Permissions**
    - Update the bucket policy to allow public read access for the files.
    - Set the correct MIME types for the files (S3 usually auto-detects these).
4. **Access Your Application**
    - Use the S3-generated URL to access your hosted frontend.
    - Optionally, link a custom domain via Route 53 and enable HTTPS using AWS Certificate Manager.

### **Backend Hosting: Using Amazon EC2**

1. **Launch an EC2 Instance**
    - Select an appropriate instance type (e.g., t2.micro for free tier).
    - Choose an AMI (e.g., Amazon Linux or Ubuntu).
2. **Configure Security Groups**
    - Open required ports (e.g., 8080 for Spring Boot, 22 for SSH).
3. **Deploy Backend Application**
    - SSH into the EC2 instance.
    - Install necessary dependencies (e.g., Java, Maven, or Docker).
    - Transfer your Spring Boot JAR file using SCP or upload via SSH.
    - Start the application using `java -jar`.
4. **Connect to a Database**
    - If using Amazon RDS, configure the backend to connect to the RDS instance via JDBC.
5. **Access the Backend**
    - Use the public IP or domain of the EC2 instance to access the backend API.

### **Database Hosting: Using Amazon RDS**

1. **Create an RDS Instance**
    - Choose the database engine (e.g., PostgreSQL, MySQL).
    - Configure instance settings like instance type, storage, and credentials.
2. **Set Up Security and Networking**
    - Enable the EC2 instance's access to the RDS database by configuring the VPC and security groups.
    - Allow connections from the backend to the database.
3. **Connect to the Database**
    - Update the application properties or environment variables in the backend with the RDS endpoint and credentials.

---

# Describe Iaas, Paas, Saas

1. **Infrastructure as a Service (IaaS)**:
    - **Definition**: Provides core infrastructure (e.g., virtual machines, storage, and networking) for users to configure and maintain themselves.
    - **Examples**:
        - **Amazon EC2**: Virtual servers to host applications.
        - **Amazon RDS**: Managed databases.
    - **Who it’s for**: Users who need full control over their setup.
2. **Platform as a Service (PaaS)**:
    - **Definition**: Provides pre-configured platforms for deploying applications without handling infrastructure management.
    - **Examples**:
        - **AWS Elastic Beanstalk**: Automates EC2 provisioning and application deployment.
        - **AWS Lambda**: Runs code without needing server management (serverless).
    - **Who it’s for**: Developers who want to focus on writing applications without worrying about servers.
3. **Software as a Service (SaaS)**:
    - **Definition**: Fully functional applications provided over the internet for end-users.
    - **Examples**:
        - **AWS Management Console**: A web-based tool for managing AWS services.
        - Everyday apps like Google Workspace or Dropbox.
    - **Who it’s for**: End-users who want ready-to-use applications.

---

# Know the SOLID design principles

- **S - Single Responsibility Principle (SRP)**
    - A class should have only one reason to change.
    - Focuses on assigning one responsibility per class.
    - Makes code easier to maintain, debug, and extend.
- **O - Open/Closed Principle (OCP)**
    - Classes should be **open for extension** but **closed for modification**.
    - Allows new functionality to be added without altering existing code.
    - Achieved through abstraction (e.g., inheritance, interfaces, or composition).
- **L - Liskov Substitution Principle (LSP)**
    - Subclasses must be replaceable with their parent classes without breaking the application.
    - Ensures derived classes maintain the behavior expected from their base classes.
    - **Example**: A `Bird` superclass with a `fly` method shouldn't have a `Penguin` subclass that cannot fly.
- **I - Interface Segregation Principle (ISP)**
    - Classes should not be forced to implement methods they do not use.
    - Promotes creating small, specific interfaces rather than large, catch-all ones.
    - **Example**: Instead of a single `Animal` interface with `fly`, `swim`, and `walk`, create `Flyable`, `Swimmable`, and `Walkable`.
- **D - Dependency Inversion Principle (DIP)**
    - High-level modules should depend on abstractions, not concrete implementations.
    - Both high-level and low-level modules should depend on the same abstraction.
    - Encourages loose coupling and flexibility in code.
    - **Example**: Use a `Database` interface rather than directly depending on `MySQLDatabase`.
- **Key Benefits**
    - **Maintainability**: Code becomes easier to understand and modify.
    - **Scalability**: Simplifies adding new features without breaking existing functionality.
    - **Reusability**: Components can be reused across projects.
    - **Testability**: Loosely coupled code is easier to test.
    - **Flexibility**: Adapts easily to changing requirements.

---