import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const fileInputRef = useRef(null);
  const [pulseEffect, setPulseEffect] = useState(true);

  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);

    // Create pulsing effect for the Road Signs card
    const pulseInterval = setInterval(() => {
      setPulseEffect((prev) => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Handle Road Signs card click (similar to original Start Your Adventure)
  const handleRoadSignsClick = () => {
    setShowModal(true);
  };

  const handleLocalUpload = () => {
    // Navigate to the photo upload page instead of triggering file input
    navigate("/photo/upload");
    setShowModal(false);
  };

  const handleFileSelected = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Navigate to upload page with the selected file
      navigate("/photo/upload", {
        state: { selectedFile: e.target.files[0] },
      });
    }
  };

  const handleCameraCapture = () => {
    navigate("/photo/camera");
    setShowModal(false);
  };

  // Handle quiz functionality
  const handleQuiz = () => {
    navigate("/road-signs/quiz");
    setShowModal(false);
  };

  // Navigation options
  const cardOptions = [
    {
      id: 1,
      title: "Chota Cop",
      description: "Learn important road signs and Response you ride",
      color: "from-red-500 to-orange-400",
      hoverColor: "from-red-600 to-orange-500",
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
      specialAction: handleRoadSignsClick,
      isPulsing: pulseEffect,
    },
    {
      id: 2,
      title: "Crossing Streets",
      description: "Learn how to cross streets safely",
      color: "from-green-500 to-teal-400",
      hoverColor: "from-green-600 to-teal-500",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      path: "/crossing-streets",
    },
    {
      id: 3,
      title: "Bike Safety",
      description: "Tips for riding your bike safely",
      color: "from-blue-500 to-indigo-400",
      hoverColor: "from-blue-600 to-indigo-500",
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
            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
          />
        </svg>
      ),
      path: "/bike-safety",
    },
    {
      id: 4,
      title: "Car Safety",
      description: "Learn about seatbelts and car safety",
      color: "from-purple-500 to-pink-400",
      hoverColor: "from-purple-600 to-pink-500",
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
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      path: "/car-safety",
    },
  ];

  const handleCardClick = (card) => {
    if (card.specialAction) {
      card.specialAction();
    } else if (card.path) {
      navigate(card.path);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2362/2362200.png"
                alt="Kids Safety"
                className="h-10 w-10 rounded-full bg-white p-1"
              />
              <span className="ml-3 text-xl font-bold">
                Road Safety for Kids
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-700"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  About
                </a>
                <a
                  href="#"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero section with animation */}
        <div
          className={`mb-12 text-center transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
            YOUNG INDIANS
            <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-yellow-300 to-red-500 rounded-full"></div>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to stay safe on the road with fun interactive lessons!
          </p>
        </div>

        {/* Four card options with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cardOptions.map((card, index) => (
            <div
              key={card.id}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              } ${card.id === 1 ? "border-2 border-yellow-400" : ""}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => handleCardClick(card)}
            >
              <div
                className={`h-40 bg-gradient-to-br ${
                  activeCard === card.id ? card.hoverColor : card.color
                } flex items-center justify-center p-6 transition-all duration-300 ${
                  card.id === 1 && card.isPulsing ? "animate-pulse" : ""
                }`}
              >
                <div className="text-white transform transition-all duration-500 hover:scale-110">
                  {card.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
                <button
                  className={`mt-4 w-full py-2 rounded-lg bg-gradient-to-r ${
                    card.color
                  } text-white font-semibold transform transition-all duration-300 hover:scale-105 ${
                    card.id === 1 ? "flex items-center justify-center" : ""
                  }`}
                >
                  {card.id === 1 && (
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
                  )}
                  Start Learning
                </button>
              </div>

              {/* Animated indicator */}
              <div
                className={`h-1 bg-gradient-to-r ${
                  card.color
                } transform transition-all duration-500 ${
                  activeCard === card.id ? "scale-x-100" : "scale-x-0"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Animated floating elements in the background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-yellow-200 opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-10 w-20 h-20 rounded-full bg-blue-200 opacity-20 animate-pulse delay-100"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-green-200 opacity-10 animate-pulse delay-200"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-purple-200 opacity-15 animate-pulse delay-300"></div>
        </div>
      </main>

      {/* Footer with wave effect */}
      <footer className="bg-gradient-to-r from-purple-600 to-blue-600 text-white relative">
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

      {/* Hidden file input - keeping this for backward compatibility */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* Enhanced modal with animations - appears when Road Signs card is clicked */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
              Road Safety Learning Path!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Card 1: Road Sign Gallery (existing functionality) */}
              <div
                onClick={handleLocalUpload}
                className="flex flex-col items-center p-6 border-2 border-red-300 rounded-2xl cursor-pointer hover:bg-red-50 transition-all hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-lg text-red-600 mb-1">
                  Chota cop
                </span>
                {/* <p className="text-gray-500 text-center text-sm">
                  Learn about important road signs with pictures
                </p> */}
              </div>

              {/* Card 2: Quiz (new functionality) */}
              <div
                onClick={handleQuiz}
                className="flex flex-col items-center p-6 border-2 border-orange-300 rounded-2xl cursor-pointer hover:bg-orange-50 transition-all hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-orange-600"
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
                </div>
                <span className="font-bold text-lg text-orange-600 mb-1">
                  Road Signs Quiz
                </span>
                <p className="text-gray-500 text-center text-sm">
                  Test your knowledge with fun quizzes
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-4 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-medium rounded-xl transition transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
