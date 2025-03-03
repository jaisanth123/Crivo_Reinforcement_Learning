import { useState, useEffect, useRef } from "react";
import PhotoProcessor from "./PhotoProcessor";
import { useNavigate, useLocation } from "react-router-dom";

function PhotoUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please drop a valid image file.");
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
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
            <div
              className={`flex flex-col items-center p-8 border-2 border-dashed rounded-xl ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-blue-300 bg-blue-50 hover:border-blue-400"
              } transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4503/4503941.png"
                alt="Upload"
                className="w-20 h-20 mb-4"
              />
              <p className="text-gray-600 mb-4 text-center">
                {isDragging
                  ? "Drop your photo here"
                  : "Drag and drop your photo here, or click to select"}
              </p>
              <button
                onClick={handleBrowseClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
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
          <div className="mb-6">
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="max-h-64 max-w-full mb-4 rounded-lg shadow-sm"
              />
              <p className="text-green-600 font-medium mb-2">
                {selectedFile.name}
              </p>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-700 font-medium mb-4"
              >
                Remove
              </button>
              <PhotoProcessor
                imageFile={selectedFile}
                onResultReceived={handleResult}
                onError={handleError}
              />
            </div>
          </div>
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
