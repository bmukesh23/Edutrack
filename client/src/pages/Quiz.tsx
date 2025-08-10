import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import Navbar from "@/layouts/Navbar";
import useUserDetails from "@/hook/useUserDetails";
import { QuizQuestion } from "@/utils/types";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const { courseId } = useParams();
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/api/get-quiz/${courseId}`);
        if (response.data?.questions) {
          setQuizData(response.data.questions);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    let calculatedScore = 0;
    quizData.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading)
    return (
      <p className="text-white text-sm sm:text-base md:text-lg text-center p-4">
        Generating quiz... This may take a few seconds.
      </p>
    );

  if (!quizData.length)
    return (
      <p className="text-white text-sm sm:text-base md:text-lg text-center p-4">
        No quiz available for this course.
      </p>
    );

  return (
    <div className="px-3 md:px-8 pt-0 pb-3 md:pb-8 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <Navbar />

        {userDetails ? (
          <div className="flex items-center space-x-3">
            <img src={userDetails?.photoUrl} alt="User Profile" className="w-8 h-8 rounded-full" />
            <span className="font-medium text-sm sm:text-base">{userDetails.name}</span>
          </div>
        ) : (
          <span className="font-medium text-sm sm:text-base">Loading...</span>
        )}
      </div>

      {quizData.map((question, index) => (
        <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="font-semibold text-sm sm:text-base md:text-lg mb-3">
            {index + 1}. {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  disabled={submitted}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleOptionSelect(index, option)}
                  className="accent-blue-500 cursor-pointer"
                />
                <span
                  className={`text-sm sm:text-base ${
                    submitted && option === question.correctAnswer
                      ? "text-green-500"
                      : submitted && selectedAnswers[index] === option
                      ? "text-red-500"
                      : "text-white"
                  }`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>

          {submitted && selectedAnswers[index] !== question.correctAnswer && (
            <p className="text-red-500 text-xs sm:text-sm mt-2">
              Correct Answer: {question.correctAnswer}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 text-sm sm:text-base px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
          disabled={submitting || Object.keys(selectedAnswers).length !== quizData.length}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      ) : (
        <div className="flex flex-row items-center justify-center sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <p className="text-xs sm:text-sm md:text-base font-semibold bg-blue-500 px-4 sm:px-6 py-2 rounded-md">
            Your Score: {score} / {quizData.length}
          </p>

          <Button
            className="bg-red-500 text-xs sm:text-base px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-red-700"
            onClick={() => navigate(`/mycourses/${courseId}`)}
          >
            Back to the course
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;