import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { 
  Box, 
  Stack, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Schedule, 
  ChevronLeft, 
  ChevronRight,
  Note,
  AttachFile,
  Download,
  Visibility
} from '@mui/icons-material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

const ClinicAppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    
    // Reschedule functionality state
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
    const [availableTimeslots, setAvailableTimeslots] = useState([]);
    const [loadingTimeslots, setLoadingTimeslots] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
    const [currentDateRange, setCurrentDateRange] = useState(new Date());
    const [dateOptions, setDateOptions] = useState([]);
    const [vendorId, setVendorId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Extract vendor ID from selected appointment
    useEffect(() => {
        if (selectedAppointment && selectedAppointment.doctor) {
            // Try different possible field names for vendor ID
            const possibleVendorId = selectedAppointment.doctor.vendorId || 
                                   selectedAppointment.doctor.id || 
                                   selectedAppointment.doctor.doctorId ||
                                   selectedAppointment.vendorId;
            
            if (possibleVendorId) {
                setVendorId(possibleVendorId);
                console.log('Vendor ID extracted:', possibleVendorId);
            } else {
                console.error('No vendor ID found in appointment:', selectedAppointment);
                setSnackbarMessage('Unable to find doctor information for rescheduling');
                setSnackbarOpen(true);
            }
        }
    }, [selectedAppointment]);

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

    // Reschedule functions
    const fetchTimeslots = async (date) => {
        if (!vendorId || !date) {
            console.log('Missing vendorId or date:', { vendorId, date });
            return;
        }
        
        setLoadingTimeslots(true);
        try {
            console.log('Fetching timeslots for date:', date, 'vendorId:', vendorId);
            
            const response = await doctorConsultationService.getTimeslots(vendorId, date);
            console.log('Timeslots response:', response);
            
            if (response && response.availableSlots && Array.isArray(response.availableSlots)) {
                // Get booked times and normalize format (remove seconds if present)
                const bookedTimes = response.bookedSlots ? response.bookedSlots.map(slot => {
                    const time = slot.time;
                    return time.includes(':') && time.split(':').length === 3 
                        ? time.substring(0, 5) // Remove seconds from "10:00:00" format
                        : time; // Keep as is if already in "10:00" format
                }) : [];
                
                // Get all available slots
                const availableTimes = response.availableSlots || [];
                
                // Combine available and booked times to get all possible timeslots
                const allTimes = [...new Set([...availableTimes, ...bookedTimes])].sort();
                
                console.log('Processed timeslots:', {
                    availableTimes,
                    bookedTimes,
                    allTimes,
                    timeslotsCount: allTimes.length
                });
                
                // Transform all timeslots into the expected format
                const timeslots = allTimes.map((time, index) => ({
                    id: `slot_${index}`,
                    time: time,
                    available: availableTimes.includes(time) && !bookedTimes.includes(time),
                    booked: bookedTimes.includes(time)
                }));
                
                setAvailableTimeslots(timeslots);
            } else {
                console.log('No available slots found or invalid response:', response);
                setAvailableTimeslots([]);
            }
        } catch (error) {
            console.error('Error fetching timeslots:', error);
            setSnackbarMessage(`Error fetching available timeslots: ${error.message}`);
            setSnackbarOpen(true);
            setAvailableTimeslots([]);
        } finally {
            setLoadingTimeslots(false);
        }
    };

    // Generate date options for horizontal picker
    const generateDateOptions = (startDate) => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push({
                date: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                year: date.getFullYear()
            });
        }
        return dates;
    };

    // Initialize date options when reschedule dialog opens
    useEffect(() => {
        if (rescheduleDialogOpen) {
            const today = new Date();
            const options = generateDateOptions(today);
            setDateOptions(options);
            setCurrentDateRange(today);
        }
    }, [rescheduleDialogOpen]);

    // Navigate date range
    const navigateDateRange = (direction) => {
        const newDate = new Date(currentDateRange);
        newDate.setDate(currentDateRange.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDateRange(newDate);
        const options = generateDateOptions(newDate);
        setDateOptions(options);
    };

    // Handle date selection from horizontal picker
    const handleDateSelect = (dateString) => {
        setSelectedDate(dateString);
        setSelectedTime(''); // Reset time when date changes
        fetchTimeslots(dateString);
    };

    const handleRescheduleClick = () => {
        setRescheduleDialogOpen(true);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeslots([]);
    };

    const handleReschedule = async () => {
        if (!selectedAppointment || !selectedDate || !selectedTime) {
            setSnackbarMessage('Please select both date and time');
            setSnackbarOpen(true);
            return;
        }

        setRescheduleLoading(true);
        try {
            const rescheduleData = {
                date: selectedDate,
                time: selectedTime,
                by: "user"
            };

            console.log('Rescheduling appointment with data:', rescheduleData);
            
            await doctorConsultationService.rescheduleAppointment(
                selectedAppointment.id, 
                rescheduleData
            );
            
            setSnackbarMessage('Appointment rescheduled successfully');
            setSnackbarOpen(true);
            setRescheduleDialogOpen(false);
            setSelectedDate('');
            setSelectedTime('');
            setAvailableTimeslots([]);
            await fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            setSnackbarMessage(`Error rescheduling appointment: ${error.message}`);
            setSnackbarOpen(true);
        } finally {
            setRescheduleLoading(false);
        }
    };

    const handleCloseRescheduleDialog = () => {
        setRescheduleDialogOpen(false);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimeslots([]);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                    
                    {/* Notes Section */}
                    {selectedAppointment.notes && (
                        <Section title="Notes">
                            <Box sx={{ 
                                p: 2, 
                                backgroundColor: 'grey.50', 
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'grey.200'
                            }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                    <Note color="primary" fontSize="small" />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Doctor's Notes
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ 
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {selectedAppointment.notes}
                                </Typography>
                            </Box>
                        </Section>
                    )}
                    
                    {/* Attachments Section */}
                    {selectedAppointment.attachments && selectedAppointment.attachments.length > 0 && (
                        <Section title="Attachments">
                            <Stack spacing={1}>
                                {selectedAppointment.attachments.map((attachment, index) => (
                                    <Box key={index} sx={{ 
                                        p: 2, 
                                        backgroundColor: 'grey.50', 
                                        borderRadius: 1,
                                        border: 1,
                                        borderColor: 'grey.200',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <AttachFile color="primary" fontSize="small" />
                                            <Typography variant="body2" sx={{ 
                                                fontWeight: 500,
                                                flex: 1,
                                                wordBreak: 'break-all'
                                            }}>
                                                {attachment.split('/').pop() || `Attachment ${index + 1}`}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => window.open(attachment, '_blank')}
                                                sx={{ 
                                                    color: 'primary.main',
                                                    '&:hover': { backgroundColor: 'primary.light' }
                                                }}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    const a = document.createElement('a');
                                                    a.href = attachment;
                                                    a.download = attachment.split('/').pop() || `attachment_${index + 1}`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                }}
                                                sx={{ 
                                                    color: 'primary.main',
                                                    '&:hover': { backgroundColor: 'primary.light' }
                                                }}
                                            >
                                                <Download fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Section>
                    )}
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handleRescheduleClick}>Reschedule</Button>
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
            
            {/* Reschedule Dialog */}
            <Dialog 
                open={rescheduleDialogOpen} 
                onClose={handleCloseRescheduleDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Schedule color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Reschedule Appointment
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedAppointment && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                                Doctor: {selectedAppointment.doctor.name}
                            </Typography>
                            
                            {/* Horizontal Date Picker */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                                    Select Date:
                                </Typography>
                                
                                {/* Month-Year Header */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {dateOptions.length > 0 && `${dateOptions[0].month} ${dateOptions[0].year}`}
                                    </Typography>
                                </Box>
                                
                                {/* Date Navigation */}
                                <Box sx={{ mb: 2 }}>
                                    {/* Navigation Buttons Row */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mb: 1
                                    }}>
                                        <IconButton 
                                            onClick={() => navigateDateRange('prev')}
                                            size="small"
                                            sx={{ 
                                                color: 'text.primary',
                                                '&:hover': { backgroundColor: 'action.hover' },
                                                p: 1
                                            }}
                                        >
                                            <ChevronLeft />
                                        </IconButton>
                                        
                                        <IconButton 
                                            onClick={() => navigateDateRange('next')}
                                            size="small"
                                            sx={{ 
                                                color: 'text.primary',
                                                '&:hover': { backgroundColor: 'action.hover' },
                                                p: 1
                                            }}
                                        >
                                            <ChevronRight />
                                        </IconButton>
                                    </Box>
                                    
                                    {/* Dates Row */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: { xs: 0.5, sm: 1 },
                                        px: { xs: 0.5, sm: 1 }
                                    }}>
                                        {dateOptions.map((dateOption) => (
                                            <Box
                                                key={dateOption.date}
                                                onClick={() => handleDateSelect(dateOption.date)}
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    p: { xs: 0.75, sm: 1 },
                                                    borderRadius: 2,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    border: selectedDate === dateOption.date ? 2 : 1,
                                                    borderColor: selectedDate === dateOption.date ? 'primary.main' : 'divider',
                                                    backgroundColor: selectedDate === dateOption.date ? 'primary.light' : 'transparent',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        backgroundColor: selectedDate === dateOption.date ? 'primary.main' : 'action.hover',
                                                        color: selectedDate === dateOption.date ? 'white' : 'inherit'
                                                    }
                                                }}
                                            >
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        fontWeight: 600, 
                                                        display: 'block',
                                                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    {dateOption.day}
                                                </Typography>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 700,
                                                        fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {dateOption.dayNumber}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>

                            {selectedDate && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Available Time Slots:
                                    </Typography>
                                    
                                    {loadingTimeslots ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                                            <CircularProgress size={20} />
                                            <Typography variant="body2">Loading available timeslots...</Typography>
                                        </Box>
                                    ) : availableTimeslots.length === 0 ? (
                                        <Box sx={{ py: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No available timeslots for this date
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                                            {availableTimeslots.map((timeslot) => (
                                                <Grid item xs={6} sm={4} md={3} key={timeslot.id}>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <Button
                                                            variant={selectedTime === timeslot.time ? "contained" : "outlined"}
                                                            size="small"
                                                            onClick={() => !timeslot.booked && setSelectedTime(timeslot.time)}
                                                            disabled={timeslot.booked}
                                                            fullWidth
                                                            sx={{ 
                                                                minHeight: { xs: 36, sm: 40 },
                                                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                                                opacity: timeslot.booked ? 0.6 : 1,
                                                                backgroundColor: timeslot.booked ? 'grey.200' : 'inherit',
                                                                color: timeslot.booked ? 'text.disabled' : 'inherit',
                                                                '&:disabled': {
                                                                    backgroundColor: 'grey.200',
                                                                    color: 'text.disabled'
                                                                }
                                                            }}
                                                        >
                                                            {timeslot.time}
                                                        </Button>
                                                        {timeslot.booked && (
                                                            <Chip
                                                                label="Booked"
                                                                size="small"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: -8,
                                                                    right: -8,
                                                                    fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                                                    height: { xs: 14, sm: 16 },
                                                                    backgroundColor: 'error.main',
                                                                    color: 'white',
                                                                    '& .MuiChip-label': {
                                                                        px: 0.5
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Box>
                            )}

                            {selectedDate && selectedTime && (
                                <Box sx={{ 
                                    p: 2, 
                                    backgroundColor: 'primary.light', 
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: 'primary.main',
                                    color: 'primary.contrastText'
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.dark' }}>
                                        New Appointment Details:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                                        <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                                        <strong>Time:</strong> {selectedTime}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRescheduleDialog} disabled={rescheduleLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleReschedule}
                        variant="contained"
                        disabled={rescheduleLoading || !selectedDate || !selectedTime}
                        startIcon={rescheduleLoading ? <CircularProgress size={20} /> : <Schedule />}
                    >
                        {rescheduleLoading ? 'Rescheduling...' : 'Reschedule'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ClinicAppointmentHistory; 