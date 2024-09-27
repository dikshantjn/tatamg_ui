import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to navigate to the results page
import './HospitalDiscovery.css';

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
    </div>
  );
}

export default HospitalDiscovery;
