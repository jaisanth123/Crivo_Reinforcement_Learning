import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(true);

  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);

    // Create pulsing effect for the main button
    const pulseInterval = setInterval(() => {
      setPulseEffect((prev) => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleUploadClick = () => {
    setShowModal(true);
  };

  const handleLocalUpload = () => {
    // Navigate to the photo upload page instead of triggering file input
    navigate("/photo/upload");
    setShowModal(false);
  };

  const handleFileSelected = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Navigate to upload page with the selected file
      navigate("/photo/upload", {
        state: { selectedFile: e.target.files[0] },
      });
    }
  };

  const handleCameraCapture = () => {
    navigate("/photo/camera");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* Animated background elements */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-12 h-12 rounded-full bg-yellow-200 opacity-50 animate-pulse"></div>
        <div className="absolute top-3/4 right-10 w-16 h-16 rounded-full bg-blue-200 opacity-50 animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-full bg-green-200 opacity-30 animate-pulse delay-200"></div>
      </div>

      {/* Logo with entrance animation */}
      <div
        className={`mb-12 transform transition-all duration-1000 ${
          isLoaded ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div className="relative">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2362/2362200.png"
            alt="Kids with camera"
            className="w-48 h-48 mx-auto drop-shadow-xl rounded-full border-4 border-white"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg">
            Road Safety
          </div>
        </div>
      </div>

      {/* Main action button with animation */}
      <button
        onClick={handleLocalUpload}
        className={`bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
                   text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl 
                   transform transition-all duration-300 hover:scale-105 z-10
                   ${pulseEffect ? "animate-pulse" : ""} 
                   ${
                     isLoaded
                       ? "translate-y-0 opacity-100"
                       : "translate-y-10 opacity-0"
                   }`}
      >
        <span className="flex items-center justify-center">
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Start Your Adventure!
        </span>
      </button>

      {/* Features highlight - appears after main UI loads */}
      <div
        className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl transition-all duration-1000 delay-500 
                      ${
                        isLoaded
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Safe Learning
          </h3>
          <p className="text-gray-600">Learn road safety with fun activities</p>
        </div>

        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Interactive Lessons
          </h3>
          <p className="text-gray-600">Engaging content for all ages</p>
        </div>

        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Earn Badges</h3>
          <p className="text-gray-600">Complete challenges to win rewards</p>
        </div>
      </div>

      {/* Hidden file input - keeping this for backward compatibility */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* Enhanced modal with animations */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Choose Your Path!
            </h2>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <div
                onClick={handleLocalUpload}
                className="flex flex-col items-center p-6 border-2 border-green-300 rounded-2xl cursor-pointer hover:bg-green-50 transition-all hover:shadow-lg"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-xl text-green-600 mb-2">
                  Photo Gallery
                </span>
                <p className="text-gray-500 text-center">
                  Choose photos from your device
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-4 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-medium rounded-xl transition transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Animated decorative elements - only visible after page loads */}
      <div
        className={`fixed bottom-0 left-0 w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 delay-700
                      ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-0 w-full h-4 overflow-hidden">
          <div
            className="absolute left-0 w-full h-full bg-white opacity-20"
            style={{
              clipPath:
                "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
