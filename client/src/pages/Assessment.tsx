import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { UserDetails, Question } from "@/utils/types";
import Navbar from "@/layouts/Navbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Assessment = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserDetails = () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const decoded: any = jwtDecode(token);
                    setUserDetails(decoded);
                    if (decoded?.email) {
                        fetchAssessment(decoded.email);
                    }
                } catch (error) {
                    setError("Invalid token");
                    console.error("Error decoding token:", error);
                    setLoading(false);
                }
            } else {
                setError("No authentication token found");
                setLoading(false);
            }
        };

        const fetchAssessment = async (email: string) => {
            try {
                const response = await axiosInstance.post("/generate-assessment", { email });
                if (response.status === 200 && response.data.questions) {
                    setQuestions(response.data.questions);
                } else {
                    setError("Failed to generate assessment.");
                }
            } catch (err) {
                setError("Error fetching assessment.");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleOptionSelect = (option: string) => {
        setSelectedOptions((prev) => ({ ...prev, [currentIndex]: option }));
    };

    const handleSubmit = async () => {
        if (!userDetails) return;
        
        const timestamp = new Date().toISOString();
        const score = questions.reduce((acc, q, idx) => (
            acc + (selectedOptions[idx] === q.answer ? 1 : 0)
        ), 0);

        const assessmentData = {
            email: userDetails.email,
            name: userDetails.name,
            timestamp,
            questions: questions.map((q, idx) => ({
                question: q.question,
                options: q.options,
                selected_option: selectedOptions[idx] || "",
                correct_answer: q.answer
            })),
            score,
            total_questions: questions.length
        };

        try {
            await axiosInstance.post("/api/save-assessment", assessmentData);
            alert("Assessment submitted successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting assessment:", error);
            alert("Failed to submit assessment.");
        }
    };

    const handleNext = () => {
        if (!selectedOptions[currentIndex]) return;
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) return <p className="text-center text-white">Loading assessment...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!userDetails) return <p className="text-center text-white">No user details found.</p>;
    if (questions.length === 0) return <p className="text-center text-white">No questions available.</p>;

    const currentQuestion = questions[currentIndex];

    return (
        <section>
            <Navbar/>
            <div className="mt-8 flex flex-col justify-center items-center bg-gray-950">
                <div className="w-full max-w-lg mb-4 flex space-x-2">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 flex-1 rounded-full transition-all ${selectedOptions[index] ? "bg-green-500" : "bg-gray-700"}`}
                        />
                    ))}
                </div>

                <div className="w-full max-w-lg p-6 bg-gray-900 shadow-lg rounded-lg text-white">
                    <h2 className="text-2xl font-bold mb-4 text-center">Initial Assessment</h2>
                    <p className="text-lg mb-4">{currentQuestion.question}</p>

                    <div className="space-y-2">
                        {currentQuestion.options.map((option: string, index: number) => (
                            <button
                                key={index}
                                className={`w-full p-3 rounded-md border transition-all ${selectedOptions[currentIndex] === option
                                        ? "bg-blue-500 text-white border-blue-400 shadow-lg"
                                        : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            className={`p-3 rounded-md font-semibold transition-all ${currentIndex > 0
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>

                        <button
                            className={`p-3 rounded-md font-semibold transition-all ${selectedOptions[currentIndex]
                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                            onClick={handleNext}
                            disabled={!selectedOptions[currentIndex]}
                        >
                            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Assessment"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Assessment;