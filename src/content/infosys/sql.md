---
title: "SQL"
order: 3
lang: "sql"
---

# Tell me about the different SQL sublanguages?

- **DDL (Data Definition Language)**: Define and manage database structure.
    - **CREATE**: Creates tables, schemas, views.
    - **ALTER**: Modifies existing structures.
    - **TRUNCATE**: Removes all data without deleting structure.
    - **DROP**: Deletes database structures entirely.
- **DML (Data Manipulation Language)**: Manipulate data within tables.
    - **SELECT**: Retrieves data.
    - **INSERT**: Adds new rows.
    - **UPDATE**: Modifies existing rows.
    - **DELETE**: Removes rows.
- **DQL (Data Query Language)**: Some consider SELECT as its own category since it queries data without modifying it.
- **DCL (Data Control Language)**: Manage access control and permissions.
    - **GRANT**: Assigns privileges.
    - **REVOKE**: Removes privileges.
- **TCL (Transaction Control Language)**: Manage transactions.
    - **BEGIN**: Starts a transaction.
    - **COMMIT**: Saves all changes.
    - **ROLLBACK**: Reverts changes.
    - **SAVEPOINT**: Creates a checkpoint within a transaction.

# How do you create a table in PostgreSQL?

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    salary NUMERIC(10, 2),
    join_date DATE
);
```

- **Key Points:**
    - **Data Types**: `VARCHAR`, `INTEGER`, `DATE`, `NUMERIC`, etc.
    - **Constraints**: `PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `FOREIGN KEY`
    - **Auto-Increment**: Use `SERIAL` for auto-incrementing primary keys.

# How can you change a table's columns without dropping and recreating it?

- Use the `ALTER TABLE` statement:

```sql
-- Add a Column
ALTER TABLE employees ADD COLUMN department VARCHAR(50);

-- Drop a Column
ALTER TABLE employees DROP COLUMN department;

-- Rename a Column
ALTER TABLE employees RENAME COLUMN salary TO pay;

-- Change a Column's Data Type
ALTER TABLE employees ALTER COLUMN age TYPE SMALLINT;

-- Set Default Value
ALTER TABLE employees ALTER COLUMN salary SET DEFAULT 30000.00;

-- Set NOT NULL
ALTER TABLE employees ALTER COLUMN age SET NOT NULL;
```

# How to select all from a DB table?

```sql
SELECT * FROM table_name;
```

- `*` denotes all columns.
- `table_name` is replaced with the name of your table.

# How to filter the results of a select? (WHERE clause)

- The `WHERE` clause filters rows based on specified conditions.
- Can be used with `SELECT`, `UPDATE`, and `DELETE` statements.

```sql
SELECT * FROM table_name WHERE column_name = value;
```

# What does ORDER BY do in SQL?

- The `ORDER BY` clause specifies sorting order for query results.
- Defaults to ascending order; use `DESC` for descending.

```sql
SELECT * FROM employees ORDER BY salary DESC;
```

# What does GROUP BY do in SQL?

- The `GROUP BY` statement aggregates rows that share the same values in specified columns.
- Typically used with aggregate functions like `SUM()`, `COUNT()`, `AVG()`, `MAX()`, `MIN()`.

```sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;
```

# What does HAVING do in SQL?

- The `HAVING` clause filters groups created by `GROUP BY`, applying conditions on aggregated data.
- Unlike `WHERE`, `HAVING` works with aggregate functions.

```sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
```

# How do you define foreign keys in PostgreSQL?

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

- **ON DELETE/UPDATE actions**: `CASCADE`, `SET NULL`, `SET DEFAULT`, `NO ACTION`, `RESTRICT`

```sql
FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
```

# Tell me about the normal forms you know

- **0NF**: Raw, unstructured data with no rules applied.
- **1NF**: Data must be atomic (no lists in columns). Requires a primary key.
- **2NF**: Must be in 1NF. Eliminate partial dependencies — non-key attributes must depend on the entire primary key.
- **3NF**: Must be in 2NF. Eliminate transitive dependencies — non-key attributes should depend only on the primary key.

# Name and describe some SQL joins

- A **join** combines rows from two or more tables based on a related column.
- **Inner Join**: Returns rows with matching values in both tables.
- **Left Outer Join**: Returns all rows from the left table and matching rows from the right table. NULL for non-matching.
- **Right Outer Join**: Returns all rows from the right table and matching rows from the left table. NULL for non-matching.
- **Full Outer Join**: Returns all rows from both tables, with NULL for unmatched rows.
- **Cross Join**: Produces a Cartesian product (all combinations).
- **Equi Join**: Join based on equality operator (`=`).
- **Theta Join**: Combines tables using conditions other than equality.

# What is a Transaction and what are the ACID properties?

- A **transaction** is a set of SQL statements executed together to ensure data integrity.
- **Atomicity**: Transactions either complete fully or not at all.
- **Consistency**: Database constraints are respected before and after transactions.
- **Isolation**: Transactions run independently. Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.
- **Durability**: Committed transactions persist permanently, even after system crashes.

```sql
BEGIN TRANSACTION;

UPDATE Account SET balance = balance - 100 WHERE account_id = 1;
UPDATE Account SET balance = balance + 100 WHERE account_id = 2;

COMMIT;
```

# What SQL functions are you aware of? Two different types?

- **Scalar Functions**: Operate on a single value, return a single value.
    - `UPPER()`, `LOWER()`, `ROUND()`, `NOW()`
- **Aggregate Functions**: Operate on a group of values, return a single calculated result.
    - `AVG()`, `MIN()`, `MAX()`, `SUM()`, `COUNT()`

# What is a view in SQL?

- A **view** is a stored query that acts like a virtual table. It doesn't store data physically.
- **Regular View**: Executes the query each time it's accessed.

```sql
CREATE VIEW view_name AS
SELECT columns
FROM table_name
WHERE condition;
```

- **Materialized View**: Stores query results physically for faster access. Requires manual refresh.

```sql
CREATE MATERIALIZED VIEW view_name AS
SELECT columns FROM table_name WHERE condition;

REFRESH MATERIALIZED VIEW view_name;
```
