import React from "react";

const ByParents = ({ result, handleBinaryChange }) => {
  return (
    result.By_Parents &&
    Array.isArray(result.By_Parents) && (
      <div className="bg-red-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-red-700">By Parents</h2>
        <div className="space-y-2">
          {result.By_Parents.map((value, index) => (
            <div
              key={`parent-${index}`}
              className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
            >
              <span className="font-medium">Question {index + 1}</span>
              <select
                value={value === 1 ? "Yes" : "No"}
                onChange={(e) =>
                  handleBinaryChange("By_Parents", index, e.target.value)
                }
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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

export default ByParents;
