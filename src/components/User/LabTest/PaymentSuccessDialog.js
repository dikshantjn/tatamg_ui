import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';

const PaymentSuccessDialog = ({ isOpen, onClose, paymentData }) => {
  const navigate = useNavigate();

  const handleGoToOrders = () => {
    onClose?.();
    navigate('/order-history');
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog open={Boolean(isOpen)} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={800}>Payment Successful</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Your lab test appointment has been booked successfully.
        </Typography>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Payment ID</Typography>
            <Typography variant="body2">{paymentData?.paymentId || 'N/A'}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Amount Paid</Typography>
            <Typography variant="body2">₹{paymentData?.amount || 0}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Chip size="small" color="success" label="Confirmed" />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Button startIcon={<CloseIcon />} onClick={handleClose}>Close</Button>
        <Button variant="outlined" startIcon={<ListAltIcon />} onClick={handleGoToOrders}>Go to My Orders</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentSuccessDialog;