import React from 'react';
import { MdMic, MdSend } from 'react-icons/md';
import Cards from '../components/Cards';
import logo from '../assets/images/2-logo.png';
import '../index.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-container">
        <div className="header-content">
          <img src={logo} alt="Siksha Mitra Logo" className="title" style={{ objectFit: 'cover' }} />
          {/* <p className="subtitle">AI Powered</p> */}
        </div>
        <Cards />
      </div>
      
      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me about admissions, scholarships, placements, and more..."
          />
          <button>
            <MdMic size={20} />
          </button>
          <button>
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;