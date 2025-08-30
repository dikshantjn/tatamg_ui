import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MAPS_API_KEY } from '../../../config/map.config';
import './LabTests.css';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaLocationArrow, FaHospital } from 'react-icons/fa';
import { getNearbyLabs, getCurrentLocation, formatDistance } from '../../../services/User/LabTest/lab-test.service';
import BookLabTestAppt from './BookLabTestAppt';
import { useNavigate } from 'react-router-dom';

const LabTests = () => {
  const [selectedLab, setSelectedLab] = useState(null);
  const [activeLab, setActiveLab] = useState(null);
  const [labs, setLabs] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 18.5204, lng: 73.8567 }); // Default to Pune center
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookLab, setBookLab] = useState(null);
  const navigate = useNavigate();

  const mapCenter = userLocation;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAPS_API_KEY,
  });

  // Fetch user location and nearby labs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user's current location
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Get nearby labs within 5km radius
        const nearbyLabs = await getNearbyLabs(location, 5);
        console.log('Fetched labs:', nearbyLabs);
        console.log('Labs with coordinates:', nearbyLabs.filter(lab => lab.coordinates));
        setLabs(nearbyLabs);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching lab data:', error);
        setError('Failed to load lab data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onLoad = useCallback((map) => {
    console.log('Map loaded with labs:', labs.length);
    setMapInstance(map);
    
    // Set initial zoom and center
    map.setZoom(12);
    map.setCenter(userLocation);
    
    console.log('Map center set to:', userLocation);
  }, [labs, userLocation]);

  // Effect to adjust map bounds when labs are loaded
  useEffect(() => {
    if (mapInstance && labs.length > 0) {
      console.log('Adjusting map bounds for', labs.length, 'labs');
      
      const bounds = new window.google.maps.LatLngBounds();
      
      // Add user location to bounds
      bounds.extend(userLocation);
      
      // Add lab coordinates to bounds
      let validCoordinates = 0;
      labs.forEach(lab => {
        if (lab.coordinates && lab.coordinates.lat && lab.coordinates.lng) {
          bounds.extend(lab.coordinates);
          validCoordinates++;
        }
      });
      
      console.log('Valid coordinates found:', validCoordinates);
      
      if (validCoordinates > 0) {
        mapInstance.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
          if (mapInstance.getZoom() > 15) {
            mapInstance.setZoom(15);
          }
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [mapInstance, labs, userLocation]);

  const handleLabClick = (lab) => {
    setSelectedLab(lab);
    setActiveLab(lab.id);
  };

  const handleImageError = (labId) => {
    setImageErrors(prev => ({
      ...prev,
      [labId]: true
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'star filled' : 'star'}
        />
      );
    }
    return stars;
  };

  const handleOpenBookPage = (lab) => {
    navigate(`/lab-tests/book/${lab.id}`, { state: { lab } });
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
    setBookLab(null);
  };

  if (!isLoaded || loading) {
    return (
      <div className="lab-tests-container">
        {/* Header (no loading indicator) */}
        <div className="lab-tests-header" style={{ background: '#D1F8EF' }}>
          <div className="header-content">
            <div className="header-main" style={{ alignItems: 'flex-end', gap: 0 }}>
              <div className="header-text" style={{ gap: 0 }}>
                <h1>Find Lab Tests Near You</h1>
                <p>Discover trusted diagnostic centers in Pune</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lab-tests-content">
          {/* Shimmer for sidebar */}
          <div className="labs-box">
            <div className="labs-box-header shimmer shimmer-bar" style={{ width: '60%', height: 28, marginBottom: 16 }}></div>
            <div className="labs-list">
              {[...Array(4)].map((_, i) => (
                <div className="lab-item shimmer shimmer-card" key={i} style={{ height: 140, marginBottom: 18 }}></div>
              ))}
            </div>
          </div>
          {/* Shimmer for map */}
          <div className="map-container">
            <div className="google-map shimmer shimmer-map"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lab-tests-container">
        <div className="loading-spinner">
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              marginTop: '10px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-tests-container">
      {/* Header */}
      <div className="lab-tests-header" style={{ background: '#D1F8EF' }}>
        <div className="header-content">
          <div className="header-main" style={{ alignItems: 'flex-end', gap: 0 }}>
            <div className="header-text" style={{ gap: 0 }}>
              <h1>Find Lab Tests Near You</h1>
              <p>Discover trusted diagnostic centers in Pune</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lab-tests-content">
        {/* Labs Box */}
        <div className="labs-box">
          <div className="labs-box-header">
            <h3>Available Labs</h3>
            <span className="lab-count">{labs.length} labs found</span>
          </div>
          
          <div className="labs-list">
            {labs.map((lab) => (
              <div 
                id={`lab-${lab.id}`}
                key={lab.id} 
                className={`lab-item ${activeLab === lab.id ? 'active' : ''}`}
                onClick={() => handleLabClick(lab)}
              >
                <div className="lab-item-image">
                  {imageErrors[lab.id] || !lab.image ? (
                    <div className="lab-item-image-fallback">
                      <FaHospital className="lab-fallback-icon" />
                    </div>
                  ) : (
                    <img 
                      src={lab.image} 
                      alt={lab.name}
                      onError={() => handleImageError(lab.id)}
                    />
                  )}
                  <div className="lab-item-rating">
                    {renderStars(lab.rating)}
                    <span className="rating-text">{lab.rating}</span>
                  </div>
                </div>
                
                <div className="lab-item-info">
                  <h4 className="lab-item-name">{lab.name}</h4>
                  <div className="lab-item-address">
                    <FaMapMarkerAlt className="icon" />
                    <span>{lab.address}</span>
                  </div>
                  <div className="lab-item-timing-phone">
                    <div className="lab-item-timing">
                      <FaClock className="icon" />
                      <span>{lab.timing}</span>
                    </div>
                    <div className="lab-item-phone">
                      <FaPhone className="icon" />
                      <span>{lab.phone}</span>
                    </div>
                  </div>
                  
                  <div className="lab-item-services">
                    {lab.services.slice(0, 2).map((service, index) => (
                      <span key={index} className="service-tag">{service}</span>
                    ))}
                    {lab.services.length > 2 && (
                      <span className="service-tag more">+{lab.services.length - 2} more</span>
                    )}
                  </div>
                  
                  <div className="lab-item-reviews">
                    <span>{lab.reviews} reviews</span>
                  </div>
                  
                  {lab.distance && (
                    <div className="lab-item-distance">
                      <FaLocationArrow className="icon" />
                      <span>{formatDistance(lab.distance)} away</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className="lab-book-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenBookPage(lab);
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <GoogleMap
            mapContainerClassName="google-map"
            center={mapCenter}
            zoom={12}
            onLoad={onLoad}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ]
            }}
          >
            {/* User Location Marker */}
            <Marker
              position={{
                lat: parseFloat(userLocation.lat),
                lng: parseFloat(userLocation.lng)
              }}
              title="Your Location"
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4FB5B7',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />

            {/* Lab Markers */}
            {labs.length > 0 && labs.map((lab) => {
              // Debug log for coordinates
              console.log('Lab marker:', lab.name, lab.coordinates);
              
              if (!lab.coordinates || !lab.coordinates.lat || !lab.coordinates.lng) {
                console.warn('Lab missing coordinates:', lab.name);
                return null;
              }
              
              const position = {
                lat: parseFloat(lab.coordinates.lat),
                lng: parseFloat(lab.coordinates.lng)
              };
              
              console.log('Rendering marker at position:', position);
              
              return (
                <Marker
                  key={`lab-${lab.id}`}
                  position={position}
                  title={lab.name}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#38A3A5',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  }}
                  onClick={() => {
                    console.log('Marker clicked:', lab.name);
                    setSelectedLab(lab);
                    setActiveLab(lab.id);
                    
                    // Center map on selected lab
                    if (mapInstance) {
                      mapInstance.panTo(position);
                      mapInstance.setZoom(15);
                    }
                    
                    // Scroll to the lab in sidebar
                    const labElement = document.getElementById(`lab-${lab.id}`);
                    if (labElement) {
                      labElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                />
              );
            })}

            {/* InfoWindow */}
            {selectedLab && selectedLab.coordinates && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedLab.coordinates.lat),
                  lng: parseFloat(selectedLab.coordinates.lng)
                }}
                onCloseClick={() => {
                  setSelectedLab(null);
                  setActiveLab(null);
                }}
              >
                <div className="info-window">
                  {imageErrors[selectedLab.id] || !selectedLab.image ? (
                    <div className="info-image-fallback">
                      <FaHospital className="info-fallback-icon" />
                    </div>
                  ) : (
                    <img 
                      src={selectedLab.image} 
                      alt={selectedLab.name} 
                      className="info-image"
                      onError={() => handleImageError(selectedLab.id)}
                    />
                  )}
                  <h4>{selectedLab.name}</h4>
                  <p className="info-address">
                    <FaMapMarkerAlt className="icon" />
                    {selectedLab.address}
                  </p>
                  <div className="info-rating">
                    {renderStars(selectedLab.rating)}
                    <span>({selectedLab.reviews} reviews)</span>
                  </div>
                  <p className="info-timing">
                    <FaClock className="icon" />
                    {selectedLab.timing}
                  </p>
                  <button className="info-book-btn">Book Now</button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
      {showBookModal && (
        <BookLabTestAppt lab={bookLab} onClose={handleCloseBookModal} />
      )}
    </div>
  );
};

export default LabTests; 