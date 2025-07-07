import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './LabTestOrderHistory.css';

const LabTestOrderHistory = () => {
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
            
            const response = await orderHistoryService.getCompletedLabTestBookings();
            
            if (response.success) {
                const formattedBookings = response.data.map(booking => 
                    orderHistoryService.formatLabTestBookingData(booking)
                );
                setBookings(formattedBookings);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Failed to fetch bookings. Please try again.');
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

    const handleDownloadReport = (testName, reportUrl) => {
        if (reportUrl) {
            const link = document.createElement('a');
            link.href = reportUrl;
            link.download = `${testName}_report.pdf`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDownloadInvoice = () => {
        if (selectedBooking) {
            const invoiceText = `
INVOICE
Booking #${selectedBooking.bookingNumber}
Date: ${formatDate(selectedBooking.date)}

Lab: ${selectedBooking.diagnosticCenter.name}
Address: ${selectedBooking.diagnosticCenter.address}

Tests:
${selectedBooking.selectedTests.map(test => 
    `${test}`
).join('\n')}

Test Fees: ${formatCurrency(selectedBooking.testFees)}
Report Delivery Fees: ${formatCurrency(selectedBooking.reportDeliveryFees)}
Discount: ${formatCurrency(selectedBooking.discount)}
GST: ${formatCurrency(selectedBooking.gst)}
Total: ${formatCurrency(selectedBooking.total)}

Payment Details:
Status: ${selectedBooking.paymentStatus}

Customer Details:
Name: ${selectedBooking.user.name}
Email: ${selectedBooking.user.email}
            `;
            
            const blob = new Blob([invoiceText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `labtest-invoice-${selectedBooking.bookingNumber}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };

    const renderBookingCard = (booking) => {
        return (
            <div key={booking.id} className="labtest-booking-card">
                <div className="booking-header">
                    <div className="booking-info">
                        <h3 className="booking-number">Booking #{booking.bookingNumber}</h3>
                        <p className="booking-date">Booked on {formatDate(booking.date)}</p>
                    </div>
                    <div className="booking-status">
                        <span className="status-badge completed">
                            {booking.status}
                        </span>
                    </div>
                </div>

                <div className="booking-content">
                    <div className="lab-info">
                        <h4>Lab: {booking.diagnosticCenter.name}</h4>
                        <p className="lab-address">{booking.diagnosticCenter.address}</p>
                        <p className="lab-contact">Contact: {booking.diagnosticCenter.phone}</p>
                    </div>

                    <div className="tests-section">
                        <h4>Tests:</h4>
                        <div className="tests-list">
                            {booking.selectedTests.map((test, index) => (
                                <div key={index} className="test-item">
                                    <span className="test-name">{test}</span>
                                    {booking.reportUrls && booking.reportUrls[test] && (
                                        <button 
                                            className="download-report-btn"
                                            onClick={() => handleDownloadReport(test, booking.reportUrls[test])}
                                            title="Download Report"
                                        >
                                            📄
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="booking-details">
                        <div className="detail-row">
                            <span className="detail-label">Appointment Date:</span>
                            <span className="detail-value">{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Appointment Time:</span>
                            <span className="detail-value">{booking.bookingTime}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Home Collection:</span>
                            <span className="detail-value">{booking.homeCollectionRequired ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Report Delivery:</span>
                            <span className="detail-value">{booking.reportDeliveryAtHome ? 'At Home' : 'At Lab'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Payment Status:</span>
                            <span className="detail-value">{booking.paymentStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="booking-footer">
                    <div className="booking-total">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-amount">{formatCurrency(booking.total)}</span>
                    </div>
                    <div className="booking-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => handleViewDetails(booking)}
                        >
                            View Details
                        </button>
                        <button className="action-btn secondary">Book Again</button>
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
                        <button className="close-btn" onClick={handleCloseSidePanel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="side-panel-content">
                        <div className="booking-summary">
                            <div className="booking-basic-info">
                                <h3>Booking #{selectedBooking.bookingNumber}</h3>
                                <p className="booking-date">Booked on {formatDate(selectedBooking.date)}</p>
                                <span className="status-badge completed">{selectedBooking.status}</span>
                            </div>

                            <div className="lab-details">
                                <h4>Diagnostic Center</h4>
                                <div className="lab-info-detail">
                                    <h5>{selectedBooking.diagnosticCenter.name}</h5>
                                    <p className="lab-address">{selectedBooking.diagnosticCenter.address}</p>
                                    <p className="lab-contact">Contact: {selectedBooking.diagnosticCenter.phone}</p>
                                    <p className="lab-email">Email: {selectedBooking.diagnosticCenter.email}</p>
                                </div>
                            </div>

                            <div className="tests-detail">
                                <h4>Tests Conducted</h4>
                                {selectedBooking.selectedTests.map((test, index) => (
                                    <div key={index} className="test-detail-item">
                                        <div className="test-info">
                                            <h5>{test}</h5>
                                            {selectedBooking.reportUrls && selectedBooking.reportUrls[test] && (
                                                <button 
                                                    className="download-report-btn"
                                                    onClick={() => handleDownloadReport(test, selectedBooking.reportUrls[test])}
                                                >
                                                    📄 Download Report
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="appointment-info">
                                <h4>Appointment Information</h4>
                                <div className="info-row">
                                    <span className="label">Appointment Date:</span>
                                    <span className="value">{formatDate(selectedBooking.bookingDate)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Appointment Time:</span>
                                    <span className="value">{selectedBooking.bookingTime}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Home Collection:</span>
                                    <span className="value">{selectedBooking.homeCollectionRequired ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Report Delivery:</span>
                                    <span className="value">{selectedBooking.reportDeliveryAtHome ? 'At Home' : 'At Lab'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment Status:</span>
                                    <span className="value">{selectedBooking.paymentStatus}</span>
                                </div>
                            </div>

                            <div className="booking-total-section">
                                <div className="total-row">
                                    <span>Test Fees:</span>
                                    <span>{formatCurrency(selectedBooking.testFees)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Report Delivery Fees:</span>
                                    <span>{formatCurrency(selectedBooking.reportDeliveryFees)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Discount:</span>
                                    <span>-{formatCurrency(selectedBooking.discount)}</span>
                                </div>
                                <div className="total-row">
                                    <span>GST:</span>
                                    <span>{formatCurrency(selectedBooking.gst)}</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total Amount:</span>
                                    <span>{formatCurrency(selectedBooking.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-panel-footer">
                        <button className="download-invoice-btn" onClick={handleDownloadInvoice}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice
                        </button>
                        <button className="reorder-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Book Again
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="labtest-bookings-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your completed lab test bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="labtest-bookings-container">
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
        <div className="labtest-bookings-container">
            <div className="bookings-section">
                {bookings.length > 0 ? (
                    <div className="bookings-grid">
                        {bookings.map((booking) => renderBookingCard(booking))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔬</div>
                        <h3>No Completed Bookings Found</h3>
                        <p>You haven't completed any lab test bookings yet.</p>
                        <button className="browse-btn">Book Lab Tests</button>
                    </div>
                )}
            </div>

            {renderSidePanel()}
        </div>
    );
};

export default LabTestOrderHistory; 