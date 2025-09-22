import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CallIcon from '@mui/icons-material/Call';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PersonIcon from '@mui/icons-material/Person';
import BedIcon from '@mui/icons-material/Bed';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSocket } from '../../../hooks/useSocket';
import hospitalBedPaymentService from '../../../services/payment/hospital-bed-payment.service';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  height: 24,
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(status === 'completed' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
}));

// Helper: Receipt Row with improved styling
function ReceiptRow({ label, value, bold }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={0.75}>
      <Typography variant="body2" color="text.secondary" fontWeight={bold ? 600 : 400}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={bold ? 600 : 400}>
        {value}
      </Typography>
    </Box>
  );
}

// Helper: Info Row with improved styling
function InfoRow({ icon: Icon, label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Icon sx={{ fontSize: 20, color: 'primary.main' }} />
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight={500} noWrap>
        {value}
      </Typography>
    </Stack>
  );
}

// Timeline component with improved styling
function Timeline({ steps, currentStepIndex }) {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto', py: 1 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          minWidth: 'max-content',
          px: 2,
        }}
      >
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          
          return (
            <Box
              key={step}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                minWidth: 100,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted || isActive ? 'primary.main' : 'grey.200',
                  color: isCompleted || isActive ? 'white' : 'grey.700',
                  mb: 1,
                }}
              >
                {isCompleted ? <CheckCircleOutlineIcon /> : idx + 1}
              </Box>
              <Typography
                variant="caption"
                align="center"
                sx={{
                  color: isActive ? 'primary.main' : isCompleted ? 'text.primary' : 'text.secondary',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {step === 'pending' ? 'Pending' :
                 step === 'accepted' ? 'Accepted' :
                 step === 'WaitingForPayment' ? 'Payment Pending' :
                 step === 'completed' ? 'Completed' : step}
              </Typography>
              {idx < steps.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: '50%',
                    width: '100%',
                    height: 2,
                    backgroundColor: isCompleted ? 'primary.main' : 'grey.200',
                    zIndex: -1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

// Update PaymentSuccessView component
function PaymentSuccessView({ onClose, amount }) {
  return (
    <Stack alignItems="center" spacing={3} py={4}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'success.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'scaleIn 0.5s ease-out'
        }}
      >
        <CheckCircleOutlineIcon 
          sx={{ 
            fontSize: 48, 
            color: 'success.main',
            animation: 'rotateIn 0.5s ease-out'
          }} 
        />
      </Box>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h5" fontWeight={700} color="success.main">
          Payment Successful!
        </Typography>
        <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
          ₹{amount?.toFixed(2)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 300 }}
        >
          Your payment has been processed successfully. The hospital has been notified and your booking is confirmed.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            px: 3,
            py: 1.5,
            borderColor: 'success.main',
            color: 'success.main',
            '&:hover': {
              borderColor: 'success.dark',
              backgroundColor: 'success.light',
            }
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<StarOutlineIcon />}
          onClick={onClose}
          sx={{
            px: 3,
            py: 1.5,
            backgroundColor: 'success.main',
            '&:hover': { backgroundColor: 'success.dark' }
          }}
        >
          Rate Service
        </Button>
      </Stack>
    </Stack>
  );
}

// Add keyframe animations to your CSS
const keyframes = `
@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotateIn {
  from {
    transform: rotate(-180deg);
    opacity: 0;
  }
  to {
    transform: rotate(0);
    opacity: 1;
  }
}
`;

// Add the keyframes to the document
const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style);

// Payment Processing View with improved styling
function PaymentProcessingView() {
  return (
    <Stack alignItems="center" spacing={3} py={4}>
      <CircularProgress size={56} thickness={4} />
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          Processing Payment...
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 300 }}
        >
          Please wait while we confirm your payment with the hospital.
        </Typography>
      </Stack>
    </Stack>
  );
}

