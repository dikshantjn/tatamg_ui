import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindDonor.css';

function FindDonor() {
  const navigate = useNavigate();
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);

  const donorData = [
    { name: 'John Doe', bloodType: 'A+', location: 'New York', contact: '555-1234', type: 'Donor' },
    { name: 'St. Peter Hospital', bloodType: 'A+', location: 'New York', contact: '555-5678', type: 'Hospital' },
    { name: 'Jane Smith', bloodType: 'O-', location: 'Los Angeles', contact: '555-8765', type: 'Donor' },
    { name: 'General Hospital', bloodType: 'O-', location: 'Los Angeles', contact: '555-4321', type: 'Hospital' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredResults = donorData.filter(donor =>
      donor.bloodType === bloodType && donor.location.toLowerCase().includes(location.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <div className="find-donor-page">
      <div className="header-container">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <h1>Find a Blood Donor or Hospital</h1>
      </div>
      
      <form className="find-donor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blood Type:</label>
          <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="find-donor-btn">Find Donors or Hospitals</button>
      </form>

      {results.length > 0 && (
        <div className="results-section">
          <h2>Results</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="result-item">
                <h3>{result.name}</h3>
                <p><strong>Type:</strong> {result.type}</p>
                <p><strong>Location:</strong> {result.location}</p>
                <p><strong>Blood Type:</strong> {result.bloodType}</p>
                <p><strong>Contact:</strong> {result.contact}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && (
        <p className="no-results">No donors or hospitals found for the selected criteria.</p>
      )}
    </div>
  );
}

export default FindDonor;
