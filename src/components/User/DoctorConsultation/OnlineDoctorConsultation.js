import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStar, FaVideo, FaCalendarAlt, FaUserMd, FaStethoscope, FaNewspaper, FaQuestionCircle, FaHeart } from 'react-icons/fa';
import { colors } from '../../../styles/colors';
import './OnlineDoctorConsultation.css';

const OnlineDoctorConsultation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [doctors, setDoctors] = useState([]);

  // Mock doctor data
  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      experience: '8 years',
      rating: 4.8,
      reviews: 324,
      languages: ['English', 'Spanish'],
      fee: 299,
      nextAvailable: '10:30 AM',
      avatar: '/api/placeholder/80/80',
      isOnline: true,
      about: 'Specialized in internal medicine and preventive care'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      experience: '12 years',
      rating: 4.9,
      reviews: 567,
      languages: ['English', 'Mandarin'],
      fee: 399,
      nextAvailable: '11:15 AM',
      avatar: '/api/placeholder/80/80',
      isOnline: true,
      about: 'Expert in skin conditions and cosmetic dermatology'
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrics',
      experience: '10 years',
      rating: 4.7,
      reviews: 289,
      languages: ['English', 'Hindi'],
      fee: 349,
      nextAvailable: '2:00 PM',
      avatar: '/api/placeholder/80/80',
      isOnline: false,
      about: 'Child healthcare specialist with focus on development'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Cardiology',
      experience: '15 years',
      rating: 4.9,
      reviews: 412,
      languages: ['English'],
      fee: 499,
      nextAvailable: '3:30 PM',
      avatar: '/api/placeholder/80/80',
      isOnline: true,
      about: 'Heart specialist with expertise in preventive cardiology'
    },
    {
      id: 5,
      name: 'Dr. Fatima Al-Zahra',
      specialty: 'Gynecology',
      experience: '11 years',
      rating: 4.8,
      reviews: 356,
      languages: ['English', 'Arabic'],
      fee: 399,
      nextAvailable: '4:45 PM',
      avatar: '/api/placeholder/80/80',
      isOnline: true,
      about: 'Women\'s health specialist and fertility expert'
    },
    {
      id: 6,
      name: 'Dr. Robert Kim',
      specialty: 'Orthopedics',
      experience: '13 years',
      rating: 4.6,
      reviews: 278,
      languages: ['English', 'Korean'],
      fee: 449,
      nextAvailable: '5:15 PM',
      avatar: '/api/placeholder/80/80',
      isOnline: false,
      about: 'Bone and joint specialist with sports medicine focus'
    }
  ];

  const specialties = [
    'General Medicine', 'Dermatology', 'Pediatrics', 'Cardiology', 
    'Gynecology', 'Orthopedics', 'Psychiatry', 'Ophthalmology'
  ];

  const languages = ['English', 'Hindi', 'Spanish', 'Mandarin', 'Arabic', 'Korean'];
  const timeSlots = ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'];

  useEffect(() => {
    // Filter doctors based on search and filters
    let filtered = mockDoctors;

    if (searchQuery) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(doctor => doctor.languages.includes(selectedLanguage));
    }

    setDoctors(filtered);
  }, [searchQuery, selectedSpecialty, selectedLanguage, selectedTimeSlot]);

  const handleBookAppointment = (doctorId) => {
    console.log('Booking appointment with doctor:', doctorId);
    // Add booking logic here
  };

  const clearFilters = () => {
    setSelectedSpecialty('');
    setSelectedLanguage('');
    setSelectedTimeSlot('');
    setSearchQuery('');
  };

  return (
    <div className="online-consultation-container">
      {/* Search and Filters Section */}
      <div className="online-search-filters-section">
        <div className="online-search-filters-row">
          <div className="online-search-box">
            <FaSearch className="online-search-icon" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="online-search-input"
            />
          </div>
          
          <div className="online-filter-group">
            <select 
              value={selectedSpecialty} 
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="online-filter-select"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div className="online-filter-group">
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="online-filter-select"
            >
              <option value="">All Languages</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          <div className="online-filter-group">
            <select 
              value={selectedTimeSlot} 
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="online-filter-select"
            >
              <option value="">Any Time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <button className="online-clear-filters-btn" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="main-content-layout">
        {/* Left Side - Doctors List */}
        <div className="doctors-section">
          <div className="results-header">
            <h2>Available Doctors ({doctors.length})</h2>
          </div>

          <div className="doctors-list">
            {doctors.map(doctor => (
                          <div key={doctor.id} className="doctor-card">
              <div className="doctor-card-content">
                {/* Left Side */}
                <div className="doctor-left-side">
                  <div className="doctor-avatar">
                    <img src={doctor.avatar} alt={doctor.name} />
                    <div className={`online-status ${doctor.isOnline ? 'online' : 'offline'}`}>
                      <div className="status-dot"></div>
                      {doctor.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div className="doctor-info">
                    <h3 className="doctor-name">{doctor.name}</h3>
                    <div className="doctor-meta">
                      <p className="doctor-specialty">
                        <FaUserMd className="specialty-icon" />
                        {doctor.specialty}
                      </p>
                      <p className="doctor-experience">{doctor.experience} experience</p>
                      <div className="doctor-rating">
                        <div className="rating-stars">
                          <FaStar className="star filled" />
                          <span className="rating-value">{doctor.rating}</span>
                        </div>
                        <span className="reviews-count">({doctor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="doctor-right-side">
                  <div className="consultation-fee">
                    <span className="fee-label">Consultation Fee</span>
                    <span className="fee-amount">₹{doctor.fee}</span>
                  </div>
                  
                  <div className="doctor-details">
                    <p className="doctor-about">{doctor.about}</p>
                    <div className="doctor-languages">
                      <strong>Languages: </strong>
                      {doctor.languages.join(', ')}
                    </div>
                    <div className="next-available">
                      <FaCalendarAlt className="calendar-icon" />
                      <span>Next available: {doctor.nextAvailable}</span>
                    </div>
                  </div>

                  <div className="doctor-actions">
                    <button 
                      className={`book-appointment-btn ${!doctor.isOnline ? 'disabled' : ''}`}
                      onClick={() => handleBookAppointment(doctor.id)}
                      disabled={!doctor.isOnline}
                    >
                      <FaVideo className="btn-icon" />
                      {doctor.isOnline ? 'Book Video Consultation' : 'Currently Offline'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>

          {doctors.length === 0 && (
            <div className="no-results">
              <FaUserMd className="no-results-icon" />
              <h3>No doctors found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Related Content */}
        <div className="related-content-section">
          {/* Related Treatments */}
          <div className="related-section">
            <h3 className="section-title">
              <FaStethoscope className="section-icon" />
              Related Treatments
            </h3>
            <div className="related-items">
              <a href="#" className="related-item">
                <span>General Health Checkup</span>
                <FaHeart className="item-icon" />
              </a>
              <a href="#" className="related-item">
                <span>Skin Consultation</span>
                <FaHeart className="item-icon" />
              </a>
              <a href="#" className="related-item">
                <span>Mental Health Support</span>
                <FaHeart className="item-icon" />
              </a>
              <a href="#" className="related-item">
                <span>Women's Health</span>
                <FaHeart className="item-icon" />
              </a>
            </div>
          </div>

          {/* Top Related Treatments */}
          <div className="related-section">
            <h3 className="section-title">
              <FaStethoscope className="section-icon" />
              Top Related Treatments
            </h3>
            <div className="related-items">
              <a href="#" className="related-item popular">
                <span>Cardiology Consultation</span>
                <span className="popular-badge">Popular</span>
              </a>
              <a href="#" className="related-item popular">
                <span>Dermatology Expert</span>
                <span className="popular-badge">Trending</span>
              </a>
              <a href="#" className="related-item">
                <span>Pediatric Care</span>
                <FaHeart className="item-icon" />
              </a>
              <a href="#" className="related-item">
                <span>Orthopedic Consultation</span>
                <FaHeart className="item-icon" />
              </a>
            </div>
          </div>

          {/* Health Articles */}
          <div className="related-section">
            <h3 className="section-title">
              <FaNewspaper className="section-icon" />
              Health Articles
            </h3>
            <div className="related-items">
              <a href="#" className="related-item">
                <span>10 Tips for Better Sleep</span>
                <span className="article-meta">5 min read</span>
              </a>
              <a href="#" className="related-item">
                <span>Managing Stress During Work</span>
                <span className="article-meta">3 min read</span>
              </a>
              <a href="#" className="related-item">
                <span>Healthy Diet for Immunity</span>
                <span className="article-meta">7 min read</span>
              </a>
              <a href="#" className="related-item">
                <span>Exercise for Mental Health</span>
                <span className="article-meta">4 min read</span>
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div className="related-section">
            <h3 className="section-title">
              <FaQuestionCircle className="section-icon" />
              FAQs
            </h3>
            <div className="faq-items">
              <div className="faq-item">
                <h4>How does online consultation work?</h4>
                <p>Book an appointment and connect via video call with certified doctors from the comfort of your home.</p>
              </div>
              <div className="faq-item">
                <h4>What if I need a prescription?</h4>
                <p>Doctors can provide e-prescriptions that you can use at any pharmacy or order medicines online.</p>
              </div>
              <div className="faq-item">
                <h4>Is my consultation private?</h4>
                <p>Yes, all consultations are completely private and secure, following healthcare privacy standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineDoctorConsultation; 