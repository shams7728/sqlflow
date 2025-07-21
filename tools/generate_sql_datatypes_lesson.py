from pathlib import Path
import json
import sqlite3

# Define the lesson JSON structure
lesson = {
    "id": "sql-datatypes",
    "title": "SQL Data Types",
    "category": "Getting Started",
    "difficulty": "Beginner",
    "estimatedTime": "12 min",
    "theory": [
        {
            "type": "paragraph",
            "text": "SQL provides various data types for defining the kind of data a column can hold. Choosing the correct type is important for performance and data integrity."
        },
        {
            "type": "table",
            "columns": ["Data Type", "Description"],
            "rows": [
                ["INTEGER", "Stores whole numbers"],
                ["REAL", "Stores floating-point numbers (decimals)"],
                ["TEXT", "Stores text strings"],
                ["BLOB", "Stores binary large objects (e.g., images, files)"],
                ["BOOLEAN", "Stores true or false values (SQLite uses INTEGER 0/1)"],
                ["DATE", "Stores date values (e.g., YYYY-MM-DD)"],
                ["DATETIME", "Stores date and time together"]
            ]
        },
        {
            "type": "note",
            "text": "SQLite is flexible with types. For example, you can insert a string into an INTEGER column, but it's not recommended."
        }
    ],
    "schema": {
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER", "constraints": "PRIMARY KEY"},
                    {"name": "username", "type": "TEXT", "constraints": "NOT NULL"},
                    {"name": "email", "type": "TEXT", "constraints": "NOT NULL"},
                    {"name": "age", "type": "INTEGER"},
                    {"name": "created_at", "type": "DATETIME"},
                    {"name": "is_active", "type": "BOOLEAN"}
                ]
            }
        ]
    },
    "sample_data": {
        "users": [
            {"id": 1, "username": "alice", "email": "alice@example.com", "age": 25, "created_at": "2023-01-01 10:00:00", "is_active": 1},
            {"id": 2, "username": "bob", "email": "bob@example.com", "age": 30, "created_at": "2023-02-10 14:30:00", "is_active": 0},
            {"id": 3, "username": "charlie", "email": "charlie@example.com", "age": 22, "created_at": "2023-03-15 09:15:00", "is_active": 1}
        ]
    },
    "starterQuery": "SELECT * FROM users;",
    "examples": [
        {
            "query": "SELECT username, age FROM users;",
            "description": "Access text and integer columns",
            "explanation": "Retrieves usernames and ages from the users table."
        },
        {
            "query": "SELECT * FROM users WHERE is_active = 1;",
            "description": "Filter by boolean column",
            "explanation": "Shows only active users (is_active = 1)."
        }
    ],
    "practice": [
        {
            "id": "practice1",
            "challenge": "Get all usernames and their creation date.",
            "solution": "SELECT username, created_at FROM users;",
            "hint": "Select two specific columns."
        },
        {
            "id": "practice2",
            "challenge": "Get all users whose age is greater than 25.",
            "solution": "SELECT * FROM users WHERE age > 25;",
            "hint": "Use a WHERE clause with the age column."
        }
    ],
    "quiz": [
        {
            "id": "q1",
            "type": "mcq",
            "question": "Which SQL data type is used to store text values?",
            "options": ["VARCHAR", "TEXT", "STRING", "CHAR"],
            "answer": "TEXT"
        },
        {
            "id": "q2",
            "type": "truefalse",
            "question": "A column with BOOLEAN type can only hold 0 or 1 in SQLite.",
            "answer": True
        },
        {
            "id": "q3",
            "type": "fill",
            "question": "The ______ data type is used to store floating-point numbers.",
            "answer": "REAL"
        }
    ],
    "challenges": [
        {
            "id": "ch1",
            "title": "User Age Analysis",
            "steps": [
                {
                    "stepId": "ch1_step1",
                    "description": "Step 1: Show usernames of users younger than 30.",
                    "solution": "SELECT username FROM users WHERE age < 30;"
                },
                {
                    "stepId": "ch1_step2",
                    "description": "Step 2: Count how many users are active.",
                    "solution": "SELECT COUNT(*) FROM users WHERE is_active = 1;"
                }
            ]
        }
    ]
}

# Create folders
lesson_dir = Path("/mnt/data/lesson-content")
db_dir = Path("/mnt/data/lesson-data")
lesson_dir.mkdir(parents=True, exist_ok=True)
db_dir.mkdir(parents=True, exist_ok=True)

# Save JSON
json_path = lesson_dir / f"lesson_{lesson['id']}.json"
with open(json_path, "w") as f:
    json.dump(lesson, f, indent=2)

# Create DB
db_path = db_dir / f"lesson_{lesson['id']}.db"
with sqlite3.connect(db_path) as conn:
    cursor = conn.cursor()
    for table in lesson["schema"]["tables"]:
        col_defs = []
        for col in table["columns"]:
            col_sql = f"{col['name']} {col['type']}"
            if "constraints" in col:
                col_sql += f" {col['constraints']}"
            col_defs.append(col_sql)
        create_sql = f"CREATE TABLE {table['name']} ({', '.join(col_defs)});"
        cursor.execute(create_sql)

    for table_name, rows in lesson["sample_data"].items():
        if rows:
            cols = rows[0].keys()
            placeholders = ", ".join(["?"] * len(cols))
            insert_sql = f"INSERT INTO {table_name} ({', '.join(cols)}) VALUES ({placeholders})"
            values = [tuple(row[col] for col in cols) for row in rows]
            cursor.executemany(insert_sql, values)

json_path.name, db_path.name
