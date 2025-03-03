import React from "react";

const ByChild = ({ result, handleBinaryChange }) => {
  return (
    result.By_Child &&
    Array.isArray(result.By_Child) && (
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">By Child</h2>
        <div className="space-y-2">
          {result.By_Child.map((value, index) => (
            <div
              key={`child-${index}`}
              className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
            >
              <span className="font-medium">Question {index + 1}</span>
              <select
                value={value === 1 ? "Yes" : "No"}
                onChange={(e) =>
                  handleBinaryChange("By_Child", index, e.target.value)
                }
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default ByChild;
