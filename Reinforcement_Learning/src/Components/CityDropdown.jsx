import React from "react";

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
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Class"
        value={className}
        onChange={(e) => onClassChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select City</option>
        {cities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select
        value={selectedSchool}
        onChange={onSchoolChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select School</option>
        {schools.map((school, index) => (
          <option key={index} value={school}>
            {school}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="City Code"
        value={cityCode} // Ensure this is a string
        onChange={onCityCodeChange} // Ensure this function updates cityCode correctly
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default CityDropdown;
