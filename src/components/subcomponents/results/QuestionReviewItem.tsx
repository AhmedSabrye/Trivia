import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { decode } from "he";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuestionReviewItemProps {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  index?: number;
}

const QuestionReviewItem: React.FC<QuestionReviewItemProps> = ({
  question,
  userAnswer,
  isCorrect,
  index,
}) => (
  <div
    className={`relative rounded-xl border border-l-5 p-5 bg-white shadow-sm hover:shadow-md transition-shadow ${
      isCorrect ? "border-green-200" : "border-red-200"
    }
    ${isCorrect ? " border-green-500" : " border-red-500"}
    `}
  >
    <div className="flex gap-3">
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isCorrect ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}
        aria-label={isCorrect ? "Correct" : "Incorrect"}
      >
        {isCorrect ? (
          <FaCheck className="text-lg" />
        ) : (
          <FaTimes className="text-lg" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1 text-xs text-gray-500">
          {typeof index === "number" && (
            <span className="font-semibold">#{index + 1}</span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {question.difficulty.toUpperCase()}
          </span>
          {question.category && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {question.category}
            </span>
          )}
        </div>

        <h4 className="text-base md:text-lg font-semibold text-gray-800">
          {decode(question.question)}
        </h4>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Your answer</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isCorrect
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {decode(userAnswer || "No answer")}
            </span>
          </div>

          {!isCorrect ? (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Correct</span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                {decode(question.correct_answer)}
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
                Well done
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default QuestionReviewItem;
