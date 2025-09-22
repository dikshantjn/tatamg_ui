import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

const MedicineOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const fetchDeliveredOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderHistoryService.getDeliveredMedicineOrders();
            if (response.success) {
                const formattedOrders = response.data.map(order => 
                    orderHistoryService.formatMedicineOrderData(order)
                );
                setOrders(formattedOrders);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders. Please try again.');
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

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsSidePanelOpen(true);
    };

    const handleCloseSidePanel = () => {
        setIsSidePanelOpen(false);
        setSelectedOrder(null);
    };

	const handleDownloadInvoice = async () => {
		if (!selectedOrder) return;
            setInvoiceLoading(true);
            try {
			const response = await orderHistoryService.getMedicineInvoice(selectedOrder.orderNumber);
			if (response.success && response.data?.pdfUrl) {
				const a = document.createElement('a');
				a.href = response.data.pdfUrl;
				a.download = `medicine-invoice-${selectedOrder.orderNumber}.pdf`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
                } else {
                    console.error('Failed to fetch invoice:', response.message);
                }
            } catch (error) {
                console.error('Error fetching invoice:', error);
            } finally {
                setInvoiceLoading(false);
		}
	};

    const renderOrderCard = (order) => {
        return (
			<Paper key={order.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
					<Stack>
						<Typography fontWeight={600}>Order #{order.orderNumber}</Typography>
						<Typography variant="caption" color="text.secondary">Placed on {formatDate(order.date)}</Typography>
					</Stack>
					<StatusChip label={order.status} />
				</Stack>
				<Stack spacing={0.5} sx={{ mb: 1.5 }}>
					<Row label="Payment Method" value={order.paymentMethod} />
					<Row label="Payment Status" value={order.paymentStatus} />
                        {order.actualDelivery && (
						<Row label="Delivered On" value={formatDate(order.actualDelivery)} />
					)}
				</Stack>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Stack direction="row" spacing={1}>
						<Typography variant="body2" color="text.secondary">Total</Typography>
						<Typography fontWeight={600}>{formatCurrency(order.total)}</Typography>
					</Stack>
					<Stack direction="row" spacing={1}>
						<Button variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 2 }} onClick={() => handleViewDetails(order)}>View Details</Button>
						<Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>Reorder</Button>
					</Stack>
				</Stack>
			</Paper>
        );
    };

    const renderSidePanel = () => {
        if (!selectedOrder) return null;
        return (
			<BottomSheetDialog
				open={isSidePanelOpen}
				onClose={handleCloseSidePanel}
				title="Order Details"
				actions={null}
			>
				<Stack spacing={2}>
					<Section>
						<Typography variant="subtitle1" fontWeight={600}>Order #{selectedOrder.orderNumber}</Typography>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography variant="body2" color="text.secondary">Placed on {formatDate(selectedOrder.date)}</Typography>
							<StatusChip label={selectedOrder.status} />
						</Stack>
					</Section>

                            {selectedOrder.vendor && (
						<Section title="Vendor Information">
							<Row label="Name" value={selectedOrder.vendor.name} />
						</Section>
                            )}

                            {selectedOrder.deliveryAddress && (
						<Section title="Delivery Address">
							<Typography variant="body2">{selectedOrder.deliveryAddress.houseStreet}</Typography>
							<Typography variant="body2">{selectedOrder.deliveryAddress.addressLine1}</Typography>
							<Typography variant="body2">{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.zipCode}</Typography>
							<Typography variant="body2">Type: {selectedOrder.deliveryAddress.addressType}</Typography>
						</Section>
                            )}

                            {selectedOrder.prescription && (
						<Section title="Prescription Details">
							<Row label="Status" value={selectedOrder.prescription.status} />
						</Section>
					)}

					<Section title="Payment Information">
						<Row label="Payment Method" value={selectedOrder.paymentMethod} />
						<Row label="Payment Status" value={selectedOrder.paymentStatus} />
						<Row label="Transaction ID" value={selectedOrder.transactionId} />
					</Section>

					<Section title="Totals">
						<Row label="Subtotal" value={formatCurrency(selectedOrder.subtotal)} />
						<Row label="Delivery Charge" value={formatCurrency(selectedOrder.deliveryCharge)} />
						<Row label="Platform Fee" value={formatCurrency(selectedOrder.platformFee)} />
						<Row label="Discount" value={`-${formatCurrency(selectedOrder.discountAmount)}`} />
						<Row label="Total Amount" value={formatCurrency(selectedOrder.total)} />
					</Section>

					<Stack direction="row" spacing={1}>
						<Button variant="contained" onClick={handleDownloadInvoice} disabled={invoiceLoading} sx={{ textTransform: 'none', borderRadius: 2 }}>
							{invoiceLoading ? 'Downloading...' : 'Download Invoice'}
						</Button>
						<Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>Reorder</Button>
					</Stack>
				</Stack>
			</BottomSheetDialog>
		);
	};

	if (loading) return <LoadingState label="Loading your delivered orders..." />;

	if (error) return <ErrorState message={error} onRetry={fetchDeliveredOrders} />;

    return (
		<Box>
                {orders.length > 0 ? (
				<Grid container spacing={2}>
					{orders.map((order) => (
						<Grid key={order.id} item xs={12} md={6}>
							{renderOrderCard(order)}
						</Grid>
					))}
				</Grid>
			) : (
				<EmptyState icon="💊" title="No Delivered Orders Found" subtitle="You haven't received any medicine orders yet." actionLabel="Order Medicines" />
			)}
            {renderSidePanel()}
		</Box>
	);
};

export default MedicineOrderHistory; 