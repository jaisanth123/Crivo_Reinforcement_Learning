import React, { useState } from "react";
import {
  Activity as ActivityIcon,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

function Activity({ activity, getActivityQuestionText, binaryToYesNo }) {
  // State to track if the table is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // Fixed number of rides (always 10)
  const rideNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-black rounded-lg shadow-md -mt-4">
      {/* Clickable header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* <ChevronDown
          className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${
            isExpanded ? "transform rotate-180" : ""
          }`}
        /> */}
      </div>

      {/* Collapsible content with smooth animation */}
      {/* <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-130 opacity-100" : "max-h-0 opacity-0"
        }`}
      > */}
      <div className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 m-0">
                <th className="py-2 px-2 text-left font-semibold text-gray-700 border-b border-gray-200 w-1/3">
                  Questions
                </th>
                {rideNumbers.map((num) => (
                  <th
                    key={`ride-${num}`}
                    className="py-1 px-1 text-center font-semibold text-blue-700 border-b border-gray-200"
                  >
                    {/* Ride{num} */}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(activity).map(([questionId, values], index) => (
                <tr
                  key={questionId}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 px-2 text-gray-800 border-b border-gray-200">
                    {getActivityQuestionText(questionId)}
                  </td>
                  {rideNumbers.map((_, valueIndex) => (
                    <td
                      key={`${questionId}-${valueIndex}`}
                      className="py-1 px-1 text-center border-b border-gray-200"
                    >
                      {valueIndex < values.length ? (
                        values[valueIndex] === 1 ? (
                          <CheckCircle className="h-3 w-3 mx-auto text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 mx-auto text-red-600" />
                        )
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default Activity;
