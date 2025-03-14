import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mockData from "../Data/Mock.json"; // Import the mock data

function CameraCapture() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(true); // Default to using mock data
  const navigate = useNavigate();

  // Debug log to verify state changes
  useEffect(() => {
    console.log("Camera mock data toggle state:", useMockData);
  }, [useMockData]);

  useEffect(() => {
    // Start camera when component mounts
    startCamera();

    // Clean up function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      console.log("Stopping camera stream");
      stream.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      setStream(null);

      // Also clear the video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const startCamera = async () => {
    try {
      // First make sure any existing stream is stopped
      stopCamera();

      console.log("Starting camera");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Could not access camera. Please make sure you've granted permission."
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);

    // Stop the camera after capturing
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const toggleMockData = () => {
    setUseMockData((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);

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

      // Log which path we're taking
      console.log("Camera using mock data?", useMockData);

      let response;

      if (useMockData) {
        // Use mock data with a simulated delay
        console.log("Camera using mock data path");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        response = mockData;
        console.log("Mock data response:", response);
        response = response.model_output;
      } else {
        // Convert base64 to blob
        console.log("Camera using real API path");
        const fetchRes = await fetch(capturedImage);
        const blob = await fetchRes.blob();

        // Create a File object from the blob
        const file = new File([blob], "camera-capture.png", {
          type: "image/png",
        });

        // Create FormData object
        const formData = new FormData();
        formData.append("img", file);

        // Make the actual API call
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

        console.log("API response:", apiResponse);
        response = apiResponse.datavoutput;
        console.log(response);
      }

      // Clear the progress interval and set to 100%
      clearInterval(progressInterval);
      setProgress(100);

      // Make sure camera is stopped before navigating
      stopCamera();

      // Navigate to results page with the response data
      navigate("/results", { state: { result: response } });
    } catch (error) {
      console.error("Error processing image:", error);
      setError(error.message || "Failed to process image");
      setIsLoading(false);
    }
  };

  // Custom navigation function to ensure camera is stopped
  const navigateHome = () => {
    stopCamera();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {!capturedImage ? "Say Cheese!" : "Your Photo"}
        </h1>

        {!capturedImage ? (
          <div className="camera-container flex flex-col items-center">
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-preview border-4 border-yellow-300 rounded-xl"
                style={{ width: "100%", maxWidth: "500px", height: "auto" }}
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 border-8 border-white rounded-xl pointer-events-none"></div>

              <div className="absolute -top-4 -right-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3004/3004661.png"
                  alt="Camera decoration"
                  className="w-12 h-12"
                />
              </div>
            </div>

            <button
              onClick={capturePhoto}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition hover:scale-105 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Take Photo
            </button>
          </div>
        ) : (
          <div className="captured-image-container flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full object-contain border-4 border-green-300 rounded-xl"
                style={{ maxHeight: "60vh" }}
              />
              <div className="absolute -top-4 -right-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1355/1355782.png"
                  alt="Photo decoration"
                  className="w-12 h-12"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={retakePhoto}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Try Again
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`${
                  isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                } text-white font-bold py-2 px-4 rounded-full flex items-center`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Use This Photo
                  </>
                )}
              </button>
            </div>

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
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 p-3 bg-red-50 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={navigateHome}
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

export default CameraCapture;
