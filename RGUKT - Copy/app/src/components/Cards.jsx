import React from 'react';
import { FaGraduationCap, FaAward, FaBuilding, FaCreditCard } from 'react-icons/fa';

const cardData = [
  {
    icon: <FaGraduationCap className="card-icon" />,
    text: "Explore the Eligibility Criteria for B.Tech Programs",
    borderColor: "var(--blue-border)",
  },
  {
    icon: <FaAward className="card-icon" />,
    text: "Explore Scholarship Options and Financial Aid",
    borderColor: "var(--green-border)"
  },
  {
    icon: <FaBuilding className="card-icon" />,
    text: "Explore Campus Recruitment Opportunities",
    borderColor: "var(--purple-border)"
  },
  {
    icon: <FaCreditCard className="card-icon" />,
    text: "Learn About Tuition Fees and Payment Methods",
    borderColor: "var(--yellow-border)"
  }
];

const Cards = () => {
  return (
    <div className="cards-container">
      {cardData.map((card, index) => (
        <div 
          key={index} 
          className="question-card"
          style={{ '--border-color': card.borderColor }}
        >
          <div className="icon-wrapper">
            {card.icon}
          </div>
          <p className="card-text">{card.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
