import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import PhotoUploader from "./Components/PhotoUploader";
import CameraCapture from "./Components/CameraCapture";
import ResultDisplay from "./Components/ResultDisplay";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
        <header className="text-center py-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Fun Photo Explorer
          </h1>
          <p className="text-gray-600">
            Take pictures and discover amazing things!
          </p>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photo/upload" element={<PhotoUploader />} />
          <Route path="/photo/camera" element={<CameraCapture />} />
          <Route path="/results" element={<ResultDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