// Main Modal Component
export default function OngoingBedBookingModal({ open, booking, onClose, onRefreshBooking }) {
  const [paymentStatus, setPaymentStatus] = React.useState('idle');
  const [paymentError, setPaymentError] = React.useState('');
  const [paymentAmount, setPaymentAmount] = React.useState(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const headerHeight = isMdUp ? 64 : 56;

  const steps = ['pending', 'accepted', 'WaitingForPayment', 'completed'];
  const currentStepIndex = steps.indexOf(booking?.status || 'pending');

  // WebSocket setup...
  const userId = booking?.userId;
  const { subscribe, unsubscribe } = useSocket(userId);

  React.useEffect(() => {
    if (!booking) return;
    const handleBookingUpdate = (data) => {
      if (data?.bedBookingId === booking.bedBookingId) {
        if (onRefreshBooking) onRefreshBooking();
      }
    };
    subscribe('bedBookingUpdated', handleBookingUpdate);
    return () => unsubscribe('bedBookingUpdated', handleBookingUpdate);
  }, [booking, subscribe, unsubscribe, onRefreshBooking]);

  if (!booking) return null;

  const isPaymentCompleted = booking.status === 'completed';
  const isWaitingForPayment = booking.status === 'WaitingForPayment';
  const isAccepted = booking.status === 'accepted';
  const isCompleted = booking.status === 'completed';
  const shouldShowPayment = isAccepted || isWaitingForPayment;

  const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Update handlePayNow in the main component
  const handlePayNow = async () => {
    try {
      setPaymentStatus('processing');
      
      await hospitalBedPaymentService.processPayment(
        booking,
        (response) => {
          console.log('Payment successful:', response);
          setPaymentStatus('success');
          setPaymentAmount(response.amount); // Add this state variable
          if (onRefreshBooking) onRefreshBooking();
        },
        (error) => {
          console.error('Payment failed:', error);
          setPaymentStatus('failed');
          setPaymentError(error || 'Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setPaymentError('Payment failed. Please try again.');
    }
  };

  const panelSx = { p: 3, height: { xs: 'auto', md: '100%' }, overflowY: 'auto' };

  // Completed State
  if (isCompleted) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        anchor={isMdUp ? 'right' : 'bottom'}
        ModalProps={{ keepMounted: true, BackdropProps: { invisible: true } }}
        PaperProps={{
          sx: {
            top: isMdUp ? headerHeight : 'auto',
            height: isMdUp ? `calc(100vh - ${headerHeight}px)` : 'auto',
            maxHeight: isMdUp ? `calc(100vh - ${headerHeight}px)` : '85vh',
            width: isMdUp ? 400 : '100%',
            borderRadius: isMdUp ? '24px 0 0 24px' : '24px 24px 0 0'
          }
        }}
      >
        <Box sx={panelSx}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <PaymentSuccessView onClose={onClose} amount={paymentAmount} />
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={isMdUp ? 'right' : 'bottom'}
      ModalProps={{ keepMounted: true, BackdropProps: { invisible: true } }}
      PaperProps={{
        sx: {
          top: isMdUp ? headerHeight : 'auto',
          height: isMdUp ? `calc(100vh - ${headerHeight}px)` : 'auto',
          maxHeight: isMdUp ? `calc(100vh - ${headerHeight}px)` : '85vh',
          width: isMdUp ? 400 : '100%',
          borderRadius: isMdUp ? '24px 0 0 24px' : '24px 24px 0 0'
        }
      }}
    >
      <Box sx={panelSx}>
        {paymentStatus === 'processing' ? (
          <PaymentProcessingView />
        ) : paymentStatus === 'success' ? (
          <PaymentSuccessView onClose={onClose} amount={paymentAmount} />
        ) : (
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <LocalHospitalIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box flex={1}>
                <Typography variant="h6" fontWeight={700}>
                  Ongoing Bed Booking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.hospital?.name}
                </Typography>
              </Box>
              <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
                <CloseIcon />
              </IconButton>
            </Stack>

            {/* Booking Info */}
            <StyledPaper elevation={0}>
              <Stack spacing={2}>
                <InfoRow
                  icon={PersonIcon}
                  label="Patient"
                  value={booking.user?.name || 'N/A'}
                />
                <InfoRow
                  icon={BedIcon}
                  label="Ward"
                  value={booking.bedType}
                />
                <InfoRow
                  icon={AccessTimeIcon}
                  label="Date"
                  value={`${formattedDate} (${booking.timeSlot})`}
                />
              </Stack>
            </StyledPaper>

            {/* Timeline */}
            <Timeline steps={steps} currentStepIndex={currentStepIndex} />

            {/* Payment Details */}
            {shouldShowPayment && (
              <StyledPaper elevation={0}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Payment Details
                    </Typography>
                    <StatusChip
                      label={isPaymentCompleted ? "Payment Completed" : "Payment Required"}
                      status={isPaymentCompleted ? "completed" : "pending"}
                      icon={isPaymentCompleted ? <CheckCircleOutlineIcon /> : <InfoOutlinedIcon />}
                    />
                  </Stack>
                  <Divider />
                  <Stack spacing={1}>
                    <ReceiptRow
                      label="Total Amount"
                      value={`₹${booking.price.toFixed(2)}`}
                      bold
                    />
                    <ReceiptRow
                      label="Paid Amount"
                      value={`₹${booking.paidAmount.toFixed(2)}`}
                    />
                  </Stack>
                  {paymentStatus === 'failed' && (
                    <Typography color="error" variant="body2" align="center">
                      {paymentError}
                    </Typography>
                  )}
                </Stack>
              </StyledPaper>
            )}

            {/* Action Buttons */}
            <Stack spacing={2}>
              {(isAccepted || isWaitingForPayment) && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PaymentOutlinedIcon />}
                  onClick={handlePayNow}
                  disabled={paymentStatus === 'processing'}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  Pay Now
                </Button>
              )}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CallIcon />}
                onClick={() => {
                  const phone = booking.hospital?.contactNumber;
                  if (phone) window.open(`tel:${phone}`);
                }}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                }}
              >
                Call Hospital
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
} 