import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const roadSigns = [
  {
    id: 1,
    name: "Stop Sign",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill="#d81e05"
          stroke="#ffffff"
          strokeWidth="3"
        />
        <text
          x="50"
          y="65"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="24"
        >
          STOP
        </text>
      </svg>
    ),
    description:
      "Mandatory sign indicating that a driver must come to a complete stop at the stop line. Proceed only when it's safe and after giving way to vehicles and pedestrians.",
    color: "bg-red-600",
    position: "top-5 right-5",
    category: "Mandatory",
  },
  {
    id: 2,
    name: "No Entry",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#d81e05"
          stroke="#ffffff"
          strokeWidth="3"
        />
        <rect x="15" y="45" width="70" height="10" fill="#ffffff" />
      </svg>
    ),
    description:
      "Prohibits entry of all vehicles. This sign is placed at roads where vehicles are not permitted to enter, such as one-way streets or restricted areas.",
    color: "bg-red-600",
    position: "bottom-5 left-5",
    category: "Prohibitory",
  },
  {
    id: 3,
    name: "Speed Limit (40 km/h)",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#ffffff"
          stroke="#d81e05"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#ffffff"
          stroke="#d81e05"
          strokeWidth="1"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#000000"
          fontWeight="bold"
          fontSize="30"
        >
          40
        </text>
      </svg>
    ),
    description:
      "Indicates the maximum speed limit of 40 kilometers per hour. Exceeding this speed is an offense under the Motor Vehicles Act in India.",
    color: "bg-red-600",
    position: "top-5 left-5",
    category: "Regulatory",
  },
  {
    id: 4,
    name: "Pedestrian Crossing",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill="#0052B4"
          stroke="#ffffff"
          strokeWidth="3"
        />
        <path
          d="M50,25 C45,25 42,30 42,35 C42,38 44,40 47,40 L47,60 L40,75 L45,77 L52,62 L55,62 L62,77 L67,75 L60,60 L60,40 C63,40 65,38 65,35 C65,30 62,25 57,25 Z"
          fill="#ffffff"
        />
      </svg>
    ),
    description:
      "Warns drivers about a pedestrian crossing ahead. Drivers must slow down and be prepared to stop to allow pedestrians to cross safely.",
    color: "bg-blue-600",
    position: "bottom-5 right-5",
    category: "Cautionary",
  },
  {
    id: 5,
    name: "No Parking",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#ffffff"
          stroke="#d81e05"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#ffffff"
          stroke="#d81e05"
          strokeWidth="1"
        />
        <text
          x="50"
          y="40"
          textAnchor="middle"
          fill="#d81e05"
          fontWeight="bold"
          fontSize="20"
        >
          P
        </text>
        <line
          x1="25"
          y1="25"
          x2="75"
          y2="75"
          stroke="#d81e05"
          strokeWidth="5"
        />
      </svg>
    ),
    description:
      "Indicates that parking is not allowed at any time. Violating this rule can result in fines or vehicle towing as per Indian traffic regulations.",
    color: "bg-red-600",
    position: "top-20 right-20",
    category: "Prohibitory",
  },
  {
    id: 6,
    name: "School Ahead",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill="#FFCC00"
          stroke="#000000"
          strokeWidth="3"
        />
        <path
          d="M35,35 L65,35 L65,65 L35,65 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M40,45 L60,45 M40,55 L60,55 M50,35 L50,65"
          stroke="#000000"
          strokeWidth="2"
        />
        <circle cx="45" cy="40" r="3" fill="#000000" />
        <circle cx="55" cy="40" r="3" fill="#000000" />
      </svg>
    ),
    description:
      "Warns drivers that they are approaching a school zone. Drivers should reduce speed and watch for children crossing the road.",
    color: "bg-yellow-500",
    position: "bottom-20 left-20",
    category: "Cautionary",
  },
  {
    id: 7,
    name: "No Overtaking",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#ffffff"
          stroke="#d81e05"
          strokeWidth="3"
        />
        <path
          d="M30,50 L45,35 L45,45 L70,45 L70,55 L45,55 L45,65 Z"
          fill="#000000"
        />
        <path d="M25,35 L40,50 L25,65 Z" fill="#d81e05" />
        <line
          x1="25"
          y1="25"
          x2="75"
          y2="75"
          stroke="#d81e05"
          strokeWidth="5"
        />
      </svg>
    ),
    description:
      "Prohibits overtaking or passing other vehicles. This sign is typically placed on roads where overtaking is dangerous due to poor visibility or road conditions.",
    color: "bg-red-600",
    position: "top-20 left-20",
    category: "Prohibitory",
  },
];

function RoadSigns() {
  const [activeSign, setActiveSign] = useState(null);

  const handleSignClick = (sign) => {
    setActiveSign(sign);
  };

  const handleClosePopup = () => {
    setActiveSign(null);
  };

  return (
    <>
      {roadSigns.map((sign) => (
        <motion.div
          key={sign.id}
          className={`absolute ${sign.position} z-10 cursor-pointer`}
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.5,
            opacity: { repeat: Infinity, duration: 3, repeatType: "reverse" },
            y: { repeat: Infinity, duration: 2, repeatType: "reverse" },
          }}
          onClick={() => handleSignClick(sign)}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 filter drop-shadow-lg">
            {sign.svg}
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {activeSign && (
          <motion.div
            className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={handleClosePopup}
          >
            <motion.div
              className="bg-white/90 rounded-xl overflow-hidden max-w-md w-full shadow-2xl border border-white/20"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${activeSign.color} p-4 flex items-center justify-between bg-opacity-90`}
              >
                <h3 className="text-white font-bold text-xl">
                  {activeSign.name}
                </h3>
                <span className="text-white text-sm px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  {activeSign.category}
                </span>
                <button
                  onClick={handleClosePopup}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 backdrop-blur-sm bg-white/70">
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-24 h-24 filter drop-shadow-md"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                  >
                    {activeSign.svg}
                  </motion.div>
                </div>
                <p className="text-gray-700 text-center mb-6">
                  {activeSign.description}
                </p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClosePopup}
                    className={`px-6 py-2 ${activeSign.color} text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    Got it!
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RoadSigns;
