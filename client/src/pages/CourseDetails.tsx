import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "@/layouts/Sidebar";
import { CourseDetailsTypes } from "@/utils/types";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState<CourseDetailsTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingNotes, setCreatingNotes] = useState(false);
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axiosInstance.get(`/api/courses/${courseId}`);

        if (response.data) {
          setCourseDetails(response.data);
          localStorage.setItem(`course-${courseId}-chapters`, response.data.totalLessons.toString());
          console.log("Course Details:", response.data);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleGenerateNotes = async () => {
    setCreatingNotes(true);
    try {
      const response = await axiosInstance.post(`/api/generate-notes/${courseId}`);
      if (response.status === 202 && response.data) {
        navigate(`/mycourses/notes/${courseId}`);
      } else {
        console.error("Failed to generate notes:", response.data);
      }
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setCreatingNotes(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setCreatingQuiz(true);
    try {
      navigate(`/mycourses/quiz/${courseId}`);
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleNotes = () => {
    navigate(`/mycourses/notes/${courseId}`);
  };

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div
        className="flex-1 px-4 pt-16 sm:p-6 md:p-8 overflow-y-auto min-w-0 md:ml-64 transition-all duration-150"
        style={{ maxHeight: "calc(100vh - 14px)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg text-gray-300">Loading course...</p>
          </div>
        ) : courseDetails ? (
          <>
            <div className="shadow-xl bg-gray-800 rounded-lg">
              <h1 className="text-lg md:text-2xl font-bold bg-blue-600 rounded-t-xl p-4">
                {courseDetails.courseTitle}
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-2 p-2 md:p-4">{courseDetails.courseSummary}</p>
              <p className="text-blue-500 text-sm md:text-base px-2 md:px-4 pb-2 md:pb-4">
                Total Chapters: {courseDetails.totalLessons}
              </p>
            </div>

            <h2 className="pt-6 font-bold text-lg sm:text-xl">Study Material</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
              {/* Notes */}
              <div className="bg-gray-800 p-4 mt-2 rounded-lg">
                <p className="flex items-center justify-center text-5xl sm:text-6xl">📝</p>
                <p className="font-semibold mt-2">Notes/Chapters</p>
                <p className="text-xs sm:text-[13px] font-semibold text-gray-400">
                  Read Notes to prepare it
                </p>
                <div className="flex flex-row justify-center items-center sm:flex-row sm:justify-center mt-2 gap-2">
                  <Button
                    className="bg-blue-500 px-4 py-1 rounded-md text-sm font-semibold hover:bg-blue-700"
                    onClick={handleGenerateNotes}
                    disabled={creatingNotes}
                  >
                    {creatingNotes ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    onClick={handleNotes}
                    className="bg-green-500 px-4 py-1 rounded-md text-sm font-semibold hover:bg-green-700"
                  >
                    View
                  </Button>
                </div>
              </div>

              {/* Quiz */}
              <div className="bg-gray-800 p-4 mt-2 rounded-lg">
                <p className="flex items-center justify-center text-5xl sm:text-6xl">💡</p>
                <p className="font-semibold mt-2">Quiz</p>
                <p className="text-xs sm:text-[13px] font-semibold text-gray-400">
                  Great way to test your knowledge
                </p>
                <Button
                  className="bg-blue-500 px-4 py-1 mt-2 rounded-md text-sm font-semibold hover:bg-blue-700"
                  onClick={handleGenerateQuiz}
                  disabled={creatingQuiz}
                >
                  {creatingQuiz ? "Generating..." : "Generate"}
                </Button>
              </div>

              {/* Q/A */}
              <div className="bg-gray-800 p-4 mt-2 rounded-lg">
                <p className="flex items-center justify-center text-5xl sm:text-6xl">💬</p>
                <p className="font-semibold mt-2">Question/Answer</p>
                <p className="text-xs sm:text-[13px] font-semibold text-gray-400">
                  Help to practice your learning
                </p>
                <button className="bg-gray-500 px-4 py-1 mt-2 text-gray-300 rounded-md text-sm font-semibold cursor-default">
                  Coming Soon
                </button>
              </div>
            </div>

            <h2 className="mt-10 text-base sm:text-lg font-semibold bg-yellow-700 p-4 rounded-t-lg">
              Chapters
            </h2>
            <ul className="mt-2">
              {courseDetails.chapters.map((chapter, index) => (
                <li key={index} className="p-3 bg-gray-800 mt-2 rounded-lg">
                  <h3 className="font-medium">{chapter.chapter_title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                    {chapter.chapter_summary}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg text-gray-300">No course found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseDetails;