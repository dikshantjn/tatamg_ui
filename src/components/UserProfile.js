import React, { useState } from 'react';
import './UserProfile.css';
import { colors } from '../styles/colors';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    photo: null,
    phone_number: '+91 9876543210',
    ABHA_ID: 'ABHA123456789',
    emailId: 'john.doe@example.com',
    password: '********',
    healthRecordPassword: '********',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    bloodGroup: 'O+',
    height: '175',
    weight: '70',
    emergencyContactNumber: '+91 9876543211',
    location: '123, Main Street',
    locationCoordinates: { lat: 12.9716, lng: 77.5946 },
    city: 'Bangalore',
    status: 'Active',
    fcmToken: 'FCM_TOKEN_123',
    platform: 'Web'
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes logic here
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header" style={{ background: 'linear-gradient(135deg, #38A3A5 0%, #22577A 100%)' }}>
        <button 
          className="edit-icon-button"
          onClick={() => setIsEditing(!isEditing)}
          title={isEditing ? "Save Changes" : "Edit Profile"}
        >
          {isEditing ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 17L20 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <div className="geometric-shapes">
          <div className="shape-circle"></div>
          <div className="shape-square"></div>
          <div className="shape-triangle"></div>
        </div>
        <div className="profile-photo-container">
          <div className="profile-photo">
            {profileData.photo ? (
              <img src={profileData.photo} alt="Profile" />
            ) : (
              <div className="profile-photo-placeholder">
                {profileData.name.charAt(0)}
              </div>
            )}
            {isEditing && (
              <label className="photo-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <span className="edit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </label>
            )}
          </div>
          <h2>{profileData.name}</h2>
          <p>{profileData.emailId}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button
          className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Medical Info
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' ? (
          <div className="profile-section">
            <div className="profile-field-group">
              <div className="profile-field">
                <label>Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Email ID</label>
                <input
                  type="email"
                  value={profileData.emailId}
                  onChange={(e) => handleInputChange('emailId', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>ABHA ID</label>
                <input
                  type="text"
                  value={profileData.ABHA_ID}
                  onChange={(e) => handleInputChange('ABHA_ID', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Password</label>
                <input
                  type="password"
                  value={profileData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  value={profileData.emergencyContactNumber}
                  onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-section">
            <div className="profile-field-group">
              <div className="profile-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Blood Group</label>
                <select
                  value={profileData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  disabled={!isEditing}
                >
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
              <div className="profile-field">
                <label>Health Record Password</label>
                <input
                  type="password"
                  value={profileData.healthRecordPassword}
                  onChange={(e) => handleInputChange('healthRecordPassword', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 