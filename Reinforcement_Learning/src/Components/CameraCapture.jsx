import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CameraCapture() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Start camera when component mounts
    startCamera();

    // Clean up function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
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
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 to file
      const fetchRes = await fetch(capturedImage);
      const blob = await fetchRes.blob();
      const file = new File([blob], "camera-capture.png", {
        type: "image/png",
      });

      const result = await uploadImageToAPI(file);
      // Navigate to results page with the API response data
      navigate("/results", { state: { result } });
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Camera Capture</h1>

      {!capturedImage ? (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-preview border-2 border-gray-300 rounded-lg"
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          />

          <button
            onClick={capturePhoto}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Take Photo
          </button>
        </div>
      ) : (
        <div className="captured-image-container">
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-md max-h-96 object-contain border-2 border-gray-300 rounded-lg"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={retakePhoto}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Retake
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
              } text-white font-bold py-2 px-4 rounded`}
            >
              {isLoading ? "Processing..." : "Submit Photo"}
            </button>
          </div>
        </div>
      )}

      {error && <div className="mt-4 text-red-500">{error}</div>}

      <button
        onClick={() => navigate("/")}
        className="mt-6 text-blue-500 hover:text-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
}

export default CameraCapture;
