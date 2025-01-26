import React from 'react';
import { useConsoleText } from '../../hooks/useConsoleText';
import './Home.css';
import profile_pic from '../Assets/profile-pic.png';
import linkedin_icon from '../Assets/linkedin.png';
import github_icon from '../Assets/github.png';

function Home() {
  const words = [
    'Generative AI enthusiast',
    'Aspiring MERN stack developer',
    'Harvard ALP 2024 participant',
    'GSSOC 2024 contributor',
    'BTech CSE 2026 at RGUKT-Basar'
  ];
  const text = useConsoleText(words);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home">
      <div className="profile-container">
        <img src={profile_pic} alt="Nilesh profile picture" className="profile-pic" />
      </div>
      <div className="home-content">
        <p className="greeting">Hello, I'm</p>
        <h1 className="name">ENUGANDHULA NILESH</h1>
        <p id="text">{text}</p>
        <div className="btn-container">
          <button className="btn btn-color-2" onClick={() => window.open('/assets/resume.pdf')}>
            Download CV
          </button>
          <button className="btn btn-color-1" onClick={scrollToContact}>
            Contact Info
          </button>
        </div>
        <div id="socials-container">
          <img 
            src={linkedin_icon} 
            alt="My LinkedIn profile" 
            className="icon" 
            onClick={() => window.open('https://www.linkedin.com/in/enugandhula-nilesh-400a14226/', '_blank')} 
          />
          <img 
            src={github_icon} 
            alt="My Github profile" 
            className="icon" 
            onClick={() => window.open('https://github.com/nileshsn', '_blank')} 
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
