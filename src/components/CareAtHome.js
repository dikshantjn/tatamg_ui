import React, { useState } from 'react';
import './CareAtHome.css';
import Testimonials from './Testimonials';  // Importing Testimonials
// Placeholder imports for icons or images
import healthSupportIcon from '../assets/others.png';
import homeCareIcon from '../assets/home care.png';
import teleConsultIcon from '../assets/instant.png';
import emergencyIcon from '../assets/emergency.png';
import bannerImage from '../assets/Care at Home.jpg';  // Placeholder for banner image

function CareAtHome() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="care-at-home-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Care at Home Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Care at Home for Your Loved Ones</h1>
          <p>We offer personalized home care services for your loved ones.</p>
          <button className="contact-btn" onClick={toggleForm}>
            Contact Us
          </button>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Contact Us for Care Services</h2>
            <form>
              <label>Name:</label>
              <input type="text" required />

              <label>Mobile Number:</label>
              <input type="tel" required />

              <label>Email ID:</label>
              <input type="email" required />

              <label>Location:</label>
              <input type="text" required />

              <label>Age:</label>
              <input type="number" required />

              <label>Gender:</label>
              <select required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label>Services Required For:</label>
              <select required>
                <option value="onetime">Onetime Service</option>
                <option value="weekly">Weekly Service</option>
                <option value="monthly">Monthly Service</option>
                <option value="doctor-visit">Doctor Visit</option>
              </select>

              <button type="submit">Submit</button>
              <button type="button" onClick={toggleForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Care Services</h2>
        <div className="services">
          <div className="service">
            <img src={healthSupportIcon} alt="Health Support" />
            <h3>Health Support</h3>
            <p>Comprehensive health support including regular checkups and medication management.</p>
          </div>
          <div className="service">
            <img src={homeCareIcon} alt="Home Health Care" />
            <h3>Home Health Care</h3>
            <p>In-home nursing, physiotherapy, and personalized medical care.</p>
          </div>
          <div className="service">
            <img src={teleConsultIcon} alt="Tele Consultation" />
            <h3>Tele Consultation</h3>
            <p>Instant access to healthcare professionals via teleconsultation services.</p>
          </div>
          <div className="service">
            <img src={emergencyIcon} alt="Emergency Support" />
            <h3>Emergency Support</h3>
            <p>24/7 emergency services just a call away.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <h2>Why Choose Our Care Services?</h2>
        <ul>
          <li>Personalized care plans tailored to individual needs</li>
          <li>Certified healthcare professionals</li>
          <li>24/7 availability for emergencies</li>
          <li>Comprehensive support for chronic conditions</li>
          <li>Convenient home visits and teleconsultations</li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default CareAtHome;
