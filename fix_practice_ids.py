import json
from pathlib import Path

# 📁 Path to your lessons
LESSON_DIR = Path(__file__).resolve().parent / "lesson-content"
files = list(LESSON_DIR.glob("*.json"))

count = 0

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        lesson = json.load(f)

    lesson_id = lesson.get("id")
    if not lesson_id:
        print(f"⛔ Skipping {file.name} (missing id)")
        continue

    if "practice" in lesson:
        for i, exercise in enumerate(lesson["practice"], 1):
            new_id = f"{lesson_id}_practice{i}"
            old_id = exercise.get("id")
            if old_id != new_id:
                exercise["id"] = new_id
                count += 1

        # Save updated file
        with open(file, "w", encoding="utf-8") as f:
            json.dump(lesson, f, indent=2)
        print(f"✅ Updated: {file.name}")

print(f"\n🎉 Done! {count} practice IDs updated.")
