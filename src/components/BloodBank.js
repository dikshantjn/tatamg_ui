import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './BloodBank.css';
import one from '../assets/blood_donation_1.jpg';  // Replace with actual image paths
import two from '../assets/blood_donation_2.jpg';
import three from '../assets/blood_donation_3.jpg';

// Array of background images for the slideshow
const backgroundImages = [
  one,
  two,
  three
];

function BloodBank() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();  // Initialize navigate

  // Cycle through background images every few seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="blood-bank-page"
      style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
    >
      {/* Content Section */}
      <div className="blood-bank-content">
        <h1>Help Save Lives by Donating Blood</h1>
        <p>Your contribution can save someone’s life today!</p>
        <div className="buttons">
          <button className="register-btn" onClick={() => navigate('/register-donor')}>
            Register as a Donor
          </button>
          <button className="find-donor-btn" onClick={() => navigate('/find-donor')}>
            Find a Donor
          </button>
        </div>
      </div>
    </div>
  );
}

export default BloodBank;
