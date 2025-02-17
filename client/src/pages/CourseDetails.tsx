import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "@/layouts/Sidebar";
import { CourseDetailsTypes } from "@/utils/types";
import axiosInstance from "@/utils/axiosInstance";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState<CourseDetailsTypes | null>(null);
  const [loading, setLoading] = useState(true);

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
    }

    fetchCourseDetails();
  }, [courseId]);

  return (
    <section className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 14px)' }}>
        {loading ? (
          <p>Loading course...</p>
        ) : courseDetails ? (
          <>
            <div className="shadow-xl bg-gray-800 p-6 rounded-lg">
              <h1 className="text-2xl font-bold">{courseDetails.course_title}</h1>
              <p className="text-gray-400 mt-2">{courseDetails.course_summary}</p>
            </div>
            <h2 className="mt-14 text-lg font-semibold bg-yellow-700 p-4 rounded-t-lg">Chapters</h2>
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
}

export default CourseDetails