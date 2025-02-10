import os
import json
import re
from dotenv import load_dotenv
from groq import Groq
from pymongo import MongoClient

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing. Check your .env file.")

# MongoDB Setup
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["edutrack"]
users_collection = db["users"]

# Groq Client
groq_client = Groq(api_key=GROQ_API_KEY)

def extract_json(text):
    try:
        # Extract JSON from markdown
        match = re.search(r"```json\s*([\s\S]*?)\s*```", text)
        if match:
            json_content = match.group(1).strip()
        else:
            # Find a JSON-like structure
            json_match = re.search(r"\{.*\}", text, re.DOTALL)
            json_content = json_match.group(0).strip() if json_match else None

        if not json_content:
            return None  # No JSON found

        # ✅ Fix JSON formatting before parsing
        json_content = fix_common_json_errors(json_content)

        # ✅ Validate and parse JSON
        return json.loads(json_content)

    except json.JSONDecodeError as json_err:
        print(f"❌ JSON Validation Error: {json_err}")
        return None
    except Exception as e:
        print(f"⚠️ Error extracting JSON: {e}")
        return None

def fix_common_json_errors(json_text):
    """Cleans and fixes common JSON errors."""
    
    # 🔹 Remove invalid trailing commas
    json_text = re.sub(r",\s*([\]}])", r"\1", json_text)
    
    # 🔹 Fix missing quotes around property names
    json_text = re.sub(r'(\{|,)\s*([\w_]+)\s*:', r'\1 "\2":', json_text)
    
    # 🔹 Ensure JSON is balanced
    open_braces = json_text.count("{")
    close_braces = json_text.count("}")
    if open_braces > close_braces:
        json_text += "}" * (open_braces - close_braces)

    return json_text

def generate_assessment(user_email):
    user = users_collection.find_one({"email": user_email})
    if not user or "preferences" not in user:
        return {"error": "User preferences not found"}, 404

    preferences = user["preferences"]
    subject = preferences.get("subjects", "General Knowledge")
    skill_level = preferences.get("skillLevel", "Beginner")

    print(f"📌 Generating quiz for {user_email} on {subject} ({skill_level})")

    prompt = (
        f"Generate a {skill_level} level quiz on the topic: {subject} with 5-10 "
        "multiple-choice questions. Format it strictly in JSON with a 'quiz' object containing 'title' and 'questions'."
    )

    try:
        completion = groq_client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )

        # ✅ Check if API returned valid response
        if not completion or not hasattr(completion, "choices") or not completion.choices:
            print("❌ Groq API returned an empty response!")
            return {"error": "No quiz generated"}, 500

        quiz_content = completion.choices[0].message.content.strip()
        print("📜 Raw Response:", quiz_content)

        # ✅ Extract JSON content
        parsed_json = extract_json(quiz_content)
        if not parsed_json:
            print("⚠️ No valid JSON extracted!")
            return {"error": "Invalid JSON format from AI", "raw": quiz_content}, 500

        # ✅ Ensure "quiz" object exists
        if "quiz" in parsed_json:
            return parsed_json["quiz"], 200
        else:
            print("⚠️ 'quiz' object missing in response!")
            return {"error": "Quiz object missing", "raw": parsed_json}, 500

    except Exception as e:
        print(f"🚨 Error calling Groq API: {str(e)}")
        return {"error": f"Groq API call failed: {str(e)}"}, 500