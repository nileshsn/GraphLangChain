import React from 'react';
import './About.css';
import experience_icon from '../Assets/experience.png';
import education_icon from '../Assets/education.png';

function About() {
  return (
    <section id="about">
      <h2 className="section-title">About Me</h2>
      <div className="about-content">
        <div className="info-cards">
          <div className="info-card">
            <img src={experience_icon} alt="Experience" className="icon" />
            <h3>Experience</h3>
            <ul>
              <li>Contributor Intern · GSSoC'24 · Internship</li>
              <li>Participant, ALP · Aspire Institute · Apprenticeship</li>
            </ul>
          </div>
          <div className="info-card">
            <img src={education_icon} alt="Education" className="icon" />
            <h3>Education</h3>
            <ul>
              <li>BTech in Computer Science RGUKT-Basar</li>
              <li>SSC Vasavi High School, BNS</li>
            </ul>
          </div>
        </div>
        <p className="about-text">
          Hello there! I'm a passionate MERN stack developer and Gen AI enthusiast. Currently contributing to GSSoC'24 and exploring the exciting world of generative AI. I'm dedicated to creating efficient and innovative applications while actively participating in open-source projects and expanding my knowledge in AI technology.
        </p>
      </div>
    </section>
  );
}

export default About;
