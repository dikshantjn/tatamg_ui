import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OutlinedButton from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CallIcon from '@mui/icons-material/Call';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { styled } from '@mui/material/styles';
import './OngoingAmbulanceBookingModal.css';
import AmbulanceBookingPaymentService from '../../../services/payment/ambulance-booking-payment.service';
import { getUserData } from '../../../services/User/Auth/auth.utils';
import { PAYMENT_ERRORS } from '../../../config/payment.config';
import { useSocket } from '../../../hooks/useSocket';

// Helper: Receipt Row
function ReceiptRow({ label, value, bold }) {
  return (
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Typography fontWeight={bold ? 700 : 400}>{label}</Typography>
      <Typography fontWeight={bold ? 700 : 400}>{value}</Typography>
    </Box>
  );
}

// Helper: Timeline (connected, continuous, custom CSS, with numbered filled nodes)
function Timeline({ steps, currentStepIndex }) {
  const containerRef = React.useRef(null);
  const nodeRefs = React.useRef([]);

  React.useEffect(() => {
    if (nodeRefs.current[currentStepIndex] && containerRef.current) {
      nodeRefs.current[currentStepIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStepIndex]);

  return (
    <div className="timeline-container" ref={containerRef}>
      <div className="timeline">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          const isLast = idx === steps.length - 1;
          const isFilled = isCompleted || isActive;
          return (
            <div className="timeline-item" key={step} ref={el => nodeRefs.current[idx] = el}>
              {/* Line before node */}
              {idx > 0 && (
                <div className={`timeline-line before ${isFilled ? 'completed' : ''}`}></div>
              )}
              {/* Node with number */}
              <div className={`timeline-circle${isFilled ? ' filled' : ''}${isActive ? ' active' : ''}`}> 
                <span className={`timeline-number${isFilled ? ' filled' : ''}`}>{idx + 1}</span>
              </div>
              {/* Step label */}
              <div className={`timeline-label${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>{step}</div>
              {/* Line after node */}
              {!isLast && (
                <div className={`timeline-line after ${isFilled ? 'completed' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper: Pickup/Drop Timeline
function PickupDropTimeline({ pickup, drop }) {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box width={10} height={10} borderRadius="50%" bgcolor="teal.main" mb={0.5} />
        <Typography variant="caption">Pickup</Typography>
        <Typography variant="body2" fontSize={12} color="text.secondary" maxWidth={100} textAlign="center">{pickup}</Typography>
      </Box>
      <Box flex={1} height={2} bgcolor="grey.300" />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box width={10} height={10} borderRadius="50%" bgcolor="red" mb={0.5} />
        <Typography variant="caption">Drop</Typography>
        <Typography variant="body2" fontSize={12} color="text.secondary" maxWidth={100} textAlign="center">{drop}</Typography>
      </Box>
    </Box>
  );
}

// Main Modal Component
export default function OngoingAmbulanceBookingModal({ open, booking, steps, currentStepIndex, onClose, onRefreshBooking }) {
  const [paymentStatus, setPaymentStatus] = React.useState('idle'); // idle | processing | success | failed
  const [paymentError, setPaymentError] = React.useState('');

  // WebSocket for real-time updates
  const userId = booking?.userId;
  const { subscribe, unsubscribe } = useSocket(userId);

  React.useEffect(() => {
    if (!booking) return;
    const handleBookingUpdate = (data) => {
      if (data?.requestId === booking.requestId) {
        if (onRefreshBooking) onRefreshBooking();
      }
    };
    subscribe('ambulanceBookingUpdated', handleBookingUpdate);
    return () => {
      unsubscribe('ambulanceBookingUpdated', handleBookingUpdate);
    };
  }, [booking, subscribe, unsubscribe, onRefreshBooking]);

  if (!booking) return null;

  const isPaymentCompleted = booking.status === 'paymentCompleted';
  const isWaitingForPayment = booking.status === 'WaitingForPayment';
  const isCompleted = booking.status === 'Completed';
  const hasPaymentInfo = booking.totalAmount != null && booking.totalDistance != null && booking.costPerKm != null && booking.baseCharge != null;
  const formattedDate = booking.timestamp ? new Date(booking.timestamp).toLocaleString() : 'N/A';
  const hasValidLocations = booking.pickupLocation && booking.pickupLocation.length && booking.dropLocation && booking.dropLocation.length;

  // Payment handler
  const handlePayNow = () => {
    setPaymentStatus('processing');
    setPaymentError('');
    const user = getUserData() || {};
    AmbulanceBookingPaymentService.processPayment(
      {
        amount: booking.totalAmount,
        bookingId: booking.requestId,
        user: {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || user.mobile || user.phoneNumber || '',
          userId: user.userId || user.id || '',
        },
        description: `Ambulance Booking #${booking.requestId}`,
      },
      (response) => {
        setPaymentStatus('success');
        // Optionally refresh booking here
      },
      (error) => {
        setPaymentStatus('failed');
        setPaymentError(error || PAYMENT_ERRORS.PAYMENT_FAILED);
      }
    );
  };

  // Responsive styles for side panel (desktop) and bottom sheet (mobile)
  const modalBoxSx = {
    position: 'fixed',
    right: { xs: 0, md: 0 },
    left: { xs: 0, md: 'auto' },
    bottom: { xs: 0, md: 'auto' },
    top: { xs: 'auto', md: 0 },
    width: { xs: '100vw', md: 400 },
    height: { xs: 'auto', md: '100vh' },
    maxHeight: { xs: '90vh', md: '100vh' },
    bgcolor: 'white',
    borderRadius: { xs: '24px 24px 0 0', md: '24px 0 0 24px' },
    boxShadow: 3,
    p: { xs: 1.5, md: 3 },
    overflowY: 'auto',
    zIndex: 1300,
    outline: 'none',
    mx: { xs: 0, md: 'auto' },
    transition: 'all 0.3s',
  };

  // Completed State
  if (isCompleted) {
    return (
      <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
        <Box sx={modalBoxSx}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Box bgcolor="green.50" borderRadius="50%" p={2} mb={1}>
              <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="green" mb={1}>Service Completed</Typography>
            <Typography align="center" color="text.secondary" mb={3}>
              Your ambulance service has been completed successfully. Thank you for choosing our service.
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-evenly">
            <Button variant="outlined" startIcon={<CloseIcon />} onClick={onClose} sx={{ px: 3, py: 1.5 }}>
              Close
            </Button>
            <Button variant="contained" startIcon={<StarOutlineIcon />} sx={{ px: 3, py: 1.5, bgcolor: 'green', color: 'white', '&:hover': { bgcolor: 'green' } }} onClick={onClose}>
              Rate Service
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
      <Box sx={modalBoxSx}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <LocalShippingRoundedIcon sx={{ fontSize: 32, color: 'green' }} />
          <Typography variant="h6" fontWeight={700} mt={1}>Ongoing Ambulance Booking</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <ApartmentRoundedIcon sx={{ fontSize: 20, color: 'blueGrey' }} />
          <Typography ml={1} fontWeight={600}>{booking.agency?.agencyName || 'Unknown Agency'}</Typography>
        </Box>
        {hasValidLocations && (
          <Box mb={1}>
            <PickupDropTimeline pickup={booking.pickupLocation} drop={booking.dropLocation} />
          </Box>
        )}
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'grey' }} />
          <Typography ml={1} fontSize={14}>Date: {formattedDate}</Typography>
        </Box>
        <Box mb={2}>
          <Timeline steps={steps} currentStepIndex={currentStepIndex} />
        </Box>
        {hasPaymentInfo && (isWaitingForPayment || isPaymentCompleted || booking.isPaymentBypassed) && (
          <Box width="100%" p={2} mb={2} borderRadius={2} border={1} borderColor={booking.isPaymentBypassed ? 'blue.200' : 'grey.300'} bgcolor={booking.isPaymentBypassed ? 'blue.50' : 'grey.100'}>
            {booking.isPaymentBypassed ? (
              <Box display="flex" alignItems="center" mb={1}>
                <InfoOutlinedIcon color="info" sx={{ fontSize: 20 }} />
                <Typography ml={1} color="blue.700" fontSize={14}>
                  Your payment has been waived for this ambulance service.
                </Typography>
              </Box>
            ) : (
              <>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography fontWeight={700}>Payment Receipt</Typography>
                  <Box flex={1} />
                  {isPaymentCompleted && (
                    <Box px={1} py={0.5} bgcolor="green.50" borderRadius={1} display="flex" alignItems="center">
                      <CheckCircleOutlineIcon sx={{ color: 'green', fontSize: 16, mr: 0.5 }} />
                      <Typography color="green" fontSize={12}>Payment Completed</Typography>
                    </Box>
                  )}
                </Box>
                <ReceiptRow label="Base Charge" value={`₹${Number(booking.baseCharge).toFixed(2)}`} />
                <ReceiptRow label="Distance" value={`${booking.totalDistance} km`} />
                <ReceiptRow label="Rate per km" value={`₹${Number(booking.costPerKm).toFixed(2)}`} />
                <Divider sx={{ my: 1.5 }} />
                <ReceiptRow label="Total Amount" value={`₹${Number(booking.totalAmount).toFixed(2)}`} bold />
              </>
            )}
          </Box>
        )}
        {isWaitingForPayment && (
          <div style={{ width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PaymentOutlinedIcon />}
              sx={{ color: 'teal.main', borderColor: 'teal.main', py: 1.5, borderRadius: 2, mb: 1.5 }}
              onClick={handlePayNow}
              disabled={paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' ? 'Processing Payment...' : 'Pay Now'}
            </Button>
            {paymentStatus === 'success' && (
              <Typography color="success.main" align="center" mt={1}>Payment Successful!</Typography>
            )}
            {paymentStatus === 'failed' && (
              <Typography color="error.main" align="center" mt={1}>{paymentError || 'Payment Failed. Please try again.'}</Typography>
            )}
          </div>
        )}
        <Button
          fullWidth
          variant="contained"
          startIcon={<CallIcon />}
          sx={{ bgcolor: 'teal.main', color: 'white', py: 1.5, borderRadius: 2, mb: 1.5, '&:hover': { bgcolor: 'teal.dark' } }}
          onClick={() => {
            // Call agency phone number
            const phone = booking.agency?.contactNumber || '';
            window.open(`tel:${phone}`);
          }}
        >
          Call Agency
        </Button>
      </Box>
    </Modal>
  );
} 