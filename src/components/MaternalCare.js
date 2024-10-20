import React, { useState } from 'react';
import './MaternalCare.css';
import Testimonials from './Testimonials';
// Placeholder imports for plan images
import planImage1 from '../assets/maternal1.jpg';
import planImage2 from '../assets/maternal2.jpg';
import planImage3 from '../assets/maternal3.jpg';
import bannerImage from '../assets/Maternal Care.jpg';  // Placeholder for banner image

function MaternalCare() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="maternal-care-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Maternal Care Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Comprehensive Maternal Care</h1>
          <p>Providing the best care for you and your baby during pregnancy</p>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Join Our Maternal Care Program</h2>
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

              <label>Trimester:</label>
              <select>
                <option value="first">First Trimester (weeks 0-12)</option>
                <option value="second">Second Trimester (weeks 13-24)</option>
                <option value="third">Third Trimester (weeks 25-delivery)</option>
              </select>

              <button type="submit">Submit</button>
              <button type="button" onClick={toggleForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Key Features Section */}
      <section className="key-features-section">
        <h1>Why Choose Our Maternal Care?</h1>
        <div className="features">
          <div className="feature">
            <h3>Comprehensive Health Monitoring</h3>
            <p>Track maternal health with advanced monitoring tools.</p>
          </div>
          <div className="feature">
            <h3>24/7 Doctor Access</h3>
            <p>Get round-the-clock access to experienced maternal care doctors.</p>
          </div>
          <div className="feature">
            <h3>Nutrition and Wellness Support</h3>
            <p>Receive personalized nutrition and wellness plans for a healthy pregnancy.</p>
          </div>
          <div className="feature">
            <h3>Home Assistance</h3>
            <p>Get home visits from our healthcare experts for in-depth checkups.</p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans-section">
        <h2>Our Maternal Care Plans</h2>
        <div className="plans">
          <div className="plan">
            <img src={planImage1} alt="Basic Plan" />
            <h3>Basic Plan</h3>
            <ul>
              <li>Monthly Checkups</li>
              <li>Access to Health Monitoring Tools</li>
              <li>24/7 Doctor Consultation</li>
            </ul>
            <button className="join-now-btn" onClick={toggleForm}>Join Now</button>
          </div>
          <div className="plan">
            <img src={planImage2} alt="Standard Plan" />
            <h3>Standard Plan</h3>
            <ul>
              <li>Bi-weekly Checkups</li>
              <li>Health Monitoring & Personalized Nutrition Plans</li>
              <li>24/7 Doctor & Home Assistance</li>
            </ul>
            <button className="join-now-btn" onClick={toggleForm}>Join Now</button>
          </div>
          <div className="plan">
            <img src={planImage3} alt="Premium Plan" />
            <h3>Premium Plan</h3>
            <ul>
              <li>Weekly Checkups & Full Health Support</li>
              <li>Health Monitoring, Nutrition, and Wellness Plans</li>
              <li>24/7 Doctor Access & Full Home Assistance</li>
            </ul>
            <button className="join-now-btn" onClick={toggleForm}>Join Now</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default MaternalCare;
