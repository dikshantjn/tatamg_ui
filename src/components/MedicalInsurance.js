import React from 'react';
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

function MedicalInsurance() {
  return (
    <div className="medical-insurance-page">
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
          {/* Add more brand logos as needed */}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default MedicalInsurance;
