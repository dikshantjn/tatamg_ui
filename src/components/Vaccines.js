import React, { useState } from 'react';
import './Vaccines.css';
import Testimonials from './Testimonials';
// Placeholder imports for icons
import reasonIcon1 from '../assets/self.png';
import reasonIcon2 from '../assets/others.png';
import reasonIcon3 from '../assets/outbreak.png';
import stepIcon1 from '../assets/contactus.png';
import stepIcon2 from '../assets/drive.png';
import stepIcon3 from '../assets/vaccinated.png';


function Vaccines() {
  const [activeVaccine, setActiveVaccine] = useState(null);

  const adultVaccines = [
    {
      name: 'Influenza Vaccine',
      details: 'The influenza vaccine protects against the flu virus, which can cause serious respiratory illness in some people.',
    },
    {
      name: 'Hepatitis A Vaccine',
      details: 'Hepatitis A vaccine helps protect against Hepatitis A, a liver infection caused by the hepatitis A virus.',
    },
    {
      name: 'Hepatitis B Vaccine',
      details: 'Hepatitis B vaccine protects against the hepatitis B virus, which can lead to chronic liver disease and liver cancer.',
    },
    {
      name: 'Tetanus and Diphtheria Vaccine',
      details: 'This combination vaccine protects against tetanus (lockjaw) and diphtheria, both serious bacterial diseases.',
    },
    {
      name: 'Shingles Vaccine',
      details: 'Shingles vaccine helps prevent shingles, a painful rash caused by the reactivation of the chickenpox virus in adults.',
    },
    {
      name: 'Pneumococcal Vaccine',
      details: 'Pneumococcal vaccine protects against infections caused by the pneumococcus bacteria, which can lead to pneumonia.',
    },
  ];

  const toggleVaccineDetails = (index) => {
    setActiveVaccine(index === activeVaccine ? null : index); // Toggle the clicked vaccine's details
  };

  return (
    <div className="vaccines-page">
      {/* Banner Section */}
      <section className="banner-section">
        <h1>Get Vaccinated, Stay Healthy!</h1>
        <p>Your health is important, protect it with timely vaccinations.</p>
      </section>

      {/* Reasons to Get Vaccinated Section */}
      <section className="reasons-section">
        <h2>Why Get Vaccinated?</h2>
        <div className="reasons">
          <div className="reason">
            <img src={reasonIcon1} alt="Reason 1" />
            <h3>Protect Yourself</h3>
            <p>Vaccines protect against serious illnesses.</p>
          </div>
          <div className="reason">
            <img src={reasonIcon2} alt="Reason 2" />
            <h3>Protect Others</h3>
            <p>Reduce the spread of contagious diseases.</p>
          </div>
          <div className="reason">
            <img src={reasonIcon3} alt="Reason 3" />
            <h3>Prevent Outbreaks</h3>
            <p>Help prevent the resurgence of diseases.</p>
          </div>
        </div>
      </section>

      {/* Corporate Vaccination Steps Section */}
      <section className="corporate-vaccination-section">
        <h2>Steps for Corporate Vaccination</h2>
        <div className="steps">
          <div className="step">
            <img src={stepIcon1} alt="Step 1" />
            <h3>Step 1: Contact Us</h3>
            <p>Get in touch to arrange corporate vaccination drives.</p>
          </div>
          <div className="step">
            <img src={stepIcon2} alt="Step 2" />
            <h3>Step 2: Plan the Drive</h3>
            <p>We’ll help you plan a vaccination drive for your employees.</p>
          </div>
          <div className="step">
            <img src={stepIcon3} alt="Step 3" />
            <h3>Step 3: Get Vaccinated</h3>
            <p>Our healthcare professionals will ensure smooth vaccinations.</p>
          </div>
        </div>
      </section>

      {/* Vaccines for Adults Section with Dropdowns */}
      <section className="adult-vaccines-section">
        <h2>Vaccines for Adults</h2>
        <ul className="vaccine-list">
          {adultVaccines.map((vaccine, index) => (
            <li key={index} className="vaccine-item">
              <button
                className="vaccine-toggle"
                onClick={() => toggleVaccineDetails(index)}
              >
                {vaccine.name}
                <span className="dropdown-icon">
                  {activeVaccine === index ? '▲' : '▼'}
                </span>
              </button>
              {activeVaccine === index && (
                <div className="vaccine-details">
                  <p>{vaccine.details}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default Vaccines;
