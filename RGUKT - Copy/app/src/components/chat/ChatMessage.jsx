import React from 'react';
import '../../styles/components/chat.css';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage; 