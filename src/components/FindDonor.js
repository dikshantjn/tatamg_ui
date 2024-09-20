import React, { useState } from 'react';
import './FindDonor.css';

function FindDonor() {
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);

  // Mock data: list of donors or hospitals
  const donorData = [
    { name: 'John Doe', bloodType: 'A+', location: 'New York', contact: '555-1234', type: 'Donor' },
    { name: 'St. Peter Hospital', bloodType: 'A+', location: 'New York', contact: '555-5678', type: 'Hospital' },
    { name: 'Jane Smith', bloodType: 'O-', location: 'Los Angeles', contact: '555-8765', type: 'Donor' },
    { name: 'General Hospital', bloodType: 'O-', location: 'Los Angeles', contact: '555-4321', type: 'Hospital' },
    // Add more donors/hospitals as needed
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter donor/hospital list based on user input
    const filteredResults = donorData.filter(donor =>
      donor.bloodType === bloodType && donor.location.toLowerCase().includes(location.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <div className="find-donor-page">
      <h1>Find a Blood Donor or Hospital</h1>
      
      {/* Form for user input */}
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

      {/* Results Section */}
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
