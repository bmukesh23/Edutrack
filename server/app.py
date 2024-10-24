from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from llamaModel import generate_mcqs  

app = Flask(__name__)
CORS(app)

# MongoDB Setup
client = MongoClient("mongodb://localhost:27017/")
db = client["elearning_db"]
users_collection = db["users"]

# Home route
@app.route('/', methods=['GET'])
def greet():
    return "Hello World"

# User Signup
@app.route('/api/signup', methods=['POST'])
def signup():
    user_data = request.json
    try:
        existing_user = users_collection.find_one({"email": user_data["email"]})
        if existing_user:
            return jsonify({"message": "User already exists, logging in!"}), 200

        users_collection.insert_one(user_data)
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Submit Learner Preferences
@app.route('/api/learners', methods=['POST'])
def submit_learner():
    learner_data = request.json
    try:
        result = users_collection.update_one(
            {"email": learner_data["email"]},
            {"$set": {"profile": learner_data["profile"]}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "User not found."}), 404
        return jsonify({"message": "Learner profile updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch All Users
@app.route('/api/users', methods=['GET'])
def get_first_user():
    try:
        # Fetch only the first document and limit the projection
        user = users_collection.find_one(
            {}, 
            {
                "_id": 0,
                "name": 1,
                "email": 1,
                "photoURL": 1,
                "profile.interests": 1,
                "profile.past_courses": 1,
                "profile.goals": 1
            }
        )
        
        # Format the user document to move profile fields to the top level
        if user:
            formatted_user = {
                "name": user.get("name"),
                "email": user.get("email"),
                "photoURL": user.get("photoURL"),
                "interests": user.get("profile", {}).get("interests", []),
                "past_courses": user.get("profile", {}).get("past_courses", []),
                "goals": user.get("profile", {}).get("goals", "")
            }

            return jsonify(formatted_user), 200
        else:
            return jsonify({"error": "No user found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# helper function to share user data to generate quiz
def get_user_data(email):
    # Try fetching the user from the database and print the result
    user = users_collection.find_one(
        {"email": email},
        {
            "_id": 0,
            "profile.interests": 1,
            "profile.past_courses": 1,
            "profile.goals": 1
        }
    )
    

    if user:
        # Debugging: print extracted profile information
        profile_data = {
            "interests": user.get("profile", {}).get("interests", []),
            "past_courses": user.get("profile", {}).get("past_courses", []),
            "goals": user.get("profile", {}).get("goals", "")
        }
        return profile_data
    else:
        # If no user is found, print that the user was not found
        print(f"No user found with email: {email}")
        return None

# generates quizzes based on user preferences
@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz_route():
    data = request.json
    email = data.get("email")
    print(f"Email received in generate_quiz_route: {email}")  

    try:
        user_data = get_user_data(email)
        if not user_data:
            return jsonify({"error": "User not found."}), 404
        
        interests = user_data.get("interests", [])
        past_courses = user_data.get("past_courses", [])
        goals = user_data.get("goals", [])

        # Create a prompt based on user data
        prompt = "Generate multiple-choice questions based on the following information:\n"
        prompt += f"Interests: {', '.join(interests)}\n"
        prompt += f"Past Courses: {', '.join(past_courses)}\n"
        prompt += f"Goals: {goals}\n"
        prompt += "Please provide 5 intermediate-level questions."

        mcqs = generate_mcqs(prompt)  # Call the MCQ generation function
        print("Generated MCQs:", mcqs)  # Debugging line to see the generated MCQs

        return jsonify(mcqs), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)