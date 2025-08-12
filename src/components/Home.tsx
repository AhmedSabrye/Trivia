import { useQuizStore } from "../store/quizStore";
import { FaBrain, FaChartBar, FaClock, FaLightbulb } from "react-icons/fa";
import FeatureCard from "./subcomponents/home/FeatureCard";
import QuizForm from "./subcomponents/quiz/QuizForm";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";

export default function Home() {
  const { error, resetQuiz } = useQuizStore(
    useShallow((state) => ({
      error: state.error,
      resetQuiz: state.resetQuiz,
    }))
  );
  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);
  return (
    <div className="min-h-screen flex justify-center items-center py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center ">
          <div className="flex justify-center mb-4">
            <FaBrain className="text-5xl text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Trivia Master
          </h1>
          <p className="text-xl text-white opacity-90 mb-2">
            Test your knowledge with our challenging quiz!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-4 mb-4">
            <FeatureCard
              icon={<FaLightbulb />}
              title="Customizable"
              description="Tailor your quiz exactly how you want it"
            />
            <FeatureCard
              icon={<FaClock />}
              title="Timed"
              description="Challenge yourself with a countdown timer"
            />
            <FeatureCard
              icon={<FaChartBar />}
              title="Detailed Results"
              description="Get comprehensive quiz performance analysis"
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Customize Your Quiz
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <QuizForm />
        </div>
      </div>
    </div>
  );
}
