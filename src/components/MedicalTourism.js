import React from 'react';
import './MedicalTourism.css';
import Testimonials from './Testimonials';
// Placeholder images/icons
import hospitalIcon from '../assets/hospital.png';
import consultationIcon from '../assets/consultation.png';
import surgeryIcon from '../assets/surgery.png';
import travelIcon from '../assets/tourism.png';

function MedicalTourism() {
  return (
    <div className="medical-tourism-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Plan Your Medical Trip with Us</h1>
        <p>We connect patients worldwide with top doctors and hospitals in India. Let us assist you with the best healthcare solutions.</p>
        <button className="get-started-btn">Request Consultation</button>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Medical Tourism Services</h2>
        <div className="services">
          <div className="service">
            <img src={hospitalIcon} alt="Hospital Network" />
            <h3>World-Class Hospitals</h3>
            <p>Partnered with the best hospitals to offer top-notch healthcare across various specialties.</p>
          </div>
          <div className="service">
            <img src={consultationIcon} alt="Consultation" />
            <h3>Free Consultation</h3>
            <p>Get expert opinions from top doctors to understand your medical treatment options.</p>
          </div>
          <div className="service">
            <img src={surgeryIcon} alt="Surgery" />
            <h3>Advanced Surgeries</h3>
            <p>We offer specialized surgeries including organ transplants, cancer treatments, and more.</p>
          </div>
          <div className="service">
            <img src={travelIcon} alt="Travel Assistance" />
            <h3>Travel and Visa Assistance</h3>
            <p>We help with visa processing, airport pickups, and accommodation arrangements.</p>
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
        <p>Get in touch with us to explore your medical treatment options in India. Let us help you with a stress-free medical trip.</p>
        <button className="contact-btn">Contact Us</button>
      </section>
    </div>
  );
}

export default MedicalTourism;
