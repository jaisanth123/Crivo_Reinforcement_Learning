import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ResultDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRawJson, setShowRawJson] = useState(false);
  const [result, setResult] = useState(location.state?.result || null);
  const [originalResult, setOriginalResult] = useState(
    location.state?.result || null
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Helper function to convert binary values to Yes/No
  const binaryToYesNo = (value) => {
    return value === 1 ? "Yes" : "No";
  };

  // Helper function to convert Yes/No to binary values
  const yesNoToBinary = (value) => {
    return value === "Yes" ? 1 : 0;
  };

  // Helper function to count occurrences in an array
  const countOccurrences = (arr, value) => {
    return arr.filter((item) => item === value).length;
  };

  // Check for changes when result is updated
  useEffect(() => {
    if (originalResult && result) {
      const isChanged =
        JSON.stringify(originalResult) !== JSON.stringify(result);
      setHasChanges(isChanged);
    }
  }, [result, originalResult]);

  // Handle text field changes
  const handleTextChange = (field, value) => {
    setResult((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle binary field changes
  const handleBinaryChange = (field, index, value) => {
    const newValue = yesNoToBinary(value);
    setResult((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = newValue;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  // Handle activity field changes
  const handleActivityChange = (question, index, value) => {
    const newValue = yesNoToBinary(value);
    setResult((prev) => {
      const newActivity = { ...prev.Activity };
      newActivity[question][index] = newValue;
      return {
        ...prev,
        Activity: newActivity,
      };
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (hasChanges) {
      // Here you would typically send the updated data to your backend
      alert("Changes submitted successfully!");
      setOriginalResult({ ...result });
      setHasChanges(false);
    } else {
      // No changes were made
      alert("Form saved successfully!");
    }
  };

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1255/1255385.png"
          alt="Not found"
          className="w-32 h-32 mb-6"
        />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          No Results Found
        </h2>
        <p className="text-gray-600 mb-8">
          Please upload an image to see results.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-blue-600">
                Analysis Results
              </h1>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showRawJson ? "Show Formatted View" : "Show Raw JSON"}
              </button>
            </div>

            {showRawJson ? (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            ) : (
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-blue-700">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={result.name}
                        onChange={(e) =>
                          handleTextChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Code
                      </label>
                      <input
                        type="text"
                        value={result.School_code}
                        onChange={(e) =>
                          handleTextChange("School_code", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City Code
                      </label>
                      <input
                        type="text"
                        value={result.City_code}
                        onChange={(e) =>
                          handleTextChange("City_code", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <input
                        type="text"
                        value={result.Class}
                        onChange={(e) =>
                          handleTextChange("Class", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={result.Date}
                        onChange={(e) =>
                          handleTextChange("Date", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Driven By Section */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-green-700">
                    Driven By
                  </h2>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Parents:</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {countOccurrences(result.Driven_by, 1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Others:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {countOccurrences(result.Driven_by, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {result.Driven_by.map((value, index) => (
                      <div
                        key={`driven-${index}`}
                        className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                      >
                        <span className="font-medium">Ride {index + 1}:</span>
                        <select
                          value={binaryToYesNo(value)}
                          onChange={(e) =>
                            handleBinaryChange(
                              "Driven_by",
                              index,
                              e.target.value
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Yes">Parent</option>
                          <option value="No">Other</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Section */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-purple-700">
                    Activity
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(result.Activity).map(
                      ([question, values]) => (
                        <div
                          key={question}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <h3 className="font-medium text-lg mb-3 text-purple-600">
                            {question}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {values.map((value, index) => (
                              <div
                                key={`${question}-${index}`}
                                className="flex flex-col"
                              >
                                <span className="text-xs text-gray-500 mb-1">
                                  Ride {index + 1}
                                </span>
                                <select
                                  value={binaryToYesNo(value)}
                                  onChange={(e) =>
                                    handleActivityChange(
                                      question,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* By Child Section */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-700">
                    By Child
                  </h2>
                  <div className="space-y-2">
                    {result.By_Child.map((value, index) => (
                      <div
                        key={`child-${index}`}
                        className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                      >
                        <span className="font-medium">q{index + 1}:</span>
                        <select
                          value={binaryToYesNo(value)}
                          onChange={(e) =>
                            handleBinaryChange(
                              "By_Child",
                              index,
                              e.target.value
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Parents Section */}
                <div className="bg-red-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-red-700">
                    By Parents
                  </h2>
                  <div className="space-y-2">
                    {result.By_Parents.map((value, index) => (
                      <div
                        key={`parent-${index}`}
                        className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                      >
                        <span className="font-medium">q{index + 1}:</span>
                        <select
                          value={binaryToYesNo(value)}
                          onChange={(e) =>
                            handleBinaryChange(
                              "By_Parents",
                              index,
                              e.target.value
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleSubmit}
                    className={`flex items-center px-6 py-3 rounded-full text-white font-bold shadow-lg transition-all ${
                      hasChanges
                        ? "bg-green-500 hover:bg-green-600 transform hover:scale-105"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {hasChanges ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Save Changes
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Save Response
                      </>
                    )}
                  </button>
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
