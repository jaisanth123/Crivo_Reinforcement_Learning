import React from "react";

const BasicInformation = ({ result, handleTextChange }) => {
  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={result.name}
            onChange={(e) => handleTextChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            School Code
          </label>
          <input
            type="text"
            value={result.School_code}
            onChange={(e) => handleTextChange("School_code", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City Code
          </label>
          <input
            type="text"
            value={result.City_code}
            onChange={(e) => handleTextChange("City_code", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <input
            type="text"
            value={result.Class}
            onChange={(e) => handleTextChange("Class", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={result.Date}
            onChange={(e) => handleTextChange("Date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
