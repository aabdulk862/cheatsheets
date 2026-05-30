# SQL Questions

# Tell me about the different SQL sublanguages?

- **DDL (Data Definition Language)** commands define and manage the **structure** of a database. These commands focus on creating, modifying, and deleting database objects like tables, schemas, and views.
    - **CREATE**: Creates tables, schemas, views, or other database objects.
    - **ALTER**: Modifies existing structures, such as adding or removing columns or constraints.
    - **TRUNCATE**: Removes all data from a table without deleting its structure.
    - **DROP**: Deletes database structures entirely, including all their data.
    - **Key Point**: DDL commands affect the database schema, not the data itself.
- **DML (Data Manipulation Language)** commands are used to **manipulate data** within tables. These commands align with CRUD operations.
    - **SELECT**: Retrieves data from a table (also referred to as DQL by some).
    - **INSERT**: Adds new rows to a table.
    - **UPDATE**: Modifies existing rows in a table.
    - **DELETE**: Removes rows from a table.
    - **Key Point**: DML directly impacts the data stored in the database.
- **DQL (Data Query Language) -** Some consider **SELECT** as its own category, called DQL. This is because it **queries** data without modifying it, distinguishing it from other DML commands.
    - **Debate**: While technically part of **DML**, SELECT’s non-manipulative nature justifies its separation as DQL.
- **DCL (Data Control Language)** commands manage **access control** and **permissions** for database users. These commands are typically used by database administrators.
    - **GRANT**: Assigns privileges to a user.
    - **REVOKE**: Removes privileges from a user.
    - **CREATE USER**: Creates a new database user.
    - **Key Point**: DCL focuses on security and user management.
- **TCL (Transaction Control Language)** commands manage **transactions**, which are groups of SQL commands that are treated as a single unit. Transactions ensure database integrity using **ACID properties.**
    - **BEGIN**: Starts a transaction.
    - **COMMIT**: Saves all changes made during the transaction.
    - **ROLLBACK**: Reverts changes made during the transaction to the last savepoint or the start of the transaction.
    - **SAVEPOINT**: Creates a checkpoint within a transaction.
    - **Key Point**: TCL is essential for maintaining database integrity during complex operations.

---

# **How do you create a table in PostgreSQL?**

- To create a table in PostgreSQL, you use the `CREATE TABLE` statement.
- **Syntax:**
    
    ```sql
    CREATE TABLE table_name (
        column_name1 data_type constraints,
        column_name2 data_type constraints,
        ...
    );
    ```
    
- **Example:**
    
    ```sql
    CREATE TABLE employees (
        id SERIAL PRIMARY KEY,         -- Auto-incrementing ID
        name VARCHAR(100) NOT NULL,    -- Name with a maximum length of 100
        age INT,                       -- Integer for age
        salary NUMERIC(10, 2),         -- Salary with precision
        join_date DATE                 -- Joining date
    );
    ```
    
- **Key Points:**
    1. **Data Types**: Use PostgreSQL data types such as `VARCHAR`, `INTEGER`, `DATE`, `NUMERIC`, etc.
    2. **Constraints**:
        - `PRIMARY KEY`: Unique identifier for rows.
        - `NOT NULL`: Prevents `NULL` values.
        - `UNIQUE`: Ensures all values in the column are distinct.
        - `FOREIGN KEY`: References another table.
    3. **Auto-Increment**: Use `SERIAL` for auto-incrementing primary keys.

---

# **How can you change a table's columns without dropping and recreating it?**

- To modify a table's columns in PostgreSQL without dropping and recreating the table, you use the `ALTER TABLE` statement.
- **Add a Column**:
    
    ```sql
    ALTER TABLE employees ADD COLUMN department VARCHAR(50);
    
    ```
    
- **Drop a Column**:
    
    ```sql
    ALTER TABLE employees DROP COLUMN department;
    
    ```
    
- **Rename a Column**:
    
    ```sql
    ALTER TABLE employees RENAME COLUMN salary TO pay;
    
    ```
    
