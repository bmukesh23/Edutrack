from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# connect to the MongoDB
client = MongoClient('mongodb://localhost:27017/')

# define the db and collection
db = client['elearning_platform']
learners_collection = db['learners']
assessments_collection = db['assessments']
recommendations_collection = db['recommnedations']

@app.route('/')
def greet():
    return jsonify(message='Hello World')

if __name__=='__main__':
    app.run(debug=True)