import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './BookDoctorAppointment.css';
import doctorAppointmentPaymentService from '../../../services/payment/doctor-appointment-payment.service';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';
import { getUserData, getUserId } from '../../../services/User/Auth/auth.utils';
import { getHealthRecordsForAppointment } from '../../../services/User/HealthRecords/health-records.service';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
import ShareIcon from '@mui/icons-material/Share';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const BookDoctorAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { doctorData: initialDoctorData } = location.state || {};
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [timeslotsData, setTimeslotsData] = useState(null);
  const [loadingTimeslots, setLoadingTimeslots] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dialogContent, setDialogContent] = useState({
    type: '', // 'success' or 'error'
    message: '',
    details: {}
  });
  const [showHealthRecordsModal, setShowHealthRecordsModal] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [selectedHealthRecords, setSelectedHealthRecords] = useState([]);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingDoctorProfile, setLoadingDoctorProfile] = useState(false);
  const [doctorData, setDoctorData] = useState(initialDoctorData || null);

  // Sample blog posts and FAQs
  const blogPosts = [
    {
      title: "How to Prepare for Your Doctor's Visit",
      link: "#",
      date: "2024-01-15"
    },
    {
      title: "Understanding Medical Prescriptions",
      link: "#",
      date: "2024-01-10"
    },
    {
      title: "Making the Most of Your Consultation",
      link: "#",
      date: "2024-01-05"
    }
  ];

  // Fetch doctor profile if not available or incomplete
  const fetchDoctorProfile = async () => {
    if (!vendorId) return;
    
    // If we already have complete doctor data, don't fetch again
    if (doctorData && doctorData.name && doctorData.languages && doctorData.specialty) {
      console.log('Doctor data already available:', doctorData);
      return;
    }
    
    try {
      setLoadingDoctorProfile(true);
      console.log('Fetching doctor profile for vendorId:', vendorId);
      
      const profileData = await doctorConsultationService.getDoctorProfile(vendorId);
      console.log('Fetched doctor profile:', profileData);
      
       // Map API response to component expected structure
      const mappedDoctorData = {
        name: profileData.doctorName || 'Dr. Unknown',
        specialty: profileData.specializations ? profileData.specializations.join(', ') : 'General Medicine',
        languages: profileData.languageProficiency ? profileData.languageProficiency.join(', ') : 'English',
        experience: profileData.experienceYears || 'N/A',
        consultationFee: profileData.consultationFeesRange || 'N/A',
        address: profileData.address ? `${profileData.address}, ${profileData.city}, ${profileData.state} - ${profileData.pincode}` : 'Address not available',
        education: profileData.educationalQualifications ? profileData.educationalQualifications.join(', ') : 'N/A',
        avatar: profileData.profilePicture || '',
        phoneNumber: profileData.phoneNumber || '',
        email: profileData.email || '',
        gender: profileData.gender || '',
        licenseNumber: profileData.licenseNumber || '',
        hasTelemedicineExperience: profileData.hasTelemedicineExperience || false,
        consultationTypes: profileData.consultationTypes || [],
        insurancePartners: profileData.insurancePartners || [],
        otherFacilities: profileData.otherFacilities || [],
        clinicPhotos: profileData.clinicPhotos || [],
        location: profileData.location || '',
        nearbyLandmark: profileData.nearbyLandmark || '',
        floor: profileData.floor || '',
        hasLiftAccess: profileData.hasLiftAccess || false,
        hasWheelchairAccess: profileData.hasWheelchairAccess || false,
        hasParking: profileData.hasParking || false,
        consultationDays: profileData.consultationDays || [],
        consultationTimeSlots: profileData.consultationTimeSlots || [],
        // Keep original fields for backward compatibility
        ...profileData
      };
      
      console.log('Mapped doctor data:', mappedDoctorData);
      
      // Update the doctorData with mapped profile
      setDoctorData(mappedDoctorData);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      // Don't show error to user, just log it
    } finally {
      setLoadingDoctorProfile(false);
    }
  };

  // Get current user on component mount
  useEffect(() => {
    const userData = getUserData();
    const userId = getUserId();
    setCurrentUser({ ...userData, uid: userId });
  }, []);

  // Fetch doctor profile when component mounts or vendorId changes
  useEffect(() => {
    fetchDoctorProfile();
  }, [vendorId]);

  // Fetch timeslots when date is selected
  useEffect(() => {
    if (selectedDate && vendorId) {
      fetchTimeslots(selectedDate.full.toISOString().split('T')[0]);
    }
  }, [selectedDate, vendorId]);

  const fetchTimeslots = async (date) => {
    try {
      setLoadingTimeslots(true);
      const data = await doctorConsultationService.getTimeslots(vendorId, date);
      setTimeslotsData(data);
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      setTimeslotsData(null);
    } finally {
      setLoadingTimeslots(false);
    }
  };

  const fetchHealthRecords = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoadingHealthRecords(true);
      const data = await getHealthRecordsForAppointment(currentUser.uid);
      setHealthRecords(data);
    } catch (error) {
      console.error('Error fetching health records:', error);
      setHealthRecords([]);
    } finally {
      setLoadingHealthRecords(false);
    }
  };

  const faqs = [
    {
      question: "What should I bring to my appointment?",
      answer: "Please bring your ID, insurance card, list of current medications, and any relevant medical records or test results."
    },
    {
      question: "What if I need to reschedule?",
      answer: "You can reschedule your appointment up to 24 hours before the scheduled time without any charges."
    },
    {
      question: "How long will the consultation take?",
      answer: "Most consultations last between 15-30 minutes, depending on the complexity of your case."
    }
  ];

  // Generate dates for the next 7 days
  const getDates = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        full: date
      });
    }
    return dates;
  };

  // Generate time slots from 10:00 to 17:00 with 30-minute intervals
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour < 17; hour++) {
      slots.push(`${hour}:00 - ${hour}:30`);
      slots.push(`${hour}:30 - ${hour + 1}:00`);
    }
    return slots;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleShareHealthRecords = () => {
    setShowHealthRecordsModal(true);
    fetchHealthRecords();
  };

  const handleHealthRecordToggle = (recordId) => {
    setSelectedHealthRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleCloseHealthRecordsModal = () => {
    setShowHealthRecordsModal(false);
    setSelectedHealthRecords([]);
    setSearchQuery('');
  };

  const handleConfirmHealthRecords = () => {
    setShowHealthRecordsModal(false);
  };

  // Filter health records based on search query
  const filteredHealthRecords = healthRecords.filter(record =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallDoctor = () => {
    // Check if doctor has a phone number
    if (doctorData.phoneNumber) {
      // Create a phone call link
      window.open(`tel:${doctorData.phoneNumber}`, '_self');
    } else {
      // Show a message or modal if no phone number is available
      setDialogContent({
        type: 'error',
        message: 'Phone Number Not Available',
        details: {
          error: 'Doctor contact number is not available. Please book an appointment to get in touch.'
        }
      });
      setShowDialog(true);
    }
  };

  const handleAppointmentBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || isProcessing) return;

    setIsProcessing(true);

    // The time slot from API is already in the correct format (e.g., "14:30")
    const formattedTime = selectedTimeSlot;

    const appointmentData = {
      doctorId: vendorId,
      vendorId: vendorId,
      doctorName: doctorData.name,
      selectedDate: selectedDate.full.toISOString().split('T')[0],
      selectedTimeSlot: formattedTime,
      consultationFee: parseInt(doctorData.consultationFee),
      isOnline: location.pathname.includes('/doctor-consultation/online'),
      reason: "General consultation",
      healthRecordIds: selectedHealthRecords
    };

    console.log('Preparing appointment data:', appointmentData);

    try {
      await doctorAppointmentPaymentService.processPayment(
        appointmentData,
        (response) => {
          console.log('Appointment created successfully:', response);
          setIsProcessing(false);
          setDialogContent({
            type: 'success',
            message: 'Appointment Confirmed!',
            details: {
              doctorName: doctorData.name,
              date: selectedDate.full.toLocaleDateString(),
              time: selectedTimeSlot,
              fee: doctorData.consultationFee,
              mode: appointmentData.isOnline ? 'Online Consultation' : 'In-Person Visit',
              appointmentId: response.appointmentId
            }
          });
          setShowDialog(true);
        },
        (error) => {
          console.error('Appointment creation failed:', error);
          setIsProcessing(false);
          setDialogContent({
            type: 'error',
            message: 'Appointment Booking Failed',
            details: {
              error: error.toString()
            }
          });
          setShowDialog(true);
        }
      );
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      setDialogContent({
        type: 'error',
        message: 'Payment Processing Failed',
        details: {
          error: 'Failed to process payment. Please try again.'
        }
      });
      setShowDialog(true);
    }
  };

  if (!doctorData && loadingDoctorProfile) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Loading doctor profile...</div>
      </div>
    );
  }

  if (!doctorData) {
    return <div className="error-message">No doctor data available</div>;
  }

  return (
    <div className="book-appointment-layout">
      {/* Left Column - Booking Form (60%) */}
      <div className="booking-content">
        <div className="book-appointment-container">
          {/* Doctor Info Header */}
          <div className="doctor-header">
            <div className="doctor-header-content">
              <img 
              src={doctorData.avatar} 
              alt={doctorData.name} 
              className="doctor-avatar"
              onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
            />
            <div className="doctor-info">
              <h2>{doctorData.name || 'Dr. Unknown'}</h2>
              <p>{doctorData.specialty || 'General Medicine'}</p>
              <div className="doctor-stats">
                <span>{doctorData.experience || 'N/A'} yrs exp</span>
                <span>₹{doctorData.consultationFee || 'N/A'}</span>
              </div>
            </div>
            </div>
            <div className="doctor-actions">
              <button 
                className="call-doctor-btn"
                onClick={() => handleCallDoctor()}
                title="Call Doctor"
              >
                <i className="fas fa-phone"></i>
                Call Doctor
              </button>
            </div>
          </div>

          {/* Doctor Stats */}
          <div className="doctor-quick-stats">
            <div className="stat-item address-stat">
              <i className="fas fa-map-marker-alt"></i>
              <p>Address</p>
              <div className="address-content">
                <p>{doctorData.address || 'Address not available'}</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-language"></i>
              <p>Languages</p>
              <h3>{doctorData.languages ? doctorData.languages.split(',').length : 0}</h3>
            </div>
            <div className="stat-item">
              <i className="fas fa-graduation-cap"></i>
              <p>Experience</p>
              <h3>{doctorData.experience} yrs</h3>
            </div>
            <div className="stat-item">
              <i className="fas fa-video"></i>
              <p>Telemedicine</p>
              <h3>{doctorData.hasTelemedicineExperience ? 'Yes' : 'No'}</h3>
            </div>
          </div>

          {/* About Doctor */}
          <div className="about-doctor">
            <h3>About Doctor</h3>
            <p>
              Dr. {doctorData.name || 'Unknown'} is a specialist in {doctorData.specialty || 'General Medicine'} with {doctorData.experience || 'N/A'} years of experience. 
              {doctorData.languages && ` They are proficient in ${doctorData.languages}.`}
              {doctorData.education && ` They have qualifications in ${doctorData.education}.`}
            </p>
          </div>

          {/* Specializations */}
          <div className="doctor-specializations">
            <h3>Specializations</h3>
            <div className="specialty-chips">
              {doctorData.specialty ? doctorData.specialty.split(',').map((spec, index) => (
                <span key={index} className="specialty-chip">
                  <i className="fas fa-stethoscope"></i>
                  {spec.trim()}
                </span>
              )) : (
                <span className="specialty-chip">
                  <i className="fas fa-stethoscope"></i>
                  General Medicine
                </span>
              )}
            </div>
          </div>

          {/* Additional Doctor Information */}
          <div className="doctor-additional-info">
            <h3>Additional Information</h3>
            
            {/* Education & Qualifications */}
            {doctorData.education && doctorData.education !== 'N/A' && (
              <div className="info-section">
                <h4><i className="fas fa-graduation-cap"></i> Education & Qualifications</h4>
                <p>{doctorData.education}</p>
              </div>
            )}

            {/* License Information */}
            {doctorData.licenseNumber && (
              <div className="info-section">
                <h4><i className="fas fa-certificate"></i> Medical License</h4>
                <p>License Number: {doctorData.licenseNumber}</p>
              </div>
            )}

            {/* Consultation Types */}
            {doctorData.consultationTypes && doctorData.consultationTypes.length > 0 && (
              <div className="info-section">
                <h4><i className="fas fa-video"></i> Available Consultation Types</h4>
                <div className="consultation-types">
                  {doctorData.consultationTypes.map((type, index) => (
                    <span key={index} className={`consultation-type ${type.toLowerCase()}`}>
                      <i className={`fas fa-${type.toLowerCase() === 'online' ? 'video' : 'user'}`}></i>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Partners */}
            {doctorData.insurancePartners && doctorData.insurancePartners.length > 0 && (
              <div className="info-section">
                <h4><i className="fas fa-shield-alt"></i> Insurance Partners</h4>
                <div className="insurance-partners">
                  {doctorData.insurancePartners.map((partner, index) => (
                    <span key={index} className="insurance-partner">
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Clinic Facilities */}
            {doctorData.otherFacilities && doctorData.otherFacilities.length > 0 && (
              <div className="info-section">
                <h4><i className="fas fa-building"></i> Clinic Facilities</h4>
                <div className="facilities">
                  {doctorData.otherFacilities.map((facility, index) => (
                    <span key={index} className="facility">
                      <i className="fas fa-check"></i>
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Accessibility Features */}
            <div className="info-section">
              <h4><i className="fas fa-universal-access"></i> Accessibility</h4>
              <div className="accessibility-features">
                {doctorData.hasLiftAccess && (
                  <span className="accessibility-feature">
                    <i className="fas fa-elevator"></i>
                    Lift Access
                  </span>
                )}
                {doctorData.hasWheelchairAccess && (
                  <span className="accessibility-feature">
                    <i className="fas fa-wheelchair"></i>
                    Wheelchair Access
                  </span>
                )}
                {doctorData.hasParking && (
                  <span className="accessibility-feature">
                    <i className="fas fa-parking"></i>
                    Parking Available
                  </span>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="info-section">
              <h4><i className="fas fa-phone"></i> Contact Information</h4>
              <div className="contact-info">
                {doctorData.phoneNumber && (
                  <p><strong>Phone:</strong> {doctorData.phoneNumber}</p>
                )}
                {doctorData.email && (
                  <p><strong>Email:</strong> {doctorData.email}</p>
                )}
                {doctorData.nearbyLandmark && (
                  <p><strong>Nearby Landmark:</strong> {doctorData.nearbyLandmark}</p>
                )}
                {doctorData.floor && (
                  <p><strong>Floor:</strong> {doctorData.floor}</p>
                )}
              </div>
            </div>
          </div>

          {/* Book Appointment Section */}
          <div className="appointment-section">
            <h3>Book Appointment</h3>
            
            {/* Date Selection */}
            <div className="date-selector">
              <h4>Select Date</h4>
              <div className="dates-list">
                {getDates().map((date, index) => (
                  <div 
                    key={index}
                    className={`date-item ${selectedDate && 
                      date.date === selectedDate.date && 
                      date.month === selectedDate.month ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <span className="day">{date.day}</span>
                    <span className="date">{date.date}</span>
                    <span className="month">{date.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="slots-section">
              <h3>Available Time Slots</h3>
              {loadingTimeslots ? (
                <div className="loading-timeslots">Loading available slots...</div>
              ) : timeslotsData ? (
                <div className="slots-grid">
                  {timeslotsData.availableSlots.map((slot, index) => {
                    // Convert slot time to match booked time format for comparison
                    const slotTimeFormatted = slot.includes(':') && slot.split(':').length === 2 
                      ? `${slot}:00` 
                      : slot;
                    
                    const isBooked = timeslotsData.bookedSlots.some(booked => booked.time === slotTimeFormatted);
                    const isBookedByUser = isBooked && timeslotsData.bookedSlots.find(booked => booked.time === slotTimeFormatted)?.userId === currentUser?.uid;
                    
                    return (
                      <div
                        key={index}
                        className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''} ${isBooked ? 'booked' : 'available'}`}
                        onClick={() => !isBooked && handleTimeSlotSelect(slot)}
                        style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
                      >
                        <span className="slot-time">{slot}</span>
                        {isBooked && (
                          <span className={`slot-badge ${isBookedByUser ? 'booked-by-user' : 'booked-by-others'}`}>
                            {isBookedByUser ? 'Booked by you' : 'Booked'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : selectedDate ? (
                <div className="no-timeslots">No time slots available for this date</div>
              ) : (
                <div className="select-date-message">Please select a date to view available time slots</div>
              )}
            </div>
          </div>

          {/* Consultation Fee */}
          <div className="consultation-fee">
            <span>Consultation Fee</span>
            <span>₹{doctorData.consultationFee || 'N/A'}</span>
          </div>

          {/* Share Health Records Button */}
          <button 
            className="share-health-records-btn"
            onClick={handleShareHealthRecords}
            disabled={isProcessing}
          >
            <i className="fas fa-share-alt"></i>
            Share Health Records
            {selectedHealthRecords.length > 0 && (
              <span className="selected-count">({selectedHealthRecords.length} selected)</span>
            )}
          </button>

          {/* Confirm Button */}
          <button 
            className={`confirm-btn ${selectedDate && selectedTimeSlot && !isProcessing ? 'active' : 'disabled'}`}
            disabled={!selectedDate || !selectedTimeSlot || isProcessing}
            onClick={handleAppointmentBooking}
          >
            {isProcessing ? 'Processing...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>

      {/* Right Column - Informative Content (40%) */}
      <div className="info-sidebar">
        {/* Health Blog Posts */}
        <div className="info-section">
          <h3>Health & Wellness Blog</h3>
          <div className="blog-posts">
            {blogPosts.map((post, index) => (
              <a key={index} href={post.link} className="blog-post-link">
                <div className="blog-post">
                  <h4>{post.title}</h4>
                  <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="info-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faqs">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <h4>{faq.question}</h4>
                  <i className={`fas fa-chevron-${expandedFaq === index ? 'up' : 'down'}`}></i>
                </div>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="info-section">
          <h3>Helpful Resources</h3>
          <div className="resources">
            <a href="#" className="resource-link">
              <i className="fas fa-file-medical"></i>
              Patient Guidelines
            </a>
            <a href="#" className="resource-link">
              <i className="fas fa-pills"></i>
              Medication Information
            </a>
            <a href="#" className="resource-link">
              <i className="fas fa-hospital"></i>
              Hospital Facilities
            </a>
          </div>
        </div>
      </div>
      
      {/* Health Records Modal/Bottomsheet */}
      <Drawer
        open={showHealthRecordsModal}
        onClose={handleCloseHealthRecordsModal}
        anchor={isMdUp ? 'right' : 'bottom'}
        ModalProps={{
          keepMounted: true,
          BackdropProps: { invisible: true, sx: { backgroundColor: 'transparent' } }
        }}
        PaperProps={{
          sx: {
            top: isMdUp ? 64 : 'auto',
            height: isMdUp ? `calc(100vh - 64px)` : 'auto',
            maxHeight: isMdUp ? `calc(100vh - 64px)` : `calc(100vh - 100px)`,
            width: isMdUp ? 400 : '100%',
            borderRadius: isMdUp ? '24px 0 0 24px' : '24px 24px 0 0',
            zIndex: 1300 // Higher than bottom navigation
          }
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, height: '100%', overflowY: 'auto' }}>
          {/* Compact Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>
              Share Health Records
            </Typography>
            <IconButton onClick={handleCloseHealthRecordsModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search Box */}
          {healthRecords.length > 0 && (
            <Box mb={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search health records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {/* Content */}
          {loadingHealthRecords ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Loading health records...
              </Typography>
            </Box>
          ) : healthRecords.length === 0 ? (
            <Box textAlign="center" py={4}>
              <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Health Records Found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Upload your medical documents to share them with doctors.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/health-records')}
                startIcon={<DescriptionIcon />}
              >
                Upload Health Records
              </Button>
            </Box>
          ) : filteredHealthRecords.length === 0 ? (
            <Box textAlign="center" py={4}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Records Found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                No health records match your search criteria.
              </Typography>
              <Button variant="outlined" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </Box>
          ) : (
            <Box>
              {/* Selection Summary */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {selectedHealthRecords.length} of {filteredHealthRecords.length} selected
                </Typography>
                {selectedHealthRecords.length > 0 && (
                  <Button 
                    size="small" 
                    onClick={() => setSelectedHealthRecords([])}
                    sx={{ textTransform: 'none' }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>

              {/* Records List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {filteredHealthRecords.map((record) => (
                  <Card 
                    key={record.healthRecordId}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedHealthRecords.includes(record.healthRecordId) ? 2 : 1,
                      borderColor: selectedHealthRecords.includes(record.healthRecordId) ? 'primary.main' : 'divider',
                      bgcolor: selectedHealthRecords.includes(record.healthRecordId) ? 'primary.50' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50'
                      }
                    }}
                    onClick={() => handleHealthRecordToggle(record.healthRecordId)}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Checkbox
                          checked={selectedHealthRecords.includes(record.healthRecordId)}
                          size="small"
                        />
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {record.name}
                          </Typography>
                          <Chip 
                            label={record.type.replace('_', ' ').toUpperCase()} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mt: 0.5, fontSize: '0.7rem' }}
                          />
                        </Box>
                        <DescriptionIcon color="primary" />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Compact Footer */}
        {healthRecords.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box display="flex" gap={1}>
              <Button 
                variant="outlined" 
                onClick={handleCloseHealthRecordsModal}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={handleConfirmHealthRecords}
                disabled={selectedHealthRecords.length === 0}
                startIcon={<ShareIcon />}
                sx={{ flex: 1 }}
              >
                Share {selectedHealthRecords.length} Record{selectedHealthRecords.length !== 1 ? 's' : ''}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Add Dialog */}
      {showDialog && (
        <div className="appointment-dialog-overlay">
          <div className={`appointment-dialog ${dialogContent.type}`}>
            <div className="dialog-header">
              <h2>{dialogContent.message}</h2>
              <button className="close-btn" onClick={() => {
                setShowDialog(false);
                if (dialogContent.type === 'success') {
                  navigate('/order-history');
                }
              }}>×</button>
            </div>
            
            {dialogContent.type === 'success' ? (
              <div className="dialog-content">
                <div className="appointment-details">
                  <p><strong>Doctor:</strong> {dialogContent.details.doctorName}</p>
                  <p><strong>Date:</strong> {dialogContent.details.date}</p>
                  <p><strong>Time:</strong> {dialogContent.details.time}</p>
                  <p><strong>Fees Paid:</strong> ₹{dialogContent.details.fee}</p>
                  <p><strong>Mode:</strong> {dialogContent.details.mode}</p>
                  <p><strong>Appointment ID:</strong> {dialogContent.details.appointmentId}</p>
                  <div className="important-note">
                    <i className="fas fa-info-circle"></i>
                    <p>Please arrive 10 minutes before your scheduled appointment time.</p>
                  </div>
                </div>
                <button className="primary-btn" onClick={() => navigate('/order-history')}>
                  View My Appointments
                </button>
              </div>
            ) : (
              <div className="dialog-content error">
                <p>{dialogContent.details.error}</p>
                <button className="primary-btn" onClick={() => setShowDialog(false)}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Rest of the existing components */}
    </div>
  );
};

export default BookDoctorAppointment; 