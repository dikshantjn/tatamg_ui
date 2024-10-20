import React, { useState } from 'react';
import './MedicalTourism.css';
import Testimonials from './Testimonials'; // Import Testimonials
// Placeholder images/icons
import hospitalIcon from '../assets/hospital.png';
import consultationIcon from '../assets/consultation.png';
import surgeryIcon from '../assets/surgery.png';
import travelIcon from '../assets/tourism.png';
import bannerImage from '../assets/Medical Tourism Banner Photo.jpg'; // Placeholder for banner image

function MedicalTourism() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="medical-tourism-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Medical Tourism Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Plan Your Medical Trip with Us</h1>
          <p>We connect patients worldwide with top doctors and hospitals in India.</p>
          <button className="get-started-btn" onClick={toggleForm}>
            Request Consultation
          </button>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Request Consultation</h2>
            <form>
              <label>Name:</label>
              <input type="text" required />

              <label>Mobile Number:</label>
              <input type="tel" required />

              <label>Email ID:</label>
              <input type="email" required />

              <label>Age:</label>
              <input type="number" required />

              <label>Gender:</label>
              <select required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label>Country/State:</label>
              <input type="text" required />

              <label>Illness to be treated:</label>
              <input type="text" required />

              <label>Referred by Doctor:</label>
              <input type="text" required />

              <label>Tentative Date of Travel:</label>
              <input type="date" required />

              <button type="submit">Submit</button>
              <button type="button" onClick={toggleForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Medical Tourism Services</h2>
        <div className="services">
          <div className="service">
            <img src={hospitalIcon} alt="Hospital Network" />
            <h3>World-Class Hospitals</h3>
            <p>Partnered with top hospitals offering specialized healthcare services.</p>
          </div>
          <div className="service">
            <img src={consultationIcon} alt="Consultation" />
            <h3>Free Consultation</h3>
            <p>Get expert opinions from renowned doctors regarding your treatment options.</p>
          </div>
          <div className="service">
            <img src={surgeryIcon} alt="Surgery" />
            <h3>Advanced Surgeries</h3>
            <p>We offer specialized surgeries including transplants, cancer treatments, and more.</p>
          </div>
          <div className="service">
            <img src={travelIcon} alt="Travel Assistance" />
            <h3>Travel and Visa Assistance</h3>
            <p>We assist with visa processing, travel arrangements, and accommodation.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <h2>Why Choose Our Medical Tourism Service?</h2>
        <ul>
          <li>Comprehensive care from consultation to surgery</li>
          <li>Partnership with over 70 world-class hospitals</li>
          <li>Experienced doctors across multiple specialties</li>
          <li>24/7 support and care coordination</li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <Testimonials />
      </div>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Contact Us for a Free Consultation</h2>
        <p>Get in touch with us to explore your medical treatment options in India.</p>
        <button className="contact-btn" onClick={toggleForm}>Contact Us</button>
      </section>
    </div>
  );
}

export default MedicalTourism;
