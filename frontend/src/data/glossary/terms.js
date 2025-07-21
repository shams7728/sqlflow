export const glossaryTerms = [
    {
        "term": "SELECT",
        "definition": "Retrieves data from one or more tables in a database. It is the most common statement in SQL.",
        "syntax": "SELECT column1, column2, ... FROM table_name WHERE [condition];",
        "example": "SELECT name, email FROM users WHERE age > 25;",
        "category": "DML (Data Manipulation Language)"
      },
      {
        "term": "INSERT INTO",
        "definition": "Adds one or more new rows of data into a table.",
        "syntax": "INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);",
        "example": "INSERT INTO employees (name, department, salary) VALUES ('John Doe', 'HR', 60000);",
        "category": "DML (Data Manipulation Language)"
      },
      {
        "term": "UPDATE",
        "definition": "Modifies existing records in a table based on a specified condition.",
        "syntax": "UPDATE table_name SET column1 = value1, column2 = value2, ... WHERE [condition];",
        "example": "UPDATE users SET status = 'active', last_login = CURRENT_TIMESTAMP WHERE user_id = 123;",
        "category": "DML (Data Manipulation Language)"
      },
      {
        "term": "DELETE",
        "definition": "Removes one or more records from a table based on a specified condition.",
        "syntax": "DELETE FROM table_name WHERE [condition];",
        "example": "DELETE FROM orders WHERE order_date < '2023-01-01';",
        "category": "DML (Data Manipulation Language)"
      },
      {
        "term": "CREATE TABLE",
        "definition": "Creates a new table in the database with specified columns and data types.",
        "syntax": "CREATE TABLE table_name (column1 datatype [constraint], column2 datatype [constraint], ...);",
        "example": "CREATE TABLE students (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, enrollment_date DATE);",
        "category": "DDL (Data Definition Language)"
      },
      {
        "term": "ALTER TABLE",
        "definition": "Modifies the structure of an existing table. It can be used to add, delete, or modify columns.",
        "syntax": "ALTER TABLE table_name [ADD|DROP|MODIFY] column_name [datatype];",
        "example": "ALTER TABLE employees ADD birthdate DATE; ALTER TABLE employees MODIFY salary DECIMAL(10, 2);",
        "category": "DDL (Data Definition Language)"
      },
      {
        "term": "DROP TABLE",
        "definition": "Permanently deletes a table, its structure, data, indexes, triggers, and constraints.",
        "syntax": "DROP TABLE table_name;",
        "example": "DROP TABLE archived_orders;",
        "category": "DDL (Data Definition Language)"
      },
      {
        "term": "TRUNCATE TABLE",
        "definition": "Quickly deletes all records from a table, but the table structure remains. This operation cannot be rolled back.",
        "syntax": "TRUNCATE TABLE table_name;",
        "example": "TRUNCATE TABLE temp_data;",
        "category": "DDL (Data Definition Language)"
      },
      {
        "term": "WHERE",
        "definition": "Filters records from a SELECT, UPDATE, or DELETE statement based on a specific condition.",
        "syntax": "SELECT * FROM table_name WHERE [condition];",
        "example": "SELECT * FROM products WHERE price < 50 AND category = 'Electronics';",
        "category": "Clauses"
      },
      {
        "term": "ORDER BY",
        "definition": "Sorts the result set of a query in ascending (ASC) or descending (DESC) order based on one or more columns.",
        "syntax": "SELECT * FROM table_name ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...;",
        "example": "SELECT name, salary FROM employees ORDER BY salary DESC, name ASC;",
        "category": "Clauses"
      },
      {
        "term": "DISTINCT",
        "definition": "Returns only unique (distinct) values from a specified column in the result set.",
        "syntax": "SELECT DISTINCT column_name FROM table_name;",
        "example": "SELECT DISTINCT department FROM employees;",
        "category": "Clauses"
      },
      {
        "term": "LIMIT / TOP / FETCH",
        "definition": "Specifies the maximum number of records to return in a query result. Syntax varies by database system.",
        "syntax": "LIMIT [number] (MySQL/PostgreSQL), TOP [number] (SQL Server), FETCH FIRST [number] ROWS ONLY (Oracle/DB2)",
        "example": "SELECT * FROM customers LIMIT 10;",
        "category": "Clauses"
      },
      {
        "term": "AS (Alias)",
        "definition": "Assigns a temporary, more readable name to a column or table in a query.",
        "syntax": "SELECT column_name AS alias_name FROM table_name;",
        "example": "SELECT c.name AS customer_name, o.order_date FROM customers AS c JOIN orders AS o ON c.id = o.customer_id;",
        "category": "Clauses"
      },
      {
        "term": "INNER JOIN",
        "definition": "Returns only the rows where the join condition is met in both tables.",
        "syntax": "SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.fk_id;",
        "example": "SELECT u.name, o.order_total FROM users u INNER JOIN orders o ON u.id = o.user_id;",
        "category": "Joins"
      },
      {
        "term": "LEFT JOIN (or LEFT OUTER JOIN)",
        "definition": "Returns all records from the left table and the matched records from the right table. If there is no match, the result is NULL on the right side.",
        "syntax": "SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.fk_id;",
        "example": "SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;",
        "category": "Joins"
      },
      {
        "term": "RIGHT JOIN (or RIGHT OUTER JOIN)",
        "definition": "Returns all records from the right table and the matched records from the left table. If there is no match, the result is NULL on the left side.",
        "syntax": "SELECT * FROM table1 RIGHT JOIN table2 ON table1.id = table2.fk_id;",
        "example": "SELECT e.name, d.department_name FROM employees e RIGHT JOIN departments d ON e.department_id = d.id;",
        "category": "Joins"
      },
      {
        "term": "FULL OUTER JOIN",
        "definition": "Returns all records when there is a match in either the left or the right table. It combines the functionality of LEFT JOIN and RIGHT JOIN.",
        "syntax": "SELECT * FROM table1 FULL OUTER JOIN table2 ON table1.id = table2.fk_id;",
        "example": "SELECT c.name, o.id FROM customers c FULL OUTER JOIN orders o ON c.id = o.customer_id;",
        "category": "Joins"
      },
      {
        "term": "SELF JOIN",
        "definition": "A regular join, but the table is joined with itself. This is useful for querying hierarchical data.",
        "syntax": "SELECT A.column, B.column FROM table1 A, table1 B WHERE A.common_field = B.common_field;",
        "example": "SELECT e.name AS Employee, m.name AS Manager FROM employees e JOIN employees m ON e.manager_id = m.id;",
        "category": "Joins"
      },
      {
        "term": "GROUP BY",
        "definition": "Groups rows that have the same values in specified columns into summary rows. Often used with aggregate functions.",
        "syntax": "SELECT column, AGGREGATE_FUNCTION(column) FROM table_name GROUP BY column;",
        "example": "SELECT department, AVG(salary) FROM employees GROUP BY department;",
        "category": "Aggregations & Grouping"
      },
      {
        "term": "HAVING",
        "definition": "Filters the results of a GROUP BY clause based on a condition applied to the aggregate function.",
        "syntax": "SELECT column, COUNT(*) FROM table_name GROUP BY column HAVING AGGREGATE_FUNCTION(column) > value;",
        "example": "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 10;",
        "category": "Aggregations & Grouping"
      },
      {
        "term": "COUNT()",
        "definition": "An aggregate function that returns the number of rows that match a specified criterion.",
        "syntax": "SELECT COUNT(column_name) FROM table_name;",
        "example": "SELECT COUNT(*) FROM users WHERE status = 'active';",
        "category": "Aggregate Functions"
      },
      {
        "term": "SUM()",
        "definition": "An aggregate function that returns the total sum of a numeric column.",
        "syntax": "SELECT SUM(column_name) FROM table_name;",
        "example": "SELECT SUM(order_total) FROM orders WHERE order_date >= '2024-01-01';",
        "category": "Aggregate Functions"
      },
      {
        "term": "AVG()",
        "definition": "An aggregate function that returns the average value of a numeric column.",
        "syntax": "SELECT AVG(column_name) FROM table_name;",
        "example": "SELECT AVG(price) FROM products WHERE category = 'Laptops';",
        "category": "Aggregate Functions"
      },
      {
        "term": "MIN() / MAX()",
        "definition": "Aggregate functions that return the minimum and maximum value of a selected column, respectively.",
        "syntax": "SELECT MIN(column_name), MAX(column_name) FROM table_name;",
        "example": "SELECT MIN(salary), MAX(salary) FROM employees;",
        "category": "Aggregate Functions"
      },
      {
        "term": "PRIMARY KEY",
        "definition": "A constraint that uniquely identifies each record in a table. It must contain unique values and cannot contain NULL values.",
        "syntax": "CREATE TABLE table_name (id INT PRIMARY KEY, ...);",
        "example": "CREATE TABLE users (user_id INT PRIMARY KEY, username VARCHAR(50) NOT NULL);",
        "category": "Constraints"
      },
      {
        "term": "FOREIGN KEY",
        "definition": "A constraint that is a key used to link two tables together. It is a field (or collection of fields) in one table that refers to the PRIMARY KEY in another table.",
        "syntax": "FOREIGN KEY (column_name) REFERENCES parent_table(pk_column_name);",
        "example": "ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(user_id);",
        "category": "Constraints"
      },
      {
        "term": "UNIQUE",
        "definition": "A constraint that ensures that all values in a column are different. Unlike a primary key, it can allow one NULL value.",
        "syntax": "CREATE TABLE table_name (column_name datatype UNIQUE, ...);",
        "example": "CREATE TABLE users (user_id INT PRIMARY KEY, email VARCHAR(100) UNIQUE);",
        "category": "Constraints"
      },
      {
        "term": "NOT NULL",
        "definition": "A constraint that enforces a column to NOT accept NULL values.",
        "syntax": "CREATE TABLE table_name (column_name datatype NOT NULL, ...);",
        "example": "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100) NOT NULL);",
        "category": "Constraints"
      },
      {
        "term": "CHECK",
        "definition": "A constraint used to limit the value range that can be placed in a column.",
        "syntax": "CREATE TABLE table_name (column_name datatype CHECK (condition), ...);",
        "example": "CREATE TABLE employees (id INT, salary INT CHECK (salary > 30000));",
        "category": "Constraints"
      },
      {
        "term": "DEFAULT",
        "definition": "A constraint that provides a default value for a column when none is specified.",
        "syntax": "CREATE TABLE table_name (column_name datatype DEFAULT default_value, ...);",
        "example": "CREATE TABLE orders (id INT, order_date DATE DEFAULT (CURRENT_DATE));",
        "category": "Constraints"
      },
      {
        "term": "UNION",
        "definition": "Combines the result set of two or more SELECT statements. It removes duplicate rows between the various SELECT statements.",
        "syntax": "SELECT column FROM table1 UNION SELECT column FROM table2;",
        "example": "SELECT name FROM employees UNION SELECT name FROM contractors;",
        "category": "Set Operations"
      },
      {
        "term": "UNION ALL",
        "definition": "Combines the result set of two or more SELECT statements, but it includes all duplicate rows.",
        "syntax": "SELECT column FROM table1 UNION ALL SELECT column FROM table2;",
        "example": "SELECT city FROM customers UNION ALL SELECT city FROM suppliers;",
        "category": "Set Operations"
      },
      {
        "term": "INTERSECT",
        "definition": "Returns only the rows that appear in both result sets of two SELECT statements.",
        "syntax": "SELECT column FROM table1 INTERSECT SELECT column FROM table2;",
        "example": "SELECT id FROM active_users INTERSECT SELECT id FROM premium_users;",
        "category": "Set Operations"
      },
      {
        "term": "EXCEPT / MINUS",
        "definition": "Returns all rows from the first SELECT statement that are not present in the second SELECT statement's result set.",
        "syntax": "SELECT column FROM table1 EXCEPT SELECT column FROM table2;",
        "example": "SELECT id FROM all_customers EXCEPT SELECT id FROM subscribed_customers;",
        "category": "Set Operations"
      },
      {
        "term": "INDEX",
        "definition": "A database object that improves the speed of data retrieval operations on a table at the cost of additional writes and storage space.",
        "syntax": "CREATE INDEX index_name ON table_name (column1, column2, ...);",
        "example": "CREATE INDEX idx_lastname ON customers (last_name);",
        "category": "Performance & Advanced"
      },
      {
        "term": "VIEW",
        "definition": "A virtual table based on the result-set of an SQL statement. A view contains rows and columns, just like a real table.",
        "syntax": "CREATE VIEW view_name AS SELECT columns FROM tables WHERE [condition];",
        "example": "CREATE VIEW active_users_view AS SELECT name, email FROM users WHERE status = 'active';",
        "category": "Performance & Advanced"
      },
      {
        "term": "Subquery (or Subselect)",
        "definition": "A query nested inside another query. It can be used in SELECT, INSERT, UPDATE, or DELETE statements, or inside another subquery.",
        "syntax": "SELECT column FROM table WHERE column IN (SELECT column FROM another_table);",
        "example": "SELECT name FROM employees WHERE department_id IN (SELECT id FROM departments WHERE location = 'New York');",
        "category": "Performance & Advanced"
      },
      {
        "term": "CASE",
        "definition": "Goes through conditions and returns a value when the first condition is met (like an if-then-else statement).",
        "syntax": "CASE WHEN condition1 THEN result1 WHEN condition2 THEN result2 ELSE result END;",
        "example": "SELECT order_id, quantity, CASE WHEN quantity > 10 THEN 'Large Order' WHEN quantity > 5 THEN 'Medium Order' ELSE 'Small Order' END AS order_size FROM order_details;",
        "category": "Functions & Expressions"
      },
      {
        "term": "Stored Procedure",
        "definition": "A prepared SQL code that you can save, so the code can be reused over and over again.",
        "syntax": "CREATE PROCEDURE procedure_name AS sql_statement;",
        "example": "CREATE PROCEDURE SelectAllCustomers AS SELECT * FROM Customers;",
        "category": "Performance & Advanced"
      },
      {
        "term": "GRANT / REVOKE",
        "definition": "GRANT gives a specific user permissions on database objects. REVOKE removes those permissions.",
        "syntax": "GRANT [permission] ON [object] TO [user]; REVOKE [permission] ON [object] FROM [user];",
        "example": "GRANT SELECT ON customers TO 'sales_user'@'localhost'; REVOKE DELETE ON orders FROM 'intern_user'@'localhost';",
        "category": "DCL (Data Control Language)"
      },
      {
        "term": "COMMIT / ROLLBACK",
        "definition": "COMMIT saves all the modifications made in the current transaction. ROLLBACK undoes modifications made in the current transaction.",
        "syntax": "COMMIT; ROLLBACK;",
        "example": "BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;",
        "category": "TCL (Transaction Control Language)"
      }
  ];
  