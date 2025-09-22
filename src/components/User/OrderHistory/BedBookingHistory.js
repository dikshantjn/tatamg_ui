import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

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
            <Paper key={booking.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <StatusChip label={booking.status} />
                    <Typography variant="caption" color="text.secondary">{formatDate(booking.date)} - {booking.timeSlot}</Typography>
                </Stack>
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                    <Section title="Hospital">
                        <Typography variant="body2" fontWeight={600}>{booking.hospital.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{booking.hospital.address}, {booking.hospital.city}, {booking.hospital.state}</Typography>
                    </Section>
                    <Section title="Details">
                        <Row label="Bed Type" value={booking.bedType} />
                        <Row label="Payment Status" value={booking.paymentStatus} />
                    </Section>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">Paid</Typography>
                        <Typography fontWeight={600}>{formatCurrency(booking.paidAmount)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={() => handleViewDetails(booking)}>View Details</Button>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>Book Again</Button>
                    </Stack>
                </Stack>
            </Paper>
        );
    };

    const renderSidePanel = () => {
        if (!selectedBooking) return null;
        return (
            <BottomSheetDialog
                open={isSidePanelOpen}
                onClose={handleCloseSidePanel}
                title="Booking Details"
                actions={null}
            >
                <Stack spacing={2}>
                    <StatusChip label={selectedBooking.status} />
                    <Section title="Hospital Information">
                        <Typography variant="subtitle1" fontWeight={600}>{selectedBooking.hospital.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{formatDate(selectedBooking.date)} - {selectedBooking.timeSlot}</Typography>
                        <Typography variant="body2" color="text.secondary">{selectedBooking.hospital.address}, {selectedBooking.hospital.city}, {selectedBooking.hospital.state}</Typography>
                        <Typography variant="body2" color="text.secondary">Contact: {selectedBooking.hospital.contactNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">Email: {selectedBooking.hospital.email}</Typography>
                    </Section>
                    <Section title="Booking Information">
                        <Row label="Bed Type" value={selectedBooking.bedType} />
                        <Row label="Payment Status" value={selectedBooking.paymentStatus} />
                        <Row label="Paid Amount" value={formatCurrency(selectedBooking.paidAmount)} />
                        <Row label="Booking Created" value={formatDate(selectedBooking.createdAt)} />
                        <Row label="Last Updated" value={formatDate(selectedBooking.updatedAt)} />
                    </Section>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }}>Book Another Bed</Button>
                        <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={async () => {
                            const res = await orderHistoryService.getBedBookingInvoice(selectedBooking.bookingNumber || selectedBooking.id);
                            if (res.success && res.data?.pdfUrl) {
                                const a = document.createElement('a');
                                a.href = res.data.pdfUrl;
                                a.download = `bed-invoice-${(selectedBooking.bookingNumber || selectedBooking.id).toString().slice(-8)}.pdf`;
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

    if (loading) return <LoadingState label="Loading your bed bookings..." />;

    if (error) return <ErrorState message={error} onRetry={fetchBookings} />;

    return (
        <Box>
            {bookings.length > 0 ? (
                <Grid container spacing={2}>
                    {bookings.map((booking) => (
                        <Grid key={booking.id} item xs={12} md={6}>
                            {renderBookingCard(booking)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState icon="🏥" title="No Bed Bookings Found" subtitle="You haven't booked any hospital beds yet." actionLabel="Book Hospital Bed" />
            )}
            {renderSidePanel()}
        </Box>
    );
};

export default BedBookingHistory; 