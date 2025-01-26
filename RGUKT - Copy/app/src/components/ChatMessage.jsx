import React from 'react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      <div className="message-content">
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage; 