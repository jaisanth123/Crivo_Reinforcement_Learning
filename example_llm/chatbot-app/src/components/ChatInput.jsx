import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";

const ChatInput = ({ input, setInput, handleSubmit }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "Show all products",
    "Add new product",
    "List of sellers",
    "Show reviews",
    "Find vegetables",
    "Add new seller",
    "Show my orders",
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      {/* Suggestions Panel */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 w-full mb-2">
          <div className="p-2 bg-gray-800 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
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
  );
};

export default ChatInput;
