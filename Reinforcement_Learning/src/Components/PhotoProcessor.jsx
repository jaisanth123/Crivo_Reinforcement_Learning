import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for navigation
import mockData from "../Data/Mock.json"; // Import the mock data
import CityDropdown from "./CityDropdown"; // Import the CityDropdown component

function PhotoProcessor({ imageFile, onResultReceived, onError }) {
  const navigate = useNavigate(); // For navigation
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [useMockData, setUseMockData] = useState(true); // Changed to use API data by default
  const [name, setName] = useState(""); // State for name
  const [className, setClassName] = useState(""); // State for class
  const [selectedSchool, setSelectedSchool] = useState(""); // State for selected school
  const [selectedCity, setSelectedCity] = useState(""); // State for selected city
  const [cityCode, setCityCode] = useState(""); // State for city code
  const [email, setEmail] = useState(""); // State for email
  const [submitStatus, setSubmitStatus] = useState(null); // State for backend submission status
  const [emailChecked, setEmailChecked] = useState(false); // To track if email has been checked

  // Debug log to verify state changes
  useEffect(() => {
    console.log("Mock data toggle state:", useMockData);
  }, [useMockData]);

  // Function to check if email already exists
  const checkEmail = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/check-email/${email}`
      );
      console.log("Email check response:", response.data);

      if (response.data.message !== "Email unavailable") {
        // Email exists, navigate to certificate page
        setSubmitStatus({
          success: true,
          message: "Email found in system. Redirecting to certificate page...",
        });

        // Wait a moment before redirecting
        setTimeout(() => {
          navigate("/certificate", {
            state: {
              email: email,
              name: response.data.name,
              school: response.data.School_name,
              city: response.data.City_name,
              className: response.data.Class,
            },
          });
        }, 1500);

        return false; // Email exists, don't continue with process
      } else {
        // Email doesn't exist, continue with form
        setEmailChecked(true);
        return true; // Email doesn't exist, continue with process
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setSubmitStatus({
        success: false,
        message: `Error checking email: ${error.message}`,
      });
      return false; // Don't continue with process if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (!imageFile) return;

    // First check if email exists
    const shouldContinue = await checkEmail();
    if (!shouldContinue) return;

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
        formData.append("img", imageFile);

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
      if (onResultReceived) {
        onResultReceived(response);
      }

      // Send the processed data to the backend API
      await sendToBackend(response);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (onError) {
        onError(error.message || "Failed to upload image");
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
      name && className && selectedSchool && selectedCity && email && imageFile
    );
  };

  const handleCityCodeChange = (value) => {
    setCityCode(value); // Ensure this is a string
  };

  // Handle email blur to check if email exists
  const handleEmailBlur = async () => {
    if (email) {
      await checkEmail();
    }
  };

  return (
    <div className="photo-processor">
      <div className="flex flex-col items-center">
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
        <button
          onClick={uploadPhoto}
          disabled={!isFormValid() || isLoading}
          className={`
    px-6 py-3 mt-10 rounded-lg font-medium text-base transition-all duration-300
    shadow-lg transform hover:-translate-y-1 relative
    ${
      isLoading || !isFormValid()
        ? "bg-gray-700 text-gray-300 cursor-not-allowed opacity-80"
        : "bg-gradient-to-r from-blue-700 to-indigo-800 text-white hover:from-blue-800 hover:to-indigo-900"
    }
    before:content-[''] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r 
    before:from-cyan-400 before:to-blue-500 before:opacity-0 before:transition-opacity 
    before:duration-300 hover:before:opacity-70 before:-z-10 before:blur-md
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
    disabled:cursor-not-allowed disabled:opacity-60
  `}
        >
          <span className="flex items-center justify-center">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Process Image
                <svg
                  className="ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </span>
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

        {submitStatus && (
          <div
            className={`mt-4 w-full max-w-md p-3 rounded ${
              submitStatus.success
                ? "bg-green-100 border border-green-400"
                : "bg-red-100 border border-red-400"
            }`}
          >
            <p
              className={`text-sm ${
                submitStatus.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {submitStatus.message}
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
    </div>
  );
}

export default PhotoProcessor;
