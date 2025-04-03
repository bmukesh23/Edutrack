import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
import pickle

# Load dataset
df = pd.read_csv("training_data.csv")

# Encode categorical variables
label_encoder_subject = LabelEncoder()
label_encoder_goal = LabelEncoder()
label_encoder_difficulty = LabelEncoder()

df["subject_encoded"] = label_encoder_subject.fit_transform(df["subject"])
df["learning_goal_encoded"] = label_encoder_goal.fit_transform(df["learning_goal"])
df["difficulty_encoded"] = label_encoder_difficulty.fit_transform(df["difficulty"])

# Rename 'accuracy' to 'score_ratio' for consistency
df.rename(columns={"accuracy": "score_ratio"}, inplace=True)

# Features & target
X = df[["score_ratio", "subject_encoded", "learning_goal_encoded"]]
y = df["difficulty_encoded"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# SVM Model (Linear Kernel with Regularization)
svm_model = SVC(kernel="linear", C=0.1)  # Lower C means stronger regularization
svm_model.fit(X_train, y_train)

svm_test_accuracy = svm_model.score(X_test, y_test)
svm_cv_scores = cross_val_score(svm_model, X, y, cv=5)

# Print results
print(f"SVM Test Accuracy: {svm_test_accuracy * 100:.2f}%")
print(f"SVM Cross-Validation Accuracy: {svm_cv_scores.mean() * 100:.2f}% (±{svm_cv_scores.std() * 100:.2f}%)")

# Save the trained model and label encoders to a pickle file
with open("difficulty_model.pkl", "wb") as f:
    pickle.dump((svm_model, label_encoder_subject, label_encoder_goal, label_encoder_difficulty), f)