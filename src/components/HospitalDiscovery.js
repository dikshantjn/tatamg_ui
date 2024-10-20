import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalDiscovery.css';
import Testimonials from './Testimonials'; // Importing Testimonials
import bannerImage from '../assets/Hospital Banner photo.jpg'; // Placeholder image

function HospitalDiscovery() {
  const [formData, setFormData] = useState({
    illness: '',
    location: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to HospitalResults page with formData as query parameters
    navigate('/hospital-results', { state: { formData } });
  };

  return (
    <div className="hospital-discovery-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Hospital Discovery Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Locate Nearby Hospitals/Clinics</h1>
        </div>
      </section>

      {/* Form Section */}
      <div className="form-container">
        <h1>Locate Hospitals</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Illness Type:</label>
            <select name="illness" value={formData.illness} onChange={handleChange} required>
              <option value="">Select Illness</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dental">Dental</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Pediatrics">Pediatrics</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter city or region"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Search Hospitals</button>
        </form>
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default HospitalDiscovery;
