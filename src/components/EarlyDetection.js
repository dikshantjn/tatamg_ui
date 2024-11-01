import React, { useState } from 'react';
import './EarlyDetection.css';
import Testimonials from './Testimonials';
// Import placeholder icons and banner image
import tuberculosisIcon from '../assets/tuberculosis.png';
import epilepsyIcon from '../assets/epilepsy.png';
import sickleCellIcon from '../assets/blood-cells_2746642.png';
import lungCancerIcon from '../assets/smoking.png';
import bannerImage from '../assets/Early Detection Banner Photo.jpg'; // Replace with your banner image

function EarlyDetection() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');

  const handleBookNowClick = (test) => {
    setSelectedTest(test);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Test for ${selectedTest} booked successfully!`);
    setShowForm(false);
  };

  return (
    <div className="early-detection-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Early Detection Banner" className="banner-image" />
        <div className="banner-content">
          <h1><b>Early detection can save lives. Schedule your tests now for a healthier future.</b></h1>
        </div>
      </section>

      {/* Scrollable Diseases Section */}
      <section className="disease-section">
        <div className="section-header">
          <h2>Early Detection of Respiratory Diseases</h2>
          <a href="/" className="view-all">View All</a>
        </div>
        <div className="diseases-container">
          <div className="disease-box">
            <img src={tuberculosisIcon} alt="Tuberculosis" className="icon" />
            <h3>Tuberculosis</h3>
            <p>Information about early detection of Tuberculosis and its importance.</p>
            <button onClick={() => handleBookNowClick('Tuberculosis')}>Book A Test</button>
          </div>
          <div className="disease-box">
            <img src={epilepsyIcon} alt="Epilepsy" className="icon" />
            <h3>Epilepsy</h3>
            <p>Early screening for Epilepsy can help prevent severe complications.</p>
            <button onClick={() => handleBookNowClick('Epilepsy')}>Book A Test</button>
          </div>
          <div className="disease-box">
            <img src={sickleCellIcon} alt="Sickle Cell Anemia" className="icon" />
            <h3>Sickle Cell Anemia</h3>
            <p>Identify Sickle Cell Anemia early to prevent complications.</p>
            <button onClick={() => handleBookNowClick('Sickle Cell Anemia')}>Book A Test</button>
          </div>
          <div className="disease-box">
            <img src={lungCancerIcon} alt="Lung Cancer" className="icon" />
            <h3>Lung Cancer</h3>
            <p>Early detection of Lung Cancer improves survival rates.</p>
            <button onClick={() => handleBookNowClick('Lung Cancer')}>Book A Test</button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <span className="close-btn" onClick={handleCloseForm}>&times;</span> {/* Close button */}
            <h2>Book A Test for {selectedTest}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Name:</label>
              <input type="text" required />
              <label>Mobile Number:</label>
              <input type="text" required />
              <label>Email ID:</label>
              <input type="email" required />
              <label>Age:</label>
              <input type="number" required />
              <label>Location:</label>
              <input type="text" required />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default EarlyDetection;
