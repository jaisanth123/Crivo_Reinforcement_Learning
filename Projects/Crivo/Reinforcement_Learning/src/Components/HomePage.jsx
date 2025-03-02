import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleUploadClick = () => {
    setShowModal(true);
  };

  const handleLocalUpload = () => {
    navigate("/photo/upload");
    setShowModal(false);
  };

  const handleCameraCapture = () => {
    navigate("/photo/camera");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Photo Upload App</h1>
      <button
        onClick={handleUploadClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload Photo
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Choose an option</h2>
            <div className="flex gap-4">
              <button
                onClick={handleLocalUpload}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Upload from Local
              </button>
              <button
                onClick={handleCameraCapture}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Use Camera
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700"
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
