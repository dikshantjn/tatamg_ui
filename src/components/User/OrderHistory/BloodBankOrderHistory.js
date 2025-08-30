import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './ProductOrderHistory.css';

const BloodBankOrderHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ setSelectedBooking] = useState(null);
    const [setIsSidePanelOpen] = useState(false);

    useEffect(() => {
        fetchCompletedBookings();
    }, []);

    const fetchCompletedBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderHistoryService.getCompletedBloodBankBookings();
            if (response.success) {
                setBookings(response.data);
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('Failed to fetch blood bank bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const renderBookingCard = (booking) => {
        const agency = booking.agency || {};
        const bloodRequest = booking.bloodRequest || {};
        const customerName = booking.customerName || bloodRequest.customerName || booking.user?.name || 'Anonymous';
        const bloodTypes = Array.isArray(bloodRequest.bloodType) ? bloodRequest.bloodType.join(', ') : (bloodRequest.bloodType || 'N/A');
        const units = bloodRequest.units || 'N/A';
        const formattedDate = booking.createdAt ? formatDate(booking.createdAt) : 'N/A';
        return (
            <div key={booking.bookingId} className="product-order-card bloodbank-order-card">
                <div className="order-header">
                    <div className="order-info">
                        <h3 className="order-number">Booking #{booking.bookingId?.slice(-8)}</h3>
                        <p className="order-date">Booked on {formattedDate}</p>
                    </div>
                    <div className="order-status">
                        <span className="status-badge delivered">Completed</span>
                    </div>
                </div>
                <div className="order-content">
                    <div className="order-items">
                        <h4>Blood Bank Details:</h4>
                        <div className="items-list">
                            <div className="item-card bloodbank-item-card">
                                <div className="item-details">
                                    <h5 className="item-name">Agency: {agency.agencyName || 'N/A'}</h5>
                                    <p className="item-category">Blood Types: {bloodTypes}</p>
                                    <p className="item-category">Units: {units}</p>
                                    <p className="item-category">Customer: {customerName}</p>
                                    <p className="item-category">Contact: {agency.phoneNumber || agency.contactNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-details">
                        <div className="detail-row">
                            <span className="detail-label">Completed On:</span>
                            <span className="detail-value">{formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div className="order-footer">
                    <div className="order-total">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-amount">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    {/* You can add a View Details button if you want a side panel */}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="product-orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your completed blood bank bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-orders-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Bookings</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchCompletedBookings}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-orders-container">
            <div className="orders-section">
                {bookings.length > 0 ? (
                    <div className="orders-grid">
                        {bookings.map((booking) => renderBookingCard(booking))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🩸</div>
                        <h3>No Completed Blood Bank Bookings Found</h3>
                        <p>You haven't completed any blood bank bookings yet.</p>
                        <button className="browse-btn">Book Blood</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodBankOrderHistory; 