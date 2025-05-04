import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/quizStore";
import ResultHeader from "./subcomponents/results/ResultHeader";
import CategoryPerformance from "./subcomponents/results/CategoryPerformance";
import ActionButtons from "./subcomponents/results/ActionButtons";
import SocialSharing from "./subcomponents/results/SocialSharing";
import QuestionReviewItem from "./subcomponents/results/QuestionReviewItem";
import { useShallow } from "zustand/shallow";

const getMessage = (percentage: number) => {
  if (percentage >= 90) return "Excellent!";
  if (percentage >= 70) return "Great job!";
  if (percentage >= 50) return "Good effort!";
  return "Keep practicing!";
};

const getBadge = (percentage: number) => {
  if (percentage >= 90) return "Master";
  if (percentage >= 70) return "Expert";
  if (percentage >= 50) return "Adept";
  return "Novice";
};

export default function Results() {
  const navigate = useNavigate();
  const {
    questions,
    userAnswers,
    score,
    quizFinished,
    fetchQuestions,
    loading,
    categories: categoriesData,
    resetQuiz,
    error,
  } = useQuizStore(
    useShallow((state) => ({
      questions: state.questions,
      userAnswers: state.userAnswers,
      score: state.score,
      quizFinished: state.quizFinished,
      fetchQuestions: state.fetchQuestions,
      loading: state.loading,
      resetQuiz: state.resetQuiz,
      categories: state.categories,
      error: state.error,
    }))
  );

  const [animateScore, setAnimateScore] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAnimateScore(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (!quizFinished && questions.length === 0 && !loading && !error) {
      navigate("/");
    }
    if (!quizFinished && questions.length > 0 && !error) {
      navigate("/quiz");
    }
  }, [quizFinished, questions.length, navigate, loading, error]);

  const handleRestart = async () => {
    resetQuiz();
    await fetchQuestions();
    navigate("/quiz");
  };

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <ResultHeader
          percentage={percentage}
          message={getMessage(percentage)}
          badgeTitle={getBadge(percentage)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[500px] gap-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center transform transition-all duration-500 hover:shadow-3xl">
            <CategoryPerformance
              animateScore={animateScore}
              categoryData={categoriesData}
            />

            <ActionButtons
              loading={loading}
              onRestart={handleRestart}
              onHome={() => {
                navigate("/");
                resetQuiz();
              }}
            />
            <SocialSharing />
            {error && <p className="text-red-500 text-center mt-5">{error}</p>}
          </div>

          <div className="bg-white overflow-y-auto h-[500px] rounded-2xl shadow-2xl p-8 ">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Question Review
            </h3>

            <div className="space-y-8">
              {questions.map((question, index) => {
                let isCorrect = userAnswers[index] === question.correct_answer;

                return (
                  <QuestionReviewItem
                    key={index}
                    question={question}
                    userAnswer={userAnswers[index]}
                    isCorrect={isCorrect}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
