import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import Sidebar from "@/layouts/Sidebar";
import ReactMarkdown from "react-markdown";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await axiosInstance.post("/api/ask-ai", { question });
      setAnswer(response.data.answer);
    } catch (err) {
      console.error("AI error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div
        className="flex-1 px-4 py-10 sm:p-6 md:p-8 overflow-y-auto min-w-0 md:ml-64 transition-all duration-150"
        style={{ maxHeight: 'calc(100vh - 14px)' }}
      >
        <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md text-white w-full max-w-3xl mx-auto mt-6 sm:mt-10">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-purple-400">
            Ask AI Anything
          </h2>

          {/* Question Box */}
          <textarea
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-900 text-white border border-gray-700 mb-4 resize-none text-sm md:text-base"
          />

          {/* Button */}
          <Button
            onClick={handleAsk}
            disabled={loading || question.trim() === ""}
            className="bg-blue-600 text-sm md:text-base px-2 sm:px-4"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </Button>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 mt-4 text-sm sm:text-base">{error}</p>
          )}

          {/* AI Answer */}
          {answer && (
            <div className="mt-6 p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="text-green-400 font-medium mb-2 text-base sm:text-lg">
                AI Answer:
              </h3>
              <div className="text-gray-300 prose prose-invert max-w-none text-justify sm:text-left text-sm sm:text-base">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AskAI;