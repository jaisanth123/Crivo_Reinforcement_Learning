import React from "react";

function DrivenBy({ drivenBy, binaryToYesNo, countOccurrences }) {
  const countParents = countOccurrences(drivenBy, 1);
  const countOthers = drivenBy.length - countParents;

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Driven By</h2>
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Parents:</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {countParents}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Others:</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {countOthers}
          </span>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        {drivenBy.map((value, index) => (
          <div
            key={`driven-${index}`}
            className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
          >
            <span className="font-medium">Ride {index + 1}:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                value === 1
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {value === 1 ? "Parent" : "Other"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrivenBy;
