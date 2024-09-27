import React from 'react';
import './CareAtHome.css';
// Placeholder imports for icons or images
import healthSupportIcon from '../assets/others.png';
import homeCareIcon from '../assets/home care.png';
import teleConsultIcon from '../assets/instant.png';
import emergencyIcon from '../assets/emergency.png';

function CareAtHome() {
  return (
    <div className="care-at-home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Care at Home for Your Loved Ones</h1>
        <p>We offer personalized home care services that ensure your loved ones receive the care they deserve from the comfort of their home.</p>
        <button className="get-started-btn">Get Started</button>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Care Services</h2>
        <div className="services">
          <div className="service">
            <img src={healthSupportIcon} alt="Health Support" />
            <h3>Health Support</h3>
            <p>We provide comprehensive health support including regular checkups, medication management, and chronic condition care.</p>
          </div>
          <div className="service">
            <img src={homeCareIcon} alt="Home Health Care" />
            <h3>Home Health Care</h3>
            <p>Our certified healthcare professionals offer in-home nursing, physiotherapy, and personalized medical care.</p>
          </div>
          <div className="service">
            <img src={teleConsultIcon} alt="Tele Consultation" />
            <h3>Tele Consultation</h3>
            <p>Get instant access to healthcare professionals through our teleconsultation services available 24/7.</p>
          </div>
          <div className="service">
            <img src={emergencyIcon} alt="Emergency Support" />
            <h3>Emergency Support</h3>
            <p>Our emergency services ensure that timely medical assistance is just a call away, available 24/7.</p>
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

      {/* Contact Us Section */}
      <section className="contact-us-section">
        <h2>Contact Us</h2>
        <p>Interested in our services? Get in touch with us to learn more and find out how we can help your loved ones.</p>
        <button className="contact-btn">Contact Us</button>
      </section>
    </div>
  );
}

export default CareAtHome;
