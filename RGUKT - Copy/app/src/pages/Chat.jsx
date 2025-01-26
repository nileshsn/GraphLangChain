import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MdMic, MdSend } from 'react-icons/md';
import ChatMessage from '../components/ChatMessage';

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Handle initial message if coming from home page
    if (location.state?.initialMessage) {
      handleSendMessage(location.state.initialMessage);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message. I'm here to help! (This is a placeholder response)",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button>
            <MdMic size={20} />
          </button>
          <button 
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading}
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 