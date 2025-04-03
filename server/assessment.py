# import os
# import json
# import re
# import google.generativeai as genai
# from dotenv import load_dotenv
# from pymongo import MongoClient
# from datetime import datetime
# from bson import ObjectId 
# from threading import Thread
# from flask import jsonify
# import pickle
# import numpy as np

# load_dotenv()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# mongo_uri = os.getenv("MONGO_URI")
# client = MongoClient(mongo_uri)
# db = client["edutrack"]
# users_collection = db["users"]
# assessments_collection = db["assessments"]
# courses_collection = db["courses"]
# notes_collection = db["notes"]

# generation_config = {
#     "temperature": 1,
#     "top_p": 0.95,
#     "top_k": 40,
#     "max_output_tokens": 8192,
#     "response_mime_type": "text/plain",
# }

# model = genai.GenerativeModel(
#     model_name="gemini-2.0-flash",
#     generation_config=generation_config,
# )


# # Load the trained model and label encoders
# try:
#     with open("difficulty_model.pkl", "rb") as f:
#         svm_model, label_encoder_subject, label_encoder_goal, label_encoder_difficulty = pickle.load(f)
#     print("Model and encoders loaded successfully!")
# except Exception as e:
#     print(f"Error loading model: {e}")
#     svm_model = None

# # Handler for generating assessment
# def async_generate_course(user_email):
#     def background_task(user_email):
#         try:
#             generate_course(user_email)
#         except Exception as e:
#             print(f"Error in async course generation: {e}")

#     Thread(target=background_task, args=(user_email,)).start()
#     return jsonify({"message": "Assessment saved. Course generation in progress."}), 200

# # Helper function to extract JSON object from text
# def extract_json(text):
#     try:
#         match = re.search(r"```json\s*([\s\S]*?)\s*```", text)
#         if match:
#             json_text = match.group(1).strip()
#         else:
#             match = re.search(r"(\{.*\})", text, re.DOTALL)
#             json_text = match.group(1).strip() if match else None

#         # return json.loads(json_text) if json_text else None

#         # Attempt to fix minor JSON issues before parsing
#         if json_text:
#             json_text = re.sub(r",\s*}", "}", json_text)  # Remove trailing commas
#             json_text = re.sub(r",\s*\]", "]", json_text)
#             return json.loads(json_text)
#     except json.JSONDecodeError as e:
#         print("JSON Decode Error:", e)
#         return None

# # Generate assessment based on user preferences
# def generate_assessment(user_email):
#     user = users_collection.find_one({"email": user_email})
#     if not user or "preferences" not in user:
#         return {"error": "User preferences not found"}, 404

#     preferences = user["preferences"]
#     subject = preferences.get("subjects", "General Knowledge")
#     skill_level = preferences.get("skillLevel", "Beginner")

#     prompt = (
#         f"Generate a {skill_level} level quiz on the topic: {subject} with 5-10 multiple-choice questions."
#         "Format it strictly in JSON with a 'quiz' object containing 'title' and 'questions', 'questions' object with 'question', 'answer' and 'options'."
#     )

#     chat_session = model.start_chat(history=[{"role": "user", "parts": [prompt]}])
#     response = chat_session.send_message("Generate quiz")
#     # print("RAW GEMINI RESPONSE:", response.text)

#     parsed_json = extract_json(response.text)
#     # print(parsed_json)
#     return (parsed_json["quiz"], 200) if parsed_json and "quiz" in parsed_json else ({"error": "Invalid JSON format"}, 500)

# # Generate course based on user assessment
# def generate_course(user_email):
#     if not svm_model:
#         return {"error": "Model not loaded"}, 500

#     # Fetch the user's most recent assessment data
#     assessment = assessments_collection.find_one({"email": user_email}, sort=[("timestamp", -1)])
#     if not assessment:
#         return {"error": "No assessment data found for the user."}, 404

#     subject = assessment.get("subject", "General Knowledge")
#     learning_goal = assessment.get("learning_goal", "Learning")
#     user_score = assessment.get("score", 0)
#     total_questions = assessment.get("total_questions", 1)
    
#     # Avoid division errors
#     score_ratio = user_score / total_questions if total_questions else 0

#     # Handle unseen subjects and goals
#     if subject not in label_encoder_subject.classes_:
#         subject_encoded = -1  # Default or unknown class encoding
#     else:
#         subject_encoded = label_encoder_subject.transform([subject])[0]
    
#     if learning_goal not in label_encoder_goal.classes_:
#         learning_goal_encoded = -1
#     else:
#         learning_goal_encoded = label_encoder_goal.transform([learning_goal])[0]
    
#     # Prepare the feature vector
#     X_new = np.array([[score_ratio, subject_encoded, learning_goal_encoded]])
    
#     try:
#         predicted_difficulty_encoded = svm_model.predict(X_new)[0]
#         difficulty = label_encoder_difficulty.inverse_transform([predicted_difficulty_encoded])[0]
#     except Exception as e:
#         return {"error": "Failed to predict difficulty."}, 500
    
