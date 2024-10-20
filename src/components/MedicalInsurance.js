import React, { useState } from 'react';
import './MedicalInsurance.css';
import Testimonials from './Testimonials';
// Placeholder imports for icons and logos
import trustIcon1 from '../assets/trust.png';
import trustIcon2 from '../assets/instant.png';
import trustIcon3 from '../assets/customer.png';
import brandLogo1 from '../assets/brand_1.png';
import brandLogo2 from '../assets/brand_2.png';
import brandLogo3 from '../assets/brand_3.png';
import step1Image from '../assets/step1.png';
import step2Image from '../assets/step3.png';
import step3Image from '../assets/step2.png';
import step4Image from '../assets/step4.png';
import bannerImage from '../assets/Medical Insurance.jpg';  // Placeholder for banner image

function MedicalInsurance() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="medical-insurance-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Insurance Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Get the Best Medical Insurance Now</h1>
          <button className="contact-btn" onClick={toggleForm}>
            Contact Us
          </button>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Get in Touch</h2>
            <form>
              <label>
                Insurance Type:
                <select>
                  <option value="1_adult">1 Adult</option>
                  <option value="2_adults">2 Adults</option>
                  <option value="adult_child">Adult + Child</option>
                  <option value="elders">Elders</option>
                  <option value="family_plan">Family Plan</option>
                  <option value="corporate">Corporate</option>
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

      {/* Why Trust Us Section */}
      <section className="trust-section">
        <h1>Why Trust Us for Medical Insurance?</h1>
        <div className="trust-metrics">
          <div className="trust-metric">
            <img src={trustIcon1} alt="Metric 1" />
            <h3>Over 1 Million Satisfied Customers</h3>
            <p>Trusted by a large base of users nationwide.</p>
          </div>
          <div className="trust-metric">
            <img src={trustIcon2} alt="Metric 2" />
            <h3>Instant Policy Issuance</h3>
            <p>Get your insurance policy issued instantly.</p>
          </div>
          <div className="trust-metric">
            <img src={trustIcon3} alt="Metric 3" />
            <h3>24/7 Customer Support</h3>
            <p>Always there to support you with your needs.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <h2>How It Works</h2>
        <div className="process-steps">
          <div className="step">
            <img src={step1Image} alt="Step 1" />
            <h3>1. Enter Personal Information</h3>
            <p>Provide your basic details to begin the process.</p>
          </div>
          <div className="step">
            <img src={step2Image} alt="Step 2" />
            <h3>2. Team Review</h3>
            <p>Our expert team will review your information and suggest the best plans.</p>
          </div>
          <div className="step">
            <img src={step3Image} alt="Step 3" />
            <h3>3. Compare Plans</h3>
            <p>Compare all available plans suited to your needs.</p>
          </div>
          <div className="step">
            <img src={step4Image} alt="Step 4" />
            <h3>4. Select Plan</h3>
            <p>Choose the right plan and get insured instantly.</p>
          </div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="partner-brands-section">
        <h2>Our Partner Brands</h2>
        <div className="partner-brands">
          <img src={brandLogo1} alt="Brand 1" />
          <img src={brandLogo2} alt="Brand 2" />
          <img src={brandLogo3} alt="Brand 3" />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default MedicalInsurance;
