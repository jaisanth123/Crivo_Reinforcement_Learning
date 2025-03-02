import { useState } from "react";
import axios from "axios";

function PhotoProcessor({ imageFile, onResultReceived, onError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);

  const uploadPhoto = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // Mock API call - simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create mock response
      const mockResponse = {
        success: true,
        message: "Image successfully processed",
        timestamp: new Date().toISOString(),
        filename: imageFile.name,
        filesize: imageFile.size,
        results: {
          classification: "Sample Classification",
          confidence: 0.95,
          processingTime: "1.2 seconds",
        },
      };

      // Complete the progress
      clearInterval(progressInterval);
      setProgress(100);

      setApiResponse(mockResponse);

      // Call the callback with the result
      if (onResultReceived) {
        onResultReceived(mockResponse);
      }

      // When you're ready to use a real API, uncomment this code:
      /*
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const API_URL = 'https://your-real-api-endpoint.com/analyze';
      
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });
      
      setApiResponse(response.data);
      
      if (onResultReceived) {
        onResultReceived(response.data);
      }
      */
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error uploading image:", error);
      if (onError) {
        onError(error.message || "Failed to upload image");
      }
    } finally {
      setIsLoading(false);
    }
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
              <p className="text-center text-sm mt-1">{progress}% Uploaded</p>
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
