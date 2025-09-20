import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Modal,
  Checkbox,
  FormControlLabel,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrdersByVendor, updateOrderStatus, updateOrderPayment, updateOrderNote, updateOrderStatusNew } from '../../../services/Vendors/MedicalStoreVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { Toast, ToastContainer } from '../../ui/Toast';

function MedicalStoreVendorProcessOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionMedicines, setSelectedPrescriptionMedicines] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('');

  // Get vendorId from auth service
  const getVendorId = () => {
    const authData = vendorAuthService.getVendorAuthData();
    return authData?.vendorData?.vendorId || 'c29e0298-b239-48df-9f11-4e21c8727f93'; // fallback for testing
  };
  
  const vendorId = getVendorId();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await getOrdersByVendor(vendorId);
        const foundOrder = response.data?.find(o => o.orderId === orderId);
        setOrder(foundOrder);
        
        // Initialize order note and payment details
        if (foundOrder) {
          setOrderNote(foundOrder.note || '');
          setPaymentDetails({
            totalAmount: foundOrder.totalAmount
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, vendorId]);


  // Removed back navigation per new design

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleOpenPrescriptionModal = () => {
    setPrescriptionModalOpen(true);
    // Initialize selected medicines from prescription data
    if (order?.prescription?.generalProduct) {
      setSelectedPrescriptionMedicines([
        {
          name: order.prescription.generalProduct,
          checked: false
        }
      ]);
      } else {
      setSelectedPrescriptionMedicines([]);
    }
  };

  const handleClosePrescriptionModal = () => {
    setPrescriptionModalOpen(false);
    setSelectedPrescriptionMedicines([]);
  };

  const handlePrescriptionMedicineToggle = (medicineIndex) => {
    setSelectedPrescriptionMedicines(prev => 
      prev.map((medicine, index) => 
        index === medicineIndex 
          ? { ...medicine, checked: !medicine.checked }
          : medicine
      )
    );
  };

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handleOpenNotesDialog = () => {
    setNotesDialogOpen(true);
  };

  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
  };

  const handleUpdatePayment = async () => {
    try {
      await updateOrderPayment(order.orderId, paymentDetails.totalAmount, orderNote);
      addToast('success', 'Success', 'Payment details updated successfully!');
      handleClosePaymentDialog();
    } catch (error) {
      console.error('Error updating payment details:', error);
      addToast('error', 'Error', 'Failed to update payment details. Please try again.');
    }
  };

  const handleUpdateNotes = async () => {
    try {
      await updateOrderNote(order.orderId, orderNote);
      addToast('success', 'Success', 'Order notes updated successfully!');
      handleCloseNotesDialog();
    } catch (error) {
      console.error('Error updating order notes:', error);
      addToast('error', 'Error', 'Failed to update order notes. Please try again.');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatusNew(order.orderId, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      addToast('success', 'Success', `Order status updated to ${newStatus.replaceAll('_', ' ')}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      addToast('error', 'Error', 'Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading order details...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Order not found</Typography>
      </Box>
    );
  }


  return (
    <>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1200px', 
        marginX: 'auto', 
        width: '100%',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}>
      {/* Single Unified Details Container */}
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', mb: 3 }}>
        {/* Summary Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Order ID</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{order.orderId}</Typography>
      </Box>
            <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Order Date</Typography>
            <Typography>{new Date(order.createdAt).toLocaleDateString()}</Typography>
            </Box>
                         <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Current Status</Typography>
            <Typography sx={{ textTransform: 'uppercase', fontWeight: 700 }}>{order.status?.replaceAll('_',' ')}</Typography>
             </Box>
          </Box>

        <Divider sx={{ my: 2 }} />

        {/* Two column content within single box */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Prescription</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ID: {order.prescription?.prescriptionId || 'N/A'}
                 </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Status: {order.prescription?.status || 'N/A'}
                             </Typography>
            <Button variant="outlined" size="small" onClick={handleOpenPrescriptionModal}>View Prescription</Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Customer</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><strong>Name:</strong> {order.user?.name || 'N/A'}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><strong>Phone:</strong> {order.user?.phone_number || 'N/A'}</Typography>
            {order.deliveryAddress && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Delivery Address</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>{order.deliveryAddress.houseStreet}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>{order.deliveryAddress.addressLine1}</Typography>
                <Typography variant="body2">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}</Typography>
           </Box>
         )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Payment and Notes */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Payment</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><strong>Total Amount:</strong> ₹{paymentDetails.totalAmount || 0}</Typography>
            <Button variant="outlined" size="small" onClick={handleOpenPaymentDialog}>
              {paymentDetails.totalAmount ? 'Update Payment' : 'Add Payment'}
           </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Order Notes</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {orderNote || 'No notes added yet'}
              </Typography>
            <Button variant="outlined" size="small" onClick={handleOpenNotesDialog}>
              {orderNote ? 'Update Notes' : 'Add Notes'}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Status Update */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Update Status</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="order-status-label">Select Status</InputLabel>
            <Select
              labelId="order-status-label"
              label="Select Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={order.status === 'delivered'}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography color="text.secondary">Select order status</Typography>;
                }
                return selected.replaceAll('_',' ');
              }}
            >
              <MenuItem value="" disabled>
                Select order status
              </MenuItem>
              <MenuItem value={'ready_to_pickup'}>Ready to Pickup</MenuItem>
              <MenuItem value={'out_for_delivery'}>Out for Delivery</MenuItem>
              <MenuItem value={'delivered'}>Delivered</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => handleStatusUpdate(selectedStatus)} disabled={!selectedStatus || order.status === 'delivered'}>
            Update Status
          </Button>
                          </Box>
                        </Box>

     </Box>
     
     {/* Toast Container */}
     <ToastContainer toasts={toasts} removeToast={removeToast} />

     {/* Prescription Modal */}
     <Modal
       open={prescriptionModalOpen}
       onClose={handleClosePrescriptionModal}
       aria-labelledby="prescription-modal-title"
       sx={{
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         p: 2
       }}
     >
       <Box sx={{
         width: '90%',
         maxWidth: 1200,
         maxHeight: '90vh',
         bgcolor: 'background.paper',
         borderRadius: 2,
         boxShadow: 24,
         overflow: 'hidden',
         display: 'flex',
         flexDirection: 'column'
       }}>
         {/* Modal Header */}
         <Box sx={{
           p: 3,
           borderBottom: 1,
           borderColor: 'divider',
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center'
         }}>
           <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
             Prescription Details
           </Typography>
           <Button onClick={handleClosePrescriptionModal} color="inherit">
             ✕
           </Button>
         </Box>

         {/* Modal Content */}
         <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
           {/* Left Side - Prescription Image */}
           <Box sx={{ 
             flex: 1, 
             p: 3, 
             borderRight: 1, 
             borderColor: 'divider',
             overflow: 'auto'
           }}>
             <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
               Prescription Image
             </Typography>
             {order?.prescription?.prescriptionFiles && order.prescription.prescriptionFiles.length > 0 ? (
               <img 
                 src={order.prescription.prescriptionFiles[0]} 
                 alt="Prescription"
                 style={{ 
                   width: '100%', 
                   height: 'auto',
                   maxHeight: '60vh',
                   objectFit: 'contain'
                 }}
               />
             ) : (
               <Typography color="text.secondary">
                 No prescription image available
               </Typography>
             )}
           </Box>

           {/* Right Side - JSON Prescription Medicines */}
           <Box sx={{ 
             flex: 1, 
             p: 3, 
             overflow: 'auto'
           }}>
             <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
               Prescribed Medicines
             </Typography>
             
             {selectedPrescriptionMedicines.length > 0 ? (
               <Box>
                 <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                   General Product from prescription:
                 </Typography>
                 
                 {selectedPrescriptionMedicines.map((medicine, index) => (
                    <Box key={index} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                       <FormControlLabel
                         control={
                           <Checkbox
                             checked={medicine.checked}
                             onChange={() => handlePrescriptionMedicineToggle(index)}
                             color="primary"
                           />
                         }
                         label={
                           <Box>
                             <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                               {medicine.name}
                             </Typography>
                           </Box>
                         }
                         sx={{ width: '100%', m: 0 }}
                       />
                    </Box>
                  ))}
                 ))}
                 
                 <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                   <Button 
                     variant="outlined" 
                     onClick={handleClosePrescriptionModal}
                     sx={{ flex: 1 }}
                   >
                     Close
                   </Button>
                 </Box>
               </Box>
             ) : (
               <Typography color="text.secondary">
                 No medicines found in prescription
               </Typography>
             )}
           </Box>
         </Box>
       </Box>
     </Modal>

     {/* Payment Details Dialog */}
     <Modal
       open={paymentDialogOpen}
       onClose={handleClosePaymentDialog}
       aria-labelledby="payment-dialog-title"
       sx={{
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         p: 2
       }}
     >
       <Box sx={{
         width: '90%',
         maxWidth: 500,
         bgcolor: 'background.paper',
         borderRadius: 2,
         boxShadow: 24,
         p: 3
       }}>
         <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
           {paymentDetails.totalAmount ? 'Update Payment Details' : 'Add Payment Details'}
         </Typography>
         
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
           <TextField
             label="Total Amount"
             type="number"
             value={paymentDetails.totalAmount || ''}
             onChange={(e) => setPaymentDetails(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
             fullWidth
             size="small"
           />
         </Box>
         
         <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
           <Button onClick={handleClosePaymentDialog} variant="outlined">
             Cancel
           </Button>
           <Button onClick={handleUpdatePayment} variant="contained">
             {paymentDetails.paymentId ? 'Update' : 'Add'}
           </Button>
         </Box>
       </Box>
     </Modal>

     {/* Order Notes Dialog */}
     <Modal
       open={notesDialogOpen}
       onClose={handleCloseNotesDialog}
       aria-labelledby="notes-dialog-title"
       sx={{
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         p: 2
       }}
     >
       <Box sx={{
         width: '90%',
         maxWidth: 500,
         bgcolor: 'background.paper',
         borderRadius: 2,
         boxShadow: 24,
         p: 3
       }}>
         <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
           {orderNote ? 'Update Order Notes' : 'Add Order Notes'}
         </Typography>
         
         <TextField
           label="Order Notes"
           multiline
           rows={4}
           value={orderNote}
           onChange={(e) => setOrderNote(e.target.value)}
           fullWidth
           placeholder="Enter any notes about this order..."
         />
         
         <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
           <Button onClick={handleCloseNotesDialog} variant="outlined">
             Cancel
           </Button>
           <Button onClick={handleUpdateNotes} variant="contained">
             {orderNote ? 'Update' : 'Add'}
           </Button>
         </Box>
       </Box>
     </Modal>
   </>
 );
}

export default MedicalStoreVendorProcessOrderPage; 