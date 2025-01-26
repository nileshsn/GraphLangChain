import React from 'react';
import './Contact.css';
import email_icon from '../Assets/email.png';
import linkedin_icon from '../Assets/linkedin.png';

function Contact() {
  return (
    <section id="contact" className="reveal">
      <p className="section__text__p1">Get in Touch</p>
      <h1 className="title">Contact Me</h1>
      <div className="contact-info-upper-container">
        <div className="contact-info-container">
          <img 
            src={email_icon} 
            alt="Email icon"
            className="icon contact-icon email-icon"
          />
          <p><a href="mailto:heynilesh05@gmail.com">heynilesh05@gmail.com</a></p>
        </div>
        <div className="contact-info-container">
          <img 
            src={linkedin_icon} 
            alt="LinkedIn icon"
            className="icon contact-icon"
          />
          <p><a href="https://www.linkedin.com/in/enugandhula-nilesh-400a14226/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
