import React from "react";

function QuestionItem({ questionText, value, onChange, binaryToYesNo, color }) {
  return (
    <div className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
      <span className="font-medium">{questionText}</span>
      <select
        value={binaryToYesNo(value)}
        onChange={onChange}
        className={`px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500`}
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  );
}

export default QuestionItem;
