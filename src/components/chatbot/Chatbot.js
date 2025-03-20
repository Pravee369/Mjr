import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import "./Chatbot.css";
import { FiSend } from "react-icons/fi";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages([...newMessages, { text: "I'm still learning!", sender: "bot" }]);
    }, 1000);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <IoChatbubbleEllipses size={24} />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-header">
            <span>Chat Assistant</span>
            <button className="close-button" onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}><FiSend /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
