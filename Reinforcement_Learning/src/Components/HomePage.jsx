import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

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
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2362/2362200.png"
          alt="Kids with camera"
          className="w-40 h-40 mx-auto"
        />
      </div>

      <button
        onClick={handleUploadClick}
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg transform transition hover:scale-105"
      >
        Start Your Adventure!
      </button>

      {/* Hidden file input - keeping this for backward compatibility */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
              Choose Your Path!
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div
                onClick={handleLocalUpload}
                className="flex flex-col items-center p-4 border-2 border-green-300 rounded-xl cursor-pointer hover:bg-green-50 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1375/1375106.png"
                  alt="Gallery"
                  className="w-16 h-16 mb-2"
                />
                <span className="font-medium text-green-600">
                  Photo Gallery
                </span>
              </div>

              <div
                onClick={handleCameraCapture}
                className="flex flex-col items-center p-4 border-2 border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3004/3004613.png"
                  alt="Camera"
                  className="w-16 h-16 mb-2"
                />
                <span className="font-medium text-blue-600">Take Photo</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
