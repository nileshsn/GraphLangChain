import React from 'react';
import './Projects.css';
import project1_img from '../Assets/project_1.png';
import project2_img from '../Assets/project_2.png';
import project3_img from '../Assets/project_3.png';
import project4_img from '../Assets/project_4.png';


function Projects() {
  const projects = [
    {
      title: 'EcoLabel',
      description: 'A platform providing insights into the health, environmental, and societal impacts of everyday products.',
      image: project1_img,
      github: 'https://github.com/nileshsn/EcoLabel',
      demo: 'https://ecolabel-na.streamlit.app/'
    },
    {
      title: 'Conversational Bot with Chat History',
      description: 'A RAG-based conversational bot with PDF upload capabilities and chat history functionality.',
      image: project2_img,
      github: 'https://github.com/nileshsn/Conversational-Bot-Chat-history',
      demo: 'https://conversational-bot-chat-history-nile.streamlit.app/'
    },
    {
      title: 'OvenOasis',
      description: 'A frontend project for food enthusiasts to explore, search, and follow recipes with ease.',
      image: project3_img,
      github: 'https://github.com/nileshsn/OvenOasis',
      demo: 'http://ovenoasis.netlify.app'
    },
    {
      title: 'Ecommerce Website',
      description: 'This is a fully responsive e-commerce website frontend built with React, HTML, CSS, and JavaScript.',
      image: project4_img,
      github: 'https://github.com/nileshsn/E-Commerce',
      demo: 'https://ecommerce-nile.netlify.app/'
    }
  ];

  return (
    <section id="projects" className="reveal">
      <p className="section__text__p1">Browse My Recent</p>
      <h1 className="title">Projects</h1>
      <div className="experience-details-container">
        <div className="about-containers">
          {projects.map((project, index) => (
            <div key={index} className="details-container color-container">
              <div className="article-container">
                <img src={project.image} alt={project.title} className="project-img" />
              </div>
              <h2 className="experience-sub-title project-title">{project.title}</h2>
              <p>{project.description}</p>
              <div className="btn-container">
                <button className="btn btn-color-2 project-btn" onClick={() => window.open(project.github)}>
                  GitHub
                </button>
                <button className="btn btn-color-2 project-btn" onClick={() => window.open(project.demo)}>
                  Live Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
