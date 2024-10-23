import React, { useState } from 'react';
import './OrganDonation.css';
import bannerImage from '../assets/Organ Donation.jpg'; // Add your banner image
import organIcon from '../assets/organ.png'; // Placeholder for organ icons
import tissueIcon from '../assets/tissue.png'; // Placeholder for tissue icons

const organOptions = [
  { name: 'Liver', description: 'Donate to save lives suffering from liver failure.' },
  { name: 'Heart', description: 'Help heart patients with your donation.' },
  { name: 'Lungs', description: 'Your lungs can help someone breathe better.' },
  { name: 'Kidneys', description: 'Kidney donation can save those with kidney failure.' },
  { name: 'Pancreas', description: 'Donate pancreas to help people with diabetes.' }
];

const tissueOptions = [
  { name: 'Corneas', description: 'Cornea donation restores sight to the blind.' },
  { name: 'Bone', description: 'Bone donation can help patients with orthopedic needs.' },
  { name: 'Skin', description: 'Skin donation helps burn victims.' },
  { name: 'Tendons', description: 'Tendon donation improves mobility for many.' },
  { name: 'Heart Valves', description: 'Heart valve donation helps repair damaged hearts.' }
];

function OrganDonation() {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = (donation) => {
    setSelectedDonation(donation);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="organ-donation-page">
      {/* Banner Section */}
      <div className="banner-section">
        <img src={bannerImage} alt="Organ Donation" className="banner-image" />
      </div>

      {/* Organ Donation Section */}
      <section className="donation-section">
        <h2>Organ Donation</h2>
        <div className="donation-cards">
          {organOptions.map((organ) => (
            <div key={organ.name} className="donation-card">
              <img src={organIcon} alt={organ.name} className="icon" />
              <h3>{organ.name}</h3>
              <p>{organ.description}</p>
              <button onClick={() => handleOpenForm(organ.name)}>Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Tissue Donation Section */}
      <section className="donation-section">
        <h2>Tissue Donation</h2>
        <div className="donation-cards">
          {tissueOptions.map((tissue) => (
            <div key={tissue.name} className="donation-card">
              <img src={tissueIcon} alt={tissue.name} className="icon" />
              <h3>{tissue.name}</h3>
              <p>{tissue.description}</p>
              <button onClick={() => handleOpenForm(tissue.name)}>Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Form Modal */}
      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseForm}>&times;</span>
            <h2>Apply for {selectedDonation} Donation</h2>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" required />

              <label>Age:</label>
              <input type="number" placeholder="Enter your age" required />

              <label>Gender:</label>
              <select required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Mobile Number:</label>
              <input type="tel" placeholder="Enter your mobile number" required />

              <label>Email ID:</label>
              <input type="email" placeholder="Enter your email ID" required />

              <label>Location:</label>
              <input type="text" placeholder="Enter your location" required />

              <button type="submit">Submit Application</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganDonation;
