import React from 'react';
import './MaternalCare.css';
import Testimonials from './Testimonials';
// Placeholder imports for plan images
import planImage1 from '../assets/maternal1.jpg';
import planImage2 from '../assets/maternal2.jpg';
import planImage3 from '../assets/maternal3.jpg';

function MaternalCare() {
  return (
    <div className="maternal-care-page">
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
            <button className="join-now-btn">Join Now</button>
          </div>
          <div className="plan">
            <img src={planImage2} alt="Standard Plan" />
            <h3>Standard Plan</h3>
            <ul>
              <li>Bi-weekly Checkups</li>
              <li>Health Monitoring & Personalized Nutrition Plans</li>
              <li>24/7 Doctor & Home Assistance</li>
            </ul>
            <button className="join-now-btn">Join Now</button>
          </div>
          <div className="plan">
            <img src={planImage3} alt="Premium Plan" />
            <h3>Premium Plan</h3>
            <ul>
              <li>Weekly Checkups & Full Health Support</li>
              <li>Health Monitoring, Nutrition, and Wellness Plans</li>
              <li>24/7 Doctor Access & Full Home Assistance</li>
            </ul>
            <button className="join-now-btn">Join Now</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default MaternalCare;
