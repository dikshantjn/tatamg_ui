import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Box, Stack, Typography, Paper, Button, Avatar, Grid } from '@mui/material';
import { BottomSheetDialog, LoadingState, ErrorState, EmptyState, StatusChip, Row, Section } from './mui/Primitives';

const ProductOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const fetchDeliveredOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await orderHistoryService.getDeliveredProductOrders();
            
            if (response.success) {
                const formattedOrders = response.data.map(order => 
                    orderHistoryService.formatOrderData(order)
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
        if (selectedOrder) {
            const res = await orderHistoryService.getProductOrderInvoice(selectedOrder.orderNumber);
            if (res.success && res.data?.pdfUrl) {
                const a = document.createElement('a');
                a.href = res.data.pdfUrl;
                a.download = `product-invoice-${selectedOrder.orderNumber.slice(-8)}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    };

    const renderOrderCard = (order) => {
        return (
            <Paper key={order.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack>
                        <Typography fontWeight={600}>Order #{order.orderNumber.slice(-8)}</Typography>
                        <Typography variant="caption" color="text.secondary">Placed on {formatDate(order.date)}</Typography>
                    </Stack>
                    <StatusChip label="Delivered" />
                </Stack>
                <Stack spacing={1.25} sx={{ mb: 1.5 }}>
                    <Section title="Products">
                        <Stack spacing={1}>
                            {order.items.map((item, index) => (
                                <Stack key={index} direction="row" spacing={1.25} alignItems="center">
                                    <Avatar variant="rounded" sx={{ width: 48, height: 48 }} src={item.image || undefined}>
                                        📦
                                    </Avatar>
                                    <Stack flex={1}>
                                        <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.category} • {item.subCategory}</Typography>
                                        <Typography variant="caption" color="text.secondary">Vendor: {item.vendor}</Typography>
                                    </Stack>
                                    <Stack alignItems="flex-end">
                                        <Typography variant="body2">{formatCurrency(item.price)}</Typography>
                                        <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Section>
                    <Section title="Delivery">
                        <Row label="Address" value={order.deliveryAddress} />
                        <Row label="Estimated" value={formatDate(order.estimatedDelivery)} />
                        {order.actualDelivery && (
                            <Row label="Delivered On" value={formatDate(order.actualDelivery)} />
                        )}
                    </Section>
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
                        <Typography variant="subtitle1" fontWeight={600}>Order #{selectedOrder.orderNumber.slice(-8)}</Typography>
                        <Typography variant="body2" color="text.secondary">Placed on {formatDate(selectedOrder.date)}</Typography>
                        <StatusChip label="Delivered" />
                    </Section>
                    <Section title="Order Items">
                        <Stack spacing={1}>
                            {selectedOrder.items.map((item, index) => (
                                <Stack key={index} direction="row" spacing={1.25} alignItems="center">
                                    <Avatar variant="rounded" sx={{ width: 48, height: 48 }} src={item.image || undefined}>
                                        📦
                                    </Avatar>
                                    <Stack flex={1}>
                                        <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.category} • {item.subCategory}</Typography>
                                        <Typography variant="caption" color="text.secondary">Vendor: {item.vendor}</Typography>
                                    </Stack>
                                    <Stack alignItems="flex-end">
                                        <Typography variant="body2">{formatCurrency(item.price)}</Typography>
                                        <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                                        <Typography variant="caption" color="text.secondary">{formatCurrency(item.price * item.quantity)}</Typography>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Section>
                    <Section title="Delivery Information">
                        <Row label="Delivery Address" value={selectedOrder.deliveryAddress} />
                        <Row label="Estimated Delivery" value={formatDate(selectedOrder.estimatedDelivery)} />
                        {selectedOrder.actualDelivery && (
                            <Row label="Delivered On" value={formatDate(selectedOrder.actualDelivery)} />
                        )}
                    </Section>
                    <Section title="Total">
                        <Row label="Total Amount" value={formatCurrency(selectedOrder.total)} />
                    </Section>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" onClick={handleDownloadInvoice} sx={{ textTransform: 'none', borderRadius: 2 }}>
                            Download Invoice
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
                <EmptyState icon="📦" title="No Delivered Orders Found" subtitle="You haven't received any product orders yet." actionLabel="Browse Products" />
            )}
            {renderSidePanel()}
        </Box>
    );
};

export default ProductOrderHistory; 