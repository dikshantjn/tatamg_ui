import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MAPS_API_KEY } from '../../../config/map.config';
import { useNavigate } from 'react-router-dom';
import { ambulanceService } from '../../../services/User/Ambulance/ambulance.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import './Ambulance.css';
import OngoingAmbulanceBookingModal from './OngoingAmbulanceBookingModal';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const defaultCenter = { lat: 19.076, lng: 72.8777 };

// Helper to calculate distance between two lat/lng points (Haversine formula)
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to parse location string to {latitude, longitude}
function parseLocation(locationString) {
  if (!locationString) return null;
  const [latStr, lngStr] = locationString.split(',');
  const lat = Number(latStr.trim());
  const lng = Number(lngStr.trim());
  if (isNaN(lat) || isNaN(lng)) return null;
  return { latitude: lat, longitude: lng };
}

// Custom Haversine formula for distance in km
function calculateDistance(userLocation, vendorLocation) {
  const userCoords = parseLocation(userLocation);
  const vendorCoords = parseLocation(vendorLocation);
  if (!userCoords || !vendorCoords) {
    throw new Error('Both user and vendor must have valid latitude and longitude.');
  }
  const R = 6371; // Radius of the Earth in km
  const lat1 = userCoords.latitude;
  const lon1 = userCoords.longitude;
  const lat2 = vendorCoords.latitude;
  const lon2 = vendorCoords.longitude;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function Ambulance() {
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mapZoom, setMapZoom] = useState(12);
  const [callLoading, setCallLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [ongoingBooking, setOngoingBooking] = useState(null);
  const [ongoingModalOpen, setOngoingModalOpen] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
  });

  // Steps logic
  const steps = [
    'Pending',
    'Accepted',
    'Payment',
    'On The Way',
    'Picked Up',
    'Completed',
  ];
  function getCurrentStepIndex(status) {
    const statusMap = {
      pending: 0,
      accepted: 1,
      WaitingForPayment: 2,
      paymentCompleted: 2,
      PaymentWaived: 2,
      OnTheWay: 3,
      PickedUp: 4,
      Completed: 5,
    };
    return statusMap[status] ?? 0;
  }

  // Fetch ambulances on mount
  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        const data = await ambulanceService.getAllAmbulances();
        setAmbulances(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAmbulances();
  }, []);

  useEffect(() => {
    // On mount, try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          setShowLocationPrompt(false);
        },
        (err) => {
          setShowLocationPrompt(true);
          if (err.code === 1) {
            setLocationError('Location access denied. Please enable location in your browser settings and reload the page.');
          } else {
            setLocationError('Unable to get your location. Please try again or check your browser settings.');
          }
        }
      );
    } else {
      setShowLocationPrompt(true);
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleMarkerClick = useCallback((amb) => {
    setSelectedAmbulance(amb);
  }, []);

  // Remove location prompt trigger from map click
  const handleMapClick = () => {};

  // Update zoom when userLocation is set
  useEffect(() => {
    if (userLocation) {
      setMapZoom(15);
    } else {
      setMapZoom(12);
    }
  }, [userLocation]);

  const handleClosePanel = () => setSelectedAmbulance(null);

  // When user clicks Cancel, navigate to home
  const handleCancelLocation = () => {
    setShowLocationPrompt(false);
    navigate('/');
  };

  // Find nearest ambulance within 5km
  const findNearestAmbulance = () => {
    if (!userLocation || !ambulances.length) return null;
    let minDist = Infinity;
    let nearest = null;
    ambulances.forEach((amb) => {
      if (!amb.preciseLocation) return;
      const userLocStr = `${userLocation.lat},${userLocation.lng}`;
      const dist = calculateDistance(userLocStr, amb.preciseLocation);
      if (dist <= 5 && dist < minDist) {
        minDist = dist;
        nearest = amb;
      }
    });
    return nearest;
  };

  // Helper to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  // Handle floating call button click
  const handleCallClick = async () => {
    if (!userLocation) {
      showNotification('Please enable location to request an ambulance.', 'error');
      return;
    }
    setCallLoading(true);
    try {
      let userId = getUserId();
      if (!userId) {
        showNotification('You must be logged in to request an ambulance.', 'error');
        setCallLoading(false);
        return;
      }
      const nearest = findNearestAmbulance();
      if (!nearest) {
        showNotification('No ambulance found within 5 km.', 'error');
        setCallLoading(false);
        return;
      }
      const res = await ambulanceService.requestAmbulance(userId, nearest.vendorId);
      if (res.success) {
        showNotification('Ambulance booking request sent successfully!', 'success');
      } else {
        showNotification(res.message || 'Failed to request ambulance.', 'error');
      }
    } catch (err) {
      showNotification('Failed to request ambulance.', 'error');
    }
    setCallLoading(false);
  };

  // Fetch ongoing booking on mount and for refresh
  const refreshOngoingBooking = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      const bookings = await ambulanceService.getActiveBookings(userId);
      if (bookings && bookings.length > 0) {
        // Attach agency info to booking as .agency
        const booking = { ...bookings[0], agency: bookings[0].agencyProfile };
        setOngoingBooking(booking);
        setOngoingModalOpen(true);
      } else {
        setOngoingBooking(null);
        setOngoingModalOpen(false);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    refreshOngoingBooking();
  }, []);

  return (
    <>
      {/* Floating Notification (fixed, left) */}
      {notification && (
        <div className={`ambulance-notification ${notification.type}`} style={{ position: 'fixed', left: 32, top: 32, zIndex: 99999 }}>
          {notification.message}
          <button className="notification-close" onClick={() => setNotification(null)} aria-label="Close notification">×</button>
        </div>
      )}
      <div className="ambulance-map-wrapper">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || defaultCenter}
            zoom={mapZoom}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              styles: [
                { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
                { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
                {
                  featureType: 'administrative.land_parcel',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#bdbdbd' }],
                },
                {
                  featureType: 'poi',
                  elementType: 'geometry',
                  stylers: [{ color: '#eeeeee' }],
                },
                {
                  featureType: 'poi',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#757575' }],
                },
                {
                  featureType: 'poi.park',
                  elementType: 'geometry',
                  stylers: [{ color: '#e5e5e5' }],
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#9e9e9e' }],
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [{ color: '#ffffff' }],
                },
                {
                  featureType: 'road.arterial',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#757575' }],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry',
                  stylers: [{ color: '#dadada' }],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#616161' }],
                },
                {
                  featureType: 'road.local',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#9e9e9e' }],
                },
                {
                  featureType: 'transit.line',
                  elementType: 'geometry',
                  stylers: [{ color: '#e5e5e5' }],
                },
                {
                  featureType: 'transit.station',
                  elementType: 'geometry',
                  stylers: [{ color: '#eeeeee' }],
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{ color: '#c9c9c9' }],
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#9e9e9e' }],
                },
              ],
            }}
            onClick={handleMapClick}
            onLoad={map => (mapRef.current = map)}
          >
            {ambulances.map((amb) => {
              const pos = parseLocation(amb.preciseLocation);
              if (!pos) return null;
              const markerPosition = { lat: pos.latitude, lng: pos.longitude };
    return (
                <Marker
                  key={amb.vendorId}
                  position={markerPosition}
                  onClick={() => handleMarkerClick(amb)}
                  icon={{
                    url: amb.is24x7Available
                      ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                      : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: { width: 40, height: 40 },
                  }}
                />
              );
            })}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: { width: 40, height: 40 },
                }}
              />
            )}
          </GoogleMap>
        )}
        {/* Floating Call Button - always visible */}
        <div className="floating-call-btn-wrapper">
          <button
            className="floating-call-btn"
            title="Request Nearest Ambulance"
            onClick={handleCallClick}
            disabled={callLoading || !userLocation}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '0 24px' }}
          >
            {callLoading ? (
              <>
                <span className="spinner"></span>
                <span style={{ fontWeight: 600, fontSize: '1rem', marginLeft: 8 }}>Requesting...</span>
              </>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="#38A3A5"/><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/></svg>
                <span className="floating-call-btn-text">Call Ambulance</span>
              </>
            )}
          </button>
        </div>
        {/* Side Panel */}
        {selectedAmbulance && (
          <div className="ambulance-side-panel animate-in">
            <div className="side-panel-accent"></div>
            <div className="bottomsheet-indicator mobile-only"></div>
            <div className="side-panel-header">
              <h3>{selectedAmbulance.agencyName}</h3>
              <div className="side-panel-header-row2">
                <button className="close-panel-btn" onClick={handleClosePanel} aria-label="Close panel">&times;</button>
              </div>
            </div>
            <div className="side-panel-section">
              <div className="side-panel-label">Address</div>
              <div className="side-panel-value">{selectedAmbulance.address}</div>
              {selectedAmbulance.landmark && <div className="side-panel-landmark">Landmark: {selectedAmbulance.landmark}</div>}
            </div>
            <div className="side-panel-divider"></div>
            <div className="side-panel-section">
              <div className="side-panel-label">Ambulance Types</div>
              <div className="side-panel-chips">
                {selectedAmbulance.ambulanceTypes && selectedAmbulance.ambulanceTypes.map((type, idx) => (
                  <span className="type-chip" key={idx}>{type}</span>
                ))}
              </div>
            </div>
            <div className="side-panel-section">
              <span className={`status-badge ${selectedAmbulance.is24x7Available ? 'available' : 'unavailable'}`}>{selectedAmbulance.is24x7Available ? '24x7' : 'Limited'}</span>
            </div>
          </div>
        )}
        {/* Location Prompt Modal */}
        {showLocationPrompt && (
          <div className="location-modal-overlay">
            <div className="location-modal attractive-modal">
              <div className="modal-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38A3A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="#E0F7FA"/><path d="M12 8v4l3 3" stroke="#38A3A5" strokeWidth="2"/></svg>
            </div>
              <h2>Enable Location</h2>
              <p>Enable location to find nearest ambulance service.</p>
              {(!locationError) && (
                <button className="enable-location-btn" onClick={handleCancelLocation}>Enable Location</button>
              )}
              {locationError && <p className="location-error">{locationError}</p>}
              <button className="close-location-modal" onClick={handleCancelLocation}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
        {/* Ongoing Ambulance Booking Modal */}
        {ongoingBooking && (
          <OngoingAmbulanceBookingModal
            open={ongoingModalOpen}
            booking={ongoingBooking}
            steps={steps}
            currentStepIndex={getCurrentStepIndex(ongoingBooking.status)}
            onClose={() => setOngoingModalOpen(false)}
            onRefreshBooking={refreshOngoingBooking}
          />
        )}
    </>
    );
}

export default Ambulance;
