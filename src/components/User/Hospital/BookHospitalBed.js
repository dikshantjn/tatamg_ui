import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiCalendar, FiInfo, FiAward, FiBriefcase, FiStar, FiHeart, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { hospitalService } from '../../../services/User/Hospital/hospital.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import './BookHospitalBed.css';

const BookHospitalBed = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ type: '', message: '' });
    const [bookingInProgress, setBookingInProgress] = useState(false);

    // Time slots
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    useEffect(() => {
        fetchHospitalAndWards();
    }, [vendorId]);

    const fetchHospitalAndWards = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch hospital data
            const hospitals = await hospitalService.getAllHospitals();
            const hospitalData = hospitals.find(h => h.vendorId === vendorId);
            
            if (!hospitalData) {
                throw new Error('Hospital not found');
            }
            
            setHospital(hospitalData);

            // Fetch wards data
            const wardsData = await hospitalService.getHospitalWards(vendorId);
            setWards(wardsData);
        } catch (err) {
            setError('Failed to fetch hospital details. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalAmount = () => {
        if (!selectedWard) return 0;
        return selectedWard.pricePerDay;
    };

    const handleBookingConfirmation = async () => {
        try {
            setBookingInProgress(true);
            
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated. Please login to continue.');
            }
            
            const bookingData = {
                vendorId: hospital.vendorId,  // Using hospitalId as vendorId
                userId: userId,
                hospitalId: hospital.vendorId,
                wardId: selectedWard.wardId,
                bedType: selectedWard.name,
                price: parseFloat(selectedWard.pricePerDay),
                paidAmount: 0.0,
                paymentStatus: 'pending',
                bookingDate: new Date(selectedDate).toISOString().split('T')[0],
                timeSlot: selectedTime,
                selectedDoctorId: vendorId,
                status: 'pending'
            };

            // Detailed logging of each field
            console.log('🔍 Detailed Booking Data:');
            console.log('vendorId:', bookingData.vendorId);
            console.log('userId:', bookingData.userId);
            console.log('hospitalId:', bookingData.hospitalId);
            console.log('wardId:', bookingData.wardId);
            console.log('bedType:', bookingData.bedType);
            console.log('price:', bookingData.price, typeof bookingData.price);
            console.log('paidAmount:', bookingData.paidAmount, typeof bookingData.paidAmount);
            console.log('paymentStatus:', bookingData.paymentStatus);
            console.log('bookingDate:', bookingData.bookingDate);
            console.log('timeSlot:', bookingData.timeSlot);
            console.log('selectedDoctorId:', bookingData.selectedDoctorId);
            console.log('status:', bookingData.status);

            console.log("📤 Complete booking data object:", JSON.stringify(bookingData, null, 2));
            
            const response = await hospitalService.createBedBooking(bookingData);
            console.log("📥 Booking response:", response);
            
            if (response.success) {
                setDialogContent({
                    type: 'success',
                    message: response.message,
                    bookingId: response.data.booking.bedBookingId
                });
                setShowDialog(true);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error("❌ Booking error:", err);
            setDialogContent({
                type: 'error',
                message: err.message || 'Failed to create booking. Please try again.'
            });
            setShowDialog(true);
        } finally {
            setBookingInProgress(false);
        }
    };

    const renderDialog = () => {
        if (!showDialog) return null;

        return (
            <div className="dialog-overlay">
                <div className="modern-dialog">
                    {dialogContent.type === 'success' ? (
                        <div className="dialog-content success">
                            <div className="dialog-icon">
                                <FiCheckCircle className="success-icon" />
                            </div>
                            <h2>Booking Request Sent!</h2>
                            <div className="booking-info">
                                <p>Your bed booking request has been successfully submitted.</p>
                                <div className="status-message">
                                    <FiInfo className="info-icon" />
                                    <p>Please wait for the hospital to review and approve your request. 
                                    You will be notified once the hospital confirms your booking.</p>
                                </div>
                            </div>
                            <div className="dialog-buttons">
                                <button className="go-back-button" onClick={() => navigate(-1)}>
                                    Go Back
                                </button>
                                <button className="close-button" onClick={() => setShowDialog(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="dialog-content error">
                            <div className="dialog-icon">
                                <FiAlertCircle className="error-icon" />
                            </div>
                            <h2>Booking Failed</h2>
                            <p>{dialogContent.message}</p>
                            <div className="dialog-buttons">
                                <button className="go-back-button" onClick={() => navigate(-1)}>
                                    Go Back
                                </button>
                                <button className="close-button" onClick={() => setShowDialog(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading hospital details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <FiInfo size={48} />
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchHospitalAndWards}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="book-hospital-bed-container">
            {/* Hospital Info Section */}
            <section className="hospital-info-section">
                <div className="hospital-header">
                    <h2>{hospital.name}</h2>
                    <div className="hospital-badges">
                        <span className="badge">
                            <FiAward />
                            {hospital.generatedId}
                        </span>
                        <span className="badge">
                            <FiStar />
                            4.5/5 Rating
                        </span>
                        <span className="badge">
                            <FiHeart />
                            98% Success Rate
                        </span>
                    </div>
                </div>

                <div className="hospital-services">
                    <h3>Services & Facilities</h3>
                    <div className="services-grid">
                        {hospital.features?.map((feature, index) => (
                            <div key={index} className="service-item">
                                <FiBriefcase />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hospital-contact">
                    <h3>Location & Contact</h3>
                    <p><FiMapPin /> {hospital.address}</p>
                    <p><FiPhone /> {hospital.phone}</p>
                    <p><FiClock /> {hospital.openHours}</p>
                    <p><FiCalendar /> {hospital.workingDays}</p>
                </div>

                <div className="hospital-about">
                    <h3>About Hospital</h3>
                    <p>{hospital.type}</p>
                </div>
            </section>

            {/* Booking Section */}
            <section className="booking-section">
                <h3>Book Hospital Bed</h3>

                <div className="form-section">
                    <h4>Select Ward</h4>
                    <div className="wards-grid">
                        {wards.map(ward => (
                            <div
                                key={ward.wardId}
                                className={`ward-card ${selectedWard?.wardId === ward.wardId ? 'selected' : ''}`}
                                onClick={() => setSelectedWard(ward)}
                            >
                                <div className="ward-header">
                                    <h4>{ward.name}</h4>
                                    <span className="ward-type">{ward.wardType}</span>
                                </div>
                                <div className="ward-details">
                                    <p>₹{ward.pricePerDay}/day • {ward.availableBeds} available</p>
                                </div>
                                <div className="ward-facilities">
                                    {ward.facilities && Object.keys(ward.facilities)
                                        .filter(facility => ward.facilities[facility])
                                        .map((facility, index) => (
                                            <span key={index} className="facility">{facility}</span>
                                        ))}
                                    {ward.isAC && <span className="facility">AC</span>}
                                    {ward.hasAttachedBathroom && <span className="facility">Attached Bathroom</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h4>Select Date</h4>
                    <input
                        type="date"
                        className="date-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-section">
                    <h4>Select Time Slot</h4>
                    <div className="time-slots">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Booking Summary */}
                {selectedWard && (
                    <div className="booking-summary">
                        <h4>Booking Summary</h4>
                        <div className="summary-item">
                            <span>Ward Type</span>
                            <span>{selectedWard.name}</span>
                        </div>
                        <div className="summary-item">
                            <span>Price per Day</span>
                            <span>₹{selectedWard.pricePerDay}</span>
                        </div>
                        <div className="summary-item">
                            <span>Date</span>
                            <span>{selectedDate || 'Not selected'}</span>
                        </div>
                        <div className="summary-item">
                            <span>Time</span>
                            <span>{selectedTime || 'Not selected'}</span>
                        </div>
                        <div className="summary-item total">
                            <span>Total Amount</span>
                            <span>₹{calculateTotalAmount()}</span>
                        </div>
                    </div>
                )}

                <button
                    className="confirm-booking-btn"
                    disabled={!selectedWard || !selectedDate || !selectedTime || bookingInProgress}
                    onClick={handleBookingConfirmation}
                >
                    {bookingInProgress 
                        ? 'Creating Booking...' 
                        : selectedWard 
                            ? 'Confirm Booking' 
                            : 'Select a Ward to Continue'
                    }
                </button>
            </section>

            {/* Dialog */}
            {renderDialog()}
        </div>
    );
};

export default BookHospitalBed; 