import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface FeedbackAnimationProps {
  isCorrect: boolean;
  isVisible: boolean;
  duration?: number;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  isCorrect,
  isVisible,
}) => {
  const [animationStatus, setAnimationStatus] = useState("hidden");
  useEffect(() => {
    if (isVisible && animationStatus === "hidden") {
      setAnimationStatus("animate-slide-in");
    } else if (!isVisible && animationStatus !== "hidden") {
      setAnimationStatus("animate-fade-out");
      setTimeout(() => {
        setAnimationStatus("hidden");
      }, 1000);
    }
  }, [isVisible]);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`${animationStatus} flex items-center justify-center ${
          isCorrect ? "bg-green-500" : "bg-red-500"
        } text-white p-6 rounded-full shadow-xl`}
      >
        {isCorrect ? (
          <FaCheck className="text-5xl" />
        ) : (
          <FaTimes className="text-5xl" />
        )}
      </div>
    </div>
  );
};

export default FeedbackAnimation;
