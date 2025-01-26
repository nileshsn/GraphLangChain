import React from 'react';
import './Experience.css';
const experience_icon = require('../Assets/experience.png');
const education_icon = require('../Assets/education.png');
const html_icon = require('../Assets/html.png');
const css_icon = require('../Assets/css.png');
const js_icon = require('../Assets/js.png');
const react_icon = require('../Assets/react.png');
const python_icon = require('../Assets/python.png');
const java_icon = require('../Assets/java.png');
const llms_icon = require('../Assets/llms.png');
const pytorch_icon = require('../Assets/pytorch.png');
const nlp_icon = require('../Assets/nlp.png');
const huggingface_icon = require('../Assets/huggingface.png');
const langchain_icon = require('../Assets/langchain.png');
const langgraph_icon = require('../Assets/langgraph.png');
const nn_icon = require('../Assets/nn.png');

function Experience() {
  const frontendSkills = [
    { name: 'HTML', logo: html_icon },
    { name: 'CSS', logo: css_icon },
    { name: 'JavaScript', logo: js_icon },
    { name: 'React', logo: react_icon },
    { name: 'Python', logo: python_icon },
    { name: 'Java', logo: java_icon },
  ];

  const aiMlSkills = [
    { name: 'LLMs', logo: llms_icon },
    { name: 'PyTorch', logo: pytorch_icon },
    { name: 'NLP', logo: nlp_icon },
    { name: 'Hugging Face', logo: huggingface_icon },
    { name: 'LangChain', logo: langchain_icon },
    { name: 'LangGraph', logo: langgraph_icon },
    { name: 'Neural Network', logo: nn_icon },
  ];

  const renderSkills = (skills) => (
    <>
      {skills.map((skill, index) => (
        <div key={index} className="skill-box">
          <div className="skill-img-box">
            <img src={skill.logo} alt={skill.name} className="skill-logo" />
          </div>
          <h3>{skill.name}</h3>
        </div>
      ))}
      {skills.map((skill, index) => (
        <div key={`repeat-${index}`} className="skill-box">
          <div className="skill-img-box">
            <img src={skill.logo} alt={skill.name} className="skill-logo" />
          </div>
          <h3>{skill.name}</h3>
        </div>
      ))}
      {skills.map((skill, index) => (
        <div key={`repeat2-${index}`} className="skill-box">
          <div className="skill-img-box">
            <img src={skill.logo} alt={skill.name} className="skill-logo" />
          </div>
          <h3>{skill.name}</h3>
        </div>
      ))}
    </>
  );

  return (
    <section id="experience" className="reveal">
      <p className="section__text__p1">Explore My</p>
      <h1 className="title">Experience</h1>
      <div className="scrolling-overflow">
        <div className="skills-scrolling">
          <div className="skills-row">
            {renderSkills(frontendSkills)}
          </div>
        </div>
        <div className="skills-scrolling-reverse">
          <div className="skills-row">
            {renderSkills(aiMlSkills)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
