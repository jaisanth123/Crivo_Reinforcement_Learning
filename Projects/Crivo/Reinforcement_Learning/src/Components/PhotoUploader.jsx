import { useState } from "react";
import PhotoProcessor from "./PhotoProcessor";
import { useNavigate } from "react-router-dom";

function PhotoUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Upload Photo</h2>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {selectedFile && (
        <PhotoProcessor
          imageFile={selectedFile}
          onResultReceived={handleResult}
          onError={handleError}
        />
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-6 text-blue-500 hover:text-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
}

export default PhotoUploader;
