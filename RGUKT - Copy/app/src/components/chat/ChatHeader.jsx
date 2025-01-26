import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import logo from '../../assets/images/2-logo.png';

const ChatHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="chat-header">
      <button className="back-button" onClick={() => navigate('/')}>
        <MdArrowBack size={24} />
      </button>
      <img src={logo} alt="Logo" className="chat-logo" />
      <div className="status-indicator">
        <span className="status-dot"></span>
        <span className="status-text">Online</span>
      </div>
    </div>
  );
};

export default ChatHeader; 