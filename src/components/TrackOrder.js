import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackOrderService } from '../services/track-order.service';
import './TrackOrder.css';

const TrackOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await trackOrderService.getUserOrders();
            const formattedOrders = response.orders.map(order => 
                trackOrderService.formatOrderData(order)
            );
            setOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const shouldShowMoreButton = (items) => {
        return items.length > 3;
    };

    const getVisibleItems = (items, orderId) => {
        const isExpanded = expandedOrders[orderId];
        return isExpanded ? items : items.slice(0, 3);
    };

    if (loading) {
        return (
            <div className="track-order-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="track-order-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Error Loading Orders</h3>
                    <p>{error}</p>
                    <button className="retry-button" onClick={fetchOrders}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="track-order-container">
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet.</p>
                    <button className="shop-button" onClick={() => navigate('/products')}>
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="track-order-container">
            <div className="track-order-header">
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <h1>Track Your Orders</h1>
            </div>

            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                        {/* Order Header */}
                        <div className="order-header">
                            <h3>Order #{order.orderId.slice(-8)}</h3>
                            <span className="order-date">{order.placedAt}</span>
                        </div>

                        {/* Timeline */}
                        <div className="timeline-container">
                            <div className="timeline">
                                {order.timelineSteps.map((step, index) => (
                                    <div key={step.id} className="timeline-item">
                                        <div className={`timeline-circle ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                            {step.completed ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="step-number">{step.id}</span>
                                            )}
                                        </div>
                                        <div className="timeline-label">
                                            <span className="step-title">{step.title}</span>
                                        </div>
                                        {index < order.timelineSteps.length - 1 && (
                                            <div className={`timeline-line ${step.completed ? 'completed' : ''}`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="order-items">
                            <h4>
                                Order Items
                                {shouldShowMoreButton(order.items) && (
                                    <button 
                                        className="show-more-btn"
                                        onClick={() => toggleOrderExpansion(order.orderId)}
                                    >
                                        {expandedOrders[order.orderId] ? 'Show Less' : 'Show More'}
                                    </button>
                                )}
                            </h4>
                            <div className={`items-list ${!expandedOrders[order.orderId] && shouldShowMoreButton(order.items) ? 'collapsed' : ''}`}>
                                {getVisibleItems(order.items, order.orderId).map((item) => (
                                    <div key={item.orderItemId} className="item-row">
                                        <div className="item-info">
                                            <span className="item-name">{item.VendorProduct.name}</span>
                                            <span className="item-category">{item.VendorProduct.category}</span>
                                        </div>
                                        <div className="item-details">
                                            <span className="item-quantity">Qty: {item.quantity}</span>
                                            <span className="item-price">₹{item.priceAtPurchase.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackOrder; 