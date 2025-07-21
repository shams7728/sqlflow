import json, os

for filename in os.listdir("lesson-content"):
    if filename.endswith(".json"):
        path = f"lesson-content/{filename}"
        with open(path, "r") as f:
            lesson = json.load(f)

        lesson_id = lesson["id"]

        # Update quiz IDs
        if "quiz" in lesson:
            for q in lesson["quiz"]:
                if not q["id"].startswith(lesson_id):
                    q["id"] = f"{lesson_id}_{q['id']}"

        # Update challenge step IDs
        if "challenges" in lesson:
            for ch in lesson["challenges"]:
                ch["id"] = f"{lesson_id}_{ch['id']}"
                for step in ch["steps"]:
                    if not step["stepId"].startswith(lesson_id):
                        step["stepId"] = f"{lesson_id}_{step['stepId']}"

        with open(path, "w") as f:
            json.dump(lesson, f, indent=2)

print("✅ All lesson IDs updated.")
