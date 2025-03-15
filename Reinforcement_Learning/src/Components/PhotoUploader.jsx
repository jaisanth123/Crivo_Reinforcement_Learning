import { useState, useEffect, useRef } from "react";
// import PhotoProcessor from "./PhotoProcessor";
import { useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import mockData from "../Data/Mock.json";
import CityDropdown from "./CityDropdown";
import certificateImage from "../Components/Chota Cop Certificate.png";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";

function PhotoUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [useMockData, setUseMockData] = useState(true);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  // Check if a file was passed from the HomePage
  useEffect(() => {
    if (location.state?.selectedFile) {
      setSelectedFile(location.state.selectedFile);
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please select a valid PDF file.");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please drop a valid PDF file.");
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleResult = (result) => {
    setApiResult(result);
    // Navigate to results page with the API response
    navigate("/results", { state: { result } });
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  //   ===============================================================
  const generatePDF = (certificateData) => {
    // Use fallbacks for School_name vs School_code based on what's available
    if (
      !certificateData.name ||
      !(certificateData.School_name || certificateData.School_code) ||
      !certificateData.Class
    ) {
      alert("Missing required data for certificate generation!");
      return;
    }

    setIsGeneratingCertificate(true);

    // Create a temporary div for rendering
    const tempDiv = document.createElement("div");
    tempDiv.className = "relative w-[1123px] h-[794px] bg-white";

    // Create an image element
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = certificateImage;

    // Add the image to the div
    tempDiv.appendChild(img);

    // Create and add text elements for the data
    const nameDiv = document.createElement("div");
    nameDiv.style.position = "absolute";
    nameDiv.style.top = "388px";
    nameDiv.style.left = "345px";
    nameDiv.style.fontWeight = "bold";
    nameDiv.textContent = certificateData.name;
    tempDiv.appendChild(nameDiv);

    const schoolCodeDiv = document.createElement("div");
    schoolCodeDiv.style.position = "absolute";
    schoolCodeDiv.style.top = "458px";
    schoolCodeDiv.style.left = "340px";
    schoolCodeDiv.style.fontWeight = "bold";
    // Use either School_name or School_code based on what's available
    schoolCodeDiv.textContent =
      certificateData.School_name || certificateData.School_code;
    tempDiv.appendChild(schoolCodeDiv);

    const classDiv = document.createElement("div");
    classDiv.style.position = "absolute";
    classDiv.style.top = "448px";
    classDiv.style.left = "750px";
    classDiv.style.fontWeight = "bold";
    classDiv.textContent = certificateData.Class;
    tempDiv.appendChild(classDiv);

    // Add to document body (hidden)
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // Wait for image to load before capturing
    img.onload = () => {
      html2canvas(tempDiv, {
        scale: 3,
        logging: true,
        useCORS: true,
        allowTaint: true,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("landscape", "mm", "a4");
          const imgWidth = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save("ChotaCop_Certificate.pdf");

          document.body.removeChild(tempDiv); // Clean up
          setIsGeneratingCertificate(false);

          // Update status to notify user that certificate has been generated
          setSubmitStatus({
            success: true,
            message: "Certificate generated successfully!",
          });
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
          setIsGeneratingCertificate(false);
          setSubmitStatus({
            success: false,
            message: "Failed to generate certificate. Please try again.",
          });
        });
    };

    // Handle image loading error
    img.handleError = () => {
      console.error("Failed to load the certificate template image");
      document.body.removeChild(tempDiv);
      setIsGeneratingCertificate(false);
      setSubmitStatus({
        success: false,
        message:
          "Failed to load certificate template. Please check the image path.",
      });
    };
  };

  useEffect(() => {
    console.log("Mock data toggle state:", useMockData);
  }, [useMockData]);

  // Function to check if email already exists
  const checkEmail = async () => {
    if (!email) return { exists: false };

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/check-email/${email}`
      );
      console.log("Email check response:", response.data);

      if (response.data.message !== "Email unavailable") {
        // Email exists, prepare certificate data
        const certificateData = {
          name: response.data.name,
          School_name: response.data.School_name,
          School_code: response.data.School_code,
          City_name: response.data.City_name,
          Class: response.data.Class,
          email: email,
        };

        // Notify user that email was found
        setSubmitStatus({
          success: true,
          message: "Email found in system. Generating certificate...",
        });

        // Generate the certificate
        generatePDF(certificateData);

        return { exists: true, data: certificateData };
      } else {
        // Email doesn't exist, continue with form
        setEmailChecked(true);
        return { exists: false };
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setSubmitStatus({
        success: false,
        message: `Error checking email: ${error.message}`,
      });
      return { exists: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return;

    // First check if email exists
    const emailCheck = await checkEmail();
    if (emailCheck.exists) {
      // If email exists, certificate generation is already triggered in checkEmail
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setSubmitStatus(null);

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

        // Important: Incorporate form data into the response
        response = {
          ...mockData.model_output,
          name: name,
          School_code: selectedSchool,
          City_code: selectedCity,
          Class: className,
        };
      } else {
        // Make the actual API call
        console.log("Using real API path");
        const formData = new FormData();
        formData.append("img", selectedFile);

        // Add form data to API request
        formData.append("name", name);
        formData.append("class", className);
        formData.append("school", selectedSchool);
        formData.append("city", selectedCity);
        formData.append("email", email);

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

        // Extract model_output from the response and merge with form data
        response = {
          ...apiResponse.data.model_output,
          name: name,
          School_code: selectedSchool,
          City_code: selectedCity,
          Class: className,
        };
      }

      // Clear the progress interval and set to 100%
      clearInterval(progressInterval);
      setProgress(100);

      setApiResponse(response);

      // Call the callback with the result
      if (handleResult) {
        handleResult(response);
      }

      // Send the processed data to the backend API
      await sendToBackend(response);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (handleError) {
        handleError(error.message || "Failed to upload image");
      }
      setSubmitStatus({
        success: false,
        message: `Error: ${error.message || "Failed to process image"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send processed data to the backend API
  const sendToBackend = async (data) => {
    try {
      // Transform the data to match the expected format
      const transformedData = {
        name: name,
        email: email,
        School_name: selectedSchool,
        City_name: selectedCity,
        Class: className,
        Driven_by: data.Driven_by || [],
        Activity: {
          q1: data.Activity?.A || [],
          q2: data.Activity?.B || [],
          q3: data.Activity?.C || [],
          q4: data.Activity?.D || [],
          q5: data.Activity?.E || [],
          q6: data.Activity?.F || [],
          q7: data.Activity?.G || [],
          q8: data.Activity?.H || [],
          q9: data.Activity?.I || [],
          q10: data.Activity?.J || [],
          q11: data.Activity?.K || [],
          q12: data.Activity?.L || [],
        },
        By_Child: data.By_Child || [],
        By_Parents: data.By_Parents || [],
      };

      console.log("Sending data to backend:", transformedData);

      // Send the data to the FastAPI backend
      const response = await axios.post(
        "http://127.0.0.1:8000/submit",
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Backend response:", response.data);

      setSubmitStatus({
        success: true,
        message: "Data successfully submitted to the system!",
      });

      // No automatic navigation to certificate page after submission
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setSubmitStatus({
        success: false,
        message: `Error submitting to backend: ${error.message}`,
      });
    }
  };

  const toggleMockData = () => {
    setUseMockData((prev) => !prev);
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      name &&
      className &&
      selectedSchool &&
      selectedCity &&
      email &&
      selectedFile
    );
  };

  const handleCityCodeChange = (value) => {
    setCityCode(value);
  };

  // Handle email blur to check if email exists
  const handleEmailBlur = async () => {
    if (email) {
      await checkEmail();
    }
  };

  // ======================================================================

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Road markings top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-800 overflow-hidden">
        <div className="flex justify-center space-x-4">
          <motion.div
            className="w-8 h-1 bg-yellow-400 mt-0.5"
            animate={{ x: [-20, 100] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          <motion.div
            className="w-8 h-1 bg-yellow-400 mt-0.5"
            animate={{ x: [-20, 100] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              delay: 0.5,
            }}
          />
          <motion.div
            className="w-8 h-1 bg-yellow-400 mt-0.5"
            animate={{ x: [-20, 100] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              delay: 1,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4">
          <CityDropdown
            selectedSchool={selectedSchool}
            onSchoolChange={setSelectedSchool}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cityCode={cityCode}
            onCityCodeChange={handleCityCodeChange}
            name={name}
            className={className}
            email={email}
            onNameChange={setName}
            onClassChange={setClassName}
            onEmailChange={setEmail}
            onEmailBlur={handleEmailBlur}
          />

          {(isLoading || isGeneratingCertificate) && (
            <div className="mt-3">
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ width: `${progress}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-600">
                  {isGeneratingCertificate
                    ? "Creating certificate..."
                    : "Processing..."}
                </p>
                <p className="text-xs text-gray-600">{progress}%</p>
              </div>
            </div>
          )}

          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-md text-sm ${
                submitStatus.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <p>{submitStatus.message}</p>
            </motion.div>
          )}

          <div className="mt-4">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-700">
                Your PDF Document
              </h3>
            </div>

            {!selectedFile && (
              <div className="mb-4">
                <div
                  className={`flex flex-col items-center p-4 border-2 border-dashed rounded-lg ${
                    isDragging
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-300 hover:border-yellow-400"
                  } transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-yellow-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    {isDragging
                      ? "Drop your PDF here"
                      : "Drag and drop your PDF here"}
                  </p>
                  <span className="text-xs text-gray-500 mb-2">- or -</span>
                  <button
                    onClick={handleBrowseClick}
                    className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded-md border border-red-200"
              >
                {error}
              </motion.div>
            )}

            {selectedFile && (
              <div className="mb-4">
                <div className="flex items-center p-2 bg-yellow-50 rounded-md border border-yellow-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={uploadPhoto}
              disabled={!isFormValid() || isLoading || isGeneratingCertificate}
              className={`py-2 px-4 rounded-md text-white text-sm font-medium ${
                !isFormValid() || isLoading || isGeneratingCertificate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isLoading
                ? "Processing..."
                : isGeneratingCertificate
                ? "Generating Certificate..."
                : "Process PDF"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Road markings bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800 overflow-hidden">
        <div className="flex justify-center space-x-4">
          <motion.div
            className="w-8 h-1 bg-yellow-400 mt-0.5"
            animate={{ x: [100, -20] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          <motion.div
            className="w-8 h-1 bg-yellow-400 mt-0.5"
            animate={{ x: [100, -20] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              delay: 0.5,
            }}
          />
          <motion.div
            className="w-8 h-1 bg-yellow-400 mt-0.5"
            animate={{ x: [100, -20] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              delay: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoUploader;
