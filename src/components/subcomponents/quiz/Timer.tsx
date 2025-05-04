import { useEffect, useState, useRef } from "react";
import { useQuizStore } from "../../../store/quizStore";
import { useShallow } from "zustand/shallow";

export default function Timer({
  isAnswerSubmitted,
  handleSubmit,
}: {
  isAnswerSubmitted: boolean;
  handleSubmit: () => void;
}) {
  const { questions, currentQuestionIndex, submitAnswer } = useQuizStore(
    useShallow((state) => ({
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      submitAnswer: state.submitAnswer,
    }))
  );
  const indexRef = useRef(currentQuestionIndex);
  const [timeLeftWarning, setTimeLeftWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const decrementTimer = () => {
    if (timeLeft > 0) {
      setTimeLeft((prev) => prev - 1);
    } else {
      submitAnswer("");
    }
  };

  const startTimer = () => {
    setTimeLeft(15);
  };

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setTimeLeftWarning(true);
    } else {
      setTimeLeftWarning(false);
    }

    if (timeLeft === 0 && !isAnswerSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isAnswerSubmitted, handleSubmit]);

  useEffect(() => {
    if (indexRef.current !== currentQuestionIndex) {
      indexRef.current = currentQuestionIndex;
      startTimer();
    }
    if (
      questions.length > 0 &&
      currentQuestionIndex < questions.length &&
      !isAnswerSubmitted
    ) {
      const timer = setInterval(() => {
        decrementTimer();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [
    currentQuestionIndex,
    decrementTimer,
    isAnswerSubmitted,
    questions.length,
    startTimer,
  ]);

  return (
    <span
      className={`font-bold ${
        timeLeftWarning ? "text-red-300 animate-pulse" : ""
      }`}
    >
      {timeLeft}s
    </span>
  );
}
