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
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");
  const filteredIndexes = questions
    .map((q, idx) => ({ idx, correct: userAnswers[idx] === q.correct_answer }))
    .filter(({ correct }) =>
      filter === "all" ? true : filter === "correct" ? correct : !correct
    )
    .map((x) => x.idx);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4 sm:px-6">
      <div className="container mx-auto">
        <ResultHeader
          percentage={percentage}
          message={getMessage(percentage)}
          badgeTitle={getBadge(percentage)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[500px] gap-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 pb-0 flex flex-col justify-center transform transition-all duration-500 hover:shadow-3xl">
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
            {error && <p className="text-red-500 text-center mt-5">{error}</p>}
          </div>

          <div className="bg-white overflow-y-auto max-h-[600px] rounded-2xl shadow-2xl p-8 ">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              Question Review
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-6">
              <button
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  filter === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setFilter("all")}
              >
                All ({questions.length})
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  filter === "correct"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setFilter("correct")}
              >
                Correct (
                {
                  questions.filter(
                    (q, i) => userAnswers[i] === q.correct_answer
                  ).length
                }
                )
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  filter === "incorrect"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setFilter("incorrect")}
              >
                Incorrect (
                {
                  questions.filter(
                    (q, i) => userAnswers[i] !== q.correct_answer
                  ).length
                }
                )
              </button>
            </div>

            <div className="space-y-4">
              {filteredIndexes.map((index) => {
                const question = questions[index];
                const isCorrect =
                  userAnswers[index] === question.correct_answer;
                return (
                  <QuestionReviewItem
                    key={index}
                    index={index}
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
