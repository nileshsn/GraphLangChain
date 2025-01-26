import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMic, MdSend } from 'react-icons/md';
import Cards from '../components/Cards';
import logo from '../assets/images/2-logo.png';
import '../styles/components/chat.css';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Navigate to chat page with the initial message
      navigate('/chat', { state: { initialMessage: inputValue } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="home-container">
      <div className="content-container">
        <div className="header-content">
          <img src={logo} alt="Siksha Mitra Logo" className="title" style={{ objectFit: 'cover' }} />
        </div>
        <Cards />
      </div>
      
      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about admissions, scholarships, placements, and more..."
          />
          <button>
            <MdMic size={20} />
          </button>
          <button onClick={handleSendMessage}>
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;