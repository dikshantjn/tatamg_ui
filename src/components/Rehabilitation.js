import React, { useState } from 'react';
import './Rehabilitation.css';
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

  return (
    <div className="rehabilitation-page">
      {/* Banner Section */}
      <section className="banner">
        <img src={bannerImage} alt="Rehabilitation Banner" />
        <h1>Comprehensive Rehabilitation Services</h1>
        <p>Your trusted partner for recovery, wellness, and a healthier future.</p>
      </section>

      {/* Mental Wellness */}
      <section className="service">
        <img src={mentalWellnessIcon} alt="Mental Wellness" className="service-icon" />
        <h2>Mental Wellness</h2>
        <p>
          Comprehensive mental wellness programs focused on helping patients recover from mental health conditions such as depression, schizophrenia, and anxiety. Our approach includes therapy, counseling, and medical care for emotional well-being.
        </p>
        <button onClick={handleBookNowClick}>Book Now</button>
      </section>

      {/* Dementia Care */}
      <section className="service">
        <img src={dementiaIcon} alt="Dementia Care" className="service-icon" />
        <h2>Dementia Care</h2>
        <p>
          Specialized dementia care programs to improve the quality of life for patients suffering from Alzheimer's and other cognitive disorders. Our approach includes cognitive therapies, occupational therapy, and support for maintaining independence.
        </p>
        <button onClick={handleBookNowClick}>Book Now</button>
      </section>

      {/* De-addiction */}
      <section className="service">
        <img src={deAddictionIcon} alt="De-addiction" className="service-icon" />
        <h2>De-addiction</h2>
        <p>
          We offer de-addiction programs to help overcome substance abuse and behavioral addictions, including alcohol and drugs. Our programs include detoxification, cognitive-behavioral therapy, and long-term support for recovery.
        </p>
        <button onClick={handleBookNowClick}>Book Now</button>
      </section>

      {/* Booking Form Pop-up */}
      {showForm && (
        <div className="booking-form">
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
          </form>
        </div>
      )}
    </div>
  );
}

export default Rehabilitation;
