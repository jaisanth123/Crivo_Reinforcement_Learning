import React from "react";
import ActivityQuestion from "./ActivityQuestion";

function Activity({ activity, getActivityQuestionText, binaryToYesNo }) {
  return (
    <div className="bg-purple-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Activity</h2>
      <div className="space-y-6">
        {Object.entries(activity).map(([question, values]) => (
          <div key={question} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-3 text-purple-600">
              {getActivityQuestionText(question)}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {values.map((value, index) => (
                <div key={`${question}-${index}`} className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">
                    Ride {index + 1}
                  </span>
                  <span
                    className={`px-2 py-1 text-center text-sm rounded-md ${
                      value === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {binaryToYesNo(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
