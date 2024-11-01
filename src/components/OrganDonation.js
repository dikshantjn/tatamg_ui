import React, { useState } from 'react';
import './OrganDonation.css';
import bannerImage from '../assets/Organ Donation.jpg';
import liverIcon from '../assets/liver.png'; // Replace with actual icons for each organ
import heartIcon from '../assets/heart.png';
import lungsIcon from '../assets/lungs.png';
import kidneyIcon from '../assets/kidney.png';
import pancreasIcon from '../assets/pancreas.png';
import corneasIcon from '../assets/cornea.png';
import boneIcon from '../assets/bone.png';
import skinIcon from '../assets/Skin.png';
import tendonsIcon from '../assets/Tendons.png';
import heartValveIcon from '../assets/Heart Valves.png';

const organOptions = [
  { name: 'Liver', description: 'Donate to save lives suffering from liver failure.', icon: liverIcon },
  { name: 'Heart', description: 'Help heart patients with your donation.', icon: heartIcon },
  { name: 'Lungs', description: 'Your lungs can help someone breathe better.', icon: lungsIcon },
  { name: 'Kidneys', description: 'Kidney donation can save those with kidney failure.', icon: kidneyIcon },
  { name: 'Pancreas', description: 'Donate pancreas to help people with diabetes.', icon: pancreasIcon }
];

const tissueOptions = [
  { name: 'Corneas', description: 'Cornea donation restores sight to the blind.', icon: corneasIcon },
  { name: 'Bone', description: 'Bone donation can help patients with orthopedic needs.', icon: boneIcon },
  { name: 'Skin', description: 'Skin donation helps burn victims.', icon: skinIcon },
  { name: 'Tendons', description: 'Tendon donation improves mobility for many.', icon: tendonsIcon },
  { name: 'Heart Valves', description: 'Heart valve donation helps repair damaged hearts.', icon: heartValveIcon }
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
              <img src={organ.icon} alt={organ.name} className="icon" />
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
              <img src={tissue.icon} alt={tissue.name} className="icon" />
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

