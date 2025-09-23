import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CallIcon from '@mui/icons-material/Call';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PersonIcon from '@mui/icons-material/Person';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useSocket } from '../../../hooks/useSocket';
import BloodBankPaymentService from '../../../services/payment/blood-bank-payment.service';

const RAW_STEPS = ['PENDING', 'CONFIRMED', 'PAYMENT', 'WaitingForPickup', 'COMPLETED'];
const DISPLAY_NAMES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PAYMENT: 'Waiting for Payment',
  WaitingForPickup: 'Waiting for Pickup',
  COMPLETED: 'Completed',
};

// Copied helpers from OngoingAmbulanceBookingModal for consistent timeline styling
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
        width: { xs: 28, sm: 32 },
        height: { xs: 28, sm: 32 },
        borderRadius: '50%',
        bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.200',
        border: active ? '3px solid' : '2px solid',
        borderColor: completed ? 'success.main' : active ? 'primary.dark' : 'grey.300',
        boxShadow: active ? '0 0 0 4px rgba(25,118,210,0.12)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: completed || active ? 'common.white' : 'text.secondary',
      }}
    >
      {completed ? (
        <CheckCircleOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
      ) : (
        <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 700 }}>{icon}</Typography>
      )}
    </Box>
  );
}

function BookingTimeline({ steps, currentStepIndex }) {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto', px: 0.5 }}>
      <Stepper
        alternativeLabel
        activeStep={currentStepIndex}
        connector={<ColorConnector />}
        sx={{ minWidth: { xs: 420, sm: 520 } }}
      >
        {steps.map((label, idx) => (
          <Step key={label} completed={idx < currentStepIndex}>
            <StepLabel StepIconComponent={NumberedStepIcon}>
              <Typography sx={{ fontSize: { xs: 11, sm: 12 }, fontWeight: idx === currentStepIndex ? 700 : 500 }}>
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

// (Old custom Timeline removed; replaced with MUI Stepper BookingTimeline)

export default function OngoingBloodBankBookingModal({ open, booking, onClose, onRefresh, onCallBloodBank }) {
  const [refreshing, setRefreshing] = useState(false);
  const [paymentStatusMsg, setPaymentStatusMsg] = useState(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
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
  const steps = RAW_STEPS.map(s => DISPLAY_NAMES[s]);
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
    <Drawer
      open={open}
      onClose={onClose}
      anchor={isMdUp ? 'right' : 'bottom'}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: isMdUp ? 420 : '100%',
          borderRadius: isMdUp ? '24px 0 0 24px' : '24px 24px 0 0',
          maxHeight: isMdUp ? '100vh' : '90vh',
        }
      }}
    >
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <BloodtypeIcon sx={{ fontSize: 28, color: 'error.main' }} />
            <Typography variant="h6" fontWeight={700}>{isCompleted ? 'Blood Request Completed' : 'Ongoing Blood Request'}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
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
          <BookingTimeline steps={steps} currentStepIndex={currentStepIndex} />
        </Box>
        {isCompleted && (
          <Box width="100%" p={2} mb={2} borderRadius={2} border={1} borderColor={'green.200'} bgcolor={'green.50'} display="flex" alignItems="center">
            <CheckCircleOutlineIcon sx={{ color: 'green', fontSize: 28, mr: 1 }} />
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
                  <CheckCircleOutlineIcon sx={{ color: 'green', fontSize: 16, mr: 0.5 }} />
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
    </Drawer>
  );
} 