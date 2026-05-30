---
title: "Cloud/SDLC"
order: 6
lang: "bash"
---

# What is Agile?

- Agile is an adaptive software development methodology emphasizing **collaboration**, **flexibility**, **customer feedback**, and **incremental** progress.
- **Core Elements**:
    1. **Iterative Development**: Small, time-boxed sprints producing working increments.
    2. **Incremental Delivery**: Software delivered in pieces, each adding functionality.
    3. **Collaboration**: Ongoing communication between team members and stakeholders.
    4. **Customer Focus**: Continuous feedback integrated throughout development.
    5. **Self-organizing Teams**: Teams that manage their own work and decisions.
    6. **Flexibility**: Adapt to changing requirements even in later stages.
- **Common Agile Frameworks**:
    - **Scrum**: Time-boxed sprints (2-4 weeks), Product Backlog, roles (Product Owner, Scrum Master, Dev Team).
    - **Kanban**: Visualize workflow with boards (To Do, In Progress, Done).
    - **Extreme Programming (XP)**: Pair programming, TDD, continuous integration.

# What are the Scrum Ceremonies in Agile?

1. **Sprint Planning**: Select items from Product Backlog, story point tasks, decide sprint scope.
2. **Daily Scrum (Stand-up)**: Brief daily meeting — progress updates, blockers, synchronization. Limited to 15 minutes.
3. **Sprint Review**: Demonstrate completed work, stakeholders provide feedback.
4. **Sprint Retrospective**: Reflect on what went well, identify improvements, create action plan.

# What Agile processes have you used?

1. **Task Management**: Trello boards with "To Do," "In Progress," "Review," "Done" lists.
2. **Sprint Planning**: Divided project into sprints with specific goals.
3. **Daily Standups**: Brief meetings for progress updates and alignment.
4. **Retrospectives**: End-of-sprint reflection and process refinement.
5. **CI/CD**: Git version control, pull request reviews, AWS deployment.
6. **Role-Based Collaboration**: Defined roles (frontend, backend, project management).
7. **Iterative Development**: Build features incrementally with continuous feedback.

# What AWS services have you used?

1. **Amazon S3**: Hosted client-side React application (static assets).
2. **Amazon EC2**: Hosted backend Spring Boot application.
3. **Amazon RDS**: Hosted PostgreSQL database.
4. **Jenkins Pipeline for CI/CD**:

```bash
# Pipeline Workflow:
# 1. Source Code Management - Pull from GitHub
# 2. Build Stage - Maven (backend), Node.js (frontend)
# 3. Test Stage - Unit tests for backend and frontend
# 4. Deploy Stage - Frontend to S3, Backend to EC2
# 5. Post-Deployment Verification - Connectivity checks
```

# How do you host projects on AWS?

## Frontend Hosting: Amazon S3

```bash
# 1. Create S3 bucket with "Static Website Hosting" enabled
# 2. Build frontend: npm run build
# 3. Upload static files (HTML, CSS, JS) to bucket
# 4. Configure bucket policy for public read access
# 5. Access via S3-generated URL or custom domain (Route 53)
```

## Backend Hosting: Amazon EC2

```bash
# 1. Launch EC2 instance (e.g., t2.micro)
# 2. Configure Security Groups (ports 8080, 22)
# 3. SSH into instance, install Java/Maven/Docker
# 4. Transfer JAR file via SCP
# 5. Start application: java -jar app.jar
```

## Database Hosting: Amazon RDS

```bash
# 1. Create RDS instance (PostgreSQL/MySQL)
# 2. Configure VPC and security groups for EC2 access
# 3. Update application properties with RDS endpoint
```

# Describe IaaS, PaaS, SaaS

- **IaaS (Infrastructure as a Service)**: Core infrastructure (VMs, storage, networking). User configures and maintains.
    - Examples: Amazon EC2, Amazon RDS.
- **PaaS (Platform as a Service)**: Pre-configured platforms for deploying apps without managing infrastructure.
    - Examples: AWS Elastic Beanstalk, AWS Lambda.
- **SaaS (Software as a Service)**: Fully functional applications over the internet.
    - Examples: AWS Management Console, Google Workspace.

# Know the SOLID design principles

- **S - Single Responsibility Principle**: A class should have only one reason to change.
- **O - Open/Closed Principle**: Open for extension, closed for modification.
- **L - Liskov Substitution Principle**: Subclasses must be replaceable with their parent classes.
- **I - Interface Segregation Principle**: Classes should not implement methods they don't use. Create small, specific interfaces.
- **D - Dependency Inversion Principle**: High-level modules should depend on abstractions, not concrete implementations.

**Key Benefits**: Maintainability, Scalability, Reusability, Testability, Flexibility.
