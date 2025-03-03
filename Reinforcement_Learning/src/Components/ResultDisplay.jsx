import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function ResultDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRawJson, setShowRawJson] = useState(false);

  // Get the result from the location state
  const result = location.state?.result;

  // Helper function to convert binary values to Yes/No
  const binaryToYesNo = (value) => {
    return value === 1 ? "Yes" : "No";
  };

  // Helper function to count occurrences in an array
  const countOccurrences = (arr, value) => {
    return arr.filter((item) => item === value).length;
  };

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1255/1255385.png"
          alt="Not found"
          className="w-32 h-32 mb-6"
        />
        <h1 className="text-2xl font-bold mb-6 text-purple-600">
          Oops! No Results Found
        </h1>
        <p className="mb-4 text-gray-600 text-center">
          We couldn't find any results. Let's take a picture first!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl w-full">
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2784/2784589.png"
            alt="Results"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-purple-600">
            Analysis Results
          </h1>
          <p className="text-gray-600">Here's what we found in your photo</p>
        </div>

        <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl overflow-hidden mb-6">
          <div className="p-4 border-b border-blue-100 bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-600">Results</h2>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                {showRawJson ? "Show Friendly View" : "Show Raw JSON"}
              </button>
            </div>
          </div>

          <div className="p-4">
            {showRawJson ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex">
                      <span className="font-medium w-32">Name:</span>
                      <span>{result.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">School Code:</span>
                      <span>{result.School_code}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">City Code:</span>
                      <span>{result.City_code}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Class:</span>
                      <span>{result.Class}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Date:</span>
                      <span>{result.Date}</span>
                    </div>
                  </div>
                </div>

                {/* Driven By Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    Driven By
                  </h3>
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Parents: </span>
                        <span className="text-green-600 font-semibold">
                          {countOccurrences(result.Driven_by, 1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Others: </span>
                        <span className="text-blue-600 font-semibold">
                          {countOccurrences(result.Driven_by, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Detailed Breakdown:
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {result.Driven_by.map((value, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md text-center ${
                            value === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {value === 1 ? "Parent" : "Other"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    Activity Responses
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Question
                          </th>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Responses
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.Activity).map(
                          ([question, answers]) => (
                            <tr key={question}>
                              <td className="py-2 px-4 border-b border-gray-200">
                                {question}
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <div className="flex flex-wrap gap-1">
                                  {answers.map((value, index) => (
                                    <span
                                      key={index}
                                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        value === 1
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {binaryToYesNo(value)}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* By Child Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    By Child
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.By_Child.map((value, index) => (
                      <div
                        key={index}
                        className={`px-3 py-2 rounded-lg ${
                          value === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span className="font-medium">Child {index + 1}:</span>{" "}
                        {binaryToYesNo(value)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Parents Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    By Parents
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.By_Parents.map((value, index) => (
                      <div
                        key={index}
                        className={`px-3 py-2 rounded-lg ${
                          value === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span className="font-medium">Parent {index + 1}:</span>{" "}
                        {binaryToYesNo(value)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                clipRule="evenodd"
              />
            </svg>
            Try Another Photo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;
