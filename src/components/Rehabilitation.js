import React, { useState } from 'react';
import './Rehabilitation.css';
import Testimonials from './Testimonials'; // Import Testimonials
// Placeholder icons for each service
import mentalWellnessIcon from '../assets/mental-health.png';
import dementiaIcon from '../assets/dementia.png';
import deAddictionIcon from '../assets/addiction.png';
import bannerImage from '../assets/Rehabilitation Banner Photo.jpg'; // Placeholder for banner

function Rehabilitation() {
  const [showForm, setShowForm] = useState(false);

  const handleBookNowClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Your information has been added to the cart!");
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="rehabilitation-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Rehabilitation Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Comprehensive Rehabilitation Services</h1>
          <p>Your trusted partner for recovery, wellness, and a healthier future.</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-container">
        <div className="service">
          <img src={mentalWellnessIcon} alt="Mental Wellness" className="service-icon" />
          <h2>Mental Wellness</h2>
          <p>
            Comprehensive mental wellness programs for conditions like depression, schizophrenia, and anxiety.
          </p>
          <button onClick={handleBookNowClick}>Book Now</button>
        </div>

        <div className="service">
          <img src={dementiaIcon} alt="Dementia Care" className="service-icon" />
          <h2>Dementia Care</h2>
          <p>
            Specialized dementia care programs to improve the quality of life for patients with Alzheimer's and other cognitive disorders.
          </p>
          <button onClick={handleBookNowClick}>Book Now</button>
        </div>

        <div className="service">
          <img src={deAddictionIcon} alt="De-addiction" className="service-icon" />
          <h2>De-addiction</h2>
          <p>
            Programs to help overcome substance abuse and behavioral addictions.
          </p>
          <button onClick={handleBookNowClick}>Book Now</button>
        </div>
      </section>

      {/* Booking Form Pop-up */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Book a Service</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Name:</label>
              <input type="text" required />

              <label>Mobile Number:</label>
              <input type="text" required />

              <label>Email ID:</label>
              <input type="email" required />

              <label>Age:</label>
              <input type="number" required />

              <label>Gender:</label>
              <select required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label>Location:</label>
              <input type="text" required />

              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default Rehabilitation;
