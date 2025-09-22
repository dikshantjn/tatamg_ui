import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Grid, Chip } from '@mui/material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

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
        const doctorName = (appointment.doctor.name || '').replace(/^Dr\.?\s+/i, '');
        return (
            <Paper key={appointment.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(appointment.date)} at {formatTime(appointment.time)}
                    </Typography>
                </Stack>
                <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight={600}>{doctorName}</Typography>
                        <StatusChip label={appointment.status} />
                    </Stack>
                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                        {appointment.doctor.specializations.map((spec, index) => (
                            <Chip key={index} label={spec} size="small" color="primary" sx={{ color: '#fff' }} />
                        ))}
                    </Stack>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Type</Typography>
                            <Typography variant="body2">{appointment.isOnline ? 'Online' : 'In-Person'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Payment</Typography>
                            <Typography variant="body2">{appointment.paymentStatus}</Typography>
                        </Grid>
                        {appointment.meetingUrl && (
                            <Grid item xs={12}>
                                <Button href={appointment.meetingUrl} target="_blank" rel="noopener noreferrer" size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>
                                    Join Meeting
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1}>
                            <Typography variant="body2" color="text.secondary">Fee</Typography>
                            <Typography fontWeight={600}>{formatCurrency(appointment.paidAmount)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={() => handleViewDetails(appointment)}>View Details</Button>
                            <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>Book Again</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>
        );
    };

    const renderSidePanel = () => {
        if (!selectedAppointment) return null;
        const doctorName = (selectedAppointment.doctor.name || '').replace(/^Dr\.?\s+/i, '');
        return (
            <BottomSheetDialog
                open={isSidePanelOpen}
                onClose={handleCloseSidePanel}
                title="Appointment Details"
                actions={null}
            >
                <Stack spacing={2}>
                    <Section title="Doctor">
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight={600}>{doctorName}</Typography>
                            <StatusChip label={selectedAppointment.status} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                            {selectedAppointment.doctor.specializations.map((spec, index) => (
                                <Chip key={index} label={spec} size="small" color="primary" sx={{ color: '#fff' }} />
                            ))}
                        </Stack>
                    </Section>
                    <Section title="Details">
                        <Row label="Type" value={selectedAppointment.isOnline ? 'Online' : 'In-Person'} />
                        <Row label="Payment" value={selectedAppointment.paymentStatus} />
                        <Row label="Fee" value={formatCurrency(selectedAppointment.paidAmount)} />
                        {selectedAppointment.meetingUrl && (
                            <Button href={selectedAppointment.meetingUrl} target="_blank" rel="noopener noreferrer" size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>
                                Join Meeting
                            </Button>
                        )}
                    </Section>
                    <Section title="Reminder">
                        <Row label="Set For" value={selectedAppointment.reminderTime ? formatDate(selectedAppointment.reminderTime) : 'Not set'} />
                        <Row label="Status" value={selectedAppointment.reminderSent ? 'Sent' : 'Pending'} />
                    </Section>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }}>Reschedule</Button>
                        <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
                        <Button variant="contained" color="secondary" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={async () => {
                            const res = await orderHistoryService.getClinicInvoice(selectedAppointment.appointmentNumber || selectedAppointment.id);
                            if (res.success && res.data?.pdfUrl) {
                                const a = document.createElement('a');
                                a.href = res.data.pdfUrl;
                                a.download = `clinic-invoice-${selectedAppointment.appointmentNumber || selectedAppointment.id}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }
                        }}>Download Invoice</Button>
                    </Stack>
                </Stack>
            </BottomSheetDialog>
        );
    };

    if (loading) return <LoadingState label="Loading your appointments..." />;

    if (error) return <ErrorState message={error} onRetry={fetchAppointments} />;

    return (
        <Box>
            {appointments.length > 0 ? (
                <Grid container spacing={2}>
                    {appointments.map((appointment) => (
                        <Grid key={appointment.id} item xs={12} md={6}>
                            {renderAppointmentCard(appointment)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState icon="👨‍⚕️" title="No Appointments Found" subtitle="You haven't booked any doctor appointments yet." actionLabel="Book Appointment" />
            )}
            {renderSidePanel()}
        </Box>
    );
};

export default ClinicAppointmentHistory; 