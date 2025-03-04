import React from "react";

const SubmitButton = ({ hasChanges, handleSubmit }) => {
  return (
    <div>
      <button
        onClick={handleSubmit}
        className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full ${
          !hasChanges ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!hasChanges}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
