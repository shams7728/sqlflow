import json
from pathlib import Path

CONTENT_DIR = Path("lesson-content")

def report_issue(file, section, message):
    print(f"❌ {file.name} → {section}: {message}")

def validate_quiz(quiz, file):
    for i, q in enumerate(quiz):
        if not isinstance(q, dict):
            report_issue(file, "quiz", f"item {i} is not a dict")
            continue
        for key in ["id", "type", "question", "answer"]:
            if key not in q:
                report_issue(file, "quiz", f"item {i} missing '{key}'")

def validate_practice(practice, file):
    for i, p in enumerate(practice):
        for key in ["id", "challenge", "solution"]:
            if key not in p:
                report_issue(file, "practice", f"item {i} missing '{key}'")

def validate_examples(examples, file):
    for i, e in enumerate(examples):
        for key in ["query", "description", "explanation"]:
            if key not in e:
                report_issue(file, "examples", f"item {i} missing '{key}'")

def validate_challenges(challenges, file):
    for i, ch in enumerate(challenges):
        if "id" not in ch or "title" not in ch or "steps" not in ch:
            report_issue(file, "challenges", f"item {i} missing id/title/steps")
            continue
        for j, step in enumerate(ch["steps"]):
            for key in ["stepId", "description", "solution"]:
                if key not in step:
                    report_issue(file, f"challenges[{ch.get('id', '?')}]", f"step {j} missing '{key}'")

print("🔍 Validating all lessons in lesson-content...\n")

error_found = False

for file in CONTENT_DIR.glob("lesson_*.json"):
    try:
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            if "quiz" in data:
                validate_quiz(data["quiz"], file)
            if "practice" in data:
                validate_practice(data["practice"], file)
            if "examples" in data:
                validate_examples(data["examples"], file)
            if "challenges" in data:
                validate_challenges(data["challenges"], file)
    except json.JSONDecodeError as e:
        report_issue(file, "JSON", f"invalid format: {e}")
        error_found = True

print("\n✅ Validation complete.")
if not error_found:
    print("🎉 All lessons are valid!")
else:
    print("⚠️ Some issues found — please review logs above.")
