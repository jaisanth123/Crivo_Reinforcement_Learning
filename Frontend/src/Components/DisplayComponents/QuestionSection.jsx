import React from "react";
import { Users, User, CheckCircle, XCircle } from "lucide-react";

function QuestionSection({ title, questions, getQuestionText, binaryToYesNo }) {
  // Define styling variables based on the section title
  const color = title === "By Child" ? "red" : "red";

  // Icons based on section
  const SectionIcon = title === "By Child" ? User : Users;

  return (
    <div
      className={`bg-${color}-50 p-3 rounded-lg shadow-sm border border-${color}-200`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <SectionIcon className={`h-4 w-4 text-${color}-600 mr-2`} />
          <h2 className={`text-lg font-medium text-${color}-700`}>{title}</h2>
        </div>
        <div className="bg-white px-2 py-0.5 rounded-full text-xs font-medium text-gray-600">
          {questions.length} questions
        </div>
      </div>

      <div className="space-y-1">
        {questions.map((value, index) => (
          <div
            key={`${title}-${index}`}
            className={`flex justify-between items-center p-2 bg-white rounded-md border-l-2 ${
              value === 1 ? `border-green-500` : `border-red-500`
            }`}
          >
            <div className="flex items-start space-x-2">
              {value === 1 ? (
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-sm text-gray-800">
                {getQuestionText(`q${index + 1}`)}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
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

      {/* <div className="mt-2 pt-2 border-t border-gray-200 flex justify-center">
        <div
          className={`px-3 py-1 rounded-full  from-${color}-400 to-${color}-600 text-white text-xs font-medium flex items-center cursor-pointer`}
        >
          <SectionIcon className="h-3 w-3 mr-1" />
          {title} Summary
        </div>
      </div> */}
    </div>
  );
}

export default QuestionSection;
