import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

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
            <Paper key={booking.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack>
                        <Typography fontWeight={600}>Booking #{booking.bookingNumber.slice(-8)}</Typography>
                        <Typography variant="caption" color="text.secondary">Booked on {formatDate(booking.date)}</Typography>
                    </Stack>
                    <StatusChip label="Completed" />
                </Stack>
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                    <Section title="Ambulance Details">
                        <Typography variant="body2">Agency: {booking.agency}</Typography>
                        <Typography variant="body2" color="text.secondary">Vehicle: {booking.vehicleType}</Typography>
                        <Typography variant="body2" color="text.secondary">Contact: {booking.agencyContact}</Typography>
                        <Typography variant="body2" color="text.secondary">Pickup: {booking.pickupLocation}</Typography>
                        <Typography variant="body2" color="text.secondary">Drop: {booking.dropLocation}</Typography>
                    </Section>
                    <Section title="Booking Information">
                        <Row label="Base Charge" value={formatCurrency(booking.baseCharge)} />
                        <Row label="Rate per km" value={formatCurrency(booking.costPerKm)} />
                        <Row label="Payment Bypassed" value={booking.isPaymentBypassed ? 'Yes' : 'No'} />
                        <Row label="Distance" value={`${booking.totalDistance} km`} />
                    </Section>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">Total</Typography>
                        <Typography fontWeight={600}>{formatCurrency(booking.total)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={() => handleViewDetails(booking)}>View Details</Button>
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
                    <Section>
                        <Typography variant="subtitle1" fontWeight={600}>Booking #{selectedBooking.bookingNumber.slice(-8)}</Typography>
                        <Typography variant="body2" color="text.secondary">Booked on {formatDate(selectedBooking.date)}</Typography>
                        <StatusChip label="Completed" />
                    </Section>
                    <Section title="Ambulance Details">
                        <Row label="Agency" value={selectedBooking.agency} />
                        <Row label="Vehicle" value={selectedBooking.vehicleType} />
                        <Row label="Contact" value={selectedBooking.agencyContact} />
                        <Row label="Pickup" value={selectedBooking.pickupLocation} />
                        <Row label="Drop" value={selectedBooking.dropLocation} />
                    </Section>
                    <Section title="Booking Information">
                        <Row label="Base Charge" value={formatCurrency(selectedBooking.baseCharge)} />
                        <Row label="Rate per km" value={formatCurrency(selectedBooking.costPerKm)} />
                        <Row label="Payment Bypassed" value={selectedBooking.isPaymentBypassed ? 'Yes' : 'No'} />
                        <Row label="Completed On" value={formatDate(selectedBooking.actualDelivery)} />
                        <Row label="Total Amount" value={formatCurrency(selectedBooking.total)} />
                    </Section>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={async () => {
                            const res = await orderHistoryService.getAmbulanceInvoice(selectedBooking.bookingNumber || selectedBooking.id);
                            if (res.success && res.data?.pdfUrl) {
                                const a = document.createElement('a');
                                a.href = res.data.pdfUrl;
                                a.download = `ambulance-invoice-${(selectedBooking.bookingNumber || selectedBooking.id).toString().slice(-8)}.pdf`;
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

    if (loading) return <LoadingState label="Loading your completed ambulance bookings..." />;

    if (error) return <ErrorState message={error} onRetry={fetchCompletedBookings} />;

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
                <EmptyState icon="🚑" title="No Completed Ambulance Bookings Found" subtitle="You haven't completed any ambulance bookings yet." actionLabel="Book Ambulance" />
            )}
            {renderSidePanel()}
        </Box>
    );
};

export default AmbulanceOrderHistory; 