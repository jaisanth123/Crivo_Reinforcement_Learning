import { useState, useEffect } from "react";
import axios from "axios";
import mockData from "../Data/Mock.json"; // Import the mock data

function PhotoProcessor({ imageFile, onResultReceived, onError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [useMockData, setUseMockData] = useState(false); // Changed to use API data by default

  // Debug log to verify state changes
  useEffect(() => {
    console.log("Mock data toggle state:", useMockData);
  }, [useMockData]);

  const uploadPhoto = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setProgress(0);

    try {
      // Set up progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      let response;

      // Log which path we're taking
      console.log("Using mock data?", useMockData);

      if (useMockData) {
        // Use mock data with a simulated delay
        console.log("Using mock data path");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        response = mockData.model_output;
      } else {
        // Make the actual API call
        console.log("Using real API path");
        const formData = new FormData();
        formData.append("img", imageFile);
        const apiResponse = await axios.post(
          import.meta.env.VITE_CRIVO_API,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            },
          }
        );

        // Extract model_output from the response
        response = apiResponse.data.model_output;
      }

      // Clear the progress interval and set to 100%
      clearInterval(progressInterval);
      setProgress(100);

      setApiResponse(response);

      // Call the callback with the result
      if (onResultReceived) {
        onResultReceived(response);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      if (onError) {
        onError(error.message || "Failed to upload image");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMockData = () => {
    setUseMockData((prev) => !prev);
  };

  return (
    <div className="photo-processor">
      {imageFile && (
        <div className="flex flex-col items-center">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Selected"
            className="max-w-md max-h-96 object-contain mb-4 border rounded"
          />

          <button
            onClick={uploadPhoto}
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium ${
              isLoading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? "Processing..." : "Process Image"}
          </button>

          {isLoading && (
            <div className="w-full max-w-md mt-4">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm mt-1">
                {progress}% {useMockData ? "Simulated" : "Uploaded"}
              </p>
            </div>
          )}

          {apiResponse && (
            <div className="mt-4 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">API Response:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotoProcessor;
