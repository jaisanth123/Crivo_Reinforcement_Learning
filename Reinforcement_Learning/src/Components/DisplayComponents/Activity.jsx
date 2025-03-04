import React from "react";
import ActivityQuestion from "./ActivityQuestion";

function Activity({
  activity,
  handleActivityChange,
  getActivityQuestionText,
  binaryToYesNo,
}) {
  return (
    <div className="bg-purple-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Activity</h2>
      <div className="space-y-6">
        {Object.entries(activity).map(([question, values]) => (
          <ActivityQuestion
            key={question}
            questionId={question}
            values={values}
            handleActivityChange={handleActivityChange}
            getActivityQuestionText={getActivityQuestionText}
            binaryToYesNo={binaryToYesNo}
          />
        ))}
      </div>
    </div>
  );
}

export default Activity;
