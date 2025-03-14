import React from "react";
import { getParentQuestionText } from "../questionUtils"; // Ensure this path is correct

const ByParents = ({ result, handleBinaryChange }) => {
  // Define binaryToYesNo function
  const binaryToYesNo = (value) => {
    return value === 1 ? "Yes" : "No";
  };

  const handleChange = (index, value) => {
    handleBinaryChange((prev) => {
      const newArray = [...prev.By_Parents];
      newArray[index] = value === "Yes" ? 1 : 0;
      return { ...prev, By_Parents: newArray };
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4">By Parents</h2>
      <div className="space-y-4">
        {result.By_Parents.map((value, index) => (
          <div
            key={`parent-${index}`}
            className="flex justify-between items-center p-3 border-b border-gray-200"
          >
            <span className="font-medium mr-4">
              {getParentQuestionText(`q${index + 1}`)}
            </span>
            <select
              value={binaryToYesNo(value)}
              onChange={(e) => handleChange(index, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-md border border-gray-300"
          onClick={() => console.log("Generate certificate")}
        >
          Save & Generate Certificate
        </button>
      </div>
    </div>
  );
};

export default ByParents;
