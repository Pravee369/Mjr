import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
  
    try {
      const response = await fetch("http://localhost:3000/chatbot-api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
      
      if (data.response && data.response.length > 0) {
        setMessages([...newMessages, { text: data.response[0].generated_text, sender: "bot" }]);
      } else {
        setMessages([...newMessages, { text: "Sorry, I couldn't process that.", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...newMessages, { text: "Sorry, I couldn't process that.", sender: "bot" }]);
    }
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
              <div key={index}
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: "20px",
                  wordBreak: "break-word",
                  display: "inline-block",
                  backgroundColor: msg.sender === "user" ? "#1976d2" : "#b0bec5",
                  color: msg.sender === "user" ? "white" : "black",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  textAlign: msg.sender === "user" ? "right" : "left",
                  borderTopRightRadius: msg.sender === "user" ? "5px" : "20px",
                  borderTopLeftRadius: msg.sender === "bot" ? "5px" : "20px"
                }}>
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
