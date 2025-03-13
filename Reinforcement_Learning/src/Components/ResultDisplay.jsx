import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BasicInfo from "./DisplayComponents/BasicInfo";
import DrivenBy from "./DisplayComponents/DrivenBy";
import Activity from "./DisplayComponents/Activity";
import QuestionSection from "./DisplayComponents/QuestionSection";
import NoResults from "./DisplayComponents/NoResults";
import {
  binaryToYesNo,
  countOccurrences,
  getActivityQuestionText,
  getQuestionText,
  getParentQuestionText,
} from "./DisplayComponents/utils";

function ResultDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRawJson, setShowRawJson] = useState(false);
  const [result, setResult] = useState(location.state?.result || null);

  useEffect(() => {
    if (result) {
      console.log("Result structure:", result);
    }
  }, [result]);

  // **Render Logic**
  if (!result) {
    return <NoResults />;
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
                <BasicInfo
                  basicInfo={{
                    name: result.name,
                    School_code: result.School_code,
                    City_code: result.City_code,
                    Class: result.Class,
                    Date: result.Date,
                  }}
                />
                {result.Driven_by && Array.isArray(result.Driven_by) && (
                  <DrivenBy
                    drivenBy={result.Driven_by}
                    binaryToYesNo={binaryToYesNo}
                    countOccurrences={countOccurrences}
                  />
                )}

                {result.Activity && typeof result.Activity === "object" && (
                  <Activity
                    activity={result.Activity}
                    getActivityQuestionText={getActivityQuestionText}
                    binaryToYesNo={binaryToYesNo}
                  />
                )}
                {result.By_Child && Array.isArray(result.By_Child) && (
                  <QuestionSection
                    title="By Child"
                    questions={result.By_Child}
                    getQuestionText={getQuestionText}
                    binaryToYesNo={binaryToYesNo}
                  />
                )}
                {result.By_Parents && Array.isArray(result.By_Parents) && (
                  <QuestionSection
                    title="By Parents"
                    questions={result.By_Parents}
                    getQuestionText={getParentQuestionText}
                    binaryToYesNo={binaryToYesNo}
                  />
                )}
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
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
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
