import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BasicInfo from "./DisplayComponents/BasicInfo";
import DrivenBy from "./DisplayComponents/DrivenBy";
import Activity from "./DisplayComponents/Activity";
import QuestionSection from "./DisplayComponents/QuestionSection";
import NoResults from "./DisplayComponents/NoResults";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Code, FileText, Printer, Download } from "lucide-react";
import {
  binaryToYesNo,
  countOccurrences,
  getActivityQuestionText,
  getQuestionText,
  getParentQuestionText,
} from "./DisplayComponents/utils";

// Import the certificate image directly
import certificateImage from "../Components/Chota Cop Certificate.png";

function ResultDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRawJson, setShowRawJson] = useState(false);
  const [result, setResult] = useState(location.state?.result || null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  // Count parent and child questions
  const generatePDF = () => {
    if (!result.name || !result.School_code || !result.Class) {
      alert("Please fill in all fields!");
      return;
    }

    setIsGeneratingCertificate(true);

    // Create a temporary div for rendering
    const tempDiv = document.createElement("div");
    tempDiv.className =
      "relative w-[1123px] h-[794px] bg-white shadow-lg border rounded-lg overflow-hidden";

    // Create an image element
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = certificateImage;
    img.className = "w-full h-full object-cover";

    // Add the image to the div
    tempDiv.appendChild(img);

    // Create and add text elements for the data
    const nameDiv = document.createElement("div");
    nameDiv.className =
      "absolute top-[388px] left-[345px] text-xl font-bold text-black";
    nameDiv.textContent = result.name;
    tempDiv.appendChild(nameDiv);

    const schoolCodeDiv = document.createElement("div");
    schoolCodeDiv.className =
      "absolute top-[458px] left-[340px] text-xs font-bold text-black";
    schoolCodeDiv.textContent = result.School_code;
    tempDiv.appendChild(schoolCodeDiv);

    const classDiv = document.createElement("div");
    classDiv.className =
      "absolute top-[448px] left-[750px] text-xl font-bold text-black";
    classDiv.textContent = result.Class;
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
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
          setIsGeneratingCertificate(false);
          alert("Failed to generate certificate. Please try again.");
        });
    };

    // Handle image loading error
    img.onerror = () => {
      console.error("Failed to load the certificate template image");
      document.body.removeChild(tempDiv);
      setIsGeneratingCertificate(false);
      alert(
        "Failed to load certificate template. Please check the image path."
      );
    };
  };

  const parentCount = result?.By_Parents?.length || 0;
  const childCount = result?.By_Child?.length || 0;

  useEffect(() => {
    if (result) {
      console.log("Result structure:", result);
    }
  }, [result]);

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return <NoResults />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mb-3">
          <motion.div
            className="flex justify-between items-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </button>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Analysis Results
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors duration-200"
              >
                {showRawJson ? (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    View Formatted
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    View JSON
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 rounded-full bg-green-100 hover:bg-green-200 text-sm font-medium text-green-700 transition-colors duration-200"
              >
                <Printer className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        {showRawJson ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-auto max-h-96 shadow-lg">
              {JSON.stringify(result, null, 2)}
            </pre>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BasicInfo
              basicInfo={{
                name: result.name,
                School_code: result.School_code,
                City_code: result.City_code,
                Class: result.Class,
              }}
            />

            {result.Driven_by && Array.isArray(result.Driven_by) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <DrivenBy
                  drivenBy={result.Driven_by}
                  binaryToYesNo={binaryToYesNo}
                  countOccurrences={countOccurrences}
                />
              </motion.div>
            )}

            {result.Activity && typeof result.Activity === "object" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Activity
                  activity={result.Activity}
                  getActivityQuestionText={getActivityQuestionText}
                  binaryToYesNo={binaryToYesNo}
                />
              </motion.div>
            )}

            {/* Side-by-side layout for By Child and By Parents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {result.By_Child && Array.isArray(result.By_Child) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <QuestionSection
                    title="By Child"
                    questions={result.By_Child}
                    getQuestionText={getQuestionText}
                    binaryToYesNo={binaryToYesNo}
                  />
                </motion.div>
              )}

              {result.By_Parents && Array.isArray(result.By_Parents) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex-grow">
                    <QuestionSection
                      title="By Parents"
                      questions={result.By_Parents}
                      getQuestionText={getParentQuestionText}
                      binaryToYesNo={binaryToYesNo}
                    />
                  </div>

                  {/* Generate Certificate Button placed under By Parents section */}
                  <motion.div
                    className="mt-0 flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <button
                      onClick={generatePDF}
                      disabled={isGeneratingCertificate}
                      className={`bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center ${
                        isGeneratingCertificate
                          ? "opacity-75 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      {isGeneratingCertificate
                        ? "Generating..."
                        : "Save & Generate Certificate"}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ResultDisplay;
