import React, { useState } from "react";

function ActivityQuestion({
  questionId,
  values,
  handleActivityChange,
  getActivityQuestionText,
  binaryToYesNo,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-medium text-lg  text-purple-600">
        {getActivityQuestionText(questionId)}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {values.map((value, index) => (
          <div key={`${questionId}-${index}`} className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Ride {index + 1}</span>
            <select
              value={binaryToYesNo(value)}
              onChange={(e) =>
                handleActivityChange(questionId, index, e.target.value)
              }
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Yes">Yesssssssssssss</option>
              <option value="No">No</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityQuestion;
