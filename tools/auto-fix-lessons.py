import json
from pathlib import Path

CONTENT_DIR = Path("lesson-content")
FIXED_DIR = Path("lesson-content-fixed")
FIXED_DIR.mkdir(exist_ok=True)

def fix_quiz(quiz):
    fixed = []
    for i, q in enumerate(quiz):
        if not isinstance(q, dict):
            q = {}
        q.setdefault("id", f"q{i+1}")
        q.setdefault("type", "mcq")
        q.setdefault("question", f"Placeholder question {i+1}?")
        if q["type"] == "mcq":
            q.setdefault("options", ["Option A", "Option B", "Option C"])
            q.setdefault("answer", q["options"][0])
        elif q["type"] == "truefalse":
            q.setdefault("answer", "true")
        elif q["type"] == "fill":
            q.setdefault("answer", "placeholder")
        else:
            q.setdefault("answer", "")
        fixed.append(q)
    return fixed

def fix_practice(practice):
    fixed = []
    for i, p in enumerate(practice):
        if not isinstance(p, dict):
            p = {}
        p.setdefault("id", f"practice{i+1}")
        p.setdefault("challenge", f"Practice question {i+1}")
        p.setdefault("solution", "SELECT 1;")
        p.setdefault("hint", "Try a simple query.")
        fixed.append(p)
    return fixed

def fix_examples(examples):
    fixed = []
    for i, e in enumerate(examples):
        if not isinstance(e, dict):
            e = {}
        e.setdefault("query", "SELECT * FROM employees;")
        e.setdefault("description", f"Example {i+1}")
        e.setdefault("explanation", "This is an example query.")
        fixed.append(e)
    return fixed

def fix_challenges(challenges):
    fixed = []
    for c_index, ch in enumerate(challenges):
        if not isinstance(ch, dict):
            ch = {}
        ch.setdefault("id", f"ch{c_index+1}")
        ch.setdefault("title", f"Challenge {c_index+1}")
        ch.setdefault("steps", [])

        for s_index, step in enumerate(ch["steps"]):
            if not isinstance(step, dict):
                step = {}
            step.setdefault("stepId", f"{ch['id']}_step{s_index+1}")
            step.setdefault("description", f"Step {s_index+1} description")
            step.setdefault("solution", "SELECT * FROM employees;")
            ch["steps"][s_index] = step

        fixed.append(ch)
    return fixed

def fix_schema(schema):
    schema.setdefault("tables", [])
    for table in schema["tables"]:
        table.setdefault("name", "table1")
        table.setdefault("columns", [])
        for col in table["columns"]:
            col.setdefault("name", "column1")
            col.setdefault("type", "TEXT")
            col.setdefault("constraints", "")
    return schema

print("🔧 Auto-fixing lesson JSON files...\n")

for file in CONTENT_DIR.glob("lesson_*.json"):
    with open(file, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in {file.name}: {e}")
            continue

    data.setdefault("quiz", [])
    data.setdefault("practice", [])
    data.setdefault("examples", [])
    data.setdefault("challenges", [])
    data.setdefault("schema", {"tables": []})
    data.setdefault("sample_data", {})

    data["quiz"] = fix_quiz(data["quiz"])
    data["practice"] = fix_practice(data["practice"])
    data["examples"] = fix_examples(data["examples"])
    data["challenges"] = fix_challenges(data["challenges"])
    data["schema"] = fix_schema(data["schema"])

    # Save to fixed folder
    fixed_path = FIXED_DIR / file.name
    with open(fixed_path, "w", encoding="utf-8") as out:
        json.dump(data, out, indent=2)

    print(f"✅ Fixed: {file.name}")

print("\n🎉 All lesson files processed and saved to lesson-content-fixed/")
