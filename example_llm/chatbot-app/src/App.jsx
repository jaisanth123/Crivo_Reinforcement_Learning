import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaUser, FaRobot, FaLightbulb } from "react-icons/fa";
import "./App.css";
import Login from "./login";

// Add these constants at the top of your file
const OPERATIONS = {
  GET: ["show", "find", "list", "get", "search", "display", "view", "see"],
  POST: ["create", "add", "register", "new", "submit", "post"],
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messageEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // New state for product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    productId: `P${Math.floor(Math.random() * 1000)}`,
    item: "",
    pricePerKilo: 0,
    // Removed sellerId from the initial state
    category: "",
    quantity: 0,
    harvestDate: new Date().toISOString().split("T")[0], // Set default to today's date
    location: "",
    reviews: [],
  });

  // Add new state for forms
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Add form data states
  const [sellerFormData, setSellerFormData] = useState({
    sellerId: `S${Math.floor(Math.random() * 1000)}`,
    name: "",
    email: "",
    password: "",
    address: "",
    sellerNumber: "",
    status: "active",
    products: [],
    orderIds: [],
  });

  const [customerFormData, setCustomerFormData] = useState({
    customerId: `C${Math.floor(Math.random() * 1000)}`,
    customerName: "",
    customerMail: "",
    password: "",
    customerNumber: "",
    address: "",
    orders: [],
    reviewIds: [],
  });

  const [reviewFormData, setReviewFormData] = useState({
    reviewId: `R${Math.floor(Math.random() * 1000)}`,
    customerId: "",
    productId: "",
    rating: 5,
    reviewText: "",
  });

  // Add new state for form loading
  const [formLoading, setFormLoading] = useState(false);

  // Add a new state for tracking cancellation
  const [isFormCancelled, setIsFormCancelled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const getSuggestions = () => {
    return [
      "Show all products",
      "Add new product",
      "List of sellers",
      "See reviews",
      "Find vegetables",
      "Add new seller",
      "Show my orders",
    ];
  };
  const detectOperationType = (input) => {
    input = input.toLowerCase();

    if (input === "") return null;

    // Don't check isFormCancelled here anymore
    if (isProcessing) return null;

    if (
      OPERATIONS.POST.some((keyword) => input.includes(keyword)) &&
      input.includes("product")
    ) {
      setIsProcessing(true);
      return "PRODUCT";
    }

    // Check for other POST operations
    if (OPERATIONS.POST.some((keyword) => input.includes(keyword))) {
      return "POST";
    }

    // Check for GET operations
    if (OPERATIONS.GET.some((keyword) => input.includes(keyword))) {
      return "GET";
    }

    return "GET";
  };

  const processProductInput = async (input) => {
    if (isFormCancelled) {
      setIsFormCancelled(false);
      setIsProcessing(false);
      return;
    }

    try {
      setFormLoading(true);
      const loadingMessage = {
        sender: "bot",
        text: "Processing your product request...",
        id: "loading-message",
      };

      setMessages((prev) => {
        const filteredMessages = prev.filter(
          (msg) => msg.id !== "loading-message"
        );
        return [...filteredMessages, loadingMessage];
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/process-request",
        { input }
      );

      setMessages((prev) => prev.filter((msg) => msg.id !== "loading-message"));

      if (!isFormCancelled) {
        setProductFormData((prev) => ({
          ...prev,
          ...response.data.product_data,
        }));
        setShowProductForm(true);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== "loading-message"));
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error processing product details: ${
            error.response?.data?.detail || error.message
          }`,
        },
      ]);
    } finally {
      setFormLoading(false);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput(""); // Clear input immediately after submit

    // Don't process if already processing
    if (isProcessing) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: currentInput }]);

    try {
      const operationType = detectOperationType(currentInput);

      if (operationType === "PRODUCT") {
        await processProductInput(currentInput);
        return;
      }

      if (operationType === null) {
        return;
      }

      // Handle other operations...
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Processing...",
          id: "loading-message",
        },
      ]);

      const response = await axios.post(
        "http://127.0.0.1:8000/process-request",
        {
          input: currentInput,
          operation_type: operationType,
        }
      );

      // Remove loading message and add response
      setMessages((prev) => {
        const withoutLoading = prev.filter(
          (msg) => msg.id !== "loading-message"
        );
        return [
          ...withoutLoading,
          {
            sender: "bot",
            text:
              response.data?.response ||
              "I'm not sure how to handle that request.",
          },
        ];
      });
    } catch (error) {
      console.error("Error details:", error);
      setMessages((prev) => {
        const withoutLoading = prev.filter(
          (msg) => msg.id !== "loading-message"
        );
        return [
          ...withoutLoading,
          {
            sender: "bot",
            text: `Error: ${
              error.response?.data?.detail || "Failed to process your request."
            }`,
          },
        ];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Creating product...",
          id: "submit-loading", // Add an ID to identify this message
        },
      ]);

      // Submit the form with the current product form data
      const submitResponse = await axios.post(
        "http://127.0.0.1:8000/products",
        productFormData
      );

      // Remove loading message and show success
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "submit-loading"),
        {
          sender: "bot",
          text: `✅ Product created successfully! Product ID: ${submitResponse.data.id}`,
        },
      ]);

      setShowProductForm(false);
    } catch (error) {
      // Remove loading message and show error
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "submit-loading"),
        {
          sender: "bot",
          text: `❌ Error creating product: ${
            error.response?.data?.detail || error.message
          }`,
        },
      ]);
    } finally {
      setFormLoading(false);
    }
  };

  // Add form submit handlers
  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/sellers",
        sellerFormData
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Seller created successfully! ID: ${response.data.id}`,
        },
      ]);
      setShowSellerForm(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error creating seller: ${
            error.response?.data?.detail || error.message
          }`,
        },
      ]);
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/customers",
        customerFormData
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Customer created successfully! ID: ${response.data.id}`,
        },
      ]);
      setShowCustomerForm(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error creating customer: ${
            error.response?.data?.detail || error.message
          }`,
        },
      ]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/reviews",
        reviewFormData
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Review created successfully! ID: ${response.data.id}`,
        },
      ]);
      setShowReviewForm(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error creating review: ${
            error.response?.data?.detail || error.message
          }`,
        },
      ]);
    }
  };

  // Add handler for form cancellation
  const handleFormCancel = () => {
    setIsFormCancelled(true);
    setIsProcessing(false);
    setShowProductForm(false);
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "❌ Product creation cancelled by user.",
      },
    ]);
    setInput("");
    setProductFormData({
      productId: `P${Math.floor(Math.random() * 1000)}`,
      item: "",
      pricePerKilo: 0,
      category: "",
      quantity: 0,
      harvestDate: new Date().toISOString().split("T")[0],
      location: "",
      reviews: [],
    });
    // Reset cancellation flag after a short delay
    setTimeout(() => {
      setIsFormCancelled(false);
    }, 100);
  };

  const Suggestions = () => (
    <div className="absolute bottom-full left-0 w-full mb-2">
      <div className="p-2 bg-gray-800 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {getSuggestions().map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(suggestion);
                setShowSuggestions(false);
              }}
              className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <div className="relative">
      <Login />
      <div
        className="fixed bottom-5 right-5 bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700 transition transform hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaRobot size={28} className="text-white" />
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-5 bg-gray-800 w-96 h-[500px] rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-purple-700 p-4 text-center text-white font-bold text-lg">
            Mistral Chatbot
          </div>

          <div className="flex-1 p-1 overflow-y-auto space-y-2 scrollbar-hide chat-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex items-center ${
                    message.sender === "user" ? "" : "flex-row-reverse"
                  }`}
                >
                  <div className="mx-2">
                    {message.sender === "user" ? (
                      <FaUser size={20} className="text-purple-600" />
                    ) : (
                      <FaRobot size={20} className="text-gray-300" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    } animate-fade-in`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="flex items-center flex-row-reverse">
                  <div className="mx-2">
                    <FaRobot size={20} className="text-gray-300" />
                  </div>
                  <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg animate-pulse">
                    loading...
                  </div>
                </div>
              </div>
            )}
            {formLoading && (
              <div className="flex justify-end">
                <div className="flex items-center flex-row-reverse"></div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <div className="relative">
            {showSuggestions && <Suggestions />}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-gray-700 flex items-center"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-2 pr-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                    showSuggestions
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FaLightbulb size={16} />
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className={`ml-2 p-2 rounded-full transition-colors ${
                  input.trim()
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-600 cursor-not-allowed text-gray-400"
                }`}
              >
                <FaPaperPlane size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowProductForm(false)}
          ></div>
          <div className="bg-gray-800 p-6 rounded-lg w-[400px] max-h-[90vh] overflow-y-auto relative z-50 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">
                Create New Product
              </h2>
              <button
                onClick={() => setShowProductForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Product ID
                </label>
                <input
                  type="text"
                  value={productFormData.productId}
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      productId: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                  readOnly
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Item Name
                </label>
                <input
                  type="text"
                  value={productFormData.item}
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      item: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Price per Kilo
                </label>
                <input
                  type="number"
                  value={productFormData.pricePerKilo}
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      pricePerKilo: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Category
                </label>
                <input
                  type="text"
                  value={productFormData.category}
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Quantity
                </label>
                <input
                  type="number"
                  value={productFormData.quantity}
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Harvest Date
                </label>
                <input
                  type="date"
                  value={productFormData.harvestDate} // Show current date as value
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      harvestDate: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Location
                </label>
                <input
                  type="text"
                  value={productFormData.location}
                  onChange={(e) => {
                    setProductFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required
                  placeholder="Enter harvest location"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
                >
                  Create Product
                </button>
                <button
                  type="button"
                  onClick={handleFormCancel}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Form Modal */}
      {showSellerForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowSellerForm(false)}
          ></div>
          <div className="bg-gray-800 p-6 rounded-lg w-[400px] max-h-[90vh] overflow-y-auto relative z-50">
            <h2 className="text-white text-xl font-semibold mb-4">
              Create New Seller
            </h2>
            <form onSubmit={handleSellerSubmit} className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Seller ID
                </label>
                <input
                  type="text"
                  value={sellerFormData.sellerId}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  readOnly
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Name</label>
                <input
                  type="text"
                  value={sellerFormData.name}
                  onChange={(e) =>
                    setSellerFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={sellerFormData.email}
                  onChange={(e) =>
                    setSellerFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  value={sellerFormData.password}
                  onChange={(e) =>
                    setSellerFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={sellerFormData.sellerNumber}
                  onChange={(e) =>
                    setSellerFormData((prev) => ({
                      ...prev,
                      sellerNumber: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Address
                </label>
                <input
                  type="text"
                  value={sellerFormData.address}
                  onChange={(e) =>
                    setSellerFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Create Seller
                </button>
                <button
                  type="button"
                  onClick={() => setShowSellerForm(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowCustomerForm(false)}
          ></div>
          <div className="bg-gray-800 p-6 rounded-lg w-[400px] max-h-[90vh] overflow-y-auto relative z-50">
            <h2 className="text-white text-xl font-semibold mb-4">
              Create New Customer
            </h2>
            <form onSubmit={handleCustomerSubmit} className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Customer ID
                </label>
                <input
                  type="text"
                  value={customerFormData.customerId}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  readOnly
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Name</label>
                <input
                  type="text"
                  value={customerFormData.customerName}
                  onChange={(e) =>
                    setCustomerFormData((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={customerFormData.customerMail}
                  onChange={(e) =>
                    setCustomerFormData((prev) => ({
                      ...prev,
                      customerMail: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  value={customerFormData.password}
                  onChange={(e) =>
                    setCustomerFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerFormData.customerNumber}
                  onChange={(e) =>
                    setCustomerFormData((prev) => ({
                      ...prev,
                      customerNumber: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Address
                </label>
                <input
                  type="text"
                  value={customerFormData.address}
                  onChange={(e) =>
                    setCustomerFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Create Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowReviewForm(false)}
          ></div>
          <div className="bg-gray-800 p-6 rounded-lg w-[400px] max-h-[90vh] overflow-y-auto relative z-50">
            <h2 className="text-white text-xl font-semibold mb-4">
              Create New Review
            </h2>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Review ID
                </label>
                <input
                  type="text"
                  value={reviewFormData.reviewId}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  readOnly
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Customer ID
                </label>
                <input
                  type="text"
                  value={reviewFormData.customerId}
                  onChange={(e) =>
                    setReviewFormData((prev) => ({
                      ...prev,
                      customerId: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Product ID
                </label>
                <input
                  type="text"
                  value={reviewFormData.productId}
                  onChange={(e) =>
                    setReviewFormData((prev) => ({
                      ...prev,
                      productId: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewFormData.rating}
                  onChange={(e) =>
                    setReviewFormData((prev) => ({
                      ...prev,
                      rating: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">
                  Review Text
                </label>
                <textarea
                  value={reviewFormData.reviewText}
                  onChange={(e) =>
                    setReviewFormData((prev) => ({
                      ...prev,
                      reviewText: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  required
                  rows="4"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Create Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
