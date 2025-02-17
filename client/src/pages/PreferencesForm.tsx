import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/layouts/Navbar";
import useUserDetails from "@/hook/useUserDetails";

const PreferencesForm = () => {
  const [subjects, setSubjects] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const navigate = useNavigate();
  const {userDetails } = useUserDetails();

  const handleSubmit = async () => {
    if (!userDetails) {
      console.error("User not logged in");
      return;
    }

    const preferences = {
      subjects,
      skillLevel,
      learningGoal,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      await axiosInstance.post("/save-preferences", preferences);

      navigate("/assessment");
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <section>
      <Navbar />
      <div className="flex items-center justify-center mt-16">
        <div className="max-w-lg p-6 bg-gray-900 shadow-lg rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">Set Up Your Learning Preferences</h2>

          <label className="block font-medium mb-2">Enter Subjects:</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., JavaScript, Python"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />

          <label className="block font-medium mt-4 mb-2">Select Skill Level:</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <label className="block font-medium mt-4 mb-2">Select Learning Goal:</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Interview Preparation">Interview Preparation</option>
            <option value="Competitive Programming">Competitive Programming</option>
            <option value="Academic Learning">Academic Learning</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-medium transition-all"
          >
            Continue to Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreferencesForm;