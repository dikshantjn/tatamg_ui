import React, { useState } from 'react';
import './Nutrition.css';
import bannerImage from '../assets/Nutrition Banner Photo.jpg'; // Make sure the path is correct and matches your project structure

function Nutrition() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleBookClick = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Appointment Booked Successfully!');
    setShowForm(false);
  };

  return (
    <div className="nutrition-page">
      {/* Banner Section with Image */}
      <section 
        className="banner" 
        style={{ backgroundImage: bannerImage }} // Using the banner image as background 
        >
        <h1>Personalized Nutrition Tracking and Counseling</h1>
        <p>Stay on top of your health with customized nutrition plans for every stage of life.</p>
      </section>

      {/* Nutrition Insights Section */}
      <section className="insights-section">
        <h2>Track Your Nutrients in Real-Time</h2>
        <p>Understand your food intake, track macros and micros, and receive insights into your dietary needs. Optimize your nutrition with detailed reports and data.</p>
        <button className="cta-btn">Start Tracking</button>
      </section>

      {/* Nutrition Programs Section */}
      <section className="plans-section">
        <h2>Choose the Right Nutrition Program</h2>

        <div className="plan">
          <h3>Kids Nutrition</h3>
          <p>Ensure your child is getting the right nutrients for healthy growth and development. Our personalized kids' nutrition plan is designed to meet the specific needs of children from toddlers to teens.</p>
          <ul>
            <li>Tailored diet plans for different age groups</li>
            <li>Focus on balanced growth and development</li>
            <li>Recommended portion sizes and key nutrients</li>
          </ul>
          <button onClick={() => handleBookClick('Kids Nutrition')}>Book Appointment</button>
        </div>

        <div className="plan">
          <h3>Adults Nutrition</h3>
          <p>Our adult nutrition plans focus on maintaining energy, controlling weight, and managing chronic conditions. We offer tailored programs for every stage of adulthood, helping you stay active and healthy.</p>
          <ul>
            <li>Manage weight, health concerns, and energy levels</li>
            <li>Monitor macronutrient intake and meal planning</li>
            <li>Adjustments for active or sedentary lifestyles</li>
          </ul>
          <button onClick={() => handleBookClick('Adults Nutrition')}>Book Appointment</button>
        </div>

        <div className="plan">
          <h3>Senior Citizens Nutrition</h3>
          <p>Our senior citizens' nutrition plans help manage age-related conditions like osteoporosis, high cholesterol, and more. Improve overall wellness and enjoy a higher quality of life through diet.</p>
          <ul>
            <li>Focus on bone health, joint care, and immunity</li>
            <li>Plans tailored to prevent chronic illness</li>
            <li>Personalized dietary adjustments for specific health concerns</li>
          </ul>
          <button onClick={() => handleBookClick('Senior Citizens Nutrition')}>Book Appointment</button>
        </div>
      </section>

      {/* Booking Form Popup */}
      {showForm && (
        <div className="booking-form-popup">
          <div className="booking-form">
            <h2>Book an Appointment for {selectedPlan}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Name:</label>
              <input type="text" required />
              <label>Address:</label>
              <input type="text" required />
              <label>Contact Details:</label>
              <input type="text" required />
              <label>Gender:</label>
              <select required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label>Age:</label>
              <input type="number" required />
              <label>Consultation Type:</label>
              <select required>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <label>Preferred Time Slots & Dates:</label>
              <textarea required placeholder="Enter your preferred time slots and dates"></textarea>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nutrition;
