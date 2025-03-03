import React from "react";

const SubmitButton = ({ hasChanges, handleSubmit }) => {
  return (
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
  );
};

export default SubmitButton;
