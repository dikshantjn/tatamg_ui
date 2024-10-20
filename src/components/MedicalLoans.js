import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './MedicalLoans.css';
import cardiologyIcon from '../assets/cardiology.png';
import orthoIcon from '../assets/orthopedic.png';
import pregnancyImg from '../assets/pregnant.png'; 
import bannerImage from '../assets/Medical Loan-1 (1).jpg'; // Example banner image
import Testimonials from './Testimonials'; // Import the Testimonials component

function MedicalLoans() {
  const navigate = useNavigate();
  const loanOptions = [
    { name: 'Cardiology', icon: cardiologyIcon },
    { name: 'Orthopedic Surgery', icon: orthoIcon },
    { name: 'Gynaecology', icon: pregnancyImg },
  ];

  const handleViewClick = (loanName) => {
    navigate('/loan-form', { state: { loanName } });
  };

  return (
    <div className="medical-loans-page">
      {/* Banner Section */}
      <section className="banner">
        <img src={bannerImage} alt="Medical Loans Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Easy Medical Loans for Your Healthcare Needs</h1>
          <p>Get financial support for all your medical treatments with quick and hassle-free loans.</p>
        </div>
      </section>
      
      {/* Loan Options Section */}
      <div className="loan-options">
        {loanOptions.map((option, index) => (
          <div className="loan-option" key={index}>
            <img src={option.icon} alt={`${option.name} icon`} />
            <h3>{option.name}</h3>
            <button 
              className="view-button" 
              onClick={() => handleViewClick(option.name)}>
              View
            </button>
          </div>
        ))}
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default MedicalLoans;
