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

// Add new Dropdown Arrow Icon
const DropdownArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
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
  const [emailError, setEmailError] = useState("");

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
    <div className="bg-white rounded-xl">
      <div className="space-y-2">
        {/* Name Input */}
        <div className="relative">
          <input
            type="text"
            value={name || ""}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Full Name"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:outline-none text-lg"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <NameIcon />
          </div>
        </div>

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            value={email || ""}
            onChange={(e) => validateEmail(e.target.value)}
            placeholder="example@email.com"
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
              emailError
                ? "border-red-400"
                : "border-gray-200 focus:border-gray-400"
            } focus:outline-none text-lg`}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <EmailIcon />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-2">{emailError}</p>
          )}
        </div>

        {/* City Select */}
        <div className="relative">
          <select
            value={selectedCity || ""}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:outline-none text-gray-500 text-lg appearance-none bg-white"
          >
            <option value="">Chapter Name</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CityIcon />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            <DropdownArrowIcon />
          </div>
        </div>

        {/* School Select */}
        <div className="relative">
          <select
            value={selectedSchool || ""}
            onChange={(e) => onSchoolChange(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:gray-red-400 text-gray-500 focus:outline-none text-lg appearance-none bg-white"
          >
            <option value="">Pick your school</option>
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SchoolIcon />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            <DropdownArrowIcon />
          </div>
        </div>

        {/* Class Input */}
        <div className="relative">
          <input
            type="text"
            value={className || ""}
            onChange={(e) => onClassChange(e.target.value)}
            placeholder="Class"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-400 focus:outline-none text-lg"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <ClassIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDropdown;
