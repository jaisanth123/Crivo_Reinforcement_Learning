import React from "react";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";

function DrivenBy({ drivenBy, binaryToYesNo, countOccurrences }) {
  const countParents = countOccurrences(drivenBy, 1);
  const countOthers = drivenBy.length - countParents;
  const rideNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="px-2 py-0.5 bg-green-100 rounded-full text-xs font-medium text-green-800 flex items-center">
            <User className="h-3 w-3 mr-1" />
            Parents: {countParents}
          </div>
          <div className="px-2 py-0.5 bg-blue-100 rounded-full text-xs font-medium text-blue-800 flex items-center">
            <Users className="h-3 w-3 mr-1" />
            Others: {countOthers}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left font-semibold text-gray-700 border-b border-gray-200 w-1/3">
                  Driven By
                </th>
                {rideNumbers.map((num) => (
                  <th
                    key={`ride-${num}`}
                    className="py-1 px-1 text-center font-bold text-blue-700 border-b border-gray-200"
                  >
                    Ride{num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="py-2 px-2 text-gray-800 border-b border-gray-200">
                  Driver Type
                </td>
                {drivenBy.map((value, index) => (
                  <td
                    key={`driven-${index}`}
                    className="py-1 px-1 text-center border-b border-gray-200"
                  >
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        value === 1
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {value === 1 ? "Parent" : "Other"}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DrivenBy;
