import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaFlask, FaUser, FaArrowLeft, FaCloudUploadAlt, FaFileImage } from 'react-icons/fa';
import labTestPaymentService from '../../../services/payment/lab-test-payment.service';
import PaymentSuccessDialog from './PaymentSuccessDialog';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import './BookLabTestAppt.css';

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

const BookLabTestAppt = () => {
  const { labId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lab = location.state?.lab;

  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [reportDelivery, setReportDelivery] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  if (!lab) {
    return (
      <div className="book-lab-page">
        <div className="book-lab-header">
          <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <h2>Lab Not Found</h2>
        </div>
        <p style={{ margin: '2rem 0', color: '#ef4444' }}>Sorry, we couldn't find the lab details. Please go back and try again.</p>
      </div>
    );
  }

  const handleTestToggle = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleTimeSelect = (slot) => setSelectedTime(slot);
  
  const handlePrescriptionChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescription(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      setPrescription(URL.createObjectURL(files[0]));
    }
  };

  const validateForm = () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one test.');
      return false;
    }
    if (!selectedDate) {
      alert('Please select a date.');
      return false;
    }
    if (!selectedTime) {
      alert('Please select a time slot.');
      return false;
    }
    return true;
  };

  const handleBook = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Get vendorId and userId for console logging
    const vendorId = lab.vendorId; // Use the actual vendorId from lab data
    const userId = getUserId();

    console.log('🔍 Booking Lab Test Appointment:');
    console.log('📋 Vendor ID:', vendorId);
    console.log('👤 User ID:', userId);
    console.log('👤 Lab Name:', lab.name);


    try {
      const appointmentData = {
        appointmentId: `LAB_${Date.now()}`,
        labId: labId,
        vendorId: lab.vendorId, // Pass the vendorId from lab data
        labName: lab.name,
        selectedTests: selectedTests,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        homeCollection: homeCollection,
        reportDelivery: reportDelivery,
        prescription: prescription
      };

      await labTestPaymentService.processPayment(
        appointmentData,
        (successData) => {
          setPaymentData(successData);
          setShowSuccessDialog(true);
          setIsSubmitting(false);
        },
        (error) => {
          alert(`Payment failed: ${error}`);
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-lab-page wider">
      <div className="lab-header-card">
        <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <div className="lab-header-main">
          <div className="lab-header-img-wrap">
            {lab.image && !imageError ? (
              <img 
                src={lab.image} 
                alt={lab.name} 
                className="lab-header-img" 
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="lab-header-fallback">
                <FaUser size={38} />
              </div>
            )}
          </div>
          <div className="lab-header-info">
            <h2>{lab.name}</h2>
            <div className="lab-header-meta">
              <span className="lab-header-address">{lab.address}</span>
              <span className="lab-header-contact">{lab.phone}</span>
            </div>
            <div className="lab-header-tags">
              <span className="lab-header-owner">Owner: {lab.ownerName || 'N/A'}</span>
              <span className="lab-header-services">{lab.services ? lab.services.slice(0, 3).join(', ') : 'N/A'}{lab.services && lab.services.length > 3 ? '...' : ''}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="book-lab-content wider">
        {/* Test Selection */}
        <div className="section">
          <h4>Select Tests</h4>
          <div className="test-list">
            {lab.services && lab.services.map((test, idx) => (
              <label key={idx} className="test-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test)}
                  onChange={() => handleTestToggle(test)}
                />
                {test}
              </label>
            ))}
          </div>
        </div>
        {/* Date & Time Selection */}
        <div className="section">
          <h4>Select Date & Time</h4>
          <input type="date" value={selectedDate} onChange={handleDateChange} className="date-input" />
          <div className="time-slots">
            {timeSlots.map(slot => (
              <button
                key={slot}
                className={`time-slot-btn${selectedTime === slot ? ' selected' : ''}`}
                onClick={() => handleTimeSelect(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
        {/* Collection Method */}
        <div className="section">
          <h4>Collection Method</h4>
          <div className="collection-method-container">
            <label className="switch-row">
              <input type="checkbox" checked={homeCollection} onChange={e => setHomeCollection(e.target.checked)} />
              <span>Home Sample Collection</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" checked={reportDelivery} onChange={e => setReportDelivery(e.target.checked)} />
              <span>Report Delivery at Home</span>
            </label>
          </div>
        </div>
        {/* Prescription Upload */}
        <div className="section">
          <h4>Upload Prescription</h4>
          <div 
            className={`prescription-upload-area ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePrescriptionChange}
              className="prescription-file-input"
              id="prescription-upload"
            />
            <label htmlFor="prescription-upload" className="prescription-upload-label">
              <div className="upload-icon">
                <FaCloudUploadAlt size={48} />
              </div>
              <div className="upload-text">
                <h5>Upload Prescription</h5>
                <p>Drag & drop your prescription image here or click to browse</p>
                <span className="upload-hint">Supports: JPG, PNG, PDF (Max 5MB)</span>
              </div>
            </label>
          </div>
          {prescription && (
            <div className="prescription-preview">
              <div className="prescription-preview-content">
                <div className="prescription-preview-icon">
                  <FaFileImage size={24} />
                </div>
                <div className="prescription-preview-info">
                  <h6>Prescription Uploaded</h6>
                  <p>Image successfully uploaded</p>
                </div>
                <button onClick={() => setPrescription(null)} className="remove-prescription">
                  Remove
                </button>
              </div>
              <img src={prescription} alt="Prescription Preview" className="prescription-preview-img" />
            </div>
          )}
        </div>
        {/* Book Button */}
        <button className="book-btn" onClick={handleBook} disabled={isSubmitting}>
          {isSubmitting ? 'Processing Payment...' : 'Book Appointment'}
        </button>
      </div>

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog 
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        paymentData={paymentData}
      />
    </div>
  );
};

export default BookLabTestAppt; 