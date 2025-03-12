import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import Sidebar from "@/layouts/Sidebar";

interface Topic {
  topic_title: string;
  key_points: string[];
  notes: string;
}

interface Chapter {
  chapter_title: string;
  chapter_summary: string;
  topics: Topic[];
}

const Notes = () => {
  const { courseId } = useParams();
  const [notes, setNotes] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axiosInstance.get(`/api/notes/${courseId}`);

        if (response.data.notes) {
          setNotes(response.data.notes.chapters);
          console.log("Course Details:", response.data.notes);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
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

      <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 14px)" }}>
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length > 0 ? (
          <div>
            {/* Navigation Buttons */}
            <div className="flex justify-between my-6">
              <Button className="bg-fuchsia-600" onClick={prevChapter} disabled={currentIndex === 0}>
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
              <Button className="bg-green-600" onClick={nextChapter} disabled={currentIndex === notes.length - 1}>
                Next
              </Button>
            </div>

            <h3 className="bg-yellow-700 rounded-t-lg p-2 text-xl font-semibold">{notes[currentIndex].chapter_title}</h3>
            <p className="mb-4 bg-gray-800 p-2 text-sm rounded-b-lg">{notes[currentIndex].chapter_summary}</p>

            {/* Topics Section */}
            <div className="mt-4">
              {notes[currentIndex].topics.length > 0 ? (
                <div className="list-disc list-inside">
                  {notes[currentIndex].topics.map((topic, idx) => (
                    <div key={idx} className="mb-2 ">
                      <h5 className="font-medium bg-blue-800 rounded-t-lg p-2">{topic.topic_title}</h5>
                      <div className="bg-gray-800 p-2 text-sm rounded-b-lg">
                        <p className="italic text-green-400">
                          KeyNotes:
                          {/* <span className="text-sm text-gray-300 not-italic">{topic.key_points[0]}</span> */}
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
                        <p className="italic text-purple-500">Note: <span className="text-sm text-gray-300 not-italic">{topic.notes}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No topics available.</p>
              )}
            </div>


          </div>
        ) : (
          <p>No notes available.</p>
        )}

        <Button className="mt-6 bg-red-500" onClick={() => window.history.back()}>
          Back to Course
        </Button>
      </div>
    </section>
  );
};

export default Notes;