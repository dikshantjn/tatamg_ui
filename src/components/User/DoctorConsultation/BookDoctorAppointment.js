import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './BookDoctorAppointment.css';
import doctorAppointmentPaymentService from '../../../services/payment/doctor-appointment-payment.service';

const BookDoctorAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { doctorData } = location.state || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    type: '', // 'success' or 'error'
    message: '',
    details: {}
  });

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

  const handleAppointmentBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || isProcessing) return;

    setIsProcessing(true);

    // Format the time slot to extract just the start time (e.g., "14:30" from "14:30 - 15:00")
    const formattedTime = selectedTimeSlot.split(' - ')[0];

    const appointmentData = {
      doctorId: vendorId,
      vendorId: vendorId,
      doctorName: doctorData.name,
      selectedDate: selectedDate.full.toISOString().split('T')[0],
      selectedTimeSlot: formattedTime,
      consultationFee: parseInt(doctorData.consultationFee),
      isOnline: location.pathname.includes('/doctor-consultation/online'),
      reason: "General consultation"
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
            <img 
              src={doctorData.avatar} 
              alt={doctorData.name} 
              className="doctor-avatar"
              onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
            />
            <div className="doctor-info">
              <h2>{doctorData.name}</h2>
              <p>{doctorData.specialty}</p>
              <div className="doctor-stats">
                <span>{doctorData.experience} yrs exp</span>
                <span>₹{doctorData.consultationFee}</span>
              </div>
            </div>
          </div>

          {/* Doctor Stats */}
          <div className="doctor-quick-stats">
                    <div className="stat-item address-stat">
          <i className="fas fa-map-marker-alt"></i>
          <p>Address</p>
          <div className="address-content">
            <p>{doctorData.address}</p>
          </div>
        </div>
            <div className="stat-item">
              <i className="fas fa-language"></i>
              <p>Languages</p>
              <h3>{doctorData.languages.split(',').length}</h3>
            </div>
            <div className="stat-item">
              <i className="fas fa-star"></i>
              <p>Rating</p>
              <h3>4.8</h3>
            </div>
          </div>

          {/* About Doctor */}
          <div className="about-doctor">
            <h3>About Doctor</h3>
            <p>
              Dr. {doctorData.name} is a specialist in {doctorData.specialty} with {doctorData.experience} years of experience. 
              They are proficient in {doctorData.languages} and have qualifications in {doctorData.education}.
            </p>
          </div>

          {/* Specializations */}
          <div className="doctor-specializations">
            <h3>Specializations</h3>
            <div className="specialty-chips">
              {doctorData.specialty.split(',').map((spec, index) => (
                <span key={index} className="specialty-chip">
                  <i className="fas fa-stethoscope"></i>
                  {spec.trim()}
                </span>
              ))}
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
              <div className="slots-grid">
                {getTimeSlots().map((slot, index) => (
                  <div
                    key={index}
                    className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSlotSelect(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consultation Fee */}
          <div className="consultation-fee">
            <span>Consultation Fee</span>
            <span>₹{doctorData.consultationFee}</span>
          </div>

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