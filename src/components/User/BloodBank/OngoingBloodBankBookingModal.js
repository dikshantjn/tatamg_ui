import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CallIcon from '@mui/icons-material/Call';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import './OngoingBloodBankBookingModal.css';
import { useSocket } from '../../../hooks/useSocket';
import BloodBankPaymentService from '../../../services/payment/blood-bank-payment.service';

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

function Timeline({ steps, currentStepIndex, status }) {
  // Map step to label, breaking long labels into multiple lines
  const getLabelLines = (label) => {
    if (label === 'Waiting for Pickup') return ['Waiting', 'for Pickup'];
    if (label === 'Waiting for Payment') return ['Waiting', 'for Payment'];
    if (label === 'Payment Completed') return ['Payment', 'Completed'];
    return [label];
  };
  return (
    <div className="timeline-container">
      <div className="timeline">
        {steps.map((step, idx) => {
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
          const isLast = idx === steps.length - 1;
          const labelLines = getLabelLines(label);
          return (
            <div className="timeline-item" key={step}>
              {/* Line before node */}
              {idx > 0 && (
                <div className={`timeline-line before ${isFilled ? 'completed' : ''}`}></div>
              )}
              {/* Node with number or tick */}
              <div className={`timeline-circle${isFilled ? ' filled' : ''}${isActive ? ' active' : ''}`}> 
                <span className={`timeline-number${isFilled ? ' filled' : ''}`}>{isCompleted ? <CheckCircleIcon style={{ fontSize: 16 }} /> : idx + 1}</span>
              </div>
              {/* Step label, multiline */}
              <div className={`timeline-label${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>{labelLines.map((line, i) => <div key={i}>{line}</div>)}</div>
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

export default function OngoingBloodBankBookingModal({ open, booking, onClose, onRefresh, onCallBloodBank, onPayNow }) {
  const [refreshing, setRefreshing] = useState(false);
  const [paymentStatusMsg, setPaymentStatusMsg] = useState(null);
  // Real-time socket for timeline updates
  const userId = booking?.user?.userId || booking?.userId;
  const { subscribe, unsubscribe } = useSocket(userId);

  useEffect(() => {
    if (!booking) return;
    const handleBookingUpdate = (data) => {
      if (data?.bookingId === booking.bookingId || data?.requestId === booking.requestId) {
        if (onRefresh) onRefresh();
      }
    };
    subscribe('bloodBankBookingUpdated', handleBookingUpdate);
    return () => {
      unsubscribe('bloodBankBookingUpdated', handleBookingUpdate);
    };
  }, [booking, subscribe, unsubscribe, onRefresh]);

  if (!booking) return null;
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
  const agency = booking.agency;
  const bloodRequest = booking.bloodRequest || {};
  const formattedDate = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A';
  const customerName = booking.customerName || booking.user?.name || 'Anonymous';
  const bloodTypes = Array.isArray(bloodRequest.bloodType) ? bloodRequest.bloodType.join(', ') : (bloodRequest.bloodType || 'N/A');
  const units = bloodRequest.units || 'N/A';
  const isCompleted = status === 'COMPLETED';
  const isWaitingForPayment = status === 'WaitingForPayment';
  const isPaymentCompleted = status === 'PaymentCompleted' || booking.paymentStatus === 'PAID';
  const hasPaymentInfo = booking.totalAmount != null;
  const paymentStatus = booking.paymentStatus;

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (e) {}
    setRefreshing(false);
  };

  const handlePayNow = () => {
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
        if (onRefresh) onRefresh();
      },
      (error) => {
        setPaymentStatusMsg('Payment failed: ' + error);
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
      <Box sx={{
        position: 'fixed',
        right: { xs: 0, md: 0 },
        left: { xs: 0, md: 'auto' },
        bottom: { xs: 0, md: 'auto' },
        top: { xs: 'auto', md: 0 },
        width: { xs: '100vw', md: 420 },
        height: { xs: 'auto', md: '100vh' },
        maxHeight: { xs: '90vh', md: '100vh' },
        bgcolor: 'white',
        borderRadius: { xs: '24px 24px 0 0', md: '24px 0 0 24px' },
        boxShadow: 3,
        p: { xs: 2, md: 3 },
        overflowY: 'auto',
        zIndex: 1300,
        outline: 'none',
        mx: { xs: 0, md: 'auto' },
        transition: 'all 0.3s',
      }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <BloodtypeIcon sx={{ fontSize: 32, color: '#e53935' }} />
          <Typography variant="h6" fontWeight={700} mt={1}>{isCompleted ? 'Blood Request Completed' : 'Ongoing Blood Request'}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <PersonIcon sx={{ fontSize: 20, color: '#38A3A5' }} />
          <Typography ml={1} fontWeight={600}>Customer Name: </Typography>
          <Typography ml={1}>{customerName}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <LocalHospitalIcon sx={{ fontSize: 20, color: '#38A3A5' }} />
          <Typography ml={1} fontWeight={600}>Blood Types: </Typography>
          <Typography ml={1}>{bloodTypes}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'grey' }} />
          <Typography ml={1} fontWeight={600}>Date: </Typography>
          <Typography ml={1}>{formattedDate}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography fontWeight={600}>Units: </Typography>
          <Typography ml={1}>{units}</Typography>
        </Box>
        <Box mb={2}>
          <Timeline steps={STEPS} currentStepIndex={currentStepIndex} status={status} />
        </Box>
        {isCompleted && (
          <Box width="100%" p={2} mb={2} borderRadius={2} border={1} borderColor={'green.200'} bgcolor={'green.50'} display="flex" alignItems="center">
            <CheckCircleIcon sx={{ color: 'green', fontSize: 28, mr: 1 }} />
            <Typography color="green" fontSize={16} fontWeight={600}>
              Blood has been successfully delivered to the patient
            </Typography>
          </Box>
        )}
        {hasPaymentInfo && (isWaitingForPayment || isPaymentCompleted) && (
          <Box width="100%" mb={2} p={2} borderRadius={2} border={1} borderColor={'grey.300'} bgcolor={'grey.100'}>
            <Box display="flex" alignItems="center" mb={1}>
              <PaymentOutlinedIcon sx={{ fontSize: 20, color: '#38A3A5', mr: 1 }} />
              <Typography fontWeight={700}>Payment Information</Typography>
              <Box flex={1} />
              {isPaymentCompleted && (
                <Box px={1} py={0.5} bgcolor="#e6f9f0" borderRadius={1} display="flex" alignItems="center">
                  <CheckCircleIcon sx={{ color: 'green', fontSize: 16, mr: 0.5 }} />
                  <Typography color="green" fontSize={12}>PAID</Typography>
                </Box>
              )}
              {!isPaymentCompleted && paymentStatus === 'PENDING' && (
                <Box px={1} py={0.5} bgcolor="#fff3e0" borderRadius={1} display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ color: 'orange', fontSize: 16, mr: 0.5 }} />
                  <Typography color="orange" fontSize={12}>PENDING</Typography>
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography>Total Amount</Typography>
              <Typography fontWeight={700}>
                ₹{
                  (typeof booking.totalAmount === 'number' && !isNaN(booking.totalAmount))
                    ? booking.totalAmount.toFixed(2)
                    : (typeof booking.totalAmount === 'string' && !isNaN(parseFloat(booking.totalAmount)))
                      ? parseFloat(booking.totalAmount).toFixed(2)
                      : '--'
                }
              </Typography>
            </Box>
          </Box>
        )}
        {isWaitingForPayment && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#38A3A5', color: 'white', py: 1.5, borderRadius: 2, mb: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#2D8587' } }}
            onClick={handlePayNow}
          >
            Pay Now
          </Button>
        )}
        {paymentStatusMsg && (
          <Box width="100%" mb={2} p={2} borderRadius={2} border={1} borderColor={paymentStatusMsg.startsWith('Payment successful') ? 'green.200' : 'red.200'} bgcolor={paymentStatusMsg.startsWith('Payment successful') ? 'green.50' : 'red.50'}>
            <Typography color={paymentStatusMsg.startsWith('Payment successful') ? 'green' : 'red'} fontWeight={600}>{paymentStatusMsg}</Typography>
          </Box>
        )}
        {!isCompleted && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<CallIcon />}
            sx={{ bgcolor: '#38A3A5', color: 'white', py: 1.5, borderRadius: 2, mb: 1.5, '&:hover': { bgcolor: '#2D8587' } }}
            onClick={() => {
              if (onCallBloodBank) onCallBloodBank(agency?.phoneNumber || agency?.contactNumber || '');
              else if (agency?.phoneNumber || agency?.contactNumber) window.open(`tel:${agency.phoneNumber || agency.contactNumber}`);
            }}
          >
            Call Blood Bank
          </Button>
        )}
      </Box>
    </Modal>
  );
} 