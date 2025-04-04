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
            <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 14px)' }}>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white max-w-3xl mx-auto mt-10">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Ask AI Anything</h2>

                    <textarea
                        rows={1}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 mb-4 resize-none"
                    />

                    <Button onClick={handleAsk} disabled={loading || question.trim() === ""} className="bg-blue-600">
                        {loading ? "Thinking..." : "Ask AI"}
                    </Button>

                    {error && <p className="text-red-400 mt-4">{error}</p>}

                    {answer && (
                        <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                            <h3 className="text-green-400 font-medium mb-2">AI Answer:</h3>
                            <div className="text-gray-300 prose prose-invert max-w-none">
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
