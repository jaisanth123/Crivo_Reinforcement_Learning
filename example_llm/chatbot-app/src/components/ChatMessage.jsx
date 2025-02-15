import React from "react";
import { FaUser, FaRobot } from "react-icons/fa";

const ChatMessage = ({ message }) => (
  <div
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
        }`}
      >
        {message.text}
      </div>
    </div>
  </div>
);

export default ChatMessage;
