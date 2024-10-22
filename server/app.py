# from flask import Flask, jsonify, request
# from pymongo import MongoClient
# from bson.objectid import ObjectId

# app = Flask(__name__)

# # connect to the MongoDB
# client = MongoClient('mongodb://localhost:27017/')

# # define the db and collection
# db = client['elearning_platform']
# learners_collection = db['learners']
# assessments_collection = db['assessments']
# recommendations_collection = db['recommnedations']

# @app.route('/')
# def greet():
#     return jsonify(message='Hello World')

# if __name__=='__main__':
#     app.run(debug=True)

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key from environment variable
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Create the model with specific generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Define the prompt and history directly
chat_session = model.start_chat(
    history=[
        {
            "role": "user",
            "parts": [
                "generate 5 difficult-level multiple-choice questions on Mathematics and Science.",
            ],
        },
        # {
        #     "role": "model",
        #     "parts": [
        #         """## Python Beginner Quiz:
        #         **1. What is the correct syntax to print "Hello World" in Python?**
        #         a) `print("Hello World")`
        #         b) `display("Hello World")`
        #         c) `print("Hello World";)`
        #         d) `echo("Hello World")`

        #         **2. What data type is used to store a whole number in Python?**
        #         a) `string`
        #         b) `float`
        #         c) `integer`
        #         d) `boolean`

        #         **3. What is the output of the following code?**
        #         ```python
        #         print(10 + 5 * 2)
        #         ```
        #         a) 15
        #         b) 20
        #         c) 30
        #         d) 100

        #         **4. Which operator is used for assigning a value to a variable in Python?**
        #         a) `=`
        #         b) `==`
        #         c) `+`
        #         d) `-`

        #         **5. What is the correct way to define a function named `my_function` in Python?**
        #         a) `function my_function():`
        #         b) `def my_function():`
        #         c) `create my_function():`
        #         d) `my_function():`
        #         """,
        #     ],
        # },
    ]
)

# Test with a custom message (replace with your own prompt if needed)
response = chat_session.send_message("Please generate more questions on Python.")
print(response.text)  # Print the response from the model to the terminal