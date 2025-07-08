import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStar, FaVideo, FaCalendarAlt, FaUserMd, FaStethoscope, FaNewspaper, FaQuestionCircle, FaHeart, FaUser } from 'react-icons/fa';
import { colors } from '../../../styles/colors';
import './OnlineDoctorConsultation.css';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';

const OnlineDoctorConsultation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchOnlineDoctors();
  }, []);

  const fetchOnlineDoctors = async () => {
    try {
      setLoading(true);
      const fetchedDoctors = await doctorConsultationService.getOnlineDoctors();
      setDoctors(fetchedDoctors);
      setError(null);
    } catch (err) {
      setError('Failed to fetch online doctors. Please try again later.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specialties from actual doctor data
  const specialties = [...new Set(doctors.flatMap(doctor => doctor.specializations || []))];
  
  // Get unique languages from actual doctor data
  const languages = [...new Set(doctors.flatMap(doctor => doctor.languageProficiency || []))];

  const timeSlots = ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specializations?.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty = !selectedSpecialty || 
      doctor.specializations?.includes(selectedSpecialty);

    const matchesLanguage = !selectedLanguage || 
      doctor.languageProficiency?.includes(selectedLanguage);

    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const handleBookAppointment = (doctorId) => {
    console.log('Booking appointment with doctor:', doctorId);
    // Add booking logic here
  };

  const handleImageError = (doctorId) => {
    setImageErrors(prev => ({
      ...prev,
      [doctorId]: true
    }));
  };

  const clearFilters = () => {
    setSelectedSpecialty('');
    setSelectedLanguage('');
    setSelectedTimeSlot('');
    setSearchQuery('');
  };

  if (loading) {
    return <div className="loading-state">Loading doctors...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={fetchOnlineDoctors}>Retry</button>
      </div>
    );
  }

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
            <h2>Available Doctors ({filteredDoctors.length})</h2>
          </div>

          <div className="doctors-list">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-card-content">
                  {/* Left Side */}
                  <div className="doctor-left-side">
                    <div className="doctor-avatar">
                      {imageErrors[doctor.id] ? (
                        <div className="default-avatar">
                          <FaUser size={40} color="#666" />
                        </div>
                      ) : (
                        <img 
                          src={doctor.profilePicture} 
                          alt={doctor.doctorName}
                          onError={() => handleImageError(doctor.id)}
                        />
                      )}
                      <div className="online-status online">
                        <div className="status-dot"></div>
                        Online
                      </div>
                    </div>
                    <div className="doctor-info">
                      <h3 className="doctor-name">{doctor.doctorName}</h3>
                      <div className="doctor-meta">
                        <p className="doctor-specialty">
                          <FaUserMd className="specialty-icon" />
                          {doctor.specializations?.join(', ')}
                        </p>
                        <p className="doctor-experience">{doctor.experienceYears} years experience</p>
                      </div>
                      <div className="doctor-actions">
                        <button 
                          className="book-appointment-btn"
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="doctor-right-side">
                    <div className="consultation-fee">
                      <span className="fee-label">Consultation Fee</span>
                      <span className="fee-amount">₹{doctor.consultationFeesRange}</span>
                    </div>
                    
                    <div className="doctor-details">
                      <div className="doctor-languages">
                        <strong>Languages: </strong>
                        {doctor.languageProficiency?.join(', ')}
                      </div>
                      <div className="doctor-qualifications">
                        <strong>Qualifications: </strong>
                        {doctor.educationalQualifications?.join(', ')}
                      </div>
                      <div className="doctor-location">
                        <strong>Location: </strong>
                        {doctor.city}, {doctor.state}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
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