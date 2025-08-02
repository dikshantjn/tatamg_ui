import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  useTheme,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Bloodtype,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility,
  Warning,
  Error,
  Refresh,
  Person,
  Phone,
  Email,
  LocationOn,
  Emergency
} from '@mui/icons-material';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorRequests = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Get vendor ID from auth data
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          if (vendorId) {
            // Fetch real booking requests data from API
            await loadRequests(vendorId);
          } else {
            console.warn('Vendor ID not found in auth data');
            // Fallback to sample data
            loadSampleRequests();
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const loadRequests = async (vendorId) => {
    try {
      const apiResponse = await bloodBankVendorService.getVendorRequests(vendorId);
      if (apiResponse && apiResponse.success && apiResponse.data) {
        // Transform API data to match component structure
        const transformedRequests = apiResponse.data.map(item => ({
          id: item.requestId,
          patientName: item.customerName,
          bloodType: item.bloodType,
          units: item.units,
          status: item.status,
          requestDate: new Date(item.createdAt).toLocaleDateString(),
          requiredDate: new Date(item.updatedAt).toLocaleDateString(),
          contactNumber: item.user?.phone_number || 'N/A',
          email: item.user?.emailId || 'N/A',
          hospital: 'Hospital Information',
          address: 'Address Information',
          notes: `Blood type: ${item.bloodType}, Units: ${item.units}`,
          price: item.units * 1200, // Calculate price based on units
          userId: item.userId,
          prescriptionUrls: item.prescriptionUrls || [],
          requestedVendors: item.requestedVendors || [],
          acceptedVendorId: item.acceptedVendorId,
          user: item.user || {}
        }));
        setRequests(transformedRequests);
      } else {
        console.warn('No requests data received from API');
        loadSampleRequests();
      }
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      toast.error('Failed to load booking requests');
      loadSampleRequests();
    }
  };

  const loadSampleRequests = () => {
    // Sample requests data as fallback
    const sampleRequests = [
      {
        id: 'BB001',
        patientName: 'Rahul Sharma',
        bloodType: 'A+',
        units: 2,
        priority: 'Emergency',
        status: 'Pending',
        requestDate: '2024-01-15',
        requiredDate: '2024-01-16',
        contactNumber: '+91 98765 43210',
        email: 'rahul.sharma@email.com',
        hospital: 'City General Hospital',
        address: '123 Medical Street, Mumbai',
        notes: 'Emergency surgery scheduled for tomorrow',
        price: 2400
      },
      {
        id: 'BB002',
        patientName: 'Priya Patel',
        bloodType: 'O-',
        units: 1,
        priority: 'Normal',
        status: 'Approved',
        requestDate: '2024-01-14',
        requiredDate: '2024-01-20',
        contactNumber: '+91 87654 32109',
        email: 'priya.patel@email.com',
        hospital: 'Metro Medical Center',
        address: '456 Health Avenue, Delhi',
        notes: 'Regular blood transfusion',
        price: 1500
      },
      {
        id: 'BB003',
        patientName: 'Amit Kumar',
        bloodType: 'B+',
        units: 3,
        priority: 'Urgent',
        status: 'Processing',
        requestDate: '2024-01-15',
        requiredDate: '2024-01-17',
        contactNumber: '+91 76543 21098',
        email: 'amit.kumar@email.com',
        hospital: 'Regional Hospital',
        address: '789 Care Road, Bangalore',
        notes: 'Multiple units needed for surgery',
        price: 3300
      },
      {
        id: 'BB004',
        patientName: 'Sneha Reddy',
        bloodType: 'AB+',
        units: 1,
        priority: 'Normal',
        status: 'Completed',
        requestDate: '2024-01-13',
        requiredDate: '2024-01-15',
        contactNumber: '+91 65432 10987',
        email: 'sneha.reddy@email.com',
        hospital: 'Community Medical Center',
        address: '321 Wellness Street, Chennai',
        notes: 'Regular transfusion completed',
        price: 1200
      },
      {
        id: 'BB005',
        patientName: 'Vikram Singh',
        bloodType: 'A-',
        units: 2,
        priority: 'Emergency',
        status: 'Rejected',
        requestDate: '2024-01-15',
        requiredDate: '2024-01-15',
        contactNumber: '+91 54321 09876',
        email: 'vikram.singh@email.com',
        hospital: 'Emergency Care Unit',
        address: '654 Urgent Lane, Kolkata',
        notes: 'Insufficient stock available',
        price: 2600
      }
    ];
    setRequests(sampleRequests);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Call API to update request status
      await bloodBankVendorService.updateRequestStatus(requestId, newStatus);
      
      // Update local state
    setRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
      
    toast.success(`Request ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error(error.message || 'Failed to update request status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'accepted': return 'info';
      case 'pending': return 'default';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency': return 'error';
      case 'Urgent': return 'warning';
      case 'Normal': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Emergency': return <Emergency />;
      case 'Urgent': return <Warning />;
      case 'Normal': return <Schedule />;
      default: return <Schedule />;
    }
  };



  if (loading) {
    return (
      <BloodBankVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LinearProgress />
        </Box>
      </BloodBankVendorLayout>
    );
  }

  return (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Booking Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage blood booking requests from patients and hospitals
          </Typography>
        </Box>



        {/* Requests Table */}
        <Card sx={{ 
          maxWidth: '1400px', 
          mx: 'auto',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Blood Booking Requests
              </Typography>
              <IconButton onClick={() => {
                const vendorId = vendorData?.vendorId || vendorData?.id;
                if (vendorId) {
                  loadRequests(vendorId);
                } else {
                  toast.error('Vendor ID not found');
                }
              }} sx={{ borderRadius: 2 }}>
                <Refresh />
              </IconButton>
            </Box>
            
            {requests.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                    '& .MuiTableCell-head': {
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      borderBottom: `2px solid ${theme.palette.divider}`
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Patient</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Blood Type</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Units</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Required Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request) => (
                    <TableRow key={request.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {request.patientName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.hospital}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: theme.palette.primary.main 
                          }}>
                            <Bloodtype />
                          </Avatar>
                          <Typography variant="body1" fontWeight="bold">
                            {request.bloodType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" fontWeight="bold">
                          {request.units}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {request.requiredDate}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            {request.status === 'pending' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleStatusChange(request.id, 'accepted')}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  px: 2,
                                  py: 0.5
                                }}
                              >
                                Accept Request
                              </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                py: 8,
                textAlign: 'center'
              }}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  backgroundColor: 'grey.100',
                  color: 'grey.600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  width: 80,
                  height: 80
                }}>
                  <Bloodtype sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                  No Booking Requests Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                  There are currently no blood booking requests for your blood bank.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const vendorId = vendorData?.vendorId || vendorData?.id;
                    if (vendorId) {
                      loadRequests(vendorId);
                    } else {
                      toast.error('Vendor ID not found');
                    }
                  }}
                  startIcon={<Refresh />}
                  sx={{ borderRadius: 2 }}
                >
                  Refresh Requests
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Request Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            Request Details - {selectedRequest?.id}
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Patient Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person />
                    <Typography variant="body1">
                      {selectedRequest.patientName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone />
                    <Typography variant="body1">
                      {selectedRequest.contactNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Email />
                    <Typography variant="body1">
                      {selectedRequest.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOn />
                    <Typography variant="body1">
                      {selectedRequest.hospital}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRequest.address}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Request Details
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Blood Type:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRequest.bloodType}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Units Required:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRequest.units}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Priority:
                    </Typography>
                    <Chip
                      icon={getPriorityIcon(selectedRequest.priority)}
                      label={selectedRequest.priority}
                      color={getPriorityColor(selectedRequest.priority)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      label={selectedRequest.status}
                      color={getStatusColor(selectedRequest.status)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Request Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.requestDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Required Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.requiredDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Price:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{selectedRequest.price}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.notes}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
              Close
            </Button>
            {selectedRequest?.status === 'pending' && (
              <>
                <Button 
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'accepted');
                    handleCloseDialog();
                  }}
                  color="success"
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  Accept Request
                </Button>
                <Button 
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, 'rejected');
                    handleCloseDialog();
                  }}
                  color="error"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  Reject Request
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
      
      <ToastContainer />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorRequests; 