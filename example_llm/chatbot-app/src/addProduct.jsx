// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";
// import "./App.css"; // Create a separate CSS file for animations and styles

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const messageEndRef = useRef(null);

//   // Scroll to the bottom whenever messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Add user's message to the chat
//     setMessages((prev) => [...prev, { sender: "user", text: input }]);
//     setInput("");
//     setLoading(true); // Show loading animation

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:8000/get-mistral-response/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ input }),
//         }
//       );

//       if (!response.ok) throw new Error("Network response was not ok");

//       const data = await response.json();
//       console.log("Response from backend:", data); // Debugging log

//     x const botResponse = data || "Sorry, I couldn't process that.";
//       setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Failed to get a response from the backend." },
//       ]);
//     }

//     setLoading(false); // Hide loading animation
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!input.trim()) return;

//   //   setMessages((prev) => [...prev, { sender: "user", text: input }]);
//   //   setInput("");
//   //   setLoading(true);

//   //   try {
//   //     const res = await axios.post(
//   //       "http://localhost:8000/duct-info/", // Change to your FastAPI endpoint
//   //       { input }
//   //     );
//   //     const botResponse = res.data.response;

//   //     if (botResponse && botResponse.length > 0) {
//   //       setMessages((prev) => [
//   //         ...prev,
//   //         {
//   //           sender: "bot",
//   //           text: botResponse
//   //             .map(
//   //               (product) =>
//   //                 `Product: ${product.item}, Price: ${product.pricePerKilo}, Quantity: ${product.quantity}`
//   //             )
//   //             .join("\n"),
//   //         },
//   //       ]);
//   //     } else {
//   //       setMessages((prev) => [
//   //         ...prev,
//   //         { sender: "bot", text: "No matching products found." },
//   //       ]);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching response:", error);
//   //     setMessages((prev) => [
//   //       ...prev,
//   //       { sender: "bot", text: "Failed to get a response from the backend." },
//   //     ]);
//   //   }

//   //   setLoading(false);
//   // };

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="relative">
//       {/* Floating Chat Icon */}
//       <div
//         className="fixed bottom-5 right-5 bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700 transition transform hover:scale-110"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <FaRobot size={28} className="text-white" />
//       </div>

//       {/* Chatbox */}
//       {isOpen && (
//         <div className="fixed bottom-24 right-5 bg-gray-800 w-96 h-[500px] rounded-lg shadow-xl flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="bg-purple-700 p-4 text-center text-white font-bold text-lg">
//             Mistral Chatbot
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-1 overflow-y-auto space-y-2">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   message.sender === "user" ? "justify-start" : "justify-end"
//                 }`}
//               >
//                 <div
//                   className={`flex items-center ${
//                     message.sender === "user" ? "" : "flex-row-reverse"
//                   }`}
//                 >
//                   <div className="mx-2">
//                     {message.sender === "user" ? (
//                       <FaUser size={20} className="text-purple-600" />
//                     ) : (
//                       <FaRobot size={20} className="text-gray-300" />
//                     )}
//                   </div>
//                   <div
//                     className={`max-w-[70%] px-4 py-2 rounded-lg ${
//                       message.sender === "user"
//                         ? "bg-purple-600 text-white"
//                         : "bg-gray-700 text-gray-200"
//                     } animate-fade-in`}
//                   >
//                     {message.text}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex justify-end">
//                 <div className="flex items-center flex-row-reverse">
//                   <div className="mx-2">
//                     <FaRobot size={20} className="text-gray-300" />
//                   </div>
//                   <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg animate-pulse">
//                     loading...
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messageEndRef} />
//           </div>

