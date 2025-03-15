import React from "react";
import { motion } from "framer-motion";
import { School, MapPin, UserCircle, GraduationCap } from "lucide-react";

function BasicInfo({ basicInfo }) {
  const infoItems = [
    {
      icon: <UserCircle className="h-5 w-5 text-blue-500" />,
      label: "Name",
      value: basicInfo.name,
    },
    {
      icon: <School className="h-5 w-5 text-blue-500" />,
      label: "School Name",
      value: basicInfo.School_code,
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
      label: "City Name",
      value: basicInfo.City_code,
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
      label: "Class",
      value: basicInfo.Class,
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg mb-2 overflow-hidden border border-blue-100 w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="p-3 sm:p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm0-9a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 110-2h2V8a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="bg-gray-50 rounded-lg p-2 h-full border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                <div className="flex items-center mb-1">
                  {item.icon}
                  <label className="ml-1 text-xs font-medium text-gray-500">
                    {item.label}
                  </label>
                </div>
                <div className="text-sm font-semibold text-gray-800 truncate">
                  {item.value || "N/A"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default BasicInfo;
