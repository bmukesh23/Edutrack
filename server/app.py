from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app) 

# MongoDB Setup
client = MongoClient("mongodb://localhost:27017/")
db = client["elearning_db"]

if __name__ == '__main__':
    app.run(debug=True)