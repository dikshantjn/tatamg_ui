import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
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
// Horizontal MUI Stepper with numbered/tick icons and connected bars
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
        <CheckIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
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
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const headerHeight = isMdUp ? 64 : 56;

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

  // Panel container styles
  const panelSx = {
    p: { xs: 2, md: 3 },
    height: { xs: 'auto', md: '100%' },
    overflowY: 'auto'
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={isMdUp ? 'right' : 'bottom'}
      ModalProps={{
        keepMounted: true,
        BackdropProps: { invisible: true, sx: { backgroundColor: 'transparent' } }
      }}
      PaperProps={{
        sx: {
          top: isMdUp ? headerHeight : 'auto',
          height: isMdUp ? `calc(100vh - ${headerHeight}px)` : 'auto',
          maxHeight: isMdUp ? `calc(100vh - ${headerHeight}px)` : `calc(100vh - 80px)`,
          width: isMdUp ? 400 : '100%',
          borderRadius: isMdUp ? '24px 0 0 24px' : '24px 24px 0 0'
        }
      }}
    >
      <Box sx={panelSx}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Header Info */}
        {!isCompleted && (
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalShippingRoundedIcon sx={{ fontSize: 28, color: 'success.main' }} />
              <Typography variant="h6" fontWeight={700}>Ongoing Ambulance Booking</Typography>
            </Box>
            <Chip
              size="small"
              label={booking.status}
              color={booking.status === 'WaitingForPayment' ? 'warning' : booking.status === 'paymentCompleted' ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>
        )}
        {isCompleted ? (
          <>
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
          </>
        ) : (
          <>
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
              <BookingTimeline steps={steps} currentStepIndex={currentStepIndex} />
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
          </>
        )}
      </Box>
    </Drawer>
  );
} 