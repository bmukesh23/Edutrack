import os
import jwt
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from assessment import generate_assessment, generate_course, async_generate_course
from datetime import datetime, timedelta
from functools import wraps
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.getenv("SECRET_KEY")

# MongoDB Setup
try:
    mongo_uri = os.getenv("MONGO_URI")
    client = MongoClient(mongo_uri)
    db = client["edutrack"]
    users_collection = db["users"]
    assessments_collection = db["assessments"]
    courses_collection = db["courses"]
    print("Connected to MongoDB")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    exit(1)

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

# Home Route
@app.route("/", methods=["GET"])
def greet():
    return jsonify({"message": "Hello, Welcome to the Edutrack server!"})

# Favicon Route
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'logo.svg', mimetype='image/svg+xml')

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
        print("Received Data:", data)

        if data is None:
            return jsonify({"error": "No data received"}), 400

        required_fields = ["questions", "score", "total_questions"]

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

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
                "timestamp": course.get("timestamp", ""),
                "chapters": course.get("course", {}).get("chapters", []),
                "totalLessons": len(course.get("course", {}).get("chapters", []))
            })

        return jsonify({"courses": formatted_courses}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Course by ID
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

if __name__ == "__main__":
    app.run(debug=True)