import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackOrderService } from '../../../services/User/TrackOrder/track-order.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import { useSocket } from '../../../hooks/useSocket';
import { ToastContainer } from '../../ui/Toast';
import './TrackOrder.css';
import BloodBankPaymentService from '../../../services/payment/blood-bank-payment.service';
import { getCartItemsByOrderId } from '../../../services/User/MedicineDelivery/medicine-delivery.service';

const TrackOrder = () => {
    const [orders, setOrders] = useState([]);
    const [ambulanceBookings, setAmbulanceBookings] = useState([]);
    const [bloodBankBookings, setBloodBankBookings] = useState([]);
    const [medicineOrders, setMedicineOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [toasts, setToasts] = useState([]);
    const [paymentStatusMsg, setPaymentStatusMsg] = useState(null);
    const navigate = useNavigate();
    const userId = getUserId();
    const timelineRefs = useRef({});
    const [medicineOrderCartItems, setMedicineOrderCartItems] = useState({});

    const { error: socketError, subscribe, unsubscribe } = useSocket(userId);

    // Define medicine order status mapping at component level
    const medicineOrderSteps = [
        'Pending',
        'PrescriptionVerified',
        'Accepted',
        'AddedItemsInCart',
        'PaymentConfirmed',
        'OutForDelivery',
        'Delivered'
    ];
    
    const medicineOrderStatusMapping = {
        'PENDING': 'Pending',
        'PRESCRIPTION_VERIFIED': 'PrescriptionVerified',
        'ACCEPTED': 'Accepted',
        'ADDED_ITEMS_IN_CART': 'AddedItemsInCart',
        'PAYMENT_CONFIRMED': 'PaymentConfirmed',
        'OUT_FOR_DELIVERY': 'OutForDelivery',
        'DELIVERED': 'Delivered'
    };

    const medicineOrderDisplayNames = {
        'Pending': ['Pending'],
        'PrescriptionVerified': ['Prescription', 'Verified'],
        'Accepted': ['Accepted'],
        'AddedItemsInCart': ['Items', 'Added'],
        'PaymentConfirmed': ['Payment', 'Confirmed'],
        'OutForDelivery': ['Out for', 'Delivery'],
        'Delivered': ['Delivered']
    };

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

    // Fetch ambulance bookings
    const fetchAmbulanceBookings = async () => {
        try {
            const bookings = await trackOrderService.getActiveAmbulanceBookings();
            const formatted = bookings.map(trackOrderService.formatAmbulanceBooking.bind(trackOrderService));
            setAmbulanceBookings(formatted);
        } catch (error) {
            console.error('Error fetching ambulance bookings:', error);
            setError('Failed to load ambulance bookings. Please try again.');
        }
    };

    // Fetch blood bank bookings
    const fetchBloodBankBookings = async () => {
        try {
            const bookings = await trackOrderService.getActiveBloodBankBookings();
            setBloodBankBookings(bookings);
        } catch (error) {
            console.error('Error fetching blood bank bookings:', error);
            setError('Failed to load blood bank bookings. Please try again.');
        }
    };

    // Fetch medicine orders
    const fetchMedicineOrders = async () => {
        try {
            const orders = await trackOrderService.getOngoingMedicineOrders();
            setMedicineOrders(orders);
        } catch (error) {
            if (error && error.message && error.message.includes('404')) {
                setMedicineOrders([]); // No medicine orders, but not an error
            } else {
                console.error('Error fetching medicine orders:', error);
                setError('Failed to load medicine orders. Please try again.');
            }
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

            // Check if this is a medicine order
            setMedicineOrders(prevOrders => {
                const medicineOrder = prevOrders.find(order => order.orderId === finalOrderId);
                if (medicineOrder) {
                    console.log('[MedicineOrderUpdate] Updating medicine order:', {
                        orderId: finalOrderId,
                        oldStatus: medicineOrder.orderStatus,
                        newStatus: finalStatus
                    });
                    
                    const updatedOrders = prevOrders.map(order => {
                        if (order.orderId === finalOrderId) {
                            return {
                                ...order,
                                orderStatus: finalStatus
                            };
                        }
                        return order;
                    });

                    // Show toast notification for medicine order
                    addToast({
                        type: 'success',
                        title: 'Medicine Order Updated',
                        message: `Order #${finalOrderId.slice(-8)} status changed to ${finalStatus}`,
                        duration: 3000
                    });

                    return updatedOrders;
                }
                return prevOrders;
            });

            // If not a medicine order, update product orders
            setOrders(prevOrders => {
                const productOrder = prevOrders.find(order => order.orderId === finalOrderId);
                if (productOrder) {
                const updatedOrders = prevOrders.map(order => {
                    if (order.orderId === finalOrderId) {
                        const updatedOrder = {
                            ...order,
                            status: finalStatus,
                            timelineSteps: trackOrderService.generateTimelineSteps(finalStatus)
                        };
                        const formattedOrder = trackOrderService.formatOrderData(updatedOrder);
                        
                        setTimeout(() => {
                            scrollToActiveNode(finalOrderId, formattedOrder.timelineSteps);
                        }, 100);

                        return formattedOrder;
                    }
                    return order;
                });

                    // Show toast notification for product order
            addToast({
                type: 'success',
                        title: 'Product Order Updated',
                        message: `Order #${finalOrderId.slice(-8)} status changed to ${trackOrderService.getStatusDisplayText(finalStatus)}`,
                duration: 3000
                    });

                    return updatedOrders;
                }
                return prevOrders;
            });

        } catch (error) {
            console.error('❌ Error handling order status update:', error);
            addToast({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update order status. Refreshing orders...',
                duration: 3000
            });
            // Refresh orders in case of error
            fetchOrders();
            fetchMedicineOrders();
        }
    }, [addToast, scrollToActiveNode, fetchOrders, fetchMedicineOrders]);

    // Handle ambulance booking status updates
    const handleAmbulanceStatusUpdate = useCallback((data) => {
        try {
            const bookingData = typeof data === 'string' ? JSON.parse(data) : data;
            const { requestId, status: newStatus } = bookingData;
            if (!requestId || !newStatus) return;
            setAmbulanceBookings(prev => prev.map(booking => {
                if (booking.requestId === requestId) {
                    const updated = { ...booking, status: newStatus };
                    const formatted = trackOrderService.formatAmbulanceBooking(updated);
                    setTimeout(() => {
                        scrollToActiveNode(requestId, formatted.timelineSteps);
                    }, 100);
                    return formatted;
                }
                return booking;
            }));
            addToast({
                type: 'success',
                title: 'Ambulance Status Updated',
                message: `Booking #${requestId.slice(-8)} status changed to ${newStatus}`,
                duration: 3000
            });
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Ambulance Update Failed',
                message: 'Failed to update ambulance status. Refreshing bookings...',
                duration: 3000
            });
            fetchAmbulanceBookings();
        }
    }, [addToast, scrollToActiveNode]);

    // Handle medicine order status updates
    const handleMedicineOrderUpdate = useCallback((data) => {
        try {
            const update = typeof data === 'string' ? JSON.parse(data) : data;
            const { orderId, status, totalAmount, estimatedDeliveryDate } = update;
            console.log('[MedicineOrderUpdate] Received update:', {
                orderId,
                status,
                totalAmount,
                estimatedDeliveryDate
            });
            
            setMedicineOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => {
                if (order.orderId === orderId) {
                        console.log('[MedicineOrderUpdate] Updating order:', {
                            before: order.orderStatus,
                            after: status
                        });
                    return {
                        ...order,
                        orderStatus: status,
                        totalAmount: totalAmount ?? order.totalAmount,
                        estimatedDeliveryDate: estimatedDeliveryDate ?? order.estimatedDeliveryDate,
                    };
                }
                return order;
                });
                return updatedOrders;
            });

            addToast({
                type: 'success',
                title: 'Medicine Order Updated',
                message: `Order #${orderId?.slice(-8)} status changed to ${status}`,
                duration: 3000
            });
        } catch (error) {
            console.error('[MedicineOrderUpdate] Error:', error);
            addToast({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update medicine order status.',
                duration: 3000
            });
        }
    }, [addToast]);

    // Subscribe to socket events
    useEffect(() => {
        subscribe('orderStatusUpdated', handleOrderStatusUpdate);
        return () => {
            unsubscribe('orderStatusUpdated', handleOrderStatusUpdate);
        };
    }, [subscribe, unsubscribe, handleOrderStatusUpdate]);

    // Subscribe to ambulance booking socket events
    useEffect(() => {
        subscribe('ambulanceBookingUpdated', handleAmbulanceStatusUpdate);
        return () => {
            unsubscribe('ambulanceBookingUpdated', handleAmbulanceStatusUpdate);
        };
    }, [subscribe, unsubscribe, handleAmbulanceStatusUpdate]);

    // Subscribe to blood bank booking socket events
    useEffect(() => {
        const handleBloodBankBookingUpdate = (data) => {
            // Accept both stringified and object data
            const bookingData = typeof data === 'string' ? JSON.parse(data) : data;
            if (!bookingData?.bookingId && !bookingData?.requestId) return;
            fetchBloodBankBookings();
        };
        subscribe('bloodBankBookingUpdated', handleBloodBankBookingUpdate);
        return () => {
            unsubscribe('bloodBankBookingUpdated', handleBloodBankBookingUpdate);
        };
    }, [subscribe, unsubscribe]);

    // Subscribe to medicine order socket events
    useEffect(() => {
        console.log('[MedicineOrderUpdate] Subscribing to MedicineOrderUpdate event');
        subscribe('MedicineOrderUpdate', handleMedicineOrderUpdate);
        return () => {
            console.log('[MedicineOrderUpdate] Unsubscribing from MedicineOrderUpdate event');
            unsubscribe('MedicineOrderUpdate', handleMedicineOrderUpdate);
        };
    }, [subscribe, unsubscribe, handleMedicineOrderUpdate]);

    // Initial orders fetch
    useEffect(() => {
        fetchOrders();
        fetchAmbulanceBookings();
        fetchBloodBankBookings();
        fetchMedicineOrders();
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

    const handleBloodBankPayNow = (booking) => {
        setPaymentStatusMsg(null);
        BloodBankPaymentService.processPayment(
          {
            amount: booking.totalAmount,
            bookingId: booking.bookingId,
            user: booking.user,
            description: `Blood Bank Booking #${booking.bookingId}`
          },
          (response) => {
            setPaymentStatusMsg('Payment successful!');
            fetchBloodBankBookings();
          },
          (error) => {
            setPaymentStatusMsg('Payment failed: ' + error);
          }
        );
    };

    useEffect(() => {
        if (medicineOrders.length > 0) {
            medicineOrders.forEach(async (order) => {
                if (!medicineOrderCartItems[order.orderId]) {
                    try {
                        const items = await getCartItemsByOrderId(order.orderId);
                        setMedicineOrderCartItems(prev => ({ ...prev, [order.orderId]: items }));
                    } catch (e) {
                        setMedicineOrderCartItems(prev => ({ ...prev, [order.orderId]: [] }));
                    }
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [medicineOrders]);

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
                    <button className="retry-button" onClick={() => { fetchOrders(); fetchAmbulanceBookings(); fetchBloodBankBookings(); fetchMedicineOrders(); }}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0 && ambulanceBookings.length === 0 && bloodBankBookings.length === 0 && medicineOrders.length === 0) {
        return (
            <div className="track-order-container">
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No Orders or Ambulance Bookings Found</h3>
                    <p>You haven't placed any orders or ambulance bookings yet.</p>
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

            {/* Ambulance Bookings Timeline */}
            {ambulanceBookings.length > 0 && (
                <div className="orders-grid">
                    {ambulanceBookings.map((booking) => (
                        <div key={booking.requestId} className="order-card ambulance-booking-card">
                            <div className="order-header">
                                <h3>Ambulance Booking #{booking.requestId.slice(-8)}</h3>
                                <span className="order-date">{booking.placedAt}</span>
                                <span className="order-status">{booking.status}</span>
                            </div>
                            <div className="timeline-container trackorder-timeline-container">
                                <div className="timeline trackorder-timeline">
                                    {booking.timelineSteps.map((step, index, steps) => (
                                        <div
                                            key={step.id}
                                            className="timeline-item"
                                            ref={el => timelineRefs.current[`${booking.requestId}-${index}`] = el}
                                        >
                                            {index > 0 && (
                                                <div className={`timeline-line before ${steps[index - 1].completed ? 'completed' : ''}`}></div>
                                            )}
                                            <div className={`timeline-circle ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                                {step.completed ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : step.active ? (
                                                    <svg className="tick-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="step-number">{step.id}</span>
                                                )}
                                            </div>
                                            <div className="timeline-label">
                                                <span className="step-title">{step.title}</span>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`timeline-line after ${step.completed ? 'completed' : ''}`}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="order-items">
                                <h4>Agency: {booking.agencyProfile?.agencyName || 'N/A'}</h4>
                                <div className="item-row">
                                    <div className="item-info">
                                        <span className="item-name">Contact: {booking.agencyProfile?.contactNumber || 'N/A'}</span>
                                    </div>
                                    <div className="item-details">
                                        <span className="item-quantity">Status: {booking.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Blood Bank Bookings Timeline */}
            {bloodBankBookings.length > 0 && (
                <div className="orders-grid">
                    {bloodBankBookings.map((booking) => {
                        // Timeline logic (replicate from OngoingBloodBankBookingModal.js)
                        const status = booking.status || booking.bloodRequest?.status || 'PENDING';
                        let currentStepIndex = 0;
                        if (status === 'WaitingForPayment' || status === 'PaymentCompleted') {
                          currentStepIndex = 2;
                        } else if (status === 'WaitingForPickup') {
                          currentStepIndex = 3;
                        } else if (status === 'COMPLETED') {
                          currentStepIndex = 4;
                        } else if (status === 'CONFIRMED') {
                          currentStepIndex = 1;
                        } else {
                          currentStepIndex = 0;
                        }
                        const STEPS = [
                          'PENDING',
                          'CONFIRMED',
                          'PAYMENT',
                          'WaitingForPickup',
                          'COMPLETED',
                        ];
                        const DISPLAY_NAMES = {
                          'PENDING': 'Pending',
                          'CONFIRMED': 'Confirmed',
                          'PAYMENT': 'Waiting for Payment',
                          'WaitingForPickup': 'Waiting for Pickup',
                          'COMPLETED': 'Completed',
                        };
                        const getLabelLines = (label) => {
                          if (label === 'Waiting for Pickup') return ['Waiting', 'for Pickup'];
                          if (label === 'Waiting for Payment') return ['Waiting', 'for Payment'];
                          if (label === 'Payment Completed') return ['Payment', 'Completed'];
                          return [label];
                        };
                        const agency = booking.agency;
                        const bloodRequest = booking.bloodRequest || {};
                        const formattedDate = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A';
                        const customerName = booking.customerName || booking.user?.name || 'Anonymous';
                        const bloodTypes = Array.isArray(bloodRequest.bloodType) ? bloodRequest.bloodType.join(', ') : (bloodRequest.bloodType || 'N/A');
                        const units = bloodRequest.units || 'N/A';
                        const isWaitingForPayment = status === 'WaitingForPayment';
                        const isPaymentCompleted = status === 'PaymentCompleted' || booking.paymentStatus === 'PAID';
                        const hasPaymentInfo = booking.totalAmount != null;
                        return (
                          <div key={booking.bookingId} className="order-card bloodbank-booking-card">
                            <div className="order-header">
                              <h3>Blood Bank Booking #{booking.bookingId?.slice(-8)}</h3>
                              <span className="order-date">{formattedDate}</span>
                              <span className="order-status">{status}</span>
                            </div>
                            <div className="timeline-container trackorder-timeline-container">
                              <div className="timeline trackorder-timeline">
                                {STEPS.map((step, idx) => {
                                  let label = DISPLAY_NAMES[step];
                                  let isActive = idx === currentStepIndex;
                                  let isCompleted = idx < currentStepIndex;
                                  let isFilled = isCompleted || isActive;
                                  if (step === 'PAYMENT') {
                                    if (status === 'PaymentCompleted' || status === 'WaitingForPickup' || status === 'COMPLETED') {
                                      label = 'Payment Completed';
                                      isCompleted = true;
                                      isFilled = true;
                                    } else if (status === 'WaitingForPayment') {
                                      label = 'Waiting for Payment';
                                      isActive = true;
                                      isFilled = true;
                                    }
                                  }
                                  const isLast = idx === STEPS.length - 1;
                                  const labelLines = getLabelLines(label);
                                  return (
                                    <div className="timeline-item" key={step}>
                                      {idx > 0 && (
                                        <div className={`timeline-line before ${isFilled ? 'completed' : ''}`}></div>
                                      )}
                                      <div className={`timeline-circle${isFilled ? ' filled' : ''}${isActive ? ' active' : ''}`}> 
                                        <span className={`timeline-number${isFilled ? ' filled' : ''}`}>{isCompleted ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : idx + 1}</span>
                                      </div>
                                      <div className={`timeline-label${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>{labelLines.map((line, i) => <div key={i}>{line}</div>)}</div>
                                      {!isLast && (
                                        <div className={`timeline-line after ${isFilled ? 'completed' : ''}`}></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="order-items">
                              <h4>Blood Bank: {agency?.agencyName || 'N/A'}</h4>
                              <div className="item-row">
                                <div className="item-info">
                                  <span className="item-name">Customer Name: {customerName}</span>
                                  <span className="item-name">Blood Types: {bloodTypes}</span>
                                  <span className="item-name">Units: {units}</span>
                                  <span className="item-name">Date: {formattedDate}</span>
                                </div>
                                <div className="item-details">
                                  <span className="item-quantity">Status: {status}</span>
                                  {hasPaymentInfo && (
                                    <span className="item-price">Amount: ₹{(typeof booking.totalAmount === 'number' && !isNaN(booking.totalAmount))
                                      ? booking.totalAmount.toFixed(2)
                                      : (typeof booking.totalAmount === 'string' && !isNaN(parseFloat(booking.totalAmount)))
                                        ? parseFloat(booking.totalAmount).toFixed(2)
                                        : '--'}</span>
                                  )}
                                  {isPaymentCompleted && <span className="item-status paid">PAID</span>}
                                  {isWaitingForPayment && <span className="item-status pending">PENDING</span>}
                                  {isWaitingForPayment && (
                                    <button className="pay-now-btn" onClick={() => handleBloodBankPayNow(booking)}>
                                      Pay Now
                                    </button>
                                  )}
                                  {paymentStatusMsg && (
                                    <div className={`payment-status-msg ${paymentStatusMsg.startsWith('Payment successful') ? 'success' : 'error'}`}>{paymentStatusMsg}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                    })}
                </div>
            )}

            {/* Medicine Orders Timeline */}
            {medicineOrders.length > 0 && (
                <div className="orders-grid">
                    {medicineOrders.map((order) => {
                        // Add debug logging for initial render
                        const normalizedStatus = medicineOrderStatusMapping[order.orderStatus] || order.orderStatus;
                        const currentStepIndex = medicineOrderSteps.indexOf(normalizedStatus);
                        
                        console.log('[MedicineOrder] Rendering order:', {
                            orderId: order.orderId,
                            status: order.orderStatus,
                            normalizedStatus,
                            timelineSteps: medicineOrderSteps,
                            currentStepIndex
                        });

                        return (
                            <div key={order.orderId} className="order-card medicine-order-card">
                                <div className="order-header">
                                    <h3>Medicine Order #{order.orderId.slice(-8)}</h3>
                                    <span className="order-date">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</span>
                                    <span className={`order-status-badge status-${normalizedStatus.toLowerCase()}`}>
                                        {medicineOrderDisplayNames[normalizedStatus]?.join(' ') || normalizedStatus}
                                    </span>
                                </div>
                                <div className="timeline-container trackorder-timeline-container">
                                    <div className="timeline trackorder-timeline">
                                        {medicineOrderSteps.map((step, idx, arr) => {
                                            const isActive = idx === currentStepIndex;
                                            const isCompleted = idx < currentStepIndex;
                                            
                                            console.log('Timeline Step Status:', {
                                                step,
                                                idx,
                                                currentStepIndex,
                                                isActive,
                                                isCompleted,
                                                orderStatus: order.orderStatus
                                            });

                                            const isLast = idx === arr.length - 1;
                                            const lines = medicineOrderDisplayNames[step] || [step];
                                            
                                            return (
                                                <div className="timeline-item" key={step}>
                                                    {idx > 0 && (
                                                        <div className={`timeline-line before ${isCompleted ? 'completed' : ''}`}></div>
                                                    )}
                                                    <div className={`timeline-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}> 
                                                        <span className="timeline-number">
                                                            {isCompleted ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" style={{width:16,height:16}}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                idx + 1
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className={`timeline-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                                        {lines.map((line, i) => <div key={i}>{line}</div>)}
                                                    </div>
                                                    {!isLast && (
                                                        <div className={`timeline-line after ${isCompleted ? 'completed' : ''}`}></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="order-items">
                                    {order.totalAmount && <span className="item-price">Total: ₹{order.totalAmount}</span>}
                                    <div className="cart-items-list">
                                        {medicineOrderCartItems[order.orderId]?.length > 0 ? (
                                            medicineOrderCartItems[order.orderId].map(item => (
                                                <div key={item.cartId} className="item-row">
                                                    <div className="item-info">
                                                        <span className="item-name">{item.MedicineProduct?.name || item.name}</span>
                                                    </div>
                                                    <div className="item-details">
                                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                                        <span className="item-price">₹{item.price}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-cart-items">No items found for this order.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Product Orders Timeline */}
            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                        {/* Order Header */}
                        <div className="order-header">
                            <h3>Product Order #{order.orderId.slice(-8)}</h3>
                            <span className="order-date">{order.placedAt}</span>
                        </div>

                        {/* Timeline */}
                        <div className="timeline-container trackorder-timeline-container">
                            <div className="timeline trackorder-timeline">
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
                                            ) : step.active ? (
                                                <svg className="tick-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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