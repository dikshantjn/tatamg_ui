import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

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

    const handleDownloadInvoice = async () => {
        if (selectedBooking) {
            const res = await orderHistoryService.getLabTestInvoice(selectedBooking.bookingNumber);
            if (res.success && res.data?.pdfUrl) {
            const a = document.createElement('a');
                a.href = res.data.pdfUrl;
                a.download = `labtest-invoice-${selectedBooking.bookingNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            }
        }
    };

    const renderBookingCard = (booking) => {
        return (
			<Paper key={booking.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
					<Stack>
						<Typography fontWeight={600}>Booking #{booking.bookingNumber}</Typography>
						<Typography variant="caption" color="text.secondary">Booked on {formatDate(booking.date)}</Typography>
					</Stack>
					<StatusChip label={booking.status} />
				</Stack>
				<Stack spacing={1.5} sx={{ mb: 1.5 }}>
					<Section title="Lab">
						<Typography variant="body2">{booking.diagnosticCenter.name}</Typography>
						<Typography variant="body2" color="text.secondary">{booking.diagnosticCenter.address}</Typography>
						<Typography variant="body2" color="text.secondary">Contact: {booking.diagnosticCenter.phone}</Typography>
					</Section>
					<Section title="Tests">
						<Stack spacing={0.75}>
                            {booking.selectedTests.map((test, index) => (
								<Stack key={index} direction="row" alignItems="center" spacing={1}>
									<Typography variant="body2">{test}</Typography>
                                    {booking.reportUrls && booking.reportUrls[test] && (
										<Button size="small" variant="outlined" onClick={() => handleDownloadReport(test, booking.reportUrls[test])} sx={{ textTransform: 'none', borderRadius: 2 }}>
											Download Report
										</Button>
									)}
								</Stack>
							))}
						</Stack>
					</Section>
					<Section title="Details">
						<Row label="Appointment Date" value={formatDate(booking.bookingDate)} />
						<Row label="Appointment Time" value={booking.bookingTime} />
						<Row label="Home Collection" value={booking.homeCollectionRequired ? 'Yes' : 'No'} />
						<Row label="Report Delivery" value={booking.reportDeliveryAtHome ? 'At Home' : 'At Lab'} />
						<Row label="Payment Status" value={booking.paymentStatus} />
					</Section>
				</Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Stack direction="row" spacing={1}>
						<Typography variant="body2" color="text.secondary">Total</Typography>
						<Typography fontWeight={600}>{formatCurrency(booking.total)}</Typography>
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
					<Section>
						<Typography variant="subtitle1" fontWeight={600}>Booking #{selectedBooking.bookingNumber}</Typography>
						<Typography variant="body2" color="text.secondary">Booked on {formatDate(selectedBooking.date)}</Typography>
						<StatusChip label={selectedBooking.status} />
					</Section>
					<Section title="Diagnostic Center">
						<Typography variant="body2">{selectedBooking.diagnosticCenter.name}</Typography>
						<Typography variant="body2" color="text.secondary">{selectedBooking.diagnosticCenter.address}</Typography>
						<Typography variant="body2" color="text.secondary">Contact: {selectedBooking.diagnosticCenter.phone}</Typography>
						<Typography variant="body2" color="text.secondary">Email: {selectedBooking.diagnosticCenter.email}</Typography>
					</Section>
					<Section title="Tests Conducted">
						<Stack spacing={0.75}>
                                {selectedBooking.selectedTests.map((test, index) => (
								<Stack key={index} direction="row" alignItems="center" spacing={1}>
									<Typography variant="body2">{test}</Typography>
                                            {selectedBooking.reportUrls && selectedBooking.reportUrls[test] && (
										<Button size="small" variant="outlined" onClick={() => handleDownloadReport(test, selectedBooking.reportUrls[test])} sx={{ textTransform: 'none', borderRadius: 2 }}>
											Download Report
										</Button>
									)}
								</Stack>
							))}
						</Stack>
					</Section>
					<Section title="Appointment Information">
						<Row label="Appointment Date" value={formatDate(selectedBooking.bookingDate)} />
						<Row label="Appointment Time" value={selectedBooking.bookingTime} />
						<Row label="Home Collection" value={selectedBooking.homeCollectionRequired ? 'Yes' : 'No'} />
						<Row label="Report Delivery" value={selectedBooking.reportDeliveryAtHome ? 'At Home' : 'At Lab'} />
						<Row label="Payment Status" value={selectedBooking.paymentStatus} />
					</Section>
					<Section title="Totals">
						<Row label="Test Fees" value={formatCurrency(selectedBooking.testFees)} />
						<Row label="Report Delivery Fees" value={formatCurrency(selectedBooking.reportDeliveryFees)} />
						<Row label="Discount" value={`-${formatCurrency(selectedBooking.discount)}`} />
						<Row label="GST" value={formatCurrency(selectedBooking.gst)} />
						<Row label="Total Amount" value={formatCurrency(selectedBooking.total)} />
					</Section>
					<Stack direction="row" spacing={1}>
						<Button variant="contained" onClick={handleDownloadInvoice} sx={{ textTransform: 'none', borderRadius: 2 }}>
                            Download Invoice
						</Button>
						<Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>Book Again</Button>
					</Stack>
				</Stack>
			</BottomSheetDialog>
		);
	};

	if (loading) return <LoadingState label="Loading your completed lab test bookings..." />;

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
                <EmptyState icon="🔬" title="No Completed Bookings Found" subtitle="You haven't completed any lab test bookings yet." actionLabel="Book Lab Tests" />
            )}
            {renderSidePanel()}
        </Box>
    );
};

export default LabTestOrderHistory; 