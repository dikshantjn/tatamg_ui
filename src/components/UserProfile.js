import React, { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { getUserId } from '../services/auth.utils';
import './UserProfile.css';
import { colors } from '../styles/colors';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [notification, setNotification] = useState(null);

  // Personal profile data
  const [profileData, setProfileData] = useState({
    name: '',
    photo: null,
    phone_number: '',
    ABHA_ID: '',
    emailId: '',
    password: '********',
    healthRecordPassword: '********',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    emergencyContactNumber: '',
    location: '',
    locationCoordinates: '',
    city: '',
    status: false,
    fcmToken: '',
    platform: ''
  });

  // Medical profile data
  const [medicalData, setMedicalData] = useState({
    isDiabetic: false,
    allergies: '',
    eyePower: '',
    currentMedication: '',
    pastMedication: '',
    chronicConditions: '',
    injuries: '',
    surgeries: ''
  });

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      console.log('Fetching user details for userId:', userId);
      const response = await userService.getUserDetails(userId);
      
      if (response.data) {
        const formattedData = userService.formatUserData(response.data);
        setProfileData(formattedData);
        console.log('User profile data loaded:', formattedData);

        // Fetch medical profile data
        const medicalProfile = await userService.getMedicalProfile(userId);
        if (medicalProfile) {
          setMedicalData(medicalProfile);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'personal') {
        // Save personal profile data
        const userId = getUserId();
        await userService.updateUserDetails(userId, profileData);
        setNotification({
          type: 'success',
          message: 'Personal information updated successfully!'
        });
      } else if (activeTab === 'medical') {
        // Save medical profile data
        const userId = getUserId();
        const existingMedicalProfile = await userService.getMedicalProfile(userId);
        
        if (existingMedicalProfile) {
          // Update existing medical profile
          await userService.updateMedicalProfile(userId, medicalData);
          setNotification({
            type: 'success',
            message: 'Medical information updated successfully!'
          });
        } else {
          // Create new medical profile
          await userService.createMedicalProfile({
            userId: userId,
            ...medicalData
          });
          setNotification({
            type: 'success',
            message: 'Medical profile created successfully!'
          });
        }
      }

      setIsEditing(false);
      setLoading(false);
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving data:', err);
      const errorMessage = err.message || 'Failed to save data. Please try again.';
      setNotification({
        type: 'error',
        message: errorMessage
      });
      setLoading(false);
      
      // Auto-hide error notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset data to original values
    fetchUserData();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          photo: e.target.result
        }));
        // Reset image load error when new photo is selected
        setImageLoadError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    if (activeTab === 'personal') {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (activeTab === 'medical') {
      setMedicalData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (loading && !profileData.name) {
    return (
      <div className="user-profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchUserData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12L10 17L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              )}
            </div>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="profile-header" style={{ background: 'linear-gradient(135deg, #38A3A5 0%, #22577A 100%)' }}>
        <button 
          className="edit-icon-button" 
          onClick={() => setIsEditing(!isEditing)}
          disabled={loading}
          title={isEditing ? `Save ${activeTab === 'personal' ? 'Personal' : 'Medical'} Information` : `Edit ${activeTab === 'personal' ? 'Personal' : 'Medical'} Information`}
        >
          {loading ? (
            <div className="loading-spinner-small"></div>
          ) : isEditing ? (
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

        {/* Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="shape-circle"></div>
          <div className="shape-square"></div>
          <div className="shape-triangle"></div>
        </div>

        <div className="profile-photo-container">
          <div className="profile-photo">
            {profileData.photo && !imageLoadError ? (
              <img 
                src={profileData.photo} 
                alt="Profile" 
                onError={() => setImageLoadError(true)}
              />
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
          <div className="profile-info">
            <h2>{profileData.name}</h2>
            <p>{profileData.emailId}</p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
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

      {/* Profile Content */}
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
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  value={profileData.emergencyContactNumber}
                  onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="profile-field">
                <label>Blood Group</label>
                <select
                  value={profileData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="">Select Blood Group</option>
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
            </div>
          </div>
        ) : (
          <div className="profile-section">
            <div className="profile-field-group">
              <div className="profile-field">
                <label>Diabetic</label>
                <select
                  value={medicalData.isDiabetic ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('isDiabetic', e.target.value === 'true')}
                  disabled={!isEditing}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div className="profile-field">
                <label>Eye Power</label>
                <input
                  type="text"
                  value={medicalData.eyePower}
                  onChange={(e) => handleInputChange('eyePower', e.target.value)}
                  placeholder="e.g., -2.5"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Allergies</label>
                <input
                  type="text"
                  value={medicalData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="e.g., Peanuts, Shellfish"
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Chronic Conditions</label>
                <input
                  type="text"
                  value={medicalData.chronicConditions}
                  onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                  placeholder="e.g., Hypertension, Asthma"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Current Medication</label>
                <input
                  type="text"
                  value={medicalData.currentMedication}
                  onChange={(e) => handleInputChange('currentMedication', e.target.value)}
                  placeholder="e.g., Metformin, Insulin"
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Past Medication</label>
                <input
                  type="text"
                  value={medicalData.pastMedication}
                  onChange={(e) => handleInputChange('pastMedication', e.target.value)}
                  placeholder="e.g., Antibiotics, Painkillers"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field-group">
              <div className="profile-field">
                <label>Injuries</label>
                <input
                  type="text"
                  value={medicalData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  placeholder="e.g., Fractured leg in 2019"
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Surgeries</label>
                <input
                  type="text"
                  value={medicalData.surgeries}
                  onChange={(e) => handleInputChange('surgeries', e.target.value)}
                  placeholder="e.g., Appendectomy in 2015"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="action-buttons">
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12L10 17L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{`Save ${activeTab === 'personal' ? 'Personal' : 'Medical'} Information`}</span>
                </>
              )}
            </button>
            <button 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 