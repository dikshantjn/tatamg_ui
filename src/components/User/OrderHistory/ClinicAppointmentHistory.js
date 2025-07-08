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
                <div className="appointment-header">
                    <div className="appointment-info">
                        <h3 className="appointment-number">Appointment #{appointment.appointmentNumber}</h3>
                        <p className="appointment-datetime">
                            {formatDate(appointment.date)} at {formatTime(appointment.time)}
                        </p>
                    </div>
                    <div className="appointment-status">
                        <span className="status-badge" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                            {appointment.status}
                        </span>
                    </div>
                </div>

                <div className="appointment-content">
                    <div className="doctor-info">
                        <h4>{appointment.doctor.name}</h4>
                        <div className="specializations">
                            {appointment.doctor.specializations.map((spec, index) => (
                                <span key={index} className="specialization-tag">{spec}</span>
                            ))}
                        </div>
                    </div>

                    <div className="appointment-details">
                        <div className="detail-row">
                            <span className="detail-label">Consultation Type:</span>
                            <span className="detail-value">{appointment.isOnline ? 'Online' : 'In-Person'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Payment Status:</span>
                            <span className="detail-value">{appointment.paymentStatus}</span>
                        </div>
                        {appointment.meetingUrl && (
                            <div className="detail-row">
                                <span className="detail-label">Meeting URL:</span>
                                <a href={appointment.meetingUrl} target="_blank" rel="noopener noreferrer" className="meeting-link">
                                    Join Meeting
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="appointment-footer">
                    <div className="appointment-amount">
                        <span className="amount-label">Consultation Fee:</span>
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
                    <div className="side-panel-header">
                        <h2>Appointment Details</h2>
                        <button className="close-btn" onClick={handleCloseSidePanel}>×</button>
                    </div>

                    <div className="side-panel-content">
                        <div className="appointment-summary">
                            <div className="appointment-basic-info">
                                <h3>Appointment #{selectedAppointment.appointmentNumber}</h3>
                                <p className="appointment-datetime">
                                    {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                                </p>
                                <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedAppointment.status) }}>
                                    {selectedAppointment.status}
                                </span>
                            </div>

                            <div className="doctor-details">
                                <h4>Doctor Information</h4>
                                <div className="doctor-info-detail">
                                    <h5>{selectedAppointment.doctor.name}</h5>
                                    <div className="specializations">
                                        {selectedAppointment.doctor.specializations.map((spec, index) => (
                                            <span key={index} className="specialization-tag">{spec}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="appointment-info-detail">
                                <h4>Appointment Information</h4>
                                <div className="info-row">
                                    <span className="label">Consultation Type:</span>
                                    <span className="value">{selectedAppointment.isOnline ? 'Online' : 'In-Person'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment Status:</span>
                                    <span className="value">{selectedAppointment.paymentStatus}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Consultation Fee:</span>
                                    <span className="value">{formatCurrency(selectedAppointment.paidAmount)}</span>
                                </div>
                                {selectedAppointment.meetingUrl && (
                                    <div className="info-row">
                                        <span className="label">Meeting URL:</span>
                                        <a href={selectedAppointment.meetingUrl} target="_blank" rel="noopener noreferrer" className="meeting-link">
                                            Join Meeting
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="reminder-info">
                                <h4>Reminder Information</h4>
                                <div className="info-row">
                                    <span className="label">Reminder Set For:</span>
                                    <span className="value">
                                        {selectedAppointment.reminderTime ? formatDate(selectedAppointment.reminderTime) : 'Not set'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Reminder Status:</span>
                                    <span className="value">{selectedAppointment.reminderSent ? 'Sent' : 'Pending'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-panel-footer">
                        <button className="reschedule-btn">
                            Reschedule Appointment
                        </button>
                        <button className="cancel-btn">
                            Cancel Appointment
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