- **Change a Column's Data Type**:
    
    ```sql
    ALTER TABLE employees ALTER COLUMN age TYPE SMALLINT;
    
    ```
    
- **Set Default Value**:
    
    ```sql
    ALTER TABLE employees ALTER COLUMN salary SET DEFAULT 30000.00;
    
    ```
    
- **Remove Default Value**:
    
    ```sql
    ALTER TABLE employees ALTER COLUMN salary DROP DEFAULT;
    ```
    
- **Set NOT NULL**:
    
    ```sql
    ALTER TABLE employees ALTER COLUMN age SET NOT NULL;
    ```
    
- **Remove NOT NULL**:
    
    ```sql
    ALTER TABLE employees ALTER COLUMN age DROP NOT NULL;
    ```
    

---

# **How to select all from a DB table?**

- To select all records from a table in a database, use the `SELECT` statement with `*`, which retrieves all columns and rows.
- **Example Query**
    
    ```sql
    SELECT * FROM table_name;
    ```
    

- **`*`**: Denotes all columns.
- **`table_name`**: Replace with the name of your table.

---

# **How to filter the results of a select? (WHERE clause)**

- The `WHERE` clause is used to **filter rows** based on specified conditions, making it crucial for data retrieval and manipulation.
- It can be used with **SELECT**, **UPDATE**, and **DELETE** statements to apply conditions on the data being queried or modified.
- **Syntax:**
    
    ```sql
    SELECT * FROM table_name WHERE column_name [operator] value;
    ```
    

---

# **What does ORDER BY do in SQL?**

- The `ORDER BY` clause specifies **sorting order** for query results.
- Defaults to **ascending order**; use `DESC` for descending.
- **Example:**
    
    ```sql
    SELECT * FROM employees ORDER BY salary DESC;
    ```
    

---

# **What does GROUP BY do in SQL?**

- The `GROUP BY` statement **aggregates rows** that share the same values in specified columns.
- Typically used with **aggregate functions** like `SUM()`, `COUNT()`, `AVG()`, `MAX()`, and `MIN()`.
- **Example:**
    
    ```sql
    SELECT department, COUNT(*) AS employee_count
    FROM employees
    GROUP BY department;
    ```
    

---

# **What does HAVING do in SQL?**

- The `HAVING` clause is used to **filter groups** created by the `GROUP BY` clause, applying conditions on aggregated data.
- Unlike `WHERE`, `HAVING` works with **aggregate functions**.
- **Example:**
    
    ```sql
    SELECT department, COUNT(*) AS employee_count
    FROM employees
    GROUP BY department
    HAVING COUNT(*) > 5;
    ```
    

---

# **How do you define foreign keys in PostgreSQL?**

- A **foreign key** establishes a relationship between a column in one table (child) and a column in another table (parent), enforcing referential integrity.
- The `FOREIGN KEY` constraint ensures values in the child table column must exist in the parent table's referenced column.
- **Example:**
    
    ```sql
    -- Create the parent table
    CREATE TABLE departments (
        department_id SERIAL PRIMARY KEY,
        department_name VARCHAR(50)
    );
    
    -- Create the child table with a foreign key
    CREATE TABLE employees (
        employee_id SERIAL PRIMARY KEY,
        employee_name VARCHAR(50),
        department_id INT,
        FOREIGN KEY (department_id) REFERENCES departments(department_id)
    );
    ```
    
- If the referenced row in the parent table is deleted or updated, you can use `ON DELETE` or `ON UPDATE` actions to specify behavior:
    - `CASCADE`: Delete or update matching rows in the child table.
    - `SET NULL`: Set the foreign key to `NULL`.
    - `SET DEFAULT`: Set the foreign key to its default value.
    - `NO ACTION` or `RESTRICT`: Prevent deletion or updates if referenced.
    
    ```sql
    CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(50),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
    );
    ```
    

---

# **Tell me about the normal forms you know.**

