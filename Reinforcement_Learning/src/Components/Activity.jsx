import React from "react";

const Activity = ({ result, handleActivityChange }) => {
  return (
    result.Activity &&
    typeof result.Activity === "object" && (
      <div className="bg-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Activity</h2>
        <div className="space-y-6">
          {Object.entries(result.Activity).map(([question, values]) => (
            <div key={question} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-3 text-purple-600">
                {question}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {values.map((value, index) => (
                  <div key={`${question}-${index}`} className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">
                      Ride {index + 1}
                    </span>
                    <select
                      value={value === 1 ? "Yes" : "No"}
                      onChange={(e) =>
                        handleActivityChange(question, index, e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Activity;
