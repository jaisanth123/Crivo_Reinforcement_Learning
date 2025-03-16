import React from "react";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";

function DrivenBy({ drivenBy, binaryToYesNo, countOccurrences }) {
  const countParents = countOccurrences(drivenBy, 1);
  const countOthers = drivenBy.length - countParents;

  return (
    <motion.div
      className="bg-white rounded-xl mb-1 shadow-lg overflow-hidden border border-green-100 w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-0.5 bg-gradient-to-r from-green-500 to-teal-600"></div>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 sm:gap-0">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="bg-green-100 text-green-600 p-1 rounded-md mr-2">
              <Users className="h-4 w-4" />
            </span>
            Driven By
          </h2>

          {/* Parent and Other counts in top right */}
          <div className="flex space-x-2">
            <div className="px-2 py-0.5 bg-green-100 rounded-full text-xs font-medium text-green-800 flex items-center">
              <User className="h-3 w-3 mr-1" />
              Parents: {countParents}
            </div>
            <div className="px-2 py-0.5 bg-blue-100 rounded-full text-xs font-medium text-blue-800 flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Others: {countOthers}
            </div>
          </div>
        </div>

        {/* Desktop version - Original structure */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-11 gap-1 mb-1 border-b pb-1">
            <div className="font-medium text-xs text-gray-700">Rides</div>
            {drivenBy.map((_, index) => (
              <div
                key={`ride-header-${index}`}
                className="text-center font-medium text-xs text-gray-700"
              >
                R{index + 1}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-11 gap-1 mb-3">
            <div className="font-medium text-xs text-gray-700 flex items-center">
              <span>By:</span>
            </div>
            {drivenBy.map((value, index) => (
              <motion.div
                key={`driven-code-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="text-center"
              >
                <div className="bg-gray-100 rounded-md p-1 relative">
                  <div className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs px-1 py-0 rounded-full text-xs">
                    W{index}
                  </div>
                  <span
                    className={
                      value === 1
                        ? "text-green-600 font-medium text-xs"
                        : "text-blue-600 font-medium text-xs"
                    }
                  >
                    {value === 1 ? "Parents" : "Others"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile version - 5 boxes in a row grid layout (changed from 3) */}
        <div className="block sm:hidden">
          <div className="mb-2 border-b pb-1"></div>

          <div className="grid grid-cols-5 gap-1">
            {drivenBy.map((value, index) => (
              <motion.div
                key={`mobile-driven-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
              >
                <div className="bg-gray-50 rounded-md p-1 relative h-full">
                  {/* Ride number at top */}
                  <div className="text-center mb-1">
                    <span className="font-medium text-xs text-gray-700 bg-gray-200 px-1 py-0.5 rounded-full text-xs">
                      R{index + 1}
                    </span>
                  </div>

                  {/* Who info */}
                  <div className="bg-gray-100 rounded-md p-1 relative">
                    <div className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center text-xs leading-none">
                      {index}
                    </div>
                    <span
                      className={
                        value === 1
                          ? "text-green-600 font-medium text-xs"
                          : "text-blue-600 font-medium text-xs"
                      }
                    >
                      {value === 1 ? "Parent" : "Others"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DrivenBy;
