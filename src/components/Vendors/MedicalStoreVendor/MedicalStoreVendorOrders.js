import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { acceptPrescriptionRequest, getPendingPrescriptionRequests, getAllOrders } from '../../../services/Vendors/MedicalStoreVendor.service';
import { Toast, ToastContainer } from '../../ui/Toast';

function MedicalStoreVendorOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  // TODO: Replace with actual vendorId from auth context or props
  const vendorId = 'c29e0298-b239-48df-9f11-4e21c8727f93';

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching pending requests for vendorId:', vendorId);
        const response = await getPendingPrescriptionRequests(vendorId);
        console.log('📦 API Response:', response);
        console.log('📋 Prescriptions array:', response.prescriptions);
        
        if (response.prescriptions && response.prescriptions.length > 0) {
          console.log('🔍 First prescription details:');
          console.log('  - prescriptionId:', response.prescriptions[0].prescriptionId);
          console.log('  - jsonPrescription:', response.prescriptions[0].jsonPrescription);
          console.log('  - jsonPrescription type:', typeof response.prescriptions[0].jsonPrescription);
          console.log('  - All keys:', Object.keys(response.prescriptions[0]));
        }
        
        setPendingRequests(response.prescriptions || []);
      } catch (error) {
        console.error('❌ Error fetching pending requests:', error);
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
        const response = await getAllOrders(vendorId);
        console.log('📦 Orders API Response:', response);
        console.log('📋 Orders array:', response.orders);
        
        if (response.orders && response.orders.length > 0) {
          console.log('🔍 First order details:');
          console.log('  - orderId:', response.orders[0].orderId);
          console.log('  - orderStatus:', response.orders[0].orderStatus);
          console.log('  - All keys:', Object.keys(response.orders[0]));
        }
        
        setOrders(response.orders || []);
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
      console.log('jsonPrescription value:', request.jsonPrescription);
      console.log('jsonPrescription type:', typeof request.jsonPrescription);
      console.log('jsonPrescription is null:', request.jsonPrescription === null);
      console.log('jsonPrescription is undefined:', request.jsonPrescription === undefined);
      console.log('jsonPrescription is empty string:', request.jsonPrescription === '');
      console.log('jsonPrescription is empty object:', JSON.stringify(request.jsonPrescription) === '{}');
      console.log('=====================================');

      // Check if jsonPrescription exists and has content
      if (!request.jsonPrescription) {
        console.error('❌ jsonPrescription is falsy:', request.jsonPrescription);
        addToast('error', 'Acceptance Failed', 'No prescription data available to accept');
        return;
      }

      // Additional check for empty objects or strings
      if (typeof request.jsonPrescription === 'object' && Object.keys(request.jsonPrescription).length === 0) {
        console.error('❌ jsonPrescription is empty object:', request.jsonPrescription);
        addToast('error', 'Acceptance Failed', 'Prescription data is empty');
        return;
      }

      if (typeof request.jsonPrescription === 'string' && request.jsonPrescription.trim() === '') {
        console.error('❌ jsonPrescription is empty string:', request.jsonPrescription);
        addToast('error', 'Acceptance Failed', 'Prescription data is empty');
        return;
      }

      console.log('✅ jsonPrescription is valid, proceeding with acceptance...');
      console.log('Prescription ID:', request.prescriptionId);
      console.log('Vendor ID:', vendorId);
      console.log('JSON Prescription to send:', request.jsonPrescription);

      const response = await acceptPrescriptionRequest(
        request.prescriptionId,
        vendorId,
        request.jsonPrescription
      );
      
      console.log('✅ API Response after acceptance:', response);
      
      // Remove the accepted prescription from the local state instead of refreshing
      setPendingRequests(prev => prev.filter(req => req.prescriptionId !== request.prescriptionId));
      
      addToast('success', 'Prescription Accepted', `Prescription accepted successfully! Order ID: ${response.orderId}`);
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
      <Typography variant="h5" sx={{ mb: 2 }}>Orders</Typography>
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
                      <TableCell>{request.User?.name || 'N/A'}</TableCell>
                      <TableCell>{request.User?.phone_number || 'N/A'}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => window.open(request.prescriptionUrl, '_blank')}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small" 
                          disabled={request.prescriptionAcceptedStatus === 'Accepted'}
                          onClick={() => handleAcceptPrescription(request)}
                        >
                          Accept
                        </Button>
                      </TableCell>
                      <TableCell>{request.prescriptionAcceptedStatus}</TableCell>
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
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Process Order</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                        <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography sx={{ py: 2, color: 'text.secondary' }}>
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.User?.name || 'N/A'}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: 
                            order.orderStatus === 'Pending' ? '#FFF3CD' :
                            order.orderStatus === 'PrescriptionVerified' ? '#D1ECF1' :
                            order.orderStatus === 'AddedItemsInCart' ? '#D4EDDA' :
                            order.orderStatus === 'Delivered' ? '#D1E7DD' :
                            '#F8F9FA',
                          color: 
                            order.orderStatus === 'Pending' ? '#856404' :
                            order.orderStatus === 'PrescriptionVerified' ? '#0C5460' :
                            order.orderStatus === 'AddedItemsInCart' ? '#155724' :
                            order.orderStatus === 'Delivered' ? '#0F5132' :
                            '#6C757D',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          border: 
                            order.orderStatus === 'Pending' ? '1px solid #FFEAA7' :
                            order.orderStatus === 'PrescriptionVerified' ? '1px solid #BEE5EB' :
                            order.orderStatus === 'AddedItemsInCart' ? '1px solid #C3E6CB' :
                            order.orderStatus === 'Delivered' ? '1px solid #B8DACC' :
                            '1px solid #E9ECEF',
                          minWidth: '80px',
                          textAlign: 'center'
                        }}>
                          {order.orderStatus}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => handleProcessOrder(order)}
                          disabled={order.orderStatus === 'Delivered'}
                        >
                          Process Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Box>
  );
}

export default MedicalStoreVendorOrders; 