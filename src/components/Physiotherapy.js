import React, { useState } from 'react';
import './Physiotherapy.css';

function Physiotherapy() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true); // Show the popup on form submission
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup when clicking the close button or confirming
  };

  return (
    <div className="physiotherapy-page">
      <div className="background-image">
        <div className="form-container">
          <h1>Request a Home Physiotherapy Visit</h1>
          <form className="physio-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label>Mobile Number:</label>
              <input type="text" placeholder="Enter your mobile number" required />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input type="text" placeholder="Enter your city" required />
            </div>
            <div className="form-group">
              <label>Complaint Type:</label>
              <textarea placeholder="Describe your issue" required />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input type="text" placeholder="Enter price" required />
            </div>
            <button type="submit" className="book-btn">Book Appointment</button>
          </form>
        </div>
      </div>

      {/* Popup Window for Selecting Availability */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Select Your Availability</h2>
            <div className="availability-selection">
              <label>Select Dates:</label>
              <input type="date" required />
              <input type="date" required />
              <label>Select Time Slots:</label>
              <input type="time" required />
              <input type="time" required />
            </div>
            <button className="confirm-btn" onClick={handleClosePopup}>Confirm Booking</button>
            <button className="close-btn" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Physiotherapy;