#     # Generate the course using AI model
#     prompt = (
#         f"Generate a study material for {subject} {learning_goal}. "
#         f"The level of difficulty should be {difficulty}. "
#         "Provide a summary of the course, a list of chapters with summaries, "
#         "Format it strictly in JSON with a 'course' object containing 'difficulty', 'category', 'course_title', 'course_summary', 'chapters' "
#         "and 'chapters' object with 'chapter_title', 'chapter_summary', 'topics'"
#     )

#     chat_session = model.start_chat(history=[{"role": "user", "parts": [prompt]}])
#     response = chat_session.send_message("Generate course")
    
#     parsed_json = extract_json(response.text)
#     if not parsed_json or "course" not in parsed_json:
#         return {"error": "Invalid JSON format"}, 500
    
#     # Save course to database
#     parsed_json["_id"] = str(ObjectId())
#     parsed_json["email"] = user_email
#     parsed_json["assessment_id"] = str(assessment["_id"])
#     parsed_json["timestamp"] = datetime.utcnow().isoformat()

#     courses_collection.insert_one(parsed_json)
    
#     return {
#         "message": "New course generated and saved successfully!",
#         "course": parsed_json,
#     }, 201

# # Generate notes based on course ID
# def generate_notes(user_email, course_id):
#     try:
#         course = courses_collection.find_one({"_id": course_id, "email": user_email})

#         if not course:
#             return {"error": "Course not found"}, 404

#         chapters = course.get("course", {}).get("chapters", [])
#         if not chapters:
#             return {"error": "No chapters found in the course."}, 404

#         # Construct prompt for structured JSON output
#         chapter_details = "\n".join(
#             [f"Chapter {i+1}: {ch['chapter_title']} - {ch['chapter_summary']} (Topics: {', '.join(ch['topics'])})"
#              for i, ch in enumerate(chapters)]
#         )

#         prompt = (
#             "Generate detailed notes for each chapter in structured JSON format."
#             "Ensure all topic points are covered with clear explanations."
#             "Format it strictly as JSON with a 'notes' object containing a 'chapters' array."
#             "Each chapter should have 'chapter_title', 'chapter_summary', 'topic' and 'topic' object with 'key points', 'notes'."
#             f"The Chapters:\n{chapter_details}"
#         )

#         chat_session = model.start_chat(history=[{"role": "user", "parts": [prompt]}])
#         response = chat_session.send_message("Generate notes")

#         # Extract JSON from response
#         parsed_json = extract_json(response.text)
#         if not parsed_json or "notes" not in parsed_json:
#             return {"error": "Invalid JSON format"}, 500

#         # Save structured notes
#         notes_data = {
#             "course_id": str(course["_id"]),
#             "email": user_email,
#             "notes": parsed_json["notes"],  # Store JSON directly
#             "timestamp": datetime.utcnow().isoformat(),
#         }

#         notes_collection.insert_one(notes_data)
#         return {"message": "Notes generated successfully!", "notes": parsed_json["notes"]}, 201

#     except Exception as e:
#         print("Error:", str(e))
#         return {"error": str(e)}, 500

# # Generate quizzes based on course ID
# def generate_quiz_from_course(user_email, course_id):
#     try:
#         course = courses_collection.find_one({"_id": course_id, "email": user_email})
        
#         if not course:
#             return {"error": "Course not found"}, 404

#         chapters = course.get("course", {}).get("chapters", [])
#         if not chapters:
#             return {"error": "No chapters found in the course."}, 404

#         # Prepare prompt using chapter details
#         chapter_details = "\n".join(
#             [f"Chapter {i+1}: {ch['chapter_title']} - {ch['chapter_summary']} (Topics: {', '.join(ch['topics'])})"
#              for i, ch in enumerate(chapters)]
#         )

#         prompt = (
#             "Generate a quiz based on the following course chapters and topics. "
#             "The quiz should have 5-10 multiple-choice questions. "
#             "Format it strictly in JSON with a 'quiz' object containing 'quiz_title' and 'questions'. "
#             "Each question should have 'question', 'options', and 'answer'.\n"
#             f"The Chapters:\n{chapter_details}"
#         )

#         chat_session = model.start_chat(history=[{"role": "user", "parts": [prompt]}])
#         response = chat_session.send_message("Generate quiz")

#         parsed_json = extract_json(response.text)
#         if not parsed_json or "quiz" not in parsed_json:
#             return {"error": "Invalid JSON format"}, 500

#         # Save quiz to assessments collection
#         quiz_data = {
#             "email": user_email,
#             "course_id": str(course["_id"]),
#             "quiz": parsed_json["quiz"],
#             "timestamp": datetime.utcnow().isoformat()
#         }

#         assessments_collection.insert_one(quiz_data)
#         return {"message": "Quiz generated successfully!", "quiz": parsed_json["quiz"]}, 201

#     except Exception as e:
#         print("Error:", str(e))
#         return {"error": str(e)}, 500
