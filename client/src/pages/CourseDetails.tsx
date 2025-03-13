import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "@/layouts/Sidebar";
import { CourseDetailsTypes } from "@/utils/types";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

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
      await axiosInstance.post(`/api/generate-notes/${courseId}`);

      const pollForNotes = async () => {
        try {
          const response = await axiosInstance.get(`/api/notes/${courseId}`);
          if (response.status === 200 && response.data) {
            navigate(`/mycourses/notes/${courseId}`);
          } else {
            setTimeout(pollForNotes, 5000);
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            setTimeout(pollForNotes, 5000);
          } else {
            console.error("Error fetching notes:", error);
            setCreatingNotes(false);
          }
        }
      }

      pollForNotes();
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setCreatingNotes(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setCreatingQuiz(true);
    try {
      await axiosInstance.post(`/api/generate-quiz/${courseId}`);

      const pollForQuiz = async () => {
        try {
          const response = await axiosInstance.get(`/api/get-quiz/${courseId}`);
          if (response.status === 200 && response.data) {
            navigate(`/mycourses/quiz/${courseId}`);
          } else {
            setTimeout(pollForQuiz, 5000);
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            setTimeout(pollForQuiz, 5000);
          } else {
            console.error("Error fetching quiz:", error);
            setCreatingQuiz(false);
          }
        }
      }

      pollForQuiz();
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleNotes = async () => {
    navigate(`/mycourses/notes/${courseId}`);
  }

  const handleQuiz = async () => {
    navigate(`/mycourses/quiz/${courseId}`);
  }

  return (
    <section className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 14px)" }}>
        {loading ? (
          <p>Loading course...</p>
        ) : courseDetails ? (
          <>
            <div className="shadow-xl bg-gray-800 rounded-lg">
              <h1 className="text-2xl font-bold bg-blue-600 rounded-t-xl p-4">{courseDetails.course_title}</h1>
              <p className="text-gray-400 mt-2 p-4">{courseDetails.course_summary}</p>
              <p className="text-blue-500 px-4 pb-4">Total Chapters: {courseDetails.totalLessons}</p>
            </div>

            <h2 className="pt-6 font-bold text-xl">Study Material</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800 p-4 mt-2 rounded-lg">
                <p className="flex items-center justify-center text-6xl text-center">📝</p>
                <p className="font-semibold">Notes/Chapters</p>
                <p className="text-[13px] font-semibold text-gray-400">Read Notes to prepare it</p>
                <Button
                  className="bg-blue-500 px-4 py-1 mt-2 mr-2 rounded-md text-sm font-semibold hover:bg-blue-700"
                  onClick={handleGenerateNotes}
                  disabled={creatingNotes}
                >
                  {creatingNotes ? "Generating..." : "Generate"}
                </Button>

                <Button
                  onClick={handleNotes}
                  className="bg-green-500 px-4 py-1 mt-2 rounded-md text-sm font-semibold hover:bg-green-700"
                >
                  View
                </Button>
              </div>

              <div className="bg-gray-800 p-4 mt-2 rounded-lg">
                <p className="flex items-center justify-center text-6xl text-center">💡</p>
                <p className="font-semibold">Quiz</p>
                <p className="text-[13px] font-semibold text-gray-400">Great way to test your knowledge</p>

                <Button
                  className="bg-blue-500 px-4 py-1 mt-2 mr-2 rounded-md text-sm font-semibold hover:bg-blue-700"
                  onClick={handleGenerateQuiz}
                  disabled={creatingQuiz}
                >
                  {creatingQuiz ? "Generating..." : "Generate"}
                </Button>

                <Button
                  onClick={handleQuiz}
                  className="bg-green-500 px-4 py-1 mt-2 rounded-md text-sm font-semibold hover:bg-green-700"
                >
                  View
                </Button>
              </div>

              <div className="bg-gray-800 p-4 mt-2 rounded-lg">
                <p className="flex items-center justify-center text-6xl text-center">💬</p>
                <p className="font-semibold">Question/Answer</p>
                <p className="text-[13px] font-semibold text-gray-400">Help to practice your learning</p>
                <button className="bg-gray-500 px-4 py-1 mt-2 text-gray-300 rounded-md text-sm font-semibold cursor-default">Coming Soon</button>
              </div>
            </div>

            <h2 className="mt-10 text-lg font-semibold bg-yellow-700 p-4 rounded-t-lg">Chapters</h2>
            <ul className="mt-2">
              {courseDetails.chapters.map((chapter, index) => (
                <li key={index} className="p-3 bg-gray-800 mt-2 rounded-lg">
                  <h3 className="font-medium">{chapter.chapter_title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{chapter.chapter_summary}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No course found</p>
        )}
      </div>
    </section>
  );
};

export default CourseDetails;