- **0NF (Zero Normal Form)**:
    - Raw, unstructured data with no rules applied.
    - **Example**: A table storing customer orders with multiple values in the same column.
        
        
        | Order_ID | Customer | Items (Multiple) |
        | --- | --- | --- |
        | 1 | John | Apple, Banana |
        | 2 | Sara | Orange, Pear, Grapes |
- **1NF (First Normal Form)**:
    - Data must be atomic (no lists or sets in columns).
    - Requires a primary key.
    - **Example:**
        
        
        | Order_ID | Customer | Item |
        | --- | --- | --- |
        | 1 | John | Apple |
        | 1 | John | Banana |
        | 2 | Sara | Orange |
        | 2 | Sara | Pear |
        | 2 | Sara | Grapes |
- **2NF (Second Normal Form)**:
    - Must already be in 1NF.
    - Eliminate **partial dependencies**: Non-key attributes must depend on the entire primary key (if composite).
    - **Example:** Consider a table where the **Order_ID** and **Product_ID** together form the composite primary key.
        
        
        | Order_ID | Product_ID | Customer | Product_Name |
        | --- | --- | --- | --- |
        | 1 | 101 | John | Apple |
        | 1 | 102 | John | Banana |
        | 2 | 103 | Sara | Orange |
        | 2 | 104 | Sara | Pear |
    - To convert to 2NF, we split the data into two tables:
    - **Orders Table**:
        
        
        | Order_ID | Customer |
        | --- | --- |
        | 1 | John |
        | 2 | Sara |
    - **Order_Items Table**:
        
        
        | Order_ID | Product_ID | Product_Name |
        | --- | --- | --- |
        | 1 | 101 | Apple |
        | 1 | 102 | Banana |
        | 2 | 103 | Orange |
        | 2 | 104 | Pear |
- **3NF (Third Normal Form)**:
    - Must already be in 2NF.
    - Eliminate **transitive dependencies**: Non-key attributes should depend only on the primary key.
    - **Example:** Consider a **Products Table** where **Product_Price** depends on **Product_Name**.
        
        
        | Order_ID | Product_ID | Product_Name | Product_Price |
        | --- | --- | --- | --- |
        | 1 | 101 | Apple | 1.00 |
        | 1 | 102 | Banana | 0.50 |
        | 2 | 103 | Orange | 0.75 |
        | 2 | 104 | Pear | 0.60 |
    - To convert to 3NF, we split the data into two tables
    - **Products Table**:
        
        
        | Product_ID | Product_Name | Product_Price |
        | --- | --- | --- |
        | 101 | Apple | 1.00 |
        | 102 | Banana | 0.50 |
        | 103 | Orange | 0.75 |
        | 104 | Pear | 0.60 |
    - **Order_Items Table**:
        
        
        | Order_ID | Product_ID | Product_Name |
        | --- | --- | --- |
        | 1 | 101 | Apple |
        | 1 | 102 | Banana |
        | 2 | 103 | Orange |
        | 2 | 104 | Pear |

---

# **Name and describe some SQL joins.**

- A **join** is used in a query to combine rows from two or more tables based on a related column between them (typically the primary key (PK) and foreign key (FK)).
    - Joins are essential for retrieving data from multiple tables and are a core component in SQL for achieving multi-table queries.

![image.png](SQL%20Questions/86023e06-cf17-40d9-b68e-da714dc95419.png)

- **Inner Join**:
    - Returns rows with matching values in both tables.
    - Commonly used to fetch data where a match exists between tables.
- **Left Outer Join (Left Join)**:
    - Returns all rows from the left table and matching rows from the right table.
    - NULL values appear for non-matching rows in the right table.
    - **Left Join**: The first table in the query is the "left" table.
- **Right Outer Join (Right Join)**:
    - Returns all rows from the right table and matching rows from the left table.
    - NULL values appear for non-matching rows in the left table.
    - **Right Join**: The second table in the query is the "right" table.
- **Full Outer Join**:
    - Returns all rows from both tables, with NULL values for unmatched rows.
- **Cross Join**:
    - Produces a Cartesian product (all combinations of rows from both tables).
    - Useful for combinatorial analysis.
- **Equi Join**:
    - A join based on the equality operator (`=`); equivalent to an inner join.
- **Theta Join**:
    - Combines tables using conditions other than equality (e.g., `<`, `>`, `!=`).
    - Useful for comparisons with additional conditions.

# **What is a Transaction and what are the ACID properties?**

- A **transaction** is a set of one or more SQL statements executed together to ensure data integrity. Transactions are important for scenarios where you need multiple operations to either all succeed or all fail, ensuring the consistency and reliability of your database.
    - Transactions are governed by the **ACID** properties, which ensure that database operations are processed reliably.
- **Atomicity**:
    - Transactions are indivisible; they either complete fully or not at all.
    - Ensures no partial updates occur if any part of the transaction fails.
- **Consistency**:
    - Ensures database constraints are respected, maintaining valid states before and after transactions.
    - Prevents transactions that violate rules like unique or non-null constraints.
- **Isolation**:
    - Transactions run independently, as though no others are occurring simultaneously.
    - Includes isolation levels like **Read Uncommitted**, **Read Committed**, **Repeatable Read**, and **Serializable** for balancing accuracy and performance.
- **Durability**:
    - Committed transactions persist permanently, even after system crashes.
    - Guarantees data reliability once changes are saved.

---

# **Transaction** Example

```sql
BEGIN TRANSACTION;

-- Deduct $100 from account 1
UPDATE Account SET balance = balance - 100 WHERE account_id = 1;

-- Add $100 to account 2
UPDATE Account SET balance = balance + 100 WHERE account_id = 2;

-- Commit the transaction
COMMIT;
```

- **Atomicity**: If the second update fails (e.g., insufficient funds in account 2), the first update is rolled back, and no change is made.
- **Consistency**: The database constraints (e.g., `balance >= 0`) are enforced. If an update violates constraints, the transaction will fail.
- **Isolation**: If another transaction is happening concurrently, each transaction will execute as if it is the only one, ensuring no data conflicts.
- **Durability**: Once the `COMMIT` is issued, the changes are permanent and saved to the disk.

---

# **What SQL functions are you aware of? Two different types?**

- SQL provides **functions** to simplify and enhance data calculations and manipulations. These functions are broadly categorized into **scalar functions** and **aggregate functions**.
- **Scalar Functions:** Operate on **a single value** and return **a single value** after processing. Commonly used for modifying or formatting data.
    - `UPPER(column_name)`: Converts text to uppercase.
    - `LOWER(column_name)`: Converts text to lowercase.
    - `ROUND(column_name, decimals)`: Rounds numbers to specified decimal places.
    - `NOW()`: Returns the current date and time.
- **Aggregate Functions:** Operate on **a group of values** and return a **single calculated result**. Often used with `GROUP BY` for summarizing grouped data.
    - `AVG(column_name)`: Calculates the average of values.
    - `MIN(column_name)`: Finds the smallest value.
    - `MAX(column_name)`: Finds the largest value.
    - `SUM(column_name)`: Calculates the total of values.
    - `COUNT(column_name)`: Counts the number of records.

---

# **What is a view in SQL?**

- A **view** in SQL is essentially a stored query that acts like a virtual table. It allows you to encapsulate complex SQL logic into a single object that can be queried just like a regular table.
    - A **view** doesn't store data physically; it simply executes a query whenever it's accessed, returning the result set as if it were a table.
- **Regular View**: Executes the query each time it's accessed, ensuring up-to-date results.
    - Use Case:
    
    ```sql
    CREATE VIEW view_name AS  
    SELECT columns  
    FROM table_name  
    WHERE condition;  
    ```
    
- **Materialized View**: Stores query results physically for faster access but requires manual refresh to update data.
    
    ```sql
    CREATE MATERIALIZED VIEW view_name AS  
    SELECT columns  
    FROM table_name  
    WHERE condition;  
    ```
    
- You can refresh the materialized view if the data changes:
    
    ```sql
    REFRESH MATERIALIZED VIEW view_name; 
    ```
    

---