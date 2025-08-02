import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Bloodtype,
  Schedule,
  CheckCircle,
  Cancel,
  ArrowBack,
  Payment,
  Notifications,
  Person,
  Phone,
  Email,
  LocationOn,
  Emergency,
  Receipt,
  LocalHospital,
  AccessTime,
  AttachMoney,
  Visibility,
  Download,
  Send
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorProcessRequest = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [serviceDetailsDialogOpen, setServiceDetailsDialogOpen] = useState(false);
  const [serviceDetails, setServiceDetails] = useState({
    units: '',
    pricePerUnit: '',
    discount: '',
    totalAmount: '',
    deliveryType: '',
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Get vendor ID from auth data
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          if (vendorId && bookingId) {
            // Fetch booking details from API
            await loadBookingDetails(vendorId, bookingId);
          } else {
            console.warn('Vendor ID or Booking ID not found');
            // Fallback to sample data
            loadSampleBooking();
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const loadBookingDetails = async (vendorId, bookingId) => {
    try {
      const apiResponse = await bloodBankVendorService.getVendorBookings(vendorId);
      if (apiResponse && apiResponse.success && apiResponse.data) {
        const foundBooking = apiResponse.data.find(b => b.bookingId === bookingId);
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          console.warn('Booking not found');
          loadSampleBooking();
        }
      } else {
        console.warn('No bookings data received from API');
        loadSampleBooking();
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
      loadSampleBooking();
    }
  };

  const loadSampleBooking = () => {
    // Sample booking data as fallback
    const sampleBooking = {
      bookingId: bookingId || 'sample-booking-id',
      status: 'CONFIRMED',
      bloodType: 'A+',
      units: 5,
      scheduledDate: '2025-08-03T08:08:32.000Z',
      notes: 'Emergency blood requirement',
      totalAmount: '2500.00',
      paymentStatus: 'PENDING',
      deliveryType: 'HOME_DELIVERY',
      healthIssue: 'Emergency surgery',
      deliveryLocation: 'City General Hospital',
      pricePerUnit: '500.00',
      deliveryFees: '0.00',
      gst: '0.00',
      discount: '0.00',
      createdAt: '2025-08-02T08:08:32.000Z',
      updatedAt: '2025-08-02T08:08:32.000Z',
      bloodRequest: {
        customerName: 'Kapil Kalyani',
        user: {
          phone_number: '+919370320067',
          emailId: 'kapilkalyani@gmail.com',
          location: 'Market Yard',
          city: 'Pune'
        },
        prescriptionUrls: [
          'https://dummy.url/prescription.jpg',
          'https://firebasestorage.googleapis.com/v0/b/vedikahealthcare-59980.firebasestorage.app/o/BloodBank_Prescriptions%2FGOrt7AWP82dMYs8tVejjLyvdPyy2%2F1748845293119-JPEG_20250531_234955_4914054189690297113.jpg?alt=media&token=b59e4157-491c-4feb-9b44-18e0da86f112'
        ]
      }
    };
    setBooking(sampleBooking);
  };

  const handleViewPrescription = (prescriptionUrl) => {
    setSelectedPrescription(prescriptionUrl);
    setPrescriptionDialogOpen(true);
  };

  const handleClosePrescriptionDialog = () => {
    setPrescriptionDialogOpen(false);
    setSelectedPrescription(null);
  };

  const handleNotifyPayment = async () => {
    setProcessingPayment(true);
    try {
      // Simulate API call for payment notification
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment notification sent successfully to user');
    } catch (error) {
      console.error('Error sending payment notification:', error);
      toast.error('Failed to send payment notification');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleAddServiceDetails = () => {
    setServiceDetailsDialogOpen(true);
  };

  const handleCloseServiceDetailsDialog = () => {
    setServiceDetailsDialogOpen(false);
    setServiceDetails({
      units: '',
      pricePerUnit: '',
      discount: '',
      totalAmount: '',
      deliveryType: '',
      note: ''
    });
  };

  const handleServiceDetailsChange = (field, value) => {
    setServiceDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitServiceDetails = async () => {
    try {
      // Validate required fields
      if (!serviceDetails.units || !serviceDetails.pricePerUnit || !serviceDetails.totalAmount || !serviceDetails.deliveryType) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Prepare service data for API
      const serviceData = {
        totalAmount: parseInt(serviceDetails.totalAmount),
        discount: parseInt(serviceDetails.discount) || 0,
        notes: serviceDetails.note || '',
        units: parseInt(serviceDetails.units),
        pricePerUnit: parseInt(serviceDetails.pricePerUnit),
        deliveryType: serviceDetails.deliveryType
      };

      // Call the API
      const response = await bloodBankVendorService.addServiceDetails(booking.bookingId, serviceData);
      
      if (response.success) {
        toast.success(response.message || 'Service details added successfully');
        handleCloseServiceDetailsDialog();
        
        // Optionally refresh the booking data
        // You can add a callback to refresh the booking details here
      } else {
        toast.error('Failed to add service details');
      }
    } catch (error) {
      console.error('Error adding service details:', error);
      toast.error(error.message || 'Failed to add service details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'CONFIRMED': return 'info';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'WaitingForPayment': return 'warning';
      case 'PaymentCompleted': return 'success';
      case 'WaitingForPickup': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString()}`;
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

  if (!booking) {
    return (
      <BloodBankVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Alert severity="error">Booking not found</Alert>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/vendor/blood-bank/history')}
              sx={{ borderRadius: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Process Blood Request
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Booking ID: {booking.bookingId}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Booking Details Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Booking Details
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Person sx={{ color: 'primary.main', fontSize: 30, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Patient Name
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.bloodRequest?.customerName || 'Anonymous'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Phone sx={{ color: 'primary.main', fontSize: 30, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Contact
                      </Typography>
                      <Typography variant="body2">
                        {booking.bloodRequest?.user?.phone_number || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Bloodtype sx={{ color: 'error.main', fontSize: 30, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Blood Type
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.bloodType} ({booking.units} units)
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Schedule sx={{ color: 'primary.main', fontSize: 30, mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Prescriptions Section */}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Prescriptions
                  </Typography>
                  {booking.bloodRequest?.prescriptionUrls && booking.bloodRequest.prescriptionUrls.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {booking.bloodRequest.prescriptionUrls.map((prescription, index) => (
                        <Chip
                          key={index}
                          icon={<Receipt />}
                          label={`Prescription ${index + 1}`}
                          onClick={() => handleViewPrescription(prescription)}
                          clickable
                          sx={{ borderRadius: 2 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No prescriptions uploaded
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Service Details Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Service Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Buttons stacked vertically */}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Notifications />}
                    onClick={handleAddServiceDetails}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Add Service Details
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Send />}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    Send Payment Reminder
                  </Button>

                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status Actions
                  </Typography>
                  
                  {/* Dynamic Status Button based on current booking status */}
                  {booking.status === 'PENDING' && (
                    <Button
                      variant="contained"
                      color="info"
                      startIcon={<Schedule />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Mark as Confirmed
                    </Button>
                  )}
                  
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<Payment />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Mark Waiting for Payment
                    </Button>
                  )}
                  
                  {booking.status === 'WaitingForPayment' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Mark Payment Completed
                    </Button>
                  )}
                  
                  {booking.status === 'PaymentCompleted' && (
                    <Button
                      variant="contained"
                      color="info"
                      startIcon={<Schedule />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Mark Waiting for Pickup
                    </Button>
                  )}
                  
                  {booking.status === 'WaitingForPickup' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  
                  {booking.status === 'COMPLETED' && (
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircle />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none'
                      }}
                      disabled
                    >
                      Already Completed
                    </Button>
                  )}
                  
                  {booking.status === 'CANCELLED' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none'
                      }}
                      disabled
                    >
                      Request Cancelled
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>


        </Grid>

        {/* Prescription Preview Dialog */}
        <Dialog 
          open={prescriptionDialogOpen} 
          onClose={handleClosePrescriptionDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Prescription Preview
          </DialogTitle>
          <DialogContent>
            {selectedPrescription && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <img 
                  src={selectedPrescription} 
                  alt="Prescription"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ display: 'none', mt: 2 }}
                >
                  Failed to load prescription image
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePrescriptionDialog} sx={{ borderRadius: 2 }}>
              Close
            </Button>
            <Button 
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                if (selectedPrescription) {
                  window.open(selectedPrescription, '_blank');
                }
              }}
              sx={{ borderRadius: 2 }}
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>

        {/* Service Details Dialog */}
        <Dialog 
          open={serviceDetailsDialogOpen} 
          onClose={handleCloseServiceDetailsDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            pb: 1
          }}>
            <Notifications sx={{ color: 'primary.main' }} />
            Add Service Details
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Units"
                  type="number"
                  value={serviceDetails.units}
                  onChange={(e) => handleServiceDetailsChange('units', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Unit (₹)"
                  type="number"
                  value={serviceDetails.pricePerUnit}
                  onChange={(e) => handleServiceDetailsChange('pricePerUnit', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Discount (₹)"
                  type="number"
                  value={serviceDetails.discount}
                  onChange={(e) => handleServiceDetailsChange('discount', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Amount (₹)"
                  type="number"
                  value={serviceDetails.totalAmount}
                  onChange={(e) => handleServiceDetailsChange('totalAmount', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Delivery Type"
                  value={serviceDetails.deliveryType}
                  onChange={(e) => handleServiceDetailsChange('deliveryType', e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Select delivery type"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& .MuiInputBase-input': { 
                      minWidth: '200px',
                      textOverflow: 'ellipsis'
                    }
                  }}
                >
                  <MenuItem value="HOME_DELIVERY">Home Delivery</MenuItem>
                  <MenuItem value="SELF_PICKUP">Self Pickup</MenuItem>
                  <MenuItem value="HOSPITAL_DELIVERY">Hospital Delivery</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  multiline
                  rows={3}
                  value={serviceDetails.note}
                  onChange={(e) => handleServiceDetailsChange('note', e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Add any additional notes or instructions..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
            <Button 
              onClick={handleCloseServiceDetailsDialog} 
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSubmitServiceDetails}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Add Service
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <ToastContainer />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorProcessRequest; 