import React from "react";

function QuestionSection({ title, questions, getQuestionText, binaryToYesNo }) {
  const color = title === "By Child" ? "yellow" : "red";
  return (
    <div className={`bg-${color}-50 p-6 rounded-lg`}>
      <h2 className={`text-xl font-semibold mb-4 text-${color}-700`}>
        {title}
      </h2>
      <div className="space-y-2">
        {questions.map((value, index) => (
          <div
            key={`${title}-${index}`}
            className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
          >
            <span className="font-medium">
              {getQuestionText(`q${index + 1}`)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                value === 1
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {binaryToYesNo(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionSection;
