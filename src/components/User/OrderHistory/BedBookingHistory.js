import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './BedBookingHistory.css';

const BedBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await orderHistoryService.getCompletedBedBookings();
            
            if (response.success) {
                const formattedBookings = response.data.map(booking => 
                    orderHistoryService.formatBedBookingData(booking)
                );
                setBookings(formattedBookings);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error fetching bed bookings:', error);
            setError('Failed to fetch bed bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsSidePanelOpen(true);
    };

    const handleCloseSidePanel = () => {
        setIsSidePanelOpen(false);
        setSelectedBooking(null);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#F59E0B',
            confirmed: '#10B981',
            completed: '#10B981',
            cancelled: '#EF4444',
            rescheduled: '#6366F1'
        };
        return statusColors[status.toLowerCase()] || '#6B7280';
    };

    const renderBookingCard = (booking) => {
        return (
            <div key={booking.id} className="bed-booking-card">
                <div className="booking-header">
                    <div className="booking-status">
                        <span className="status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>
                            {booking.status}
                        </span>
                    </div>
                </div>

                <div className="booking-content">
                    <div className="hospital-info">
                        <h4>{booking.hospital.name}</h4>
                        <p className="booking-datetime">
                            {formatDate(booking.date)} - {booking.timeSlot}
                        </p>
                        <p className="hospital-address">
                            {booking.hospital.address}, {booking.hospital.city}, {booking.hospital.state}
                        </p>
                    </div>

                    <div className="booking-details">
                        <div className="detail-row">
                            <span className="detail-label">Bed Type:</span>
                            <span className="detail-value">{booking.bedType}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Payment Status:</span>
                            <span className="detail-value">{booking.paymentStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="booking-footer">
                    <div className="booking-amount">
                        <span className="amount-label">Paid Amount:</span>
                        <span className="amount-value">{formatCurrency(booking.paidAmount)}</span>
                    </div>
                    <div className="booking-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => handleViewDetails(booking)}
                        >
                            View Details
                        </button>
                        <button className="action-btn secondary">
                            Book Again
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSidePanel = () => {
        if (!selectedBooking) return null;

        return (
            <div className={`side-panel-overlay ${isSidePanelOpen ? 'active' : ''}`} onClick={handleCloseSidePanel}>
                <div className="side-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="side-panel-header">
                        <h2>Booking Details</h2>
                        <button className="close-btn" onClick={handleCloseSidePanel}>×</button>
                    </div>

                    <div className="side-panel-content">
                        <div className="booking-summary">
                            <div className="booking-basic-info">
                                <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedBooking.status) }}>
                                    {selectedBooking.status}
                                </span>
                            </div>

                            <div className="hospital-details">
                                <h4>Hospital Information</h4>
                                <div className="hospital-info-detail">
                                    <h5>{selectedBooking.hospital.name}</h5>
                                    <p className="booking-datetime">
                                        {formatDate(selectedBooking.date)} - {selectedBooking.timeSlot}
                                    </p>
                                    <p className="hospital-address">
                                        {selectedBooking.hospital.address}, {selectedBooking.hospital.city}, {selectedBooking.hospital.state}
                                    </p>
                                    <div className="contact-info">
                                        <p>Contact: {selectedBooking.hospital.contactNumber}</p>
                                        <p>Email: {selectedBooking.hospital.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-info-detail">
                                <h4>Booking Information</h4>
                                <div className="info-row">
                                    <span className="label">Bed Type:</span>
                                    <span className="value">{selectedBooking.bedType}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment Status:</span>
                                    <span className="value">{selectedBooking.paymentStatus}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Paid Amount:</span>
                                    <span className="value">{formatCurrency(selectedBooking.paidAmount)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Booking Created:</span>
                                    <span className="value">{formatDate(selectedBooking.createdAt)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Last Updated:</span>
                                    <span className="value">{formatDate(selectedBooking.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-panel-footer">
                        <button className="book-again-btn">
                            Book Another Bed
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bed-bookings-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your bed bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bed-bookings-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Bookings</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchBookings}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bed-bookings-container">
            <div className="bookings-section">
                {bookings.length > 0 ? (
                    <div className="bookings-grid">
                        {bookings.map((booking) => renderBookingCard(booking))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🏥</div>
                        <h3>No Bed Bookings Found</h3>
                        <p>You haven't booked any hospital beds yet.</p>
                        <button className="browse-btn">Book Hospital Bed</button>
                    </div>
                )}
            </div>

            {renderSidePanel()}
        </div>
    );
};

export default BedBookingHistory; 