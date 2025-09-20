import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './MedicineOrderHistory.css';

const MedicineOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    const [invoiceData, setInvoiceData] = useState(null);
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
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

    const handleViewInvoice = async () => {
        if (selectedOrder) {
            setInvoiceLoading(true);
            try {
                const response = await orderHistoryService.getInvoice(selectedOrder.orderNumber);
                if (response.success) {
                    setInvoiceData(response.data);
                    setIsInvoiceDialogOpen(true);
                } else {
                    console.error('Failed to fetch invoice:', response.message);
                }
            } catch (error) {
                console.error('Error fetching invoice:', error);
            } finally {
                setInvoiceLoading(false);
            }
        }
    };

    const handleCloseInvoiceDialog = () => {
        setIsInvoiceDialogOpen(false);
        setInvoiceData(null);
    };

    const handleDownloadInvoice = () => {
        if (invoiceData) {
            const url = window.URL.createObjectURL(invoiceData.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${selectedOrder.orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };


    const renderOrderCard = (order) => {
        return (
            <div key={order.id} className="medicine-order-card">
                <div className="order-header">
                    <div className="order-info">
                        <h3 className="order-number">Order #{order.orderNumber}</h3>
                        <p className="order-date">Placed on {formatDate(order.date)}</p>
                    </div>
                    <div className="order-status">
                        <span className="status-badge delivered">
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="order-content">
                    <div className="order-details">
                        <div className="detail-row">
                            <span className="detail-label">Payment Method:</span>
                            <span className="detail-value">{order.paymentMethod}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Payment Status:</span>
                            <span className="detail-value">{order.paymentStatus}</span>
                        </div>
                        {order.actualDelivery && (
                            <div className="detail-row">
                                <span className="detail-label">Delivered On:</span>
                                <span className="detail-value">{formatDate(order.actualDelivery)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="order-footer">
                    <div className="order-total">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-amount">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="order-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => handleViewDetails(order)}
                        >
                            View Details
                        </button>
                        <button className="action-btn secondary">Reorder</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSidePanel = () => {
        if (!selectedOrder) return null;

        return (
            <div className={`side-panel-overlay ${isSidePanelOpen ? 'active' : ''}`} onClick={handleCloseSidePanel}>
                <div className="side-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="side-panel-header">
                        <h2>Order Details</h2>
                        <button className="close-btn" onClick={handleCloseSidePanel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="side-panel-content">
                        <div className="order-summary">
                            <div className="order-basic-info">
                                <h3>Order #{selectedOrder.orderNumber}</h3>
                                <p className="order-date">Placed on {formatDate(selectedOrder.date)}</p>
                                <span className="status-badge delivered">{selectedOrder.status}</span>
                            </div>


                            {selectedOrder.vendor && (
                                <div className="vendor-info">
                                    <h5>Vendor Information</h5>
                                    <p><strong>Name:</strong> {selectedOrder.vendor.name}</p>
                                </div>
                            )}

                            {selectedOrder.deliveryAddress && (
                                <div className="address-info">
                                    <h5>Delivery Address</h5>
                                    <p><strong>Address:</strong> {selectedOrder.deliveryAddress.houseStreet}</p>
                                    <p><strong>Area:</strong> {selectedOrder.deliveryAddress.addressLine1}</p>
                                    <p><strong>City:</strong> {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}</p>
                                    <p><strong>Pincode:</strong> {selectedOrder.deliveryAddress.zipCode}</p>
                                    <p><strong>Type:</strong> {selectedOrder.deliveryAddress.addressType}</p>
                                        </div>
                            )}

                            {selectedOrder.prescription && (
                                <div className="vendor-info">
                                    <h5>Prescription Details</h5>
                                    <p><strong>Status:</strong> {selectedOrder.prescription.status}</p>
                                            </div>
                            )}

                            <div className="payment-info">
                                <h4>Payment Information</h4>
                                <div className="info-row">
                                    <span className="label">Payment Method:</span>
                                    <span className="value">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment Status:</span>
                                    <span className="value">{selectedOrder.paymentStatus}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Transaction ID:</span>
                                    <span className="value">{selectedOrder.transactionId}</span>
                                </div>
                            </div>

                            <div className="order-total-section">
                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Delivery Charge:</span>
                                    <span>{formatCurrency(selectedOrder.deliveryCharge)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Platform Fee:</span>
                                    <span>{formatCurrency(selectedOrder.platformFee)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Discount:</span>
                                    <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total Amount:</span>
                                    <span>{formatCurrency(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-panel-footer">
                        <button className="download-invoice-btn" onClick={handleViewInvoice} disabled={invoiceLoading}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {invoiceLoading ? 'Loading...' : 'View Invoice'}
                        </button>
                        <button className="reorder-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Reorder
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="medicine-orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your delivered orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="medicine-orders-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Orders</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchDeliveredOrders}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="medicine-orders-container">
            <div className="orders-section">
                {orders.length > 0 ? (
                    <div className="orders-grid">
                        {orders.map((order) => renderOrderCard(order))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">💊</div>
                        <h3>No Delivered Orders Found</h3>
                        <p>You haven't received any medicine orders yet.</p>
                        <button className="browse-btn">Order Medicines</button>
                    </div>
                )}
            </div>

            {renderSidePanel()}
            {renderInvoiceDialog()}
        </div>
    );

    function renderInvoiceDialog() {
        if (!isInvoiceDialogOpen) return null;

        return (
            <div className="invoice-dialog-overlay" onClick={handleCloseInvoiceDialog}>
                <div className="invoice-dialog" onClick={(e) => e.stopPropagation()}>
                    <div className="invoice-dialog-header">
                        <h2>Invoice - Order #{selectedOrder?.orderNumber}</h2>
                        <button className="invoice-close-btn" onClick={handleCloseInvoiceDialog}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="invoice-dialog-content">
                        {invoiceData ? (
                            <iframe
                                src={invoiceData.pdfUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                                title={`Invoice for Order ${selectedOrder?.orderNumber}`}
                            />
                        ) : (
                            <div className="invoice-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading invoice...</p>
                            </div>
                        )}
                    </div>

                    <div className="invoice-dialog-footer">
                        <button className="invoice-download-btn" onClick={handleDownloadInvoice}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice
                        </button>
                        <button className="invoice-close-dialog-btn" onClick={handleCloseInvoiceDialog}>
                            Close
                        </button>
                    </div>
                </div>
        </div>
    );
    }
};

export default MedicineOrderHistory; 