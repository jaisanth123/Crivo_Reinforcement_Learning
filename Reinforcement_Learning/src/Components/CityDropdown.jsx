import React, { useState } from "react";

const schools = ["School A", "School B", "School C", "School D", "School E"];
const cities = [
  "Sivakasi",
  "Erode",
  "Karur",
  "Coimbatore",
  "Puducherry",
  "Trichy",
  "Dindigul",
  "Salem",
  "Thoothukudi",
  "Tirupur",
  "Kanyakumari",
  "Madurai",
  "Chennai",
  "Vellore",
  "Hosur",
  "Hyderabad",
  "Trivandrum",
  "Mysuru",
  "Mangaluru",
  "Vizag",
  "Hubballi",
  "Bengaluru",
  "Kochi",
  "Kozhikode",
  "Amaravati",
  "Chandigarh",
  "Delhi",
  "Jaipur",
  "Lucknow",
  "Noida",
  "Kota",
  "Dehradun",
  "Kanpur",
  "Gurugram",
  "Ajmer",
  "Agra",
  "Varanasi",
  "Ahmedabad",
  "Bhopal",
  "Goa",
  "Indore",
  "Mumbai",
  "Pune",
  "Vadodara",
  "Rajkot",
  "Bhavnagar",
  "Surat",
  "Nashik",
  "Chhatrapati Sambhajinagar",
  "Nagpur",
  "Gwalior",
  "Jabalpur",
  "Bhubaneswar",
  "Jamshedpur",
  "Kolkata",
  "Raipur",
  "Siliguri",
  "Ranchi",
  "Sikkim",
  "Durg",
  "Balasore",
  "Guwahati",
  "Nagaland",
  "Mizoram",
];

// Icons as SVG components
const NameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ClassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const CityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const SchoolIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 22v-5l5-5 5 5 5-5 5 5v5"></path>
    <rect x="7" y="12" width="10" height="10"></rect>
    <line x1="12" y1="12" x2="12" y2="22"></line>
  </svg>
);

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const CityDropdown = ({
  name,
  className,
  email,
  onNameChange,
  onClassChange,
  onEmailChange,
  onCityChange,
  selectedCity,
  selectedSchool,
  onSchoolChange,
  cityCode,
  onCityCodeChange,
}) => {
  // Validation states
  const [classError, setClassError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Validate class input (should be numbers only)
  const validateClass = (value) => {
    // Allow "Class" prefix followed by numbers
    const classPattern = /^(Class\s+)?[0-9]+$/;

    if (!value) {
      setClassError("");
      onClassChange(value);
      return;
    }

    if (!classPattern.test(value)) {
      setClassError("Class should contain numbers only (e.g. Class 5)");
    } else {
      setClassError("");
    }

    onClassChange(value);
  };

  // Validate email format
  const validateEmail = (value) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!value) {
      setEmailError("");
      onEmailChange(value);
      return;
    }

    if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    onEmailChange(value);
  };

  return (
    <div className="bg-gradient-to-r w-100 from-orange-100 to-yellow-100 p-6 rounded-xl shadow-lg">
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-orange-300">
          <div className="flex items-center mb-2">
            <div className="text-orange-500 mr-2">
              <NameIcon />
            </div>
            <label className="font-medium text-orange-800">
              What's your name?
            </label>
          </div>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Type your name here"
            className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none text-lg"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-300">
          <div className="flex items-center mb-2">
            <div className="text-green-500 mr-2">
              <ClassIcon />
            </div>
            <label className="font-medium text-green-800">
              Which class are you in?
            </label>
          </div>
          <input
            type="text"
            value={className || ""}
            onChange={(e) => validateClass(e.target.value)}
            placeholder="Example: Class 5"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              classError
                ? "border-red-400"
                : "border-green-200 focus:border-green-400"
            } focus:outline-none text-lg`}
          />
          {classError && (
            <p className="text-red-500 text-sm mt-2">{classError}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300">
          <div className="flex items-center mb-2">
            <div className="text-blue-500 mr-2">
              <EmailIcon />
            </div>
            <label className="font-medium text-blue-800">
              Your email address
            </label>
          </div>
          <input
            type="email"
            value={email || ""}
            onChange={(e) => validateEmail(e.target.value)}
            placeholder="example@email.com"
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              emailError
                ? "border-red-400"
                : "border-blue-200 focus:border-blue-400"
            } focus:outline-none text-lg`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-2">{emailError}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-300">
          <div className="flex items-center mb-2">
            <div className="text-purple-500 mr-2">
              <CityIcon />
            </div>
            <label className="font-medium text-purple-800">
              Which city do you live in?
            </label>
          </div>
          <select
            value={selectedCity || ""}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-lg appearance-none bg-white"
          >
            <option value="">Choose your city</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-red-300">
          <div className="flex items-center mb-2">
            <div className="text-red-500 mr-2">
              <SchoolIcon />
            </div>
            <label className="font-medium text-red-800">
              Which school do you go to?
            </label>
          </div>
          <select
            value={selectedSchool || ""}
            onChange={(e) => onSchoolChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-red-200 focus:border-red-400 focus:outline-none text-lg appearance-none bg-white"
          >
            <option value="">Pick your school</option>
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CityDropdown;
