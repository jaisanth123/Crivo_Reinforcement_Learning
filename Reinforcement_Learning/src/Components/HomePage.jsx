import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PhotoUploader from "./PhotoUploader";

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
      title: "Chota Cop",
      description: "Learn important road signs and keep safe while you ride",
      color: "from-yellow-400 to-yellow-500",
      hoverColor: "from-yellow-500 to-yellow-600",
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      action: handleChotaCopClick,
    },
    {
      id: 2,
      title: "Safety Quiz",
      description: "Test your knowledge with fun interactive quizzes",
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
        {/* Animated background elements */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-1/4 opacity-10"
            animate={{
              x: [0, 30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#FF0000"
                stroke="#FFFFFF"
                strokeWidth="5"
              />
              <rect x="20" y="45" width="60" height="10" fill="#FFFFFF" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/4 opacity-10"
            animate={{
              x: [0, 30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ repeat: Infinity, duration: 7, delay: 0.5 }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#FFFF00"
                stroke="#000000"
                strokeWidth="5"
              />
            </svg>
          </motion.div>
        </div>

        {/* Hero section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="absolute right-4 top-20 z-10 hidden md:block">
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Learn how to stay safe on the road with fun interactive lessons!
          </p>
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
              <div className="flex flex-col md:flex-row justify-center md:justify-center items-center md:space-x-6 space-y-6 md:space-y-0">
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
                            className={`h-40 bg-gradient-to-br ${
                              activeCard === card.id
                                ? card.hoverColor
                                : card.color
                            } flex items-center justify-center p-6 transition-all duration-300`}
                          >
                            <motion.div
                              className="text-white"
                              whileHover={{ rotate: 10, scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {card.icon}
                            </motion.div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {card.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                              {card.description}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-full py-2 rounded-lg bg-gradient-to-r ${card.color} text-white font-semibold flex items-center justify-center`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Start Now
                            </motion.button>
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
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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

        {/* Animated Car */}

        {/* Road-themed decorative elements */}
        <div className="w-full max-w-5xl mt-16 opacity-20 pointer-events-none mx-auto">
          <div className="h-6 bg-gray-800 relative">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-1/2 h-2 bg-yellow-400 flex">
                <motion.div
                  className="w-1/6 h-full bg-yellow-400 mr-4"
                  animate={{ x: [-100, 300], opacity: [0, 1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                <motion.div
                  className="w-1/6 h-full bg-yellow-400 mr-4"
                  animate={{ x: [-100, 300], opacity: [0, 1, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: 1,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="w-1/6 h-full bg-yellow-400"
                  animate={{ x: [-100, 300], opacity: [0, 1, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: 2,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with wave effect */}
      <footer className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white relative mt-16">
        <div className="absolute top-0 w-full h-6 overflow-hidden">
          <div
            className="absolute left-0 w-full h-full"
            style={{
              transform: "rotate(180deg)",
              clipPath:
                "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center">
            <p>© 2025 Road Safety for Kids. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
