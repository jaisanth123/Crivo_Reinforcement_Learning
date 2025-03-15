// CertificatePDFGenerator.js
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CertificatePDFGenerator from "./CertificatePDFGenerator";
const CertificatePDFGenerator = () => {
  const generatePDF = (
    certificateData,
    certificateImage,
    setIsGeneratingCertificate,
    setSubmitStatus
  ) => {
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
    img.onerror = () => {
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

  // Return the function so it can be used in other components
  return { generatePDF };
};

export default CertificatePDFGenerator;
