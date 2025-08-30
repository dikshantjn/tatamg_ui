import React, { useState, useEffect } from 'react';
import orderHistoryService from '../../../services/User/orderHistory.service';
import './ProductOrderHistory.css';

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

    const handleDownloadInvoice = () => {
        if (selectedOrder) {
            // Generate and download invoice
            // Create a simple text invoice (you can enhance this to generate PDF)
            const invoiceText = `
INVOICE
Order #${selectedOrder.orderNumber.slice(-8)}
Date: ${formatDate(selectedOrder.date)}

Items:
${selectedOrder.items.map(item => 
    `${item.name} - ${item.quantity}x ${formatCurrency(item.price)}`
).join('\n')}

Total: ${formatCurrency(selectedOrder.total)}

Delivery Address:
${selectedOrder.deliveryAddress}
            `;
            
            const blob = new Blob([invoiceText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${selectedOrder.orderNumber.slice(-8)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };

    const renderOrderCard = (order) => {
        return (
            <div key={order.id} className="product-order-card">
                <div className="order-header">
                    <div className="order-info">
                        <h3 className="order-number">Order #{order.orderNumber.slice(-8)}</h3>
                        <p className="order-date">Placed on {formatDate(order.date)}</p>
                    </div>
                    <div className="order-status">
                        <span className="status-badge delivered">
                            Delivered
                        </span>
                    </div>
                </div>

                <div className="order-content">
                    <div className="order-items">
                        <h4>Products:</h4>
                        <div className="items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="item-card">
                                    <div className="item-image">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <div className="no-image">📦</div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <h5 className="item-name">{item.name}</h5>
                                        <p className="item-category">{item.category} • {item.subCategory}</p>
                                        <p className="item-vendor">Vendor: {item.vendor}</p>
                                        <div className="item-price-qty">
                                            <span className="item-price">{formatCurrency(item.price)}</span>
                                            <span className="item-quantity">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-details">
                        <div className="detail-row">
                            <span className="detail-label">Delivery Address:</span>
                            <span className="detail-value">{order.deliveryAddress}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Estimated Delivery:</span>
                            <span className="detail-value">{formatDate(order.estimatedDelivery)}</span>
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
                                <h3>Order #{selectedOrder.orderNumber.slice(-8)}</h3>
                                <p className="order-date">Placed on {formatDate(selectedOrder.date)}</p>
                                <span className="status-badge delivered">Delivered</span>
                            </div>

                            <div className="order-items-detail">
                                <h4>Order Items</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="detail-item">
                                        <div className="item-image">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <div className="no-image">📦</div>
                                            )}
                                        </div>
                                        <div className="item-info">
                                            <h5>{item.name}</h5>
                                            <p className="item-category">{item.category} • {item.subCategory}</p>
                                            <p className="item-vendor">Vendor: {item.vendor}</p>
                                            <div className="item-pricing">
                                                <span className="price">{formatCurrency(item.price)}</span>
                                                <span className="quantity">Qty: {item.quantity}</span>
                                                <span className="subtotal">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="delivery-info">
                                <h4>Delivery Information</h4>
                                <div className="info-row">
                                    <span className="label">Delivery Address:</span>
                                    <span className="value">{selectedOrder.deliveryAddress}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Estimated Delivery:</span>
                                    <span className="value">{formatDate(selectedOrder.estimatedDelivery)}</span>
                                </div>
                                {selectedOrder.actualDelivery && (
                                    <div className="info-row">
                                        <span className="label">Delivered On:</span>
                                        <span className="value">{formatDate(selectedOrder.actualDelivery)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="order-total-section">
                                <div className="total-row">
                                    <span className="total-label">Total Amount:</span>
                                    <span className="total-amount">{formatCurrency(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-panel-footer">
                        <button className="download-invoice-btn" onClick={handleDownloadInvoice}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice
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
            <div className="product-orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your delivered orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-orders-container">
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
        <div className="product-orders-container">
            <div className="orders-section">
                {orders.length > 0 ? (
                    <div className="orders-grid">
                        {orders.map((order) => renderOrderCard(order))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Delivered Orders Found</h3>
                        <p>You haven't received any product orders yet.</p>
                        <button className="browse-btn">Browse Products</button>
                    </div>
                )}
            </div>

            {renderSidePanel()}
        </div>
    );
};

export default ProductOrderHistory; 