import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function ResultDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRawJson, setShowRawJson] = useState(false);

  // Get the result from the location state
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-6">No Results Found</h1>
        <p className="mb-4">
          No analysis results were found. Please upload an image first.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Analysis Results</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Results</h2>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-blue-500 hover:text-blue-700"
            >
              {showRawJson ? "Show Formatted" : "Show Raw JSON"}
            </button>
          </div>
        </div>

        <div className="p-4">
          {showRawJson ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <div className="space-y-4">
              {/* Display formatted results here - customize based on your API response structure */}
              {Object.entries(result).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <h3 className="font-medium text-gray-700">{key}</h3>
                  <p className="text-gray-900">
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : value.toString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
