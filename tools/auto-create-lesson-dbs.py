import sqlite3, json
from pathlib import Path

# Always reference project root
ROOT_DIR = Path(__file__).resolve().parent.parent
LESSON_CONTENT_DIR = ROOT_DIR / "lesson-content"
LESSON_DATA_DIR = ROOT_DIR / "lesson-data"
LESSON_DATA_DIR.mkdir(parents=True, exist_ok=True)

for file in LESSON_CONTENT_DIR.glob("*.json"):
    with open(file) as f:
        lesson = json.load(f)

    lesson_id = lesson["id"]
    db_path = LESSON_DATA_DIR / f"lesson_{lesson_id}.db"

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()

        # Create schema
        for table in lesson.get("schema", {}).get("tables", []):
            col_defs = []
            for col in table["columns"]:
                col_def = f"{col['name']} {col['type']}"
                if "constraints" in col:
                    col_def += f" {col['constraints']}"
                col_defs.append(col_def)
            create_sql = f"CREATE TABLE {table['name']} ({', '.join(col_defs)})"
            cursor.execute(create_sql)

        # Insert sample data
        for table_name, rows in lesson.get("sample_data", {}).items():
            if not rows:
                continue
            columns = rows[0].keys()
            insert_sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['?']*len(columns))})"
            values = [tuple(row[col] for col in columns) for row in rows]
            cursor.executemany(insert_sql, values)

    print(f"✅ Created: lesson_{lesson_id}.db")
