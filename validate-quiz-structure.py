import os
import json
from pathlib import Path

# ✅ Settings
LESSON_DIR = Path("lesson-content")
VALID_TYPES = {"mcq", "truefalse", "fill"}

def validate_quiz_item(item, index):
    errors = []

    if not isinstance(item, dict):
        return [f"Quiz item at index {index} is not a JSON object"]

    if "id" not in item:
        errors.append("Missing 'id'")
    if "type" not in item:
        errors.append("Missing 'type'")
    elif item["type"] not in VALID_TYPES:
        errors.append(f"Invalid 'type': {item['type']}")
    if "question" not in item:
        errors.append("Missing 'question'")
    if "answer" not in item:
        errors.append("Missing 'answer'")
    if item.get("type") == "mcq" and "options" not in item:
        errors.append("MCQ missing 'options' field")

    return errors

def scan_lesson_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return [f"❌ Failed to load JSON: {e}"]

    if "quiz" not in data:
        return []

    quiz = data["quiz"]
    if not isinstance(quiz, list):
        return [f"❌ 'quiz' is not a list in {path.name}"]

    all_errors = []
    for i, item in enumerate(quiz):
        item_errors = validate_quiz_item(item, i)
        if item_errors:
            all_errors.append(f"\n❌ In file {path.name}, question #{i+1}:\n  - " + "\n  - ".join(item_errors))

    return all_errors

def main():
    print("🔍 Checking quizzes in lesson-content/...\n")
    total_issues = 0

    for file in LESSON_DIR.glob("*.json"):
        errors = scan_lesson_file(file)
        if errors:
            print("\n".join(errors))
            total_issues += len(errors)

    if total_issues == 0:
        print("✅ All quiz questions are valid!")
    else:
        print(f"\n⚠️ Found {total_issues} issues across lesson files.")

if __name__ == "__main__":
    main()
