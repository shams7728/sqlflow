import json
from pathlib import Path

LESSON_DIR = Path("lesson-content")

for file in LESSON_DIR.glob("*.json"):
    with open(file, "r") as f:
        lesson = json.load(f)

    lesson_id = lesson.get("id")
    if not lesson_id:
        print(f"❌ Skipping {file.name} (missing id)")
        continue

    # Fix practice IDs
    for i, p in enumerate(lesson.get("practice", []), start=1):
        p["id"] = f"{lesson_id}_practice{i}"

    # Fix challenge step IDs
    for challenge in lesson.get("challenges", []):
        challenge_id = challenge.get("id", "ch")
        for i, step in enumerate(challenge.get("steps", []), start=1):
            step["stepId"] = f"{lesson_id}_{challenge_id}_step{i}"

    # Save updated file
    with open(file, "w") as f:
        json.dump(lesson, f, indent=2)

    print(f"✅ Updated IDs in {file.name}")
