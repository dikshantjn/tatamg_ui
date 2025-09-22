import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import { LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

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
            <Paper key={booking.bookingId} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack>
                        <Typography fontWeight={600}>Booking #{booking.bookingId?.slice(-8)}</Typography>
                        <Typography variant="caption" color="text.secondary">Booked on {formattedDate}</Typography>
                    </Stack>
                    <StatusChip label="Completed" />
                </Stack>
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                    <Section title="Blood Bank Details">
                        <Typography variant="body2">Agency: {agency.agencyName || 'N/A'}</Typography>
                        <Typography variant="body2" color="text.secondary">Blood Types: {bloodTypes}</Typography>
                        <Typography variant="body2" color="text.secondary">Units: {units}</Typography>
                        <Typography variant="body2" color="text.secondary">Customer: {customerName}</Typography>
                        <Typography variant="body2" color="text.secondary">Contact: {agency.phoneNumber || agency.contactNumber || 'N/A'}</Typography>
                    </Section>
                    <Section title="Completion">
                        <Row label="Completed On" value={formattedDate} />
                    </Section>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">Total</Typography>
                        <Typography fontWeight={600}>{formatCurrency(booking.totalAmount)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={async () => {
                            const res = await orderHistoryService.getBloodBankInvoice(booking.bookingId);
                            if (res.success && res.data?.pdfUrl) {
                                const a = document.createElement('a');
                                a.href = res.data.pdfUrl;
                                a.download = `bloodbank-invoice-${(booking.bookingId || '').slice(-8)}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }
                        }}>Download Invoice</Button>
                    </Stack>
                </Stack>
            </Paper>
        );
    };

    if (loading) return <LoadingState label="Loading your completed blood bank bookings..." />;

    if (error) return <ErrorState message={error} onRetry={fetchCompletedBookings} />;

    return (
        <Box>
                {bookings.length > 0 ? (
                <Grid container spacing={2}>
                    {bookings.map((booking) => (
                        <Grid key={booking.bookingId} item xs={12} md={6}>
                            {renderBookingCard(booking)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState icon="🩸" title="No Completed Blood Bank Bookings Found" subtitle="You haven't completed any blood bank bookings yet." actionLabel="Book Blood" />
            )}
        </Box>
    );
};

export default BloodBankOrderHistory; 