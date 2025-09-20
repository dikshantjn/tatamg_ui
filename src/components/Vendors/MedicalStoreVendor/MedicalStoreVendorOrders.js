import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { acceptPrescriptionRequest, acceptPrescriptionNew, getPendingPrescriptionRequests, getPendingPrescriptions, getAllOrders, getOrdersByVendor } from '../../../services/Vendors/MedicalStoreVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import orderHistoryService from '../../../services/User/orderHistory.service';
import { Toast, ToastContainer } from '../../ui/Toast';

function MedicalStoreVendorOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  
  // Get vendorId from auth service
  const getVendorId = () => {
    const authData = vendorAuthService.getVendorAuthData();
    return authData?.vendorData?.vendorId || 'c29e0298-b239-48df-9f11-4e21c8727f93'; // fallback for testing
  };
  
  const vendorId = getVendorId();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching pending prescriptions for vendorId:', vendorId);
        const response = await getPendingPrescriptions(vendorId);
        console.log('📦 API Response:', response);
        console.log('📋 Prescriptions array:', response.data);
        
        if (response.data && response.data.length > 0) {
          console.log('🔍 First prescription details:');
          console.log('  - prescriptionId:', response.data[0].prescriptionId);
          console.log('  - prescriptionFiles:', response.data[0].prescriptionFiles);
          console.log('  - status:', response.data[0].status);
          console.log('  - All keys:', Object.keys(response.data[0]));
        }
        
        setPendingRequests(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching pending prescriptions:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setPendingRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRequests();
  }, [vendorId]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        console.log('🔍 Fetching orders for vendorId:', vendorId);
        const response = await getOrdersByVendor(vendorId);
        console.log('📦 Orders API Response:', response);
        console.log('📋 Orders array:', response.data);
        
        if (response.data && response.data.length > 0) {
          console.log('🔍 First order details:');
          console.log('  - orderId:', response.data[0].orderId);
          console.log('  - status:', response.data[0].status);
          console.log('  - totalAmount:', response.data[0].totalAmount);
          console.log('  - All keys:', Object.keys(response.data[0]));
        }
        
        setOrders(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [vendorId]);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleProcessOrder = (order) => {
    navigate(`/vendor/pharmacy/process-order/${order.orderId}`);
  };

  const handleViewInvoice = async (orderId) => {
    setInvoiceLoading(true);
    setInvoiceDialogOpen(true);
    try {
      const response = await orderHistoryService.getInvoice(orderId);
      if (response.success) {
        setInvoiceUrl(response.data.pdfUrl);
      } else {
        addToast('error', 'Error', response.message || 'Failed to load invoice');
        setInvoiceDialogOpen(false);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      addToast('error', 'Error', 'Failed to load invoice. Please try again.');
      setInvoiceDialogOpen(false);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
    if (invoiceUrl) {
      window.URL.revokeObjectURL(invoiceUrl);
      setInvoiceUrl('');
    }
  };

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAcceptPrescription = async (request) => {
    try {
      // Advanced debugging - Log the entire request object
      console.log('=== PRESCRIPTION ACCEPTANCE DEBUG ===');
      console.log('Full request object:', request);
      console.log('Request keys:', Object.keys(request));
      console.log('Prescription ID:', request.prescriptionId);
      console.log('User ID:', request.userId);
      console.log('Vendor ID:', vendorId);
      console.log('Status:', request.status);
      console.log('=====================================');

      // Check if required data exists
      if (!request.prescriptionId) {
        console.error('❌ No prescription ID available:', request.prescriptionId);
        addToast('error', 'Acceptance Failed', 'No prescription ID available to accept');
        return;
      }

      if (!request.userId) {
        console.error('❌ No user ID available:', request.userId);
        addToast('error', 'Acceptance Failed', 'No user ID available to accept');
        return;
      }

      console.log('✅ Data is valid, proceeding with acceptance...');
      console.log('Prescription ID:', request.prescriptionId);
      console.log('Vendor ID:', vendorId);
      console.log('User ID:', request.userId);

      // Use the new accept prescription API
      const response = await acceptPrescriptionNew(
        request.prescriptionId,
        vendorId,
        request.userId
      );
      
      console.log('✅ API Response after acceptance:', response);
      
      // Remove the accepted prescription from the local state instead of refreshing
      setPendingRequests(prev => prev.filter(req => req.prescriptionId !== request.prescriptionId));
      
      addToast('success', 'Prescription Accepted', `Prescription accepted successfully!`);
    } catch (error) {
      console.error('❌ Error accepting prescription:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      addToast('error', 'Acceptance Failed', 'Failed to accept prescription. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', marginX: 'auto', width: '100%' }}>
      <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Order Requests" />
        <Tab label="Orders" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>View Prescription</TableCell>
                  <TableCell>Accept Prescription</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                        <Typography sx={{ ml: 2 }}>Loading requests...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography sx={{ py: 2, color: 'text.secondary' }}>
                        No pending prescription requests
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((request) => (
                    <TableRow key={request.prescriptionId}>
                      <TableCell>{request.user?.name || 'N/A'}</TableCell>
                      <TableCell>{request.user?.phone_number || 'N/A'}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => window.open(request.prescriptionFiles[0], '_blank')}
                          disabled={!request.prescriptionFiles || request.prescriptionFiles.length === 0}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small" 
                          disabled={request.status === 'accepted'}
                          onClick={() => handleAcceptPrescription(request)}
                        >
                          Accept
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: 
                            request.status === 'pending' ? '#FFF3CD' :
                            request.status === 'accepted' ? '#D4EDDA' :
                            '#F8F9FA',
                          color: 
                            request.status === 'pending' ? '#856404' :
                            request.status === 'accepted' ? '#155724' :
                            '#6C757D',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          border: 
                            request.status === 'pending' ? '1px solid #FFEAA7' :
                            request.status === 'accepted' ? '1px solid #C3E6CB' :
                            '1px solid #E9ECEF',
                          minWidth: '80px',
                          textAlign: 'center'
                        }}>
                          {request.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 1 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                        <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography sx={{ py: 2, color: 'text.secondary' }}>
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.user?.name || 'N/A'}</TableCell>
                      <TableCell>{order.user?.phone_number || 'N/A'}</TableCell>
                      <TableCell>₹{order.totalAmount || 0}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: 
                            order.status === 'pending' ? '#FFF3CD' :
                            order.status === 'payment_completed' ? '#D1ECF1' :
                            order.status === 'out_for_delivery' ? '#D4EDDA' :
                            order.status === 'delivered' ? '#D1E7DD' :
                            '#F8F9FA',
                          color: 
                            order.status === 'pending' ? '#856404' :
                            order.status === 'payment_completed' ? '#0C5460' :
                            order.status === 'out_for_delivery' ? '#155724' :
                            order.status === 'delivered' ? '#0F5132' :
                            '#6C757D',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          border: 
                            order.status === 'pending' ? '1px solid #FFEAA7' :
                            order.status === 'payment_completed' ? '1px solid #BEE5EB' :
                            order.status === 'out_for_delivery' ? '1px solid #C3E6CB' :
                            order.status === 'delivered' ? '1px solid #B8DACC' :
                            '1px solid #E9ECEF',
                          minWidth: '80px',
                          textAlign: 'center'
                        }}>
                          {order.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {order.status === 'delivered' ? (
                            <Button 
                              variant="outlined" 
                              size="small" 
                              onClick={() => handleViewInvoice(order.orderId)}
                            >
                              View Invoice
                            </Button>
                          ) : (
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={() => handleProcessOrder(order)}
                            >
                              Process Order
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      
      {/* Invoice Dialog */}
      <Dialog
        open={invoiceDialogOpen}
        onClose={handleCloseInvoiceDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '70vh',
            maxHeight: '70vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Invoice Preview</Typography>
            <Button onClick={handleCloseInvoiceDialog} color="inherit">
              ✕
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {invoiceLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={40} />
              <Typography>Loading invoice...</Typography>
            </Box>
          ) : invoiceUrl ? (
            <iframe
              src={invoiceUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Invoice Preview"
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <Typography color="text.secondary">No invoice available</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {invoiceUrl && (
            <Button 
              variant="contained" 
              onClick={() => {
                const link = document.createElement('a');
                link.href = invoiceUrl;
                link.download = `invoice-${Date.now()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              sx={{ mr: 1 }}
            >
              Download Invoice
            </Button>
          )}
          <Button onClick={handleCloseInvoiceDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Box>
  );
}

export default MedicalStoreVendorOrders; 