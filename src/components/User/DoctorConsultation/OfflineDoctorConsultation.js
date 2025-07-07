import React, { useEffect, useRef } from 'react';
import { MAPS_API_KEY } from '../../../config/map.config';
import './OfflineDoctorConsultation.css';

const doctors = [
  {
    id: 1,
    name: 'Dr. Ayesha Sharma',
    specialty: 'Cardiologist',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lat: 19.0760,
    lng: 72.8777,
    address: 'Apollo Hospital, Mumbai',
  },
  {
    id: 2,
    name: 'Dr. Rajeev Menon',
    specialty: 'Dermatologist',
    rating: 4.6,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lat: 19.2183,
    lng: 72.9781,
    address: 'Fortis Hospital, Mulund',
  },
  {
    id: 3,
    name: 'Dr. Priya Verma',
    specialty: 'Pediatrician',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    lat: 19.1550,
    lng: 72.8494,
    address: 'Nanavati Hospital, Vile Parle',
  },
  {
    id: 4,
    name: 'Dr. Arjun Singh',
    specialty: 'Orthopedic',
    rating: 4.7,
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    lat: 19.1076,
    lng: 72.8267,
    address: 'Kokilaben Hospital, Andheri',
  },
];

function OfflineDoctorConsultation() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
    // eslint-disable-next-line
  }, []);

  function initMap() {
    if (!mapRef.current) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 19.0760, lng: 72.8777 },
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
    // Add doctor markers
    doctors.forEach((doc) => {
      new window.google.maps.Marker({
        position: { lat: doc.lat, lng: doc.lng },
        map: mapInstance.current,
        title: doc.name,
        icon: {
          url: doc.avatar,
          scaledSize: new window.google.maps.Size(44, 44),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(22, 22),
        },
      });
    });
  }

  return (
    <div className="offline-doctor-consultation-container">
      <div className="doctor-list-panel">
        <h2 className="panel-title">Doctors Near You</h2>
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div className="doctor-card" key={doc.id}>
              <img src={doc.avatar} alt={doc.name} className="doctor-avatar" />
              <div className="doctor-info">
                <div className="doctor-name">{doc.name}</div>
                <div className="doctor-specialty">{doc.specialty}</div>
                <div className="doctor-rating">
                  <span className="star">★</span> {doc.rating}
                </div>
                <div className="doctor-address">{doc.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="doctor-map-panel">
        <div ref={mapRef} className="doctor-map" />
      </div>
    </div>
  );
}

export default OfflineDoctorConsultation; 