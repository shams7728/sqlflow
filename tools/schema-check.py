import json
from pathlib import Path

CONTENT_DIR = Path("lesson-content")

def report(issue, file, context=""):
    print(f"❌ {file.name} → {context}: {issue}")

def check_column(col, table_name, file, col_index):
    if not isinstance(col, dict):
        report(f"Column {col_index} in table '{table_name}' is not a dict", file)
        return

    if "name" not in col or not col["name"]:
        report(f"Column {col_index} in table '{table_name}' missing 'name'", file)

    if "type" not in col or not col["type"]:
        report(f"Column {col_index} in table '{table_name}' missing 'type'", file)

    if "constraints" in col and not isinstance(col["constraints"], str):
        report(f"'constraints' in column '{col['name']}' must be a string", file)

def check_table(table, file, table_index):
    if not isinstance(table, dict):
        report(f"Table {table_index} is not a dict", file)
        return

    if "name" not in table or not table["name"]:
        report(f"Table {table_index} missing 'name'", file)

    if "columns" not in table or not isinstance(table["columns"], list):
        report(f"Table '{table.get('name', f'table_{table_index}')}' missing or invalid 'columns' list", file)
        return

    for i, col in enumerate(table["columns"]):
        check_column(col, table.get("name", f'table_{table_index}'), file, i)

def check_schema(schema, file):
    if "tables" not in schema or not isinstance(schema["tables"], list):
        report("Missing or invalid 'tables' in schema", file)
        return

    for i, table in enumerate(schema["tables"]):
        check_table(table, file, i)

# === MAIN ===
print("🔍 Validating lesson schemas...\n")
invalid_files = 0

for file in CONTENT_DIR.glob("lesson_*.json"):
    try:
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)

        schema = data.get("schema", {})
        if not schema:
            report("Missing schema object", file)
            invalid_files += 1
            continue

        check_schema(schema, file)

    except json.JSONDecodeError as e:
        report(f"Invalid JSON: {e}", file)
        invalid_files += 1

print("\n✅ Schema validation complete.")
if invalid_files == 0:
    print("🎉 All schemas are valid!")
else:
    print(f"⚠️ Issues found in {invalid_files} file(s). Review above.")
