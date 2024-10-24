from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app) 


# MongoDB Setup
client = MongoClient("mongodb://localhost:27017/")
db = client["elearning_db"]
users_collection = db["users"]

@app.route('/', methods=['GET'])
def greet():
    return jsonify({"Hello World"})


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

if __name__ == '__main__':
    app.run(debug=True)