import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import Sidebar from "@/layouts/Sidebar";
import { useNavigate } from "react-router-dom";

interface Topic {
  topic_title: string;
  key_points: string[];
  notes: string;
}

interface Chapter {
  chapter_title: string;
  chapter_summary: string;
  topics: Topic[];
  video: string;
}

const Notes = () => {
  const { courseId } = useParams();
  const [notes, setNotes] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const markAsCompleted = () => {
    setIsCompleted(true);
    localStorage.setItem(`course-${courseId}-completed`, "true");
  };

  useEffect(() => {
    const completed = localStorage.getItem(`course-${courseId}-completed`);
    if (completed) {
      setIsCompleted(true);
    }
  }, [courseId]);

  useEffect(() => {
    const pollNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axiosInstance.get(`/api/notes/${courseId}`);
        const data = response.data;

        if (Array.isArray(data)) {
          setNotes(data);

          const expectedChapters = parseInt(localStorage.getItem(`course-${courseId}-chapters`) || "0");
          if (expectedChapters > 0 && data.length >= expectedChapters) {
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }

      setTimeout(pollNotes, 5000);
    };

    pollNotes();
  }, [courseId]);

  const nextChapter = () => {
    if (currentIndex < notes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div
        className="flex-1 px-4 pt-12 md:p-8 overflow-y-auto min-w-0 md:ml-64 transition-all duration-150"
        style={{ maxHeight: "calc(100vh - 14px)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[calc(100vh-14px)] text-center">
            <p className="text-white text-lg sm:text-xl px-4">
              Generating notes... This may take a few minutes.
            </p>
          </div>
        ) : notes.length > 0 ? (
          <div>
            <div className="flex justify-between my-6">
              <Button
                className="bg-fuchsia-600 text-xs px-3 md:text-base sm:px-4 sm:py-2"
                onClick={prevChapter}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>

              <div className="w-full max-w-3xl m-4 flex space-x-2">
                {notes.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all ${index <= currentIndex ? "bg-green-500" : "bg-gray-700"
                      }`}
                  />
                ))}
              </div>

              <Button
                className="bg-green-600 text-xs px-3 py-1 md:text-base sm:px-4 sm:py-2"
                onClick={nextChapter}
                disabled={currentIndex === notes.length - 1}
              >
                Next
              </Button>
            </div>


            <h3 className="bg-yellow-700 rounded-t-lg p-2 text-lg md:text-xl font-semibold">{notes[currentIndex].chapter_title}</h3>
            <p className="mb-4 bg-gray-800 p-2 text-xs md:text-sm rounded-b-lg">{notes[currentIndex].chapter_summary}</p>

            {notes[currentIndex]?.video && (
              <div className="my-4">
                <h4 className="text-lg font-semibold text-blue-400">Related Video:</h4>
                <div className="relative w-full max-w-3xl h-64 sm:h-80 md:h-96 mx-auto">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={notes[currentIndex].video.replace("watch?v=", "embed/")}
                    title="Chapter Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="mt-4">
              {notes[currentIndex].topics.length > 0 ? (
                <div className="list-disc list-inside">
                  {notes[currentIndex].topics.map((topic, idx) => (
                    <div key={idx} className="mb-2">
                      <h5 className="font-medium bg-blue-800 rounded-t-lg p-2">{topic.topic_title}</h5>
                      <div className="bg-gray-800 p-2 text-sm rounded-b-lg">
                        <p className="italic text-green-400">
                          KeyNotes:
                          {topic.key_points.length > 0 ? (
                            <ol className="list-decimal list-inside ml-4 text-sm text-gray-300 not-italic">
                              {topic.key_points.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-sm text-gray-400 not-italic">No key points available.</p>
                          )}
                        </p>
                        <p className="italic text-purple-500">Note: <span className="text-sm text-gray-300 not-italic text-justify">{topic.notes}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No topics available.</p>
              )}
            </div>

            {currentIndex === notes.length - 1 && !isCompleted && (
              <Button className="mt-6 bg-green-500" onClick={markAsCompleted}>
                Mark as Completed
              </Button>
            )}
          </div>
        ) : (
          <p>No notes available.</p>
        )}

        <Button
          className="mt-6 bg-red-500"
          onClick={() => navigate(`/mycourses/${courseId}`)}
        >
          Back to Course
        </Button>
      </div>
    </section>
  );
};

export default Notes;