import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import './HospitalBedBooking.css';
import { FiSearch, FiMapPin, FiPhone, FiStar, FiClock, FiCalendar, FiArrowRight, FiAward, FiAlertCircle } from 'react-icons/fi';
import { MAPS_API_KEY } from '../../../config/map.config';
import { useNavigate } from 'react-router-dom';
import { hospitalService } from '../../../services/User/Hospital/hospital.service';
import OngoingBedBookingModal from './OngoingBedBookingModal';
import { getUserId } from '../../../services/User/Auth/auth.utils';

const mapStyles = [
  {
    featureType: "poi.medical",
    elementType: "geometry",
    stylers: [{ color: "#e9ecef" }]
  },
  {
    featureType: "poi.medical",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2563eb" }]
  },
  {
    featureType: "poi.business",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f8f9fa" }]
  }
];

function HospitalBedBooking() {
  console.log('🏥 HospitalBedBooking Component Mounted');
  
  // Debug auth state
  const userId = getUserId();
  console.log('👤 Current UserId:', userId);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Pune coordinates
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAPS_API_KEY
  });

  useEffect(() => {
    fetchHospitals();
    if (userId) {
      console.log('🔄 Fetching bookings for userId:', userId);
      fetchOngoingBookings();
    } else {
      console.log('❌ No userId available for fetching bookings');
    }
  }, [userId]);

  // Monitor selectedBooking changes
  useEffect(() => {
    console.log('🔄 Selected Booking Updated:', selectedBooking);
    console.log('📱 Modal Visibility:', showBookingModal);
  }, [selectedBooking, showBookingModal]);

  const fetchOngoingBookings = async () => {
    try {
      if (!userId) {
        console.log('❌ Cannot fetch bookings: No userId available');
        return;
      }

      console.log('🔍 Fetching bookings for user:', userId);
      const response = await hospitalService.getUserBookings(userId);
      console.log('📦 Bookings Response:', response);

      if (response.success && response.bookings.length > 0) {
        console.log('✅ Found bookings:', response.bookings);
        setOngoingBookings(response.bookings);
        
        // Show the first non-completed booking by default
        const firstOngoing = response.bookings.find(b => b.status !== 'completed');
        console.log('🎯 First ongoing booking:', firstOngoing);
        
        if (firstOngoing) {
          console.log('🔄 Setting selected booking and showing modal');
          setSelectedBooking(firstOngoing);
          setShowBookingModal(true);
        }
      } else {
        console.log('ℹ️ No ongoing bookings found');
      }
    } catch (err) {
      console.error('❌ Error fetching ongoing bookings:', err);
    }
  };

  const handleRefreshBooking = async () => {
    await fetchOngoingBookings();
  };

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hospitalService.getAllHospitals();
      setHospitals(data);
      if (data.length > 0) {
        setMapCenter(data[0].location); // Center map on first hospital
      }
    } catch (err) {
      setError('Failed to fetch hospitals. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filters = ["All", "Emergency", "ICU", "OPD", "Operation Theater"];

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setMapCenter(hospital.location);
  };

  const handleBookNow = (hospital, e) => {
    e.stopPropagation();
    navigate(`/hospital-bed-booking/${hospital.vendorId}`);
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialities.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'All' || 
      hospital.features.some(feature => feature === activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  const renderMap = () => {
    return (
      <GoogleMap
        mapContainerClassName="map-container"
        center={mapCenter}
        zoom={13}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }}
      >
        {filteredHospitals.map(hospital => (
          <Marker
            key={hospital.id}
            position={hospital.location}
            onClick={() => handleHospitalSelect(hospital)}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
              fillColor: selectedHospital?.id === hospital.id ? '#1d4ed8' : '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 2,
            }}
          />
        ))}
      </GoogleMap>
    );
  };

  if (loading) {
    return (
      <div className="hospital-booking-container">
        <div className="loading-state">
          Loading hospitals...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hospital-booking-container">
        <div className="error-state">
          <FiAlertCircle size={24} />
          <p>{error}</p>
          <button onClick={fetchHospitals}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hospital-booking-container">
      {/* Left Section - Hospital List */}
      <div className="hospitals-list-section">
        <div className="search-container">
          <div className="search-box">
            <FiSearch size={20} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search hospitals, specialities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filters-container">
            {filters.map(filter => (
              <span
                key={filter}
                className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="hospital-cards">
          {filteredHospitals.map(hospital => (
            <div
              key={hospital.id}
              className={`hospital-card ${selectedHospital?.id === hospital.id ? 'selected' : ''}`}
              onClick={() => handleHospitalSelect(hospital)}
            >
              <div className="hospital-header">
                <div>
                  <h3 className="hospital-name">{hospital.name}</h3>
                  <p className="hospital-type">
                    <FiAward size={16} />
                    {hospital.type} • {hospital.accreditation}
                  </p>
                </div>
              </div>
              
              <div className="hospital-info">
                <div className="info-item">
                  <FiMapPin size={16} />
                  <span>{hospital.distance}</span>
                </div>
                <div className="info-item">
                  <FiStar size={16} />
                  <span>{hospital.rating}</span>
                </div>
                <div className="info-item">
                  <FiClock size={16} />
                  <span>{hospital.openHours}</span>
                </div>
                <div className="info-item">
                  <FiCalendar size={16} />
                  <span>{hospital.availability}</span>
                </div>
              </div>

              <div className="hospital-features">
                {hospital.features.slice(0, 4).map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
                {hospital.features.length > 4 && (
                  <span className="feature-tag">
                    +{hospital.features.length - 4} more
                  </span>
                )}
              </div>

              <button 
                className="book-now-btn"
                onClick={(e) => handleBookNow(hospital, e)}
              >
                Book Now
                <FiArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Map */}
      <div className="map-section">
        {loadError && <div>Error loading maps</div>}
        {!isLoaded && <div>Loading maps...</div>}
        {isLoaded && renderMap()}
      </div>

      {/* Ongoing Booking Modal */}
      {selectedBooking && (
        <OngoingBedBookingModal
          open={showBookingModal}
          booking={selectedBooking}
          onClose={() => setShowBookingModal(false)}
          onRefreshBooking={handleRefreshBooking}
        />
      )}
    </div>
  );
}

export default HospitalBedBooking;
