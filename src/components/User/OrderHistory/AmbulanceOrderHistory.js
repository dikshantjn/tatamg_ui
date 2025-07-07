import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './ProductOrderHistory.css';

const AmbulanceOrderHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    useEffect(() => {
        fetchCompletedBookings();
    }, []);

    const fetchCompletedBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderHistoryService.getCompletedAmbulanceBookings();
            if (response.success) {
                const formatted = response.data.map(orderHistoryService.formatAmbulanceBookingData);
                setBookings(formatted);
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('Failed to fetch ambulance bookings. Please try again.');
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
        return (
            <div key={booking.id} className="product-order-card ambulance-order-card">
                <div className="order-header">
                    <div className="order-info">
                        <h3 className="order-number">Booking #{booking.bookingNumber.slice(-8)}</h3>
                        <p className="order-date">Booked on {formatDate(booking.date)}</p>
                    </div>
                    <div className="order-status">
                        <span className="status-badge delivered">Completed</span>
                    </div>
                </div>
                <div className="order-content">
                    <div className="order-items">
                        <h4>Ambulance Details:</h4>
                        <div className="items-list">
                            <div className="item-card ambulance-item-card">
                                <div className="item-details">
                                    <h5 className="item-name">Agency: {booking.agency}</h5>
                                    <p className="item-category">Vehicle: {booking.vehicleType}</p>
                                    <p className="item-vendor">Contact: {booking.agencyContact}</p>
                                    <div className="item-price-qty">
                                        <span className="item-price">{formatCurrency(booking.total)}</span>
                                        <span className="item-quantity">Distance: {booking.totalDistance} km</span>
                                    </div>
                                    <div className="item-pickdrop">
                                        <span>Pickup: {booking.pickupLocation}</span><br/>
                                        <span>Drop: {booking.dropLocation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-details">
                        <div className="detail-row">
                            <span className="detail-label">Base Charge:</span>
                            <span className="detail-value">{formatCurrency(booking.baseCharge)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Rate per km:</span>
                            <span className="detail-value">{formatCurrency(booking.costPerKm)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Payment Bypassed:</span>
                            <span className="detail-value">{booking.isPaymentBypassed ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
                <div className="order-footer">
                    <div className="order-total">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-amount">{formatCurrency(booking.total)}</span>
                    </div>
                    <div className="order-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => handleViewDetails(booking)}
                        >
                            View Details
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
                <div className="side-panel" onClick={e => e.stopPropagation()}>
                    <div className="side-panel-header">
                        <h2>Booking Details</h2>
                        <button className="close-btn" onClick={handleCloseSidePanel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="side-panel-content">
                        <div className="order-summary">
                            <div className="order-basic-info">
                                <h3>Booking #{selectedBooking.bookingNumber.slice(-8)}</h3>
                                <p className="order-date">Booked on {formatDate(selectedBooking.date)}</p>
                                <span className="status-badge delivered">Completed</span>
                            </div>
                            <div className="order-items-detail">
                                <h4>Ambulance Details</h4>
                                <div className="detail-item">
                                    <div className="item-info">
                                        <h5>Agency: {selectedBooking.agency}</h5>
                                        <p className="item-category">Vehicle: {selectedBooking.vehicleType}</p>
                                        <p className="item-vendor">Contact: {selectedBooking.agencyContact}</p>
                                        <div className="item-pricing">
                                            <span className="price">{formatCurrency(selectedBooking.total)}</span>
                                            <span className="quantity">Distance: {selectedBooking.totalDistance} km</span>
                                        </div>
                                        <div className="item-pickdrop">
                                            <span>Pickup: {selectedBooking.pickupLocation}</span><br/>
                                            <span>Drop: {selectedBooking.dropLocation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="delivery-info">
                                <h4>Booking Information</h4>
                                <div className="info-row">
                                    <span className="label">Base Charge:</span>
                                    <span className="value">{formatCurrency(selectedBooking.baseCharge)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Rate per km:</span>
                                    <span className="value">{formatCurrency(selectedBooking.costPerKm)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment Bypassed:</span>
                                    <span className="value">{selectedBooking.isPaymentBypassed ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Completed On:</span>
                                    <span className="value">{formatDate(selectedBooking.actualDelivery)}</span>
                                </div>
                            </div>
                            <div className="order-total-section">
                                <div className="total-row">
                                    <span className="total-label">Total Amount:</span>
                                    <span className="total-amount">{formatCurrency(selectedBooking.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="product-orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your completed ambulance bookings...</p>
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
                        <div className="empty-icon">🚑</div>
                        <h3>No Completed Ambulance Bookings Found</h3>
                        <p>You haven't completed any ambulance bookings yet.</p>
                        <button className="browse-btn">Book Ambulance</button>
                    </div>
                )}
            </div>
            {renderSidePanel()}
        </div>
    );
};

export default AmbulanceOrderHistory; 