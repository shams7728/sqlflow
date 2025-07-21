from pathlib import Path
import json
import sqlite3

# Define directories
lesson_content_dir = Path("lesson-content")
lesson_data_dir = Path("lesson-data")
lesson_content_dir.mkdir(exist_ok=True)
lesson_data_dir.mkdir(exist_ok=True)

# --- Lesson Definition for Data Cleaning Challenge ---
lesson = {
    "id": "challenge-data-cleaning",
    "title": "Challenge: Data Cleaning",
    "category": "Challenges",
    "difficulty": "Advanced",
    "estimatedTime": "30 min",
    "starterQuery": "/* This is a conceptual challenge on cleaning and standardizing raw data. */",
    "theory": [
        {
            "type": "paragraph",
            "text": "1. The Business Problem\nYou've been given a raw data extract of new user signups from a legacy system. The data is messy: names have inconsistent spacing, emails are not standardized to lowercase, and some important fields are missing (NULL). Your task is to write a query that cleans this data to produce a standardized, usable report."
        },
        {
            "type": "paragraph",
            "text": "2. Analyzing the Schema & Data\nYou have one table, `raw_signups`, with the following columns and sample messy data:\n- `id` (INTEGER)\n- `full_name` (TEXT, e.g., '  John Smith  ')\n- `email` (TEXT, e.g., 'John.S@Email.COM')\n- `status` (TEXT, can be NULL)"
        },
        {
            "type": "paragraph",
            "text": "3. Devising a Cleaning Strategy\nWe need to apply several data cleaning functions to produce a clean output:\n- **Step A (Standardize Text):** Use the `TRIM()` function to remove leading/trailing whitespace from `full_name`. Use the `LOWER()` function to convert all `email` addresses to a consistent lowercase format.\n- **Step B (Handle Missing Data):** The `status` column can be NULL. We want to replace any NULL values with a default status of 'pending'. The `COALESCE()` function is perfect for this.\n- **Step C (Extract Information):** We want to create a new `username` column from the email address (the part before the '@'). We can use `SUBSTR()` and `INSTR()` to find the '@' symbol and extract the preceding text.\n- **Step D (Combine and Select):** Combine all these cleaning functions in a single `SELECT` statement to produce the final, clean report."
        },
        {
            "type": "code",
            "text": """-- The Final Solution Query:
SELECT
    id,
    TRIM(full_name) AS cleaned_name,
    LOWER(email) AS standardized_email,
    -- Extract username from email (before the '@')
    SUBSTR(email, 1, INSTR(email, '@') - 1) AS username,
    -- If status is NULL, default to 'pending'
    COALESCE(status, 'pending') AS status
FROM
    raw_signups;"""
        },
        {
            "type": "note",
            "text": "Data cleaning is often the first and most time-consuming step in any data analysis project. Mastering functions like `TRIM`, `LOWER`, `COALESCE`, and string manipulation functions is essential."
        }
    ],
    "schema": {
        "tables": [
            { "name": "raw_signups", "columns": [{"name": "id", "type": "INTEGER"}, {"name": "full_name", "type": "TEXT"}, {"name": "email", "type": "TEXT"}, {"name": "status", "type": "TEXT"}] }
        ]
    },
    "sample_data": {
        "raw_signups": [
            {"id": 1, "full_name": "  Alice   ", "email": "Alice@Example.COM", "status": "active"},
            {"id": 2, "full_name": "Bob Smith", "email": "BOB@example.com", "status": None},
            {"id": 3, "full_name": "  charlie brown", "email": "Charlie.B@Example.COM", "status": "inactive"}
        ]
    },
    "practice": [],
    "challenges": [],
    "quiz": [
        {
            "id": "cdc_q1",
            "type": "mcq",
            "question": "Which function is used to remove leading and trailing spaces from a string?",
            "options": ["CLEAN()", "STRIP()", "TRIM()", "REMOVE_SPACES()"],
            "answer": "TRIM()"
        },
        {
            "id": "cdc_q2",
            "type": "mcq",
            "question": "What is the purpose of the `COALESCE()` function?",
            "options": ["To combine two strings", "To return the first non-NULL value in a list", "To convert a value to uppercase", "To find the average value"],
            "answer": "To return the first non-NULL value in a list"
        },
        {
            "id": "cdc_q3",
            "type": "mcq",
            "question": "To convert the string 'HELLO' to 'hello', which function would you use?",
            "options": ["LOWER()", "UPPER()", "FORMAT()", "CONVERT()"],
            "answer": "LOWER()"
        },
        {
            "id": "cdc_q4",
            "type": "truefalse",
            "question": "In the solution query, `INSTR(email, '@')` finds the position of the '@' symbol.",
            "answer": True
        },
        {
            "id": "cdc_q5",
            "type": "mcq",
            "question": "Why is standardizing data (like making all emails lowercase) important?",
            "options": ["It makes the database smaller", "It prevents duplicates and ensures accurate grouping and joining", "It is required by SQL syntax", "It improves query speed"],
            "answer": "It prevents duplicates and ensures accurate grouping and joining"
        },
        {
            "id": "cdc_q6",
            "type": "truefalse",
            "question": "The `SUBSTR()` function is used to add two strings together.",
            "answer": False
        },
        {
            "id": "cdc_q7",
            "type": "mcq",
            "question": "If you wanted to replace all NULL values in a `price` column with `0.0`, which expression would you use?",
            "options": ["REPLACE(price, NULL, 0.0)", "IF(price IS NULL, 0.0)", "COALESCE(price, 0.0)", "TRIM(price, 0.0)"],
            "answer": "COALESCE(price, 0.0)"
        }
    ]
}

# --- Script to generate files ---
def create_lesson_files(lesson_data):
    # Write JSON file
    json_path = lesson_content_dir / f"lesson_{lesson_data['id']}.json"
    with open(json_path, "w") as f:
        json.dump(lesson_data, f, indent=4)
    print(f"✅ Successfully created: {json_path.name}")

    # Create SQLite DB
    db_path = lesson_data_dir / f"lesson_{lesson_data['id']}.db"
    if db_path.exists():
        db_path.unlink()

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        for table in lesson_data["schema"]["tables"]:
            col_defs = [f"{col['name']} {col['type']} {col.get('constraints', '')}".strip() for col in table["columns"]]
            cursor.execute(f"CREATE TABLE {table['name']} ({', '.join(col_defs)});")
        
        for table_name, rows in lesson_data["sample_data"].items():
            if rows:
                keys = rows[0].keys()
                placeholders = ", ".join(["?"] * len(keys))
                sql = f"INSERT INTO {table_name} ({', '.join(keys)}) VALUES ({placeholders})"
                data_to_insert = [tuple(row.get(k) for k in keys) for row in rows]
                cursor.executemany(sql, data_to_insert)
    print(f"✅ Successfully created: {db_path.name}")

# Create the files for our new lesson
create_lesson_files(lesson)
