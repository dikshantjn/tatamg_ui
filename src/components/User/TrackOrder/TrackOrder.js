import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackOrderService } from '../../../services/User/TrackOrder/track-order.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import { useSocket } from '../../../hooks/useSocket';
import { ToastContainer } from '../../ui/Toast';
import BloodBankPaymentService from '../../../services/payment/blood-bank-payment.service';
import { getCartItemsByOrderId } from '../../../services/User/MedicineDelivery/medicine-delivery.service';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CheckIcon from '@mui/icons-material/Check';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [medicineOrderCartItems, setMedicineOrderCartItems] = useState({});

    const { error: socketError, subscribe, unsubscribe } = useSocket(userId);

    // Define medicine order status mapping at component level
    const medicineOrderSteps = [
        'Pending',
        'WaitingForPayment',
        'PaymentCompleted',
        'OutForDelivery',
        'Delivered'
    ];
    
    const medicineOrderStatusMapping = {
        'pending': 'Pending',
        'waiting_for_payment': 'WaitingForPayment',
        'payment_completed': 'PaymentCompleted',
        'ready_to_pickup': 'PaymentCompleted', // Map ready_to_pickup to PaymentCompleted for user display
        'out_for_delivery': 'OutForDelivery',
        'delivered': 'Delivered'
    };

    const medicineOrderDisplayNames = {
        'Pending': ['Pending'],
        'WaitingForPayment': ['Waiting', 'for Payment'],
        'PaymentCompleted': ['Payment', 'Completed'],
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
            const orders = await trackOrderService.getActiveMedicineOrders();
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
            const { orderId, productOrderId, newStatus, status, totalAmount, estimatedDeliveryDate, orderType } = orderData;
            const finalOrderId = orderId || productOrderId;
            const finalStatus = newStatus || status;

            if (!finalOrderId || !finalStatus) {
                console.error('❌ Missing orderId or status in update data:', orderData);
                return;
            }

            let orderUpdated = false;
            let toastShown = false;

            // Check if this is a medicine order first
            setMedicineOrders(prevOrders => {
                const medicineOrder = prevOrders.find(order => order.orderId === finalOrderId);
                if (medicineOrder) {
                    console.log('[MedicineOrderUpdate] Updating medicine order:', {
                        orderId: finalOrderId,
                        oldStatus: medicineOrder.status,
                        newStatus: finalStatus,
                        totalAmount,
                        estimatedDeliveryDate
                    });
                    
                    const updatedOrders = prevOrders.map(order => {
                        if (order.orderId === finalOrderId) {
                            return {
                                ...order,
                                status: finalStatus,
                                totalAmount: totalAmount ?? order.totalAmount,
                                estimatedDeliveryDate: estimatedDeliveryDate ?? order.estimatedDeliveryDate
                            };
                        }
                        return order;
                    });

                    orderUpdated = true;
                    return updatedOrders;
                }
                return prevOrders;
            });

            // If medicine order was updated, show toast and return early
            if (orderUpdated) {
                addToast({
                    type: 'success',
                    title: 'Medicine Order Updated',
                    message: `Order #${finalOrderId.slice(-8)} status changed to ${finalStatus}`,
                    duration: 3000
                });
                return;
            }

            // Only update product orders if it's not a medicine order
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

                    orderUpdated = true;
                    return updatedOrders;
                }
                return prevOrders;
            });

            // Show toast for product order only if it was updated and no medicine order was found
            if (orderUpdated && !toastShown) {
                addToast({
                    type: 'success',
                    title: 'Product Order Updated',
                    message: `Order #${finalOrderId.slice(-8)} status changed to ${trackOrderService.getStatusDisplayText(finalStatus)}`,
                    duration: 3000
                });
            }

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
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Loading your orders...</Typography>
                </Paper>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Error Loading Orders</Typography>
                    <Typography sx={{ mb: 2 }}>{error}</Typography>
                    <Button variant="contained" onClick={() => { fetchOrders(); fetchAmbulanceBookings(); fetchBloodBankBookings(); fetchMedicineOrders(); }}>Try Again</Button>
                </Paper>
            </Box>
        );
    }

    if (orders.length === 0 && ambulanceBookings.length === 0 && bloodBankBookings.length === 0 && medicineOrders.length === 0) {
        return (
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>No Orders or Ambulance Bookings Found</Typography>
                    <Typography sx={{ mb: 2 }}>You haven't placed any orders or ambulance bookings yet.</Typography>
                    <Button variant="contained" onClick={() => navigate('/products')}>Start Shopping</Button>
                </Paper>
            </Box>
        );
    }

    // Horizontal Stepper helpers
    const ColorConnector = styled(StepConnector)(({ theme }) => ({
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 16,
      },
      [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.grey[300],
        borderRadius: 2,
      },
    }));

    function NumberedStepIcon(props) {
      const { active, completed, icon } = props;
      return (
        <Box
          sx={{
            width: { xs: 28, md: 32 },
            height: { xs: 28, md: 32 },
            borderRadius: '50%',
            bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.200',
            border: active ? '3px solid' : '2px solid',
            borderColor: completed ? 'success.main' : active ? 'primary.dark' : 'grey.300',
            boxShadow: active ? '0 0 0 4px rgba(25,118,210,0.12)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: completed || active ? 'common.white' : 'text.secondary'
          }}
        >
          {completed ? <CheckIcon sx={{ fontSize: { xs: 16, md: 18 } }} /> : (
            <Typography sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 700 }}>{icon}</Typography>
          )}
        </Box>
      );
    }

    const HorizontalStepper = ({ labels, activeStep }) => (
      <Box sx={{ 
        width: '100%', 
        overflowX: 'auto',
        '::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        MsOverflowStyle: 'none'
      }}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorConnector />} sx={{ minWidth: { xs: 420, md: 560 } }}>
          {labels.map((label, idx) => (
            <Step key={`${label}-${idx}`} completed={idx < activeStep}>
              <StepLabel StepIconComponent={NumberedStepIcon}>
                <Typography sx={{ fontSize: { xs: 11, md: 12 }, fontWeight: idx === activeStep ? 700 : 500 }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ mr: 1 }}>
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Typography variant={isMdUp ? 'h4' : 'h5'} fontWeight={700}>Track Your Orders</Typography>
            </Box>

            {/* Ambulance Bookings */}
            {ambulanceBookings.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {ambulanceBookings.map((booking) => {
                  const labels = booking.timelineSteps.map(s => s.title);
                  const activeIdx = Math.max(0, booking.timelineSteps.findIndex(s => s.active));
                  return (
                    <Paper key={booking.requestId} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'error.main', border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">Ambulance Booking #{booking.requestId.slice(-8)}</Typography>
                        <Chip label={booking.status} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{booking.placedAt}</Typography>
                      <HorizontalStepper labels={labels} activeStep={activeIdx === -1 ? 0 : activeIdx} />
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2">Agency: {booking.agencyProfile?.agencyName || 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Contact: {booking.agencyProfile?.contactNumber || 'N/A'}</Typography>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* Blood Bank Bookings Timeline */}
            {bloodBankBookings.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
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
                          <Paper key={booking.bookingId} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'error.main', border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="h6">Blood Bank Booking #{booking.bookingId?.slice(-8)}</Typography>
                              <Chip label={status} size="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{formattedDate}</Typography>
                            <HorizontalStepper labels={STEPS.map(s => DISPLAY_NAMES[s])} activeStep={currentStepIndex} />
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2">Blood Bank: {agency?.agencyName || 'N/A'}</Typography>
                            <Typography variant="body2" color="text.secondary">Customer: {customerName}</Typography>
                            <Typography variant="body2" color="text.secondary">Blood Types: {bloodTypes}</Typography>
                            <Typography variant="body2" color="text.secondary">Units: {units}</Typography>
                          </Paper>
                        );
                    })}
                </Box>
            )}

            {/* Medicine Orders Timeline */}
            {medicineOrders.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {medicineOrders.map((order) => {
                        // Add debug logging for initial render
                        const normalizedStatus = medicineOrderStatusMapping[order.status] || order.status;
                        const currentStepIndex = medicineOrderSteps.indexOf(normalizedStatus);
                        
                        console.log('[MedicineOrder] Rendering order:', {
                            orderId: order.orderId,
                            status: order.status,
                            normalizedStatus,
                            timelineSteps: medicineOrderSteps,
                            currentStepIndex
                        });

                        return (
                            <Paper key={order.orderId} sx={{ p: 2, borderLeft: '4px solid', borderColor: 'primary.main', border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6">Medicine Order #{order.orderId.slice(-8)}</Typography>
                                    <Chip label={medicineOrderDisplayNames[normalizedStatus]?.join(' ') || normalizedStatus} size="small" />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</Typography>
                                <HorizontalStepper labels={medicineOrderSteps.map(s => medicineOrderDisplayNames[s].join(' '))} activeStep={currentStepIndex} />
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2">Medical Store: {order.vendor?.name || 'N/A'}</Typography>
                                <Typography variant="body2" color="text.secondary">Order ID: {order.orderId}</Typography>
                                <Typography variant="body2" color="text.secondary">Prescription Status: {order.prescription?.status || 'N/A'}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>Total: ₹{order.totalAmount}</Typography>
                            </Paper>
                        );
                    })}
                </Box>
            )}

            {/* Product Orders Timeline */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orders.map((order) => (
                    <Paper key={order.orderId} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                        {/* Order Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Product Order #{order.orderId.slice(-8)}</Typography>
                            <Typography variant="body2" color="text.secondary">{order.placedAt}</Typography>
                        </Box>

                        {/* Timeline */}
                        <HorizontalStepper labels={order.timelineSteps.map(s => s.title)} activeStep={Math.max(0, order.timelineSteps.findIndex(s => s.active))} />

                        {/* Order Items */}
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle1">Order Items</Typography>
                                {shouldShowMoreButton(order.items) && (
                                    <Button size="small" onClick={() => toggleOrderExpansion(order.orderId)}>
                                        {expandedOrders[order.orderId] ? 'Show Less' : 'Show More'}
                                    </Button>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                {getVisibleItems(order.items, order.orderId).map((item) => (
                                    <Paper key={item.orderItemId} variant="outlined" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{item.VendorProduct.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.VendorProduct.category}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                                            <Typography variant="body2">₹{item.priceAtPurchase.toFixed(2)}</Typography>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                            <Typography variant="subtitle2" textAlign="right">Total: ₹{order.totalAmount.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default TrackOrder; 