import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './ClinicAppointmentHistory.css';

const ClinicAppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await orderHistoryService.getClinicAppointments();
            
            if (response.success) {
                const formattedAppointments = response.data.map(appointment => 
                    orderHistoryService.formatClinicAppointmentData(appointment)
                );
                setAppointments(formattedAppointments);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Failed to fetch appointments. Please try again.');
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

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setIsSidePanelOpen(true);
    };

    const handleCloseSidePanel = () => {
        setIsSidePanelOpen(false);
        setSelectedAppointment(null);
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

    const renderAppointmentCard = (appointment) => {
        return (
            <div key={appointment.id} className="clinic-appointment-card">
                {/* Status Header */}
                <div className="appointment-header">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                        {appointment.status}
                    </span>
                </div>

                {/* Doctor Information */}
                <div className="doctor-info">
                    <h4>{appointment.doctor.name}</h4>
                    <p className="appointment-datetime">
                        {formatDate(appointment.date)} at {formatTime(appointment.time)}
                    </p>
                    <div className="specializations">
                        {appointment.doctor.specializations.map((spec, index) => (
                            <span key={index} className="specialization-tag">{spec}</span>
                        ))}
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="appointment-details">
                    <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{appointment.isOnline ? 'Online' : 'In-Person'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Payment:</span>
                        <span className="detail-value">{appointment.paymentStatus}</span>
                    </div>
                    {appointment.meetingUrl && (
                        <div className="detail-row">
                            <span className="detail-label">Meeting:</span>
                            <a href={appointment.meetingUrl} target="_blank" rel="noopener noreferrer" className="meeting-link">
                                Join Meeting
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer with Amount and Actions */}
                <div className="appointment-footer">
                    <div className="appointment-amount">
                        <span className="amount-label">Fee:</span>
                        <span className="amount-value">{formatCurrency(appointment.paidAmount)}</span>
                    </div>
                    <div className="appointment-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => handleViewDetails(appointment)}
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
        if (!selectedAppointment) return null;

        return (
            <div className={`side-panel-overlay ${isSidePanelOpen ? 'active' : ''}`} onClick={handleCloseSidePanel}>
                <div className="side-panel" onClick={(e) => e.stopPropagation()}>
                    {/* Content */}
                    <div className="side-panel-content">
                        <div className="appointment-summary">
                            {/* Title */}
                            <div className="modal-title">
                                <h2>Appointment Details</h2>
                                <button className="close-btn" onClick={handleCloseSidePanel}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            {/* Status */}
                            <div className="appointment-basic-info">
                                <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedAppointment.status) }}>
                                    {selectedAppointment.status}
                                </span>
                            </div>

                            {/* Doctor Info */}
                            <div className="doctor-details">
                                <h4>Doctor</h4>
                                <h5>{selectedAppointment.doctor.name}</h5>
                                <p className="appointment-datetime">
                                    {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                                </p>
                                <div className="specializations">
                                    {selectedAppointment.doctor.specializations.map((spec, index) => (
                                        <span key={index} className="specialization-tag">{spec}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="appointment-info-detail">
                                <h4>Details</h4>
                                <div className="info-row">
                                    <span className="label">Type</span>
                                    <span className="value">{selectedAppointment.isOnline ? 'Online' : 'In-Person'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment</span>
                                    <span className="value">{selectedAppointment.paymentStatus}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Fee</span>
                                    <span className="value">{formatCurrency(selectedAppointment.paidAmount)}</span>
                                </div>
                                {selectedAppointment.meetingUrl && (
                                    <div className="info-row">
                                        <span className="label">Meeting</span>
                                        <a href={selectedAppointment.meetingUrl} target="_blank" rel="noopener noreferrer" className="meeting-link">
                                            Join Meeting
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Reminder Info */}
                            <div className="reminder-info">
                                <h4>Reminder</h4>
                                <div className="info-row">
                                    <span className="label">Set For</span>
                                    <span className="value">
                                        {selectedAppointment.reminderTime ? formatDate(selectedAppointment.reminderTime) : 'Not set'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Status</span>
                                    <span className="value">{selectedAppointment.reminderSent ? 'Sent' : 'Pending'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-actions">
                        <button className="reschedule-btn">
                            Reschedule
                        </button>
                        <button className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="clinic-appointments-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="clinic-appointments-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Appointments</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchAppointments}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="clinic-appointments-container">
            <div className="appointments-section">
                {appointments.length > 0 ? (
                    <div className="appointments-grid">
                        {appointments.map((appointment) => renderAppointmentCard(appointment))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">👨‍⚕️</div>
                        <h3>No Appointments Found</h3>
                        <p>You haven't booked any doctor appointments yet.</p>
                        <button className="browse-btn">Book Appointment</button>
                    </div>
                )}
            </div>

            {renderSidePanel()}
        </div>
    );
};

export default ClinicAppointmentHistory; 