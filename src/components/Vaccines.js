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
import bannerImage from '../assets/Vaccine Banner Photo.jpg';  // Placeholder for banner image

function Vaccines() {
  const [showForm, setShowForm] = useState(false);
  const [activeVaccine, setActiveVaccine] = useState(null);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const adultVaccines = [
    {
      name: 'Influenza Vaccine',
      details: 'The influenza vaccine protects against the flu virus, which can cause serious respiratory illness in some people.',
    },
    // Additional vaccines go here...
  ];

  const toggleVaccineDetails = (index) => {
    setActiveVaccine(index === activeVaccine ? null : index); // Toggle the clicked vaccine's details
  };

  return (
    <div className="vaccines-page">
      {/* Banner Section */}
      <section className="banner-section" style={{ position: 'relative' }}>
        <img src={bannerImage} alt="Vaccination Banner" className="banner-image" />
        <div className="banner-content" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', color: 'white', textAlign: 'center' }}>
          <h1>Get Vaccinated, Stay Healthy!</h1>
          <p>Your health is important, protect it with timely vaccinations.</p>
          <button className="contact-btn" onClick={toggleForm}>
            Contact Us
          </button>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Contact Us for Vaccination Plans</h2>
            <form>
              <label>
                Vaccine Type:
                <select>
                  <option value="mother">Vaccine for Mother</option>
                  <option value="children">Vaccine for Children</option>
                  <option value="adults">Vaccine for Adults</option>
                  <option value="institutes">Educational Institutes</option>
                  <option value="corporates">Corporate</option>
                  <option value="preventive">Preventive Care</option>
                </select>
              </label>
              <label>
                Name:
                <input type="text" name="name" required />
              </label>
              <label>
                Mobile Number:
                <input type="tel" name="phone" required />
              </label>
              <label>
                Email ID:
                <input type="email" name="email" required />
              </label>
              <label>
                Location:
                <input type="text" name="location" required />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={toggleForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

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
