import React, { useState } from 'react';
import './Header.css';

function Header({ theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <header>
      <nav id="desktop-nav">
        <div className="logo">NILE</div>
        <div>
          <ul className="nav-links">
            <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
            <li><a href="#experience" onClick={() => scrollToSection('experience')}>Experience</a></li>
            <li><a href="#projects" onClick={() => scrollToSection('projects')}>Projects</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
          </ul>
        </div>
        <div className="theme-switch-wrapper">
          <label className="theme-switch" htmlFor="checkbox">
            <input type="checkbox" id="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
            <div className="slider round"></div>
          </label>
          <em>Switch Theme</em>
        </div>
      </nav>
      <nav id="hamburger-nav">
        <div className="logo">NILE</div>
        <div className="hamburger-menu">
          <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`menu-links ${isMenuOpen ? 'open' : ''}`}>
            <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
            <li><a href="#experience" onClick={() => scrollToSection('experience')}>Experience</a></li>
            <li><a href="#projects" onClick={() => scrollToSection('projects')}>Projects</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
            <li>
              <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="checkbox-mobile">
                  <input type="checkbox" id="checkbox-mobile" checked={theme === 'dark'} onChange={toggleTheme} />
                  <div className="slider round"></div>
                </label>
                <em>Switch Theme</em>
              </div>
            </li>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
