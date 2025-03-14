import React from "react";
import { getQuestionText } from "../questionUtils"; // Ensure this path is correct

const ByChild = ({ result, handleBinaryChange }) => {
  // Define binaryToYesNo function
  const binaryToYesNo = (value) => {
    return value === 1 ? "Yes" : "No";
  };

  const handleChange = (index, value) => {
    handleBinaryChange((prev) => {
      const newArray = [...prev.By_Child];
      newArray[index] = value === "Yes" ? 1 : 0;
      return { ...prev, By_Child: newArray };
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4">By Child</h2>
      <div className="space-y-4">
        {result.By_Child.map((value, index) => (
          <div
            key={`child-${index}`}
            className="flex justify-between items-center p-3 border-b border-gray-200"
          >
            <span className="font-medium mr-4">
              {getQuestionText(`q${index + 1}`)}
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
    </div>
  );
};

export default ByChild;
