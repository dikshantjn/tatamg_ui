import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BloodBank.css';
import { getActiveBloodBanks, createBloodBankRequest, getOngoingBloodBankBooking } from '../../../services/User/BloodBank/blood-bank.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import OngoingBloodBankBookingModal from './OngoingBloodBankBookingModal';
import userService from '../../../services/User/Profile/user.service';

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Default location for static map
const defaultLocation = "18.5204, 73.8567"; // Pune coordinates

function BloodBank() {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
  const [units, setUnits] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [donorPanelOpen, setDonorPanelOpen] = useState(false);
  const [donorForm, setDonorForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    bloodType: '',
    date: '',
  });
  const [donorSubmitted, setDonorSubmitted] = useState(false);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBloodBank, setSelectedBloodBank] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestNotification, setRequestNotification] = useState(null);
  const [formError, setFormError] = useState('');
  const [ongoingBooking, setOngoingBooking] = useState(null);
  const [ongoingModalOpen, setOngoingModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get map center coordinates
  const getMapCenter = () => {
    if (userLocation) {
      return `${userLocation.lat},${userLocation.lng}`;
    }
    return defaultLocation;
  };

  // Geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationEnabled(false);
      setShowLocationDialog(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationEnabled(true);
        setShowLocationDialog(false);
      },
      () => {
        setLocationEnabled(false);
        setShowLocationDialog(true);
      }
    );
  }, []);

  // Fetch blood banks on mount
  useEffect(() => {
    getActiveBloodBanks()
      .then(data => {
        if (Array.isArray(data)) setBloodBanks(data);
        else if (Array.isArray(data.data)) setBloodBanks(data.data);
      })
      .catch(() => setBloodBanks([]));
  }, []);

  // Fetch ongoing blood bank booking on mount and for refresh
  const fetchOngoingBooking = async () => {
    const userId = getUserId && getUserId();
    if (!userId) return;
    try {
      const booking = await getOngoingBloodBankBooking(userId);
      if (booking) {
        setOngoingBooking(booking);
        setOngoingModalOpen(true);
        setSidePanelOpen(false);
      } else {
        setOngoingBooking(null);
        setOngoingModalOpen(false);
        setSidePanelOpen(true);
      }
    } catch (err) {
      setOngoingBooking(null);
      setOngoingModalOpen(false);
      setSidePanelOpen(true);
    }
  };

  useEffect(() => {
    fetchOngoingBooking();
  }, []);

  const renderMap = () => {
    const centerCoords = getMapCenter();
    return (
      <iframe
        src={`https://maps.google.com/maps?q=${centerCoords}&z=13&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  };

  // Handle prescription upload
  const handlePrescriptionChange = (e) => {
    setPrescription(e.target.files[0]);
  };

  // Toggle blood type selection (multi-select)
  const handleBloodTypeToggle = (type) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Handle blood request submit
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestNotification(null);
    setFormError('');
    try {
      const userId = getUserId && getUserId();
      if (!userId) throw new Error('User not logged in');
      if (!userLocation) throw new Error('Location not available');
      if (!units || isNaN(units) || Number(units) < 1) throw new Error('Please enter valid units');
      if (!selectedBloodTypes.length) throw new Error('Select at least one blood type');
      if (!prescription) throw new Error('Upload prescription');
      // Fetch user details for customer name
      let customerName = 'Anonymous';
      try {
        const userDetailsResp = await userService.getUserDetails(userId);
        if (userDetailsResp && userDetailsResp.data && userDetailsResp.data.name) {
          customerName = userDetailsResp.data.name;
        }
      } catch (err) {
        // fallback to Anonymous
      }
      // TODO: Upload prescription and get URL. For now, use dummy URL.
      let prescriptionUrls = ['https://dummy.url/prescription.jpg'];
      // If you want to actually upload, integrate upload logic here.
      const res = await createBloodBankRequest({
        userId,
        customerName,
        bloodType: selectedBloodTypes.join(','),
        units: Number(units),
        prescriptionUrls,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 50
      });
      setRequestNotification({ type: res.success ? 'success' : 'error', message: res.message || (res.success ? 'Request submitted!' : 'Failed to submit request') });
      if (res.success) {
        setRequestSubmitted(true);
        setTimeout(() => {
          setRequestSubmitted(false);
          setSidePanelOpen(false);
          setSelectedBloodTypes([]);
          setUnits('');
          setPrescription(null);
        }, 2000);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit request');
      setRequestNotification({ type: 'error', message: err.message || 'Failed to submit request' });
    }
    setRequestLoading(false);
  };

  // Handle donor form change
  const handleDonorChange = (e) => {
    setDonorForm({ ...donorForm, [e.target.name]: e.target.value });
  };

  // Handle donor submit
  const handleDonorSubmit = (e) => {
    e.preventDefault();
    setDonorSubmitted(true);
    setTimeout(() => {
      setDonorSubmitted(false);
      setDonorPanelOpen(false);
      setDonorForm({
        fullName: '', phone: '', city: '', state: '', country: '', bloodType: '', date: '',
      });
    }, 2000);
  };

  // Dialog for location
  if (showLocationDialog) {
    return (
      <div className="bloodbank-dialog-overlay">
        <div className="bloodbank-dialog">
          <h2>Enable Location</h2>
          <p>We need your location to show nearby blood banks and donors.</p>
          <div className="dialog-actions">
            <button className="primary" onClick={() => window.location.reload()}>Enable Location</button>
            <button className="secondary" onClick={() => navigate('/')}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blood-bank-map-root">
      {/* Ongoing Blood Bank Booking Modal */}
      <OngoingBloodBankBookingModal
        open={ongoingModalOpen}
        booking={ongoingBooking}
        onClose={() => { setOngoingModalOpen(false); setSidePanelOpen(true); }}
        onRefresh={fetchOngoingBooking}
      />
      {/* Notification for blood request */}
      {requestNotification && (
        <div className={`bloodbank-request-notification ${requestNotification.type}`}
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 3000, background: requestNotification.type === 'success' ? '#e6f9f0' : '#ffeaea', color: requestNotification.type === 'success' ? '#1a7f5a' : '#b91c1c', padding: '16px 28px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontWeight: 600 }}>
          {requestNotification.message}
          <button style={{ marginLeft: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'inherit' }} onClick={() => setRequestNotification(null)}>&times;</button>
        </div>
      )}
      {/* Google Map */}
      <div className="bloodbank-map">
        {renderMap()}
      </div>

      {/* Blood Bank Info Side Panel (left) */}
      {selectedBloodBank && (
        <div className="bloodbank-info-panel animate-in">
          <div className="side-panel-header">
            <h3>{selectedBloodBank.agencyName}</h3>
            <button className="close-panel-btn" onClick={() => setSelectedBloodBank(null)} aria-label="Close panel">&times;</button>
          </div>
          <div className="side-panel-section">
            <div className="side-panel-label">Address</div>
            <div className="side-panel-value">{selectedBloodBank.completeAddress}</div>
            {selectedBloodBank.nearbyLandmark && (
              <div className="side-panel-value" style={{ color: '#555', fontSize: '0.97rem' }}>
                Landmark: {selectedBloodBank.nearbyLandmark}
              </div>
            )}
            {(selectedBloodBank.city || selectedBloodBank.state || selectedBloodBank.pincode) && (
              <div className="side-panel-value" style={{ color: '#888', fontSize: '0.97rem' }}>
                {[selectedBloodBank.city, selectedBloodBank.state, selectedBloodBank.pincode].filter(Boolean).join(', ')}
              </div>
            )}
          </div>
          <div className="side-panel-divider"></div>
          <div className="side-panel-section">
            <div className="side-panel-label">Contact</div>
            <div className="side-panel-value">{selectedBloodBank.phoneNumber || (selectedBloodBank.Vendor && selectedBloodBank.Vendor.phoneNumber) || 'N/A'}</div>
            {selectedBloodBank.email && (
              <div className="side-panel-value" style={{ color: '#888', fontSize: '0.97rem' }}>
                {selectedBloodBank.email}
              </div>
            )}
            {selectedBloodBank.website && (
              <div className="side-panel-value" style={{ color: '#888', fontSize: '0.97rem' }}>
                <a href={selectedBloodBank.website.startsWith('http') ? selectedBloodBank.website : `https://${selectedBloodBank.website}`} target="_blank" rel="noopener noreferrer">{selectedBloodBank.website}</a>
              </div>
            )}
          </div>
          <div className="side-panel-divider"></div>
          <div className="side-panel-section">
            <div className="side-panel-label">Available Blood Types</div>
            <div className="side-panel-chips">
              {(() => {
                const types = [
                  ...(selectedBloodBank.bloodServicesProvided || []),
                  ...(selectedBloodBank.plateletServicesProvided || []),
                  ...(selectedBloodBank.otherServicesProvided || [])
                ].filter(t => t && t !== 'NA' && t !== 'Yes');
                return types.length > 0
                  ? types.map((type, idx) => (
                      <span className="type-chip" key={idx}>{type}</span>
                    ))
                  : <span style={{ color: '#888' }}>N/A</span>;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Floating Donor Button */}
      <button className="floating-donor-btn" onClick={() => setDonorPanelOpen(true)}>
        <span role="img" aria-label="donor">🩸</span> Are you a donor?
      </button>

      {/* Side Panel for Blood Request */}
      <div className={`bloodbank-sidepanel ${sidePanelOpen ? 'open' : ''}`}>
        <div className="bottomsheet-handle" />
        <div className="sidepanel-header">
          <h2>Request Blood</h2>
          <button className="close-btn" style={{ color: '#38A3A5' }} onClick={() => setSidePanelOpen(false)}>&times;</button>
        </div>
        <div className="sidepanel-content">
          <form className="sidepanel-form" onSubmit={handleRequestSubmit}>
            <label htmlFor="units">Units Required</label>
            <input
              id="units"
              type="number"
              min="1"
              value={units}
              onChange={e => setUnits(e.target.value)}
              required
              placeholder="Enter units"
            />
            <label htmlFor="bloodType">Select Blood Type(s)</label>
            <div className="bloodtype-list">
              {BLOOD_TYPES.map(type => (
                <button
                  type="button"
                  key={type}
                  className={`bloodtype-btn${selectedBloodTypes.includes(type) ? ' selected' : ''}`}
                  onClick={() => handleBloodTypeToggle(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            {selectedBloodTypes.length > 0 && (
              <>
                <label htmlFor="prescription">Upload Prescription</label>
                <input
                  type="file"
                  id="prescription"
                  accept="image/*,application/pdf"
                  onChange={handlePrescriptionChange}
                  required
                />
                <button type="submit" className="submit-btn" disabled={requestSubmitted || requestLoading}>
                  {requestLoading ? 'Submitting...' : (requestSubmitted ? 'Submitted!' : 'Submit Request')}
                </button>
              </>
            )}
            {formError && <div style={{ color: '#b91c1c', marginTop: 8, fontWeight: 500 }}>{formError}</div>}
          </form>
        </div>
        <button
          className="submit-btn inpanel-donor-btn"
          type="button"
          onClick={() => setDonorPanelOpen(true)}
        >
          <span role="img" aria-label="donor">🩸</span> Are you a donor?
        </button>
      </div>

      {/* Donor Registration Side Panel */}
      <div className={`donor-sidepanel ${donorPanelOpen ? 'open' : ''}`}>
        <div className="bottomsheet-handle" />
        <div className="sidepanel-header">
          <h2>Register as Donor</h2>
          <button className="close-btn" style={{ color: '#38A3A5' }} onClick={() => setDonorPanelOpen(false)}>&times;</button>
        </div>
        <form className="sidepanel-form" onSubmit={handleDonorSubmit}>
          <label>Full Name</label>
          <input name="fullName" value={donorForm.fullName} onChange={handleDonorChange} required />
          <label>Phone Number</label>
          <input name="phone" value={donorForm.phone} onChange={handleDonorChange} required />
          <label>City</label>
          <input name="city" value={donorForm.city} onChange={handleDonorChange} required />
          <label>State</label>
          <input name="state" value={donorForm.state} onChange={handleDonorChange} required />
          <label>Country</label>
          <input name="country" value={donorForm.country} onChange={handleDonorChange} required />
          <label>Blood Type</label>
          <select name="bloodType" value={donorForm.bloodType} onChange={handleDonorChange} required>
            <option value="">Select</option>
            {BLOOD_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <label>Date</label>
          <input type="date" name="date" value={donorForm.date} onChange={handleDonorChange} required />
          <button type="submit" className="submit-btn" disabled={donorSubmitted}>
            {donorSubmitted ? 'Registering...' : 'Register as Donor'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BloodBank;
