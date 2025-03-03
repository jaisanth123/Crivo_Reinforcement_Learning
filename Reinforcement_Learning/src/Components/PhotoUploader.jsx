import { useState, useEffect } from "react";
import PhotoProcessor from "./PhotoProcessor";
import { useNavigate, useLocation } from "react-router-dom";

function PhotoUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a file was passed from the HomePage
  useEffect(() => {
    if (location.state?.selectedFile) {
      setSelectedFile(location.state.selectedFile);
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleResult = (result) => {
    setApiResult(result);
    // Navigate to results page with the API response
    navigate("/results", { state: { result } });
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Your Photo
        </h2>

        {!selectedFile && (
          <div className="mb-6">
            <div className="flex flex-col items-center p-8 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4503/4503941.png"
                alt="Upload"
                className="w-20 h-20 mb-4"
              />
              <p className="text-gray-600 mb-4 text-center">
                Drag and drop your photo here, or click to select
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {selectedFile && (
          <PhotoProcessor
            imageFile={selectedFile}
            onResultReceived={handleResult}
            onError={handleError}
          />
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-6 text-blue-500 hover:text-blue-700 font-medium flex items-center justify-center w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default PhotoUploader;
