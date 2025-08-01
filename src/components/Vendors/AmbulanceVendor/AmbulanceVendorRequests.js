import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Assignment,
  Emergency,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Visibility,
  LocalPhone,
  Person,
  AccessTime,
  Close,
  Check,
  PlayArrow,
  Done
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPendingRequestsByVendor, acceptAmbulanceBooking } from '../../../services/Vendors/AmbulanceVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';

const AmbulanceVendorRequests = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);

        // Get vendor ID from authentication service
        const authData = vendorAuthService.getVendorAuthData();
        if (!authData || !authData.vendorData) {
          toast.error('Vendor authentication required. Please login again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
        if (!vendorId) {
          console.error('Vendor ID not found in auth data:', authData);
          toast.error('Vendor ID not found. Please login again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        console.log('Using vendor ID from auth service:', vendorId);
        const pendingRequests = await getPendingRequestsByVendor(vendorId);

        // Transform the API response to match our component's expected format
        const transformedRequests = pendingRequests.map(request => ({
          id: request.requestId,
          customerName: request.user?.name || 'Unknown Customer',
          mobileNo: request.user?.phone_number || 'N/A',
          time: new Date(request.timestamp).toLocaleString(),
          status: request.status,
          pickupLocation: request.pickupLocation,
          dropLocation: request.dropLocation,
          vehicleType: request.vehicleType,
          totalAmount: request.totalAmount,
          totalDistance: request.totalDistance,
          costPerKm: request.costPerKm,
          baseCharge: request.baseCharge,
          user: request.user,
          originalRequest: request // Keep the original request data
        }));

        setRequests(transformedRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        toast.error('Failed to fetch pending requests. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'info';
      case 'Accepted':
        return 'primary';
      case 'WaitingForPayment':
        return 'warning';
      case 'PaymentCompleted':
        return 'success';
      case 'InTransit':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <Done fontSize="small" />;
      case 'In Progress':
        return <PlayArrow fontSize="small" />;
      case 'Pending':
        return <Schedule fontSize="small" />;
      case 'Accepted':
        return <Check fontSize="small" />;
      case 'WaitingForPayment':
        return <Warning fontSize="small" />;
      case 'PaymentCompleted':
        return <CheckCircle fontSize="small" />;
      case 'InTransit':
        return <PlayArrow fontSize="small" />;
      default:
        return <Error fontSize="small" />;
    }
  };



  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      // Call the API to accept the booking
      await acceptAmbulanceBooking(requestId);

      // Update the local state to reflect the change
      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? { ...req, status: 'Accepted' }
          : req
      ));

      toast.success('Request accepted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: 'request-accepted',
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: 'accept-error',
      });
    }
  };

  const handleProcessRequest = (requestId) => {
    const request = requests.find(req => req.id === requestId);
    if (request) {
      navigate(`/vendor/ambulance/process-order/${requestId}`, {
        state: { requestData: request }
      });
    } else {
      toast.error('Request data not found. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: 'request-not-found',
      });
    }
  };

  const getActionButton = (request) => {
    switch (request.status) {
      case 'Pending':
        return (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={() => handleAcceptRequest(request.id)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 2,
              py: 0.5
            }}
          >
            Accept Order
          </Button>
        );
      case 'accepted':
      case 'WaitingForPayment':
      case 'paymentCompleted':
      case 'OnTheWay':
      case 'PickedUp':
      case 'completed':

      case 'InTransit':
        return (
          <Button
            variant="outlined"
            color="success"
            size="small"
            startIcon={<PlayArrow />}
            onClick={() => handleProcessRequest(request.id)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 2,
              py: 0.5
            }}
          >
            Process Order
          </Button>
        );
      default:
        return (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={() => handleAcceptRequest(request.id)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 2,
              py: 0.5
            }}
          >
            Accept Order
          </Button>
        );
    }
  };

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading requests...</Typography>
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Ambulance Requests 🚑
          </Typography>
          <Typography variant="h6" color={theme.palette.text.secondary} sx={{ fontWeight: 400 }}>
            Manage and track all ambulance service requests
          </Typography>
        </Box>

        {/* Requests Table */}
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {requests.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Customer
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Contact
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Request Time
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderBottom: 'none'
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderBottom: 'none',
                      textAlign: 'center'
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow
                      key={request.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                          transition: 'background-color 0.3s ease'
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.02)'
                            : 'rgba(0,0,0,0.01)'
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              fontSize: '1rem',
                              fontWeight: 700
                            }}
                          >
                            {request.customerName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{
                              fontWeight: 700,
                              color: theme.palette.text.primary,
                              mb: 0.5
                            }}>
                              {request.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                              #{request.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.mobileNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          size="small"
                          color={getStatusColor(request.status)}
                          icon={getStatusIcon(request.status)}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 28,
                            '& .MuiChip-icon': {
                              fontSize: '1rem'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {getActionButton(request)}
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
              px: 3
            }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <Emergency sx={{ 
                  fontSize: 60, 
                  color: theme.palette.text.secondary 
                }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                mb: 1,
                textAlign: 'center'
              }}>
                No Ambulance Requests Found
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                textAlign: 'center',
                maxWidth: 400
              }}>
                There are currently no pending ambulance requests for your service. 
                New requests will appear here when customers book ambulance services.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Request Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Request Details
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedRequest && (
              <Box>
                {/* Customer Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.customerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.mobileNo}
                      </Typography>
                    </Grid>
                    {selectedRequest.user?.emailId && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {selectedRequest.user.emailId}
                        </Typography>
                      </Grid>
                    )}
                    {selectedRequest.user?.location && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                          Location
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {selectedRequest.user.location}, {selectedRequest.user.city}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Trip Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Trip Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Pickup Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.pickupLocation}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Drop Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.dropLocation}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Vehicle Type
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.vehicleType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Distance
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.totalDistance} km
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Pricing Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Pricing Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Base Charge
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        ₹{selectedRequest.baseCharge}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Cost per km
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        ₹{selectedRequest.costPerKm}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Total Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                        ₹{selectedRequest.totalAmount}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Request Information */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                    Request Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Request ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedRequest.status}
                        size="small"
                        color={getStatusColor(selectedRequest.status)}
                        icon={getStatusIcon(selectedRequest.status)}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 28,
                          '& .MuiChip-icon': {
                            fontSize: '1rem'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                        Request Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedRequest.time}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="colored"
          limit={3}
          newestOnTop={true}
        />
      </Box>
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorRequests; 