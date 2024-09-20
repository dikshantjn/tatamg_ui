import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './MedicalLoans.css';
import cardiologyIcon from '../assets/cardiology.png'; // Replace with actual icons
import orthoIcon from '../assets/orthopedic.png';
import pregnancyImg from '../assets/pregnant.png'; 
import Testimonials from './Testimonials'; // Import the Testimonials component

function MedicalLoans() {
  const navigate = useNavigate();
  const loanOptions = [
    { name: 'Cardiology', icon: cardiologyIcon },
    { name: 'Orthopedic Surgery', icon: orthoIcon },
    { name: 'Gynaecology', icon: pregnancyImg },
    // Add more healthcare concerns as needed
  ];

  const handleViewClick = (loanName) => {
    // Pass the loanName as state to the LoanForm page for context
    navigate('/loan-form', { state: { loanName } });
  };

  return (
    <div className="medical-loans-page">
      <h1>Medical Loans for Healthcare Concerns</h1>
      
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