import React from "react";
import { getParentQuestionText } from "../questionUtils"; // Ensure this path is correct

const ByParents = ({ result, handleBinaryChange }) => {
  const handleChange = (index, value) => {
    handleBinaryChange((prev) => {
      const newArray = [...prev.By_Parents];
      newArray[index] = value;
      return { ...prev, By_Parents: newArray };
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold">By Parents</h2>
      {result.By_Parents.map((value, index) => (
        <div
          key={`parent-${index}`}
          className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
        >
          <span className="font-medium">
            {getParentQuestionText(`q${index + 1}`)}
          </span>
          <select
            value={binaryToYesNo(value)}
            onChange={(e) => handleChange(index, e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default ByParents;
