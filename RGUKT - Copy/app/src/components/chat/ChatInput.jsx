import React, { useState } from 'react';
import { MdMic, MdSend } from 'react-icons/md';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-input-container">
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="button">
          <MdMic size={20} />
        </button>
        <button type="submit" disabled={!message.trim() || isLoading}>
          <MdSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput; 