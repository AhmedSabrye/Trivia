import React from "react";
import { FaChartBar } from "react-icons/fa";

interface CategoryPerformanceProps {
  categoryData: {name:string; count:number; isCorrect:number }[];
  animateScore: boolean;
}

const CategoryPerformance: React.FC<CategoryPerformanceProps> = ({
  categoryData,
  animateScore,
}) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
      <FaChartBar className="inline-block mr-2" />
      Performance by Category
    </h3>
    <div className="space-y-3 text-lg">
      {categoryData.map((data) => (
        <div key={data.name} className="bg-gray-50  p-3 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium  text-gray-700">{data.name}</span>
            <span className=" font-semibold">
              {data.isCorrect}/{data.count} (
              {Math.round((data.isCorrect / data.count) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 h-5 rounded-full">
            <div
              className={`h-full rounded-full ${
                data.isCorrect / data.count >= 0.7
                  ? "bg-green-500"
                  : data.isCorrect / data.count >= 0.4
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: animateScore
                  ? `${(data.isCorrect / data.count) * 100}%`
                  : "0%",
                transition: "width 1s ease-in-out",
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryPerformance;