//           {/* Input Field */}
//           <form
//             onSubmit={handleSubmit}
//             className="p-3 bg-gray-700 flex items-center"
//           >
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//             <button
//               type="submit"
//               className="ml-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none transition transform hover:scale-110"
//             >
//               <FaPaperPlane size={20} />
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";
import "./App.css";
import Login from "./login";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Pagination state
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectOperationType = (input) => {
    const createKeywords = [
      "create",
      "add",
      "register",
      "new",
      "submit",
      "post",
    ];
    const searchKeywords = ["show", "find", "list", "get", "display", "search"];

    input = input.toLowerCase();

    for (const keyword of createKeywords) {
      if (input.includes(keyword)) {
        return "POST";
      }
    }

    for (const keyword of searchKeywords) {
      if (input.includes(keyword)) {
        return "GET";
      }
    }

    return "GET"; // default to GET if unclear
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;

  //   setMessages((prev) => [...prev, { sender: "user", text: input }]);
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/process-request", // Backend URL
  //       { input, page } // Send page number for pagination
  //     );
  //     const data = response.data;
  //     console.log("Response from backend:", data);

  //     // Handle pagination data
  //     if (data?.response) {
  //       setMessages((prev) => [
  //         ...prev,
  //         { sender: "bot", text: data.response }, // Add the response as a bot message
  //       ]);
  //     } else {
  //       setMessages((prev) => [
  //         ...prev,
  //         { sender: "bot", text: "No valid response received." },
  //       ]);
  //     }

  //     setTotalPages(data.totalPages || 1); // Assuming backend sends totalPages
  //   } catch (error) {
  //     console.error("Error details:", {
  //       message: error.message,
  //       response: error.response?.data,
  //       status: error.response?.status,
  //     });
  //     const errorMessage =
  //       error.response?.data?.detail ||
  //       "Failed to get a response from the backend.";

  //     setMessages((prev) => [
  //       ...prev,
  //       { sender: "bot", text: `Error: ${errorMessage}` },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const operationType = detectOperationType(input);
      console.log("Detected operation type:", operationType);

      const response = await axios.post(
        "http://127.0.0.1:8000/process-request",
        {
          input,
          operation_type: operationType,
          page,
        }
      );

      const data = response.data;
      console.log("Response from backend:", data);

      if (operationType === "GET") {
        // Handle search results
        if (data?.response) {
          let displayText = data.response;

          // If the response is an array of items, format it nicely
          if (Array.isArray(data.items)) {
            displayText +=
              "\n\nResults:\n" +
              data.items
                .map((item, index) => `${index + 1}. ${JSON.stringify(item)}`)
                .join("\n");
          }

          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: displayText },
          ]);

          if (data.totalPages) {
            setTotalPages(data.totalPages);
          }
        }
      } else if (operationType === "POST") {
        // Handle creation response
        if (data?.status === "success") {
          let successMessage = "Successfully created! ";

          // Add specific details based on what was created
          if (data.product_id) {
            successMessage += `New product ID: ${data.product_id}`;
          } else if (data.review_id) {
            successMessage += `New review ID: ${data.review_id}`;
          } else if (data.seller_id) {
            successMessage += `New seller ID: ${data.seller_id}`;
          } else if (data.customer_id) {
            successMessage += `New customer ID: ${data.customer_id}`;
          } else if (data.order_id) {
            successMessage += `New order ID: ${data.order_id}`;
          }

          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: successMessage },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text:
                data?.message || "Creation successful but no ID was returned.",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.detail ||
        "Failed to process your request. Please try again.";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Re-run the last search with new page number
    if (messages.length > 0) {
      const lastUserMessage = messages.filter((m) => m.sender === "user").pop();
      if (lastUserMessage) {
        setInput(lastUserMessage.text);
        handleSubmit(new Event("submit"));
      }
    }
  };

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
          <div className="flex-1 p-1 overflow-y-auto space-y-2">
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
            <div ref={messageEndRef} />
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="flex justify-center p-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    page === index + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-200 hover:bg-purple-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-gray-700 flex items-center"
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="ml-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none transition transform hover:scale-110"
            >
              <FaPaperPlane size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
