import React from "react";
import { FaTrophy, FaCheckCircle, FaChartBar } from "react-icons/fa";

interface CategoryPerformanceProps {
  categoryData: { name: string; count: number; isCorrect: number }[];
  animateScore: boolean;
}

const CategoryPerformance: React.FC<CategoryPerformanceProps> = ({
  categoryData,
  animateScore,
}) => {
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90)
      return { label: "Excellent", color: "emerald", icon: FaTrophy };
    if (percentage >= 70)
      return { label: "Great", color: "green", icon: FaCheckCircle };
    if (percentage >= 50)
      return { label: "Good", color: "yellow", icon: FaChartBar };
    return { label: "Needs Practice", color: "red", icon: FaChartBar };
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Performance by Category
        </h3>
        <p className="text-sm text-gray-500">Your knowledge breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryData.map((data) => {
          const percentage = Math.round((data.isCorrect / data.count) * 100);
          const performance = getPerformanceLevel(percentage);
          const IconComponent = performance.icon;

          return (
            <div
              key={data.name}
              className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      performance.color === "emerald"
                        ? "bg-emerald-100 text-emerald-600"
                        : performance.color === "green"
                        ? "bg-green-100 text-green-600"
                        : performance.color === "yellow"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <IconComponent className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {data.name}
                    </h4>
                    <p
                      className={`text-xs font-medium ${
                        performance.color === "emerald"
                          ? "text-emerald-600"
                          : performance.color === "green"
                          ? "text-green-600"
                          : performance.color === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {performance.label}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg text-gray-800">
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.isCorrect}/{data.count} correct
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all bg-gradient-to-r duration-1000 ease-out ${
                      performance.color === "emerald"
                        ? " from-emerald-400 to-emerald-500"
                        : performance.color === "green"
                        ? " from-green-400 to-green-500"
                        : performance.color === "yellow"
                        ? " from-yellow-400 to-yellow-500"
                        : " from-red-400 to-red-500"
                    }`}
                    style={{
                      width: animateScore ? `${percentage}%` : "0%",
                      transitionDelay: animateScore ? "200ms" : "0ms",
                    }}
                  />
                </div>

                {animateScore && percentage > 15 && (
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 text-xs font-bold text-white opacity-90 transition-opacity duration-500 delay-700"
                    style={{ left: `calc(${percentage}% - 2rem)` }}
                  >
                    {percentage}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPerformance;
