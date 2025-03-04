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
      newArray[index] = value;
      return { ...prev, By_Child: newArray };
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold">By Child</h2>
      {result.By_Child.map((value, index) => (
        <div
          key={`child-${index}`}
          className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
        >
          <span className="font-medium">
            {getQuestionText(`q${index + 1}`)}
          </span>
          <select
            value={binaryToYesNo(value)} // Ensure a scalar value
            onChange={(e) => handleChange(index, e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default ByChild;
