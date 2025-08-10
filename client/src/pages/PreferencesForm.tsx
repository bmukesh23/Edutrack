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
  const { userDetails } = useUserDetails();

  const handleSubmit = async () => {
    if (!userDetails) {
      console.error("User not logged in");
      return;
    }

    const preferences = { subjects, skillLevel, learningGoal };

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
    <section className="min-h-screen bg-[#030712] text-white">
      <Navbar />
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="w-full max-w-lg p-6 sm:p-8 bg-gray-900 shadow-lg rounded-xl">
          <h2 className="text-lg md:text-2xl font-semibold mb-6 text-center text-white">
            Set Up Your Learning Preferences
          </h2>

          {/* Skill */}
          <label className="block font-medium text-sm sm:text-base mb-2">
            Enter Skill:
          </label>
          <select
            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Python">Python</option>
            <option value="SQL">SQL</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Go">Go</option>
            <option value="Ruby">Ruby</option>
            <option value="PHP">PHP</option>
          </select>

          {/* Skill Level */}
          <label className="block font-medium text-sm sm:text-base mt-4 mb-2">
            Select Skill Level:
          </label>
          <select
            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Learning Goal */}
          <label className="block font-medium text-sm sm:text-base mt-4 mb-2">
            Select Learning Goal:
          </label>
          <select
            className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Interview Preparation">Interview Preparation</option>
            <option value="Competitive Programming">Competitive Programming</option>
            <option value="Academic Learning">Academic Learning</option>
          </select>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-medium transition-all text-sm md:text-base"
          >
            Continue to Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export default PreferencesForm;