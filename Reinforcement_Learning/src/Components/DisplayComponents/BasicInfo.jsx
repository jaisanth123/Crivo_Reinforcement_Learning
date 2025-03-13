import React from "react";

function BasicInfo({ basicInfo }) {
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
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md">
            {basicInfo.name}
          </div>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            School Code
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md">
            {basicInfo.School_code}
          </div>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City Code
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md">
            {basicInfo.City_code}
          </div>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md">
            {basicInfo.Class}
          </div>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md">
            {basicInfo.Date}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;
