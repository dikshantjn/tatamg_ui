import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackOrderService } from '../../../services/User/TrackOrder/track-order.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import { useSocket } from '../../../hooks/useSocket';
import { ToastContainer } from '../../ui/Toast';
import './TrackOrder.css';

const TrackOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();
    const userId = getUserId();
    const timelineRefs = useRef({});

    const { isConnected, error: socketError, subscribe, unsubscribe } = useSocket(userId);

    const addToast = useCallback((toast) => {
        const id = Date.now();
        setToasts(prev => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
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

    // Function to scroll to active or next node
    const scrollToActiveNode = useCallback((orderId, timelineSteps) => {
        const activeIndex = timelineSteps.findIndex(step => step.active);
        if (activeIndex !== -1) {
            const nodeRef = timelineRefs.current[`${orderId}-${activeIndex}`];
            if (nodeRef) {
                nodeRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, []);

    // Handle order status updates
    const handleOrderStatusUpdate = useCallback((data) => {
        try {
            console.log('📦 Order status update received:', data);
            
            // Parse the data if it's a string
            const orderData = typeof data === 'string' ? JSON.parse(data) : data;
            
            // Get orderId and status from the data
            const { orderId, productOrderId, newStatus, status } = orderData;
            const finalOrderId = orderId || productOrderId;
            const finalStatus = newStatus || status;

            if (!finalOrderId || !finalStatus) {
                console.error('❌ Missing orderId or status in update data:', orderData);
                return;
            }

            setOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                    if (order.orderId === finalOrderId) {
                        // Update the order with new status
                        const updatedOrder = {
                            ...order,
                            status: finalStatus,
                            timelineSteps: trackOrderService.generateTimelineSteps(finalStatus)
                        };
                        const formattedOrder = trackOrderService.formatOrderData(updatedOrder);
                        
                        // Schedule scroll after the state update
                        setTimeout(() => {
                            scrollToActiveNode(finalOrderId, formattedOrder.timelineSteps);
                        }, 100);

                        return formattedOrder;
                    }
                    return order;
                });

                return updatedOrders;
            });

            console.log(`✅ Order ${finalOrderId} status updated to: ${finalStatus}`);
            
            // Show toast notification
            addToast({
                type: 'success',
                title: 'Order Status Updated',
                message: `Order #${finalOrderId.slice(-8)} status changed to ${trackOrderService.getStatusDisplayText(finalStatus)}`,
                duration: 3000
            });
        } catch (error) {
            console.error('❌ Error handling order status update:', error);
            // Show error toast
            addToast({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update order status. Refreshing orders...',
                duration: 3000
            });
            // Refresh orders in case of error
            fetchOrders();
        }
    }, [addToast, scrollToActiveNode]);

    // Subscribe to socket events
    useEffect(() => {
        subscribe('orderStatusUpdated', handleOrderStatusUpdate);
        return () => {
            unsubscribe('orderStatusUpdated', handleOrderStatusUpdate);
        };
    }, [subscribe, unsubscribe, handleOrderStatusUpdate]);

    // Initial orders fetch
    useEffect(() => {
        fetchOrders();
    }, []);

    // Show socket connection error toast
    useEffect(() => {
        if (socketError) {
            addToast({
                type: 'error',
                title: 'Connection Error',
                message: 'Lost connection to server. Attempting to reconnect...',
                duration: 5000
            });
        }
    }, [socketError, addToast]);

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
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="track-order-header">
                <button 
                    className="back-icon-button"
                    onClick={() => navigate(-1)}
                    title="Back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
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
                                {order.timelineSteps.map((step, index, steps) => (
                                    <div 
                                        key={step.id} 
                                        className="timeline-item"
                                        ref={el => timelineRefs.current[`${order.orderId}-${index}`] = el}
                                    >
                                        {/* Show line before circle only if not first step and previous step is completed */}
                                        {index > 0 && (
                                            <div className={`timeline-line before ${steps[index - 1].completed ? 'completed' : ''}`}></div>
                                        )}
                                        
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
                                        
                                        {/* Show line after circle only if not last step and current step is completed */}
                                        {index < steps.length - 1 && (
                                            <div className={`timeline-line after ${step.completed ? 'completed' : ''}`}></div>
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