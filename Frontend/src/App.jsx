import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import PhotoUploader from "./Components/PhotoUploader";
import CameraCapture from "./Components/CameraCapture";
import ResultDisplay from "./Components/ResultDisplay";

function App() {
  return (
    <Router>
      <div className=" w-full min-h-screen">
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
