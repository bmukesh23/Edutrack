import os
import jwt
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from assessment import generate_assessment, generate_course, async_generate_course, generate_notes, generate_quiz_from_course
from datetime import datetime, timedelta
from functools import wraps
from bson import ObjectId
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.getenv("SECRET_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
)

# MongoDB Setup
try:
    mongo_uri = os.getenv("MONGO_URI")
    client = MongoClient(mongo_uri)
    db = client["edutrack"]
    users_collection = db["users"]
    assessments_collection = db["assessments"]
    courses_collection = db["courses"]
    notes_collection = db["notes"]
    print("Connected to MongoDB")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    exit(1)

# Home Route
@app.route("/", methods=["GET"])
def greet():
    return jsonify({"message": "Hello, Welcome to the Edutrack server!"})

# Favicon Route
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'logo.svg', mimetype='image/svg+xml')


# JWT Token Required Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            token = token.split(" ")[1]  # Remove "Bearer " prefix
            decoded_data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_email = decoded_data.get("email")

            if not user_email:
                return jsonify({"error": "Invalid token"}), 401

            return f(user_email, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    return decorated

# Sign-Up/Login Route (Returns JWT Token)
@app.route("/api/auth", methods=["POST"])
def auth():
    user_data = request.json
    if not user_data.get("email"):
        return jsonify({"error": "Email is required"}), 400
    
    try:
        existing_user = users_collection.find_one({"email": user_data["email"]})

        if not existing_user:
            users_collection.insert_one(user_data)

        # Generate JWT Token
        token = jwt.encode(
            {
                "email": user_data["email"],
                "exp": datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({"message": "Login successful!", "token": token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch Logged-in User Data
@app.route("/api/users/me", methods=["GET"])
@token_required
def get_current_user(user_email):
    try:
        user = users_collection.find_one({"email": user_email}, {"_id": 0, "name": 1, "email": 1, "photoURL": 1})
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch All Users (Admin Route)
@app.route("/api/users", methods=["GET"])
@token_required
def get_all_users(user_email):
    try:
        users = list(users_collection.find({}, {"_id": 0, "name": 1, "email": 1, "photoURL": 1}))
        return jsonify(users), 200 if users else jsonify({"error": "No users found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Save Preferences
@app.route("/save-preferences", methods=["POST"])
@token_required
def save_preferences(user_email):
    data = request.json
    try:
        users_collection.update_one(
            {"email": user_email},
            {"$set": {"preferences": data}},
            upsert=True
        )
        return jsonify({"message": "Preferences saved", "user_email": user_email}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate Assessment
@app.route("/generate-assessment", methods=["POST"])
@token_required
def generate_assessment_route(user_email):
    quiz_response, status_code = generate_assessment(user_email)
    return jsonify(quiz_response), status_code

# Save Assessment
@app.route("/api/save-assessment", methods=["POST"])
@token_required
def save_assessment(user_email):
    try:
        data = request.json

        if data is None:
            return jsonify({"error": "No data received"}), 400

        required_fields = ["questions", "score", "total_questions"]

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Retrieve user preferences
        user = users_collection.find_one({"email": user_email})
        if not user or "preferences" not in user:
            return jsonify({"error": "User preferences not found"}), 404

        preferences = user["preferences"]
        subject = preferences.get("subjects", "General Knowledge")
        learning_goal = preferences.get("learningGoal", "Learning")

        # Add subject and learning goal to assessment data
        data["subject"] = subject
        data["learning_goal"] = learning_goal

        # Store the assessment with the additional fields
        data["email"] = user_email
        data["timestamp"] = datetime.utcnow().isoformat()

        assessments_collection.insert_one(data)
        print("New assessment saved successfully.")

        # Trigger async course generation
        async_generate_course(user_email)

        return jsonify({"message": "Assessment saved. Course generation in progress."}), 200

    except Exception as e:
        print("Error in save_assessment:", str(e))
        return jsonify({"error": str(e)}), 500

# Get Assessment
@app.route("/api/get-assessment", methods=["GET"])
@token_required
def get_assessment(user_email):
    assessment = assessments_collection.find_one({"email": user_email}, {"_id": 0})
    
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    return jsonify(assessment), 200

# Generate Course
@app.route("/generate-course", methods=["POST"])
@token_required
def generate_course_route(user_email):
    course_response, status_code = generate_course(user_email)
    return jsonify(course_response), status_code

# Get Courses
@app.route("/api/get-courses", methods=["GET"])
@token_required
def get_courses(user_email):
    try:
        courses = list(
            courses_collection.find(
                {"email": user_email}, 
                {
                    "_id": 1, 
                    "course.course_title": 1, 
                    "course.course_summary": 1, 
                    "course.category": 1,
                    "course.difficulty": 1,
                    "timestamp": 1, 
                    "course.chapters": 1
                }
            )
        )

        if not courses:
            return jsonify({"error": "No courses found"}), 404

        formatted_courses = []
        for course in courses:
            formatted_courses.append({
                "_id": str(course.get("_id")),
                "course_title": course.get("course", {}).get("course_title", ""),
                "course_summary": course.get("course", {}).get("course_summary", ""),
                "category": course.get("course", {}).get("category", ""),
                "difficulty": course.get("course", {}).get("difficulty", ""),
                "timestamp": course.get("timestamp", ""),
                "chapters": course.get("course", {}).get("chapters", []),
                "totalLessons": len(course.get("course", {}).get("chapters", []))
            })

        return jsonify({"courses": formatted_courses}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Courses by ID
@app.route("/api/courses/<course_identifier>", methods=["GET"])
@token_required
def get_course_details(user_email, course_identifier):
    try:
        if course_identifier:
            course = courses_collection.find_one({"_id": course_identifier, "email": user_email})
        else:
            return jsonify({"error": "Invalid course ID format"}), 400
        
        if not course:
            return jsonify({"error": "Course not found"}), 404

        formatted_course = {
            "_id": str(course.get("_id")),
            "course_title": course.get("course", {}).get("course_title", ""),
            "course_summary": course.get("course", {}).get("course_summary", ""),
            "timestamp": course.get("timestamp", ""),
            "chapters": course.get("course", {}).get("chapters", []),
            "totalLessons": len(course.get("course", {}).get("chapters", []))
        }

        return jsonify(formatted_course), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate Notes by course ID
@app.route("/api/generate-notes/<notes_identifier>", methods=["POST"])
@token_required
def generate_notes_route(user_email, notes_identifier):
    print(notes_identifier)
    response, status_code = generate_notes(user_email, notes_identifier)
    return jsonify(response), status_code

# Get Notes with YouTube Videos
@app.route("/api/notes/<course_id>", methods=["GET"])
@token_required
def get_notes(user_email, course_id):
    try:
        print(f"Fetching notes for course_id: {course_id} and email: {user_email}")
        notes_entry = notes_collection.find_one({"course_id": course_id, "email": user_email})
        
        if not notes_entry:
            print("No notes found in DB.")
            return jsonify({"error": "No notes found for this course."}), 404

        # Ensure each chapter includes a YouTube video link
        notes = notes_entry.get("notes", {})
        for chapter in notes.get("chapters", []):
            chapter["video"] = chapter.get("video", "")

        # Remove unnecessary fields before returning
        notes_entry.pop("_id", None)

        return jsonify({"notes": notes}), 200
    except Exception as e:
        print("Error fetching notes:", str(e))
        return jsonify({"error": str(e)}), 500


# Generate quiz based on course ID
@app.route("/api/generate-quiz/<course_id>", methods=["POST"])
@token_required
def generate_quiz_route(user_email, course_id):
    response, status_code = generate_quiz_from_course(user_email, course_id)
    return jsonify(response), status_code

# Get quizzes based on course ID
@app.route("/api/get-quiz/<course_id>", methods=["GET"])
def get_quiz(course_id):
    quiz = assessments_collection.find_one({"course_id": course_id})
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify({"quiz": quiz["quiz"]}), 200


@app.route("/api/ask-ai", methods=["POST"])
def ask_ai():
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        prompt = f"You are a helpful AI assistant for an educational platform. Answer this course-related question in 40 words:\n\n{question}"
        print(f"[ASK-AI] Prompt: {prompt}")
        
        response = model.generate_content(prompt)
        print(f"[ASK-AI] Raw Response: {response.text}")
        
        answer = response.text.strip()

        return jsonify({"answer": answer})
    except Exception as e:
        print("[ASK-AI] ERROR:", str(e))
        return jsonify({"error": "AI failed to generate a response"}), 500


if __name__ == "__main__":
    app.run(debug=True)