import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAPS_API_KEY } from '../../../config/map.config';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';
import './OfflineDoctorConsultation.css';

// Default profile icon as fallback
const DEFAULT_PROFILE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

function OfflineDoctorConsultation() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    fetchDoctors();
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsMapLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);
  };

  const fetchDoctors = async () => {
    try {
      const doctorsData = await doctorConsultationService.getOfflineDoctors();
      const formattedDoctors = doctorsData.map(doc => {
        const [lat, lng] = doc.location.split(',').map(coord => parseFloat(coord.trim()));
        return {
          id: doc.id,
          vendorId: doc.vendorId || doc.id, // Fallback to id if vendorId is not available
          name: doc.doctorName,
          specialty: doc.specializations.join(', '),
          rating: 4.5,
          avatar: doc.profilePicture,
          lat,
          lng,
          address: `${doc.address}, ${doc.city}, ${doc.state} - ${doc.pincode}`,
          experience: doc.experienceYears,
          consultationFee: doc.consultationFeesRange,
          languages: doc.languageProficiency.join(', '),
          education: doc.educationalQualifications.join(', ')
        };
      });
      setDoctors(formattedDoctors);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (isMapLoaded && doctors.length > 0 && mapRef.current) {
      initializeMap();
    }
  }, [isMapLoaded, doctors]);

  const initializeMap = () => {
    try {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps not loaded');
        return;
      }

      // Create the map instance
      const defaultCenter = doctors.length > 0 
        ? { lat: doctors[0].lat, lng: doctors[0].lng }
        : { lat: 20.5937, lng: 78.9629 }; // Default to center of India

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 11,
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
      });

      // Clear existing markers
      clearMarkers();

      // Add markers for each doctor
      doctors.forEach(doc => {
        const marker = new window.google.maps.Marker({
          position: { lat: doc.lat, lng: doc.lng },
          map: mapInstance.current,
          title: doc.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(16, 32),
          },
        });

        // Add click listener to show info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0;">${doc.name}</h3>
              <p style="margin: 0 0 5px 0;">${doc.specialty}</p>
              <p style="margin: 0;">${doc.address}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance.current, marker);
        });

        markersRef.current.push(marker);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  };

  const clearMarkers = () => {
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    }
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_PROFILE;
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="offline-consultation-container">
      <div className="offline-doctor-list-panel">
        <h2 className="offline-panel-title">Doctors Near You</h2>
        <div className="offline-doctor-list">
          {doctors.map((doc) => (
            <div className="offline-doctor-card" key={doc.id}>
              <div className="offline-doctor-profile">
                <img 
                  src={doc.avatar} 
                  alt={doc.name} 
                  className="offline-doctor-avatar"
                  onError={handleImageError}
                />
                <div className="offline-doctor-info">
                  <h3 className="offline-doctor-name">{doc.name}</h3>
                  <p className="offline-doctor-specialty">{doc.specialty}</p>
                  
                  <div className="info-tag">
                    <i className="fas fa-user-md"></i>
                    {doc.experience} years experience
                  </div>
                  
                  <div className="doctor-details-section">
                    <div className="info-tag">
                      <i className="fas fa-graduation-cap"></i>
                      {doc.education}
                    </div>
                    
                    <div className="info-tag">
                      <i className="fas fa-language"></i>
                      {doc.languages}
                    </div>
                    
                    <div className="info-tag">
                      <i className="fas fa-rupee-sign"></i>
                      ₹{doc.consultationFee}
                    </div>
                  </div>
                  
                  <p className="offline-doctor-address">
                    <i className="fas fa-map-marker-alt"></i> {doc.address}
                  </p>
                  
                  <button 
                    className="offline-book-btn"
                    onClick={() => navigate(`/doctor-consultation/offline/book/${doc.vendorId}`, { state: { doctorData: doc } })}
                  >
                    <i className="fas fa-calendar-check"></i> Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="offline-doctor-map-panel">
        <div ref={mapRef} className="offline-doctor-map" />
      </div>
    </div>
  );
}

export default OfflineDoctorConsultation; 