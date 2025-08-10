import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Question } from "@/utils/types";
import Navbar from "@/layouts/Navbar";
import { useNavigate } from "react-router-dom";
import useUserDetails from "@/hook/useUserDetails";

const Assessment = () => {
    const navigate = useNavigate();
    const { userDetails } = useUserDetails();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAssessment = async () => {
            if (!userDetails?.email) return;
            try {
                const response = await axiosInstance.post("/generate-assessment", { email: userDetails.email });
                if (response.status === 200 && response.data.questions) {
                    setQuestions(response.data.questions);
                } else {
                    setError("Failed to generate assessment.");
                }
            } catch {
                setError("Error fetching assessment.");
            } finally {
                setLoading(false);
            }
        };
        if (userDetails) {
            fetchAssessment();
        }
    }, [userDetails]);

    const handleOptionSelect = (option: string) => {
        setSelectedOptions((prev) => ({ ...prev, [currentIndex]: option }));
    };

    const handleSubmit = async () => {
        if (!userDetails) return;
        setSubmitting(true);

        const timestamp = new Date().toISOString();
        const score = questions.reduce(
            (acc, q, idx) => acc + (selectedOptions[idx] === q.answer ? 1 : 0),
            0
        );

        const assessmentData = {
            email: userDetails.email,
            name: userDetails.name,
            timestamp,
            score,
            totalQuestions: questions.length
        };

        try {
            const response = await axiosInstance.post("/save-assessment", assessmentData);
            if (response.status === 201) {
                alert("Assessment submitted successfully! Course created.");
                navigate("/dashboard");
            } else {
                alert(response.data.error || "Failed to create course.");
            }
        } catch {
            alert("Failed to submit assessment.");
        } finally {
            setSubmitting(false);
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

    if (submitting) return <p className="text-center text-white p-4">Saving assessment and generating course...</p>;
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <p className="text-center text-white p-4">Loading assessment...</p>
            </div>
        );
    }
    if (error) return <p className="text-red-500 text-center p-4">{error}</p>;
    if (!userDetails) return <p className="text-center text-white p-4">No user details found.</p>;
    if (questions.length === 0) return <p className="text-center text-white p-4">No questions available.</p>;

    const currentQuestion = questions[currentIndex];

    return (
        <section className="min-h-screen bg-gray-950">
            <Navbar />
            <div className="mt-6 flex flex-col items-center px-4 sm:px-6 lg:px-8">

                {/* Progress Bar */}
                <div className="w-full max-w-3xl mb-4 flex space-x-1 sm:space-x-2">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 flex-1 rounded-full transition-all ${selectedOptions[index] ? "bg-green-500" : "bg-gray-700"
                                }`}
                        />
                    ))}
                </div>

                {/* Question Card */}
                <div className="w-full max-w-3xl p-4 sm:p-6 bg-gray-900 shadow-lg rounded-lg text-white">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Initial Assessment</h2>
                    <p className="text-base sm:text-lg mb-4 text-center sm:text-left">{currentQuestion.question}</p>

                    {/* Options */}
                    <div className="space-y-2">
                        {currentQuestion.options.map((option: string, index: number) => (
                            <button
                                key={index}
                                className={`w-full p-2 sm:p-3 rounded-md border text-sm sm:text-base transition-all ${selectedOptions[currentIndex] === option
                                    ? "bg-blue-500 text-white border-blue-400 shadow-lg"
                                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                                    }`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6">
                        <button
                            className={`flex-1 sm:flex-none p-2 sm:p-3 rounded-md font-semibold text-sm sm:text-base transition-all ${currentIndex > 0
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>

                        <button
                            className={`flex-1 sm:flex-none p-2 sm:p-3 rounded-md font-semibold text-sm sm:text-base transition-all ${selectedOptions[currentIndex]
                                ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
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