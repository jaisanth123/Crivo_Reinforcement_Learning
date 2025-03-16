import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PhotoUploader from "./PhotoUploader";
import RoadSigns from "./RoadSigns";
import chotaCopLogo from "../assets/CH.png";

function HomePage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [showUploadComponent, setShowUploadComponent] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle Chota Cop card click
  const handleChotaCopClick = () => {
    setShowUploadComponent(true);
    setShowPhotoUploader(true);
  };

  // Handle Safety Quiz card click
  const handleSafetyQuizClick = () => {
    setShowQuizPopup(true);
  };

  // Handle closing the PhotoUploader
  const handleClosePhotoUploader = () => {
    setShowPhotoUploader(false);
    setShowUploadComponent(false);
  };

  // Handle closing the Quiz popup
  const handleCloseQuizPopup = () => {
    setShowQuizPopup(false);
  };

  // Card options
  const cardOptions = [
    {
      id: 1,

      color: "from-yellow-400 to-yellow-500",
      hoverColor: "from-yellow-500 to-yellow-600",
      icon: (
        <img
          src={chotaCopLogo}
          alt="Chota Cop Logo"
          className="h-40 w-40 object-contain"
        />
      ),
      action: handleChotaCopClick,
    },
    {
      id: 2,
      title: "Safety Quiz",
      description: "Test  your knowledge with fun interactive quizzes",
      color: "from-green-400 to-green-500",
      hoverColor: "from-green-500 to-green-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      action: handleSafetyQuizClick,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2554/2554966.png"
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="font-bold text-xl">Road Safety for Kids</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="hover:text-yellow-200 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-yellow-200 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-yellow-200 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 relative overflow-hidden">
        {/* Road Signs Component */}
        <RoadSigns />

        {/* Hero section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          {/* traffic signal */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
            <div className="w-10 h-24 bg-gray-800 rounded-lg flex flex-col items-center justify-around p-1">
              <motion.div
                className="w-6 h-6 bg-red-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="w-6 h-6 bg-yellow-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2,
                }}
              />
              <motion.div
                className="w-6 h-6 bg-green-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 4,
                }}
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
            YOUNG INDIANS
            <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-yellow-300 to-red-500 rounded-full"></div>
          </h1>
        </motion.div>

        {/* Cards and PhotoUploader container */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Cards section */}
            <div
              className={`${
                showPhotoUploader ? "md:col-span-5" : "md:col-span-12"
              }`}
            >
              <div className="flex flex-col  md:flex-row justify-center md:justify-center items-center md:space-x-6 space-y-6 md:space-y-0">
                <AnimatePresence>
                  {cardOptions.map(
                    (card, index) =>
                      (!showUploadComponent || card.id === 1) && (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            x: showUploadComponent && card.id === 1 ? -20 : 0,
                            scale:
                              showUploadComponent && card.id === 1 ? 0.9 : 1,
                          }}
                          exit={{
                            opacity: 0,
                            x: card.id === 1 ? -300 : 300,
                            transition: { duration: 0.5 },
                          }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.2,
                          }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow:
                              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          }}
                          className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs cursor-pointer"
                          onMouseEnter={() => setActiveCard(card.id)}
                          onMouseLeave={() => setActiveCard(null)}
                          onClick={card.action}
                        >
                          <div
                            className={`h-48 bg-gradient-to-br ${
                              activeCard === card.id
                                ? card.hoverColor
                                : card.color
                            } flex items-center justify-center p-6 transition-all duration-300`}
                          >
                            <div className="text-white">{card.icon}</div>
                          </div>

                          {/* Animated indicator */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: activeCard === card.id ? 1 : 0 }}
                            className={`h-1 bg-gradient-to-r ${card.color} origin-left`}
                          ></motion.div>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PhotoUploader section */}
            {showPhotoUploader && (
              <motion.div
                className="md:col-span-7"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white rounded-2xl w-120 shadow-xl overflow-hidden">
                  <div className="h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-between px-4">
                    <h3 className="text-white font-bold">
                      Chota Cop - Upload Your PDF
                    </h3>
                    <button
                      onClick={handleClosePhotoUploader}
                      className="text-white hover:text-yellow-200"
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
                  <div className="p-4">
                    <PhotoUploader />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quiz Coming Soon Popup */}
        <AnimatePresence>
          {showQuizPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0  backdrop:blur-md bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="h-12 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-between px-4">
                  <h3 className="text-white font-bold">Safety Quiz</h3>
                  <button
                    onClick={handleCloseQuizPopup}
                    className="text-white hover:text-green-200"
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
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2995/2995620.png"
                      alt="Children Quiz"
                      className="w-32 h-32"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Coming Soon!
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Our interactive road safety quiz for children is under
                    development. Check back soon to test your knowledge and
                    learn more about staying safe on the roads!
                  </p>
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCloseQuizPopup}
                      className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-medium"
                    >
                      I'll check back later
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="absolute bottom-20 z-10 hidden md:block"
          animate={{ x: [-100, window.innerWidth + 100] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width="60"
            height="40"
            viewBox="0 0 60 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="10"
              cy="30"
              r="8"
              stroke="#333"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="45"
              cy="30"
              r="8"
              stroke="#333"
              strokeWidth="2"
              fill="none"
            />
            <rect x="5" y="10" width="45" height="15" rx="5" fill="#4f46e5" />
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformOrigin: "10px 30px" }}
            >
              <line
                x1="10"
                y1="30"
                x2="10"
                y2="22"
                stroke="#333"
                strokeWidth="2"
              />
              <line
                x1="10"
                y1="30"
                x2="16"
                y2="33"
                stroke="#333"
                strokeWidth="2"
              />
              <line
                x1="10"
                y1="30"
                x2="4"
                y2="33"
                stroke="#333"
                strokeWidth="2"
              />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformOrigin: "45px 30px" }}
            >
              <line
                x1="45"
                y1="30"
                x2="45"
                y2="22"
                stroke="#333"
                strokeWidth="2"
              />
              <line
                x1="45"
                y1="30"
                x2="51"
                y2="33"
                stroke="#333"
                strokeWidth="2"
              />
              <line
                x1="45"
                y1="30"
                x2="39"
                y2="33"
                stroke="#333"
                strokeWidth="2"
              />
            </motion.g>
            <line
              x1="10"
              y1="30"
              x2="27"
              y2="15"
              stroke="#333"
              strokeWidth="2"
            />
            <line
              x1="45"
              y1="30"
              x2="27"
              y2="15"
              stroke="#333"
              strokeWidth="2"
            />
            <line
              x1="27"
              y1="15"
              x2="35"
              y2="15"
              stroke="#333"
              strokeWidth="2"
            />
            <line
              x1="35"
              y1="15"
              x2="45"
              y2="30"
              stroke="#333"
              strokeWidth="2"
            />
            <rect x="34" y="10" width="2" height="5" fill="#333" />
            <rect x="25" y="5" width="10" height="5" rx="2" fill="#f59e0b" />
          </svg>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                © 2023 Road Safety for Kids. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
