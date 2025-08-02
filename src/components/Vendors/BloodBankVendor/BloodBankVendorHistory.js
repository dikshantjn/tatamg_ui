import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
  DatePicker
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
  Emergency,
  History,
  TrendingUp,
  Payment
} from '@mui/icons-material';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorHistory = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Get vendor ID from auth data
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          if (vendorId) {
            // Fetch real booking history data from API
            await loadHistory(vendorId);
          } else {
            console.warn('Vendor ID not found in auth data');
            // Fallback to sample data
            loadSampleHistory();
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

  const loadHistory = async (vendorId) => {
    try {
      const apiResponse = await bloodBankVendorService.getVendorBookings(vendorId);
      if (apiResponse && apiResponse.success && apiResponse.data) {
        // Transform API data to match component structure
        const transformedHistory = apiResponse.data.map(booking => ({
          id: booking.bookingId,
          patientName: booking.bloodRequest?.customerName || 'Anonymous',
          bloodType: booking.bloodType,
          units: booking.units,
          status: booking.status,
          requestDate: new Date(booking.createdAt).toLocaleDateString(),
          completedDate: booking.status === 'COMPLETED' ? new Date(booking.updatedAt).toLocaleDateString() : null,
          contactNumber: booking.bloodRequest?.user?.phone_number || 'N/A',
          email: booking.bloodRequest?.user?.emailId || 'N/A',
          hospital: '',
          address: `${booking.bloodRequest?.user?.location || 'N/A'}, ${booking.bloodRequest?.user?.city || 'N/A'}`,
          notes: booking.notes || 'No notes',
          price: parseFloat(booking.totalAmount) || 0,
          paymentStatus: booking.paymentStatus,
          deliveryType: booking.deliveryType,
          scheduledDate: new Date(booking.scheduledDate).toLocaleDateString(),
          healthIssue: booking.healthIssue,
          deliveryLocation: booking.deliveryLocation,
          pricePerUnit: parseFloat(booking.pricePerUnit) || 0,
          deliveryFees: parseFloat(booking.deliveryFees) || 0,
          gst: parseFloat(booking.gst) || 0,
          discount: parseFloat(booking.discount) || 0,
          totalAmount: parseFloat(booking.totalAmount) || 0,
          bloodRequest: booking.bloodRequest || {}
        }));
        setHistory(transformedHistory);
      } else {
        console.warn('No bookings data received from API');
        loadSampleHistory();
      }
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Failed to load booking history');
      loadSampleHistory();
    }
  };

  const loadSampleHistory = () => {
    // Sample history data as fallback
    const sampleHistory = [
      {
        id: 'BB001',
        patientName: 'Rahul Sharma',
        bloodType: 'A+',
        units: 2,
        priority: 'Emergency',
        status: 'Completed',
        requestDate: '2024-01-10',
        completedDate: '2024-01-11',
        contactNumber: '+91 98765 43210',
        email: 'rahul.sharma@email.com',
        hospital: 'City General Hospital',
        address: '123 Medical Street, Mumbai',
        notes: 'Emergency surgery completed successfully',
        price: 2400,
        paymentStatus: 'Paid'
      },
      {
        id: 'BB002',
        patientName: 'Priya Patel',
        bloodType: 'O-',
        units: 1,
        priority: 'Normal',
        status: 'Completed',
        requestDate: '2024-01-08',
        completedDate: '2024-01-10',
        contactNumber: '+91 87654 32109',
        email: 'priya.patel@email.com',
        hospital: 'Metro Medical Center',
        address: '456 Health Avenue, Delhi',
        notes: 'Regular blood transfusion completed',
        price: 1500,
        paymentStatus: 'Paid'
      },
      {
        id: 'BB003',
        patientName: 'Amit Kumar',
        bloodType: 'B+',
        units: 3,
        priority: 'Urgent',
        status: 'Completed',
        requestDate: '2024-01-05',
        completedDate: '2024-01-07',
        contactNumber: '+91 76543 21098',
        email: 'amit.kumar@email.com',
        hospital: 'Regional Hospital',
        address: '789 Care Road, Bangalore',
        notes: 'Multiple units delivered for surgery',
        price: 3300,
        paymentStatus: 'Paid'
      },
      {
        id: 'BB004',
        patientName: 'Sneha Reddy',
        bloodType: 'AB+',
        units: 1,
        priority: 'Normal',
        status: 'Completed',
        requestDate: '2024-01-03',
        completedDate: '2024-01-05',
        contactNumber: '+91 65432 10987',
        email: 'sneha.reddy@email.com',
        hospital: 'Community Medical Center',
        address: '321 Wellness Street, Chennai',
        notes: 'Regular transfusion completed',
        price: 1200,
        paymentStatus: 'Paid'
      },
      {
        id: 'BB005',
        patientName: 'Vikram Singh',
        bloodType: 'A-',
        units: 2,
        priority: 'Emergency',
        status: 'Cancelled',
        requestDate: '2024-01-02',
        completedDate: null,
        contactNumber: '+91 54321 09876',
        email: 'vikram.singh@email.com',
        hospital: 'Emergency Care Unit',
        address: '654 Urgent Lane, Kolkata',
        notes: 'Request cancelled due to insufficient stock',
        price: 2600,
        paymentStatus: 'Refunded'
      },
      {
        id: 'BB006',
        patientName: 'Meera Desai',
        bloodType: 'O+',
        units: 1,
        priority: 'Normal',
        status: 'Completed',
        requestDate: '2024-01-01',
        completedDate: '2024-01-03',
        contactNumber: '+91 43210 98765',
        email: 'meera.desai@email.com',
        hospital: 'City Medical Center',
        address: '987 Health Road, Pune',
        notes: 'Regular transfusion completed',
        price: 1000,
        paymentStatus: 'Paid'
      }
    ];
    setHistory(sampleHistory);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Refunded': return 'info';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const filteredHistory = history.filter(record => {
    const statusMatch = filterStatus === 'all' || record.status.toLowerCase() === filterStatus.toLowerCase();
    const dateMatch = filterDate === 'all' || record.completedDate?.includes(filterDate);
    return statusMatch && dateMatch;
  });

  const statusCounts = {
    all: history.length,
    pending: history.filter(r => r.status === 'PENDING').length,
    confirmed: history.filter(r => r.status === 'CONFIRMED').length,
    completed: history.filter(r => r.status === 'COMPLETED').length,
    cancelled: history.filter(r => r.status === 'CANCELLED').length,
    waitingForPayment: history.filter(r => r.status === 'WaitingForPayment').length,
    paymentCompleted: history.filter(r => r.status === 'PaymentCompleted').length,
    waitingForPickup: history.filter(r => r.status === 'WaitingForPickup').length
  };

  const totalRevenue = history
    .filter(record => record.status === 'Completed' && record.paymentStatus === 'Paid')
    .reduce((sum, record) => sum + record.price, 0);

  const totalUnits = history
    .filter(record => record.status === 'Completed')
    .reduce((sum, record) => sum + record.units, 0);

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
            Booking History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View completed and cancelled blood booking records
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          justifyContent: 'center',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4
        }}>
          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <History />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {history.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'info.light',
                color: 'info.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <CheckCircle />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'info.main' }}>
                {statusCounts.confirmed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confirmed
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'success.light',
                color: 'success.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Bloodtype />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                {totalUnits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Units
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: 'warning.light',
                color: 'warning.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64
              }}>
                <Payment />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                ₹{totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item>
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="waitingForPayment">Waiting for Payment</MenuItem>
                  <MenuItem value="paymentCompleted">Payment Completed</MenuItem>
                  <MenuItem value="waitingForPickup">Waiting for Pickup</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl size="small">
                <InputLabel>Date</InputLabel>
                <Select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  label="Date"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="2024-01">January 2024</MenuItem>
                  <MenuItem value="2023-12">December 2023</MenuItem>
                  <MenuItem value="2023-11">November 2023</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* History Table */}
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
                Booking History
              </Typography>
              <IconButton onClick={() => {
                const vendorId = vendorData?.vendorId || vendorData?.id;
                if (vendorId) {
                  loadHistory(vendorId);
                } else {
                  toast.error('Vendor ID not found');
                }
              }} sx={{ borderRadius: 2 }}>
                <Refresh />
              </IconButton>
            </Box>
            
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
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Completed Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Price (₹)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Payment</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {record.patientName}
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
                            {record.bloodType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" fontWeight="bold">
                          {record.units}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {record.completedDate || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" fontWeight="bold">
                          ₹{record.price}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={record.paymentStatus}
                          color={getPaymentStatusColor(record.paymentStatus)}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/vendor/blood-bank/process-request/${record.id}`)}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            px: 2,
                            py: 0.5
                          }}
                        >
                          Process Request
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Record Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            Order Details - {selectedRecord?.id}
          </DialogTitle>
          <DialogContent>
            {selectedRecord && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Patient Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person />
                    <Typography variant="body1">
                      {selectedRecord.patientName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone />
                    <Typography variant="body1">
                      {selectedRecord.contactNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Email />
                    <Typography variant="body1">
                      {selectedRecord.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOn />
                    <Typography variant="body1">
                      {selectedRecord.hospital}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRecord.address}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Details
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Blood Type:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRecord.bloodType}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Units Delivered:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedRecord.units}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Priority:
                    </Typography>
                    <Chip
                      icon={getPriorityIcon(selectedRecord.priority)}
                      label={selectedRecord.priority}
                      color={getPriorityColor(selectedRecord.priority)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      label={selectedRecord.status}
                      color={getStatusColor(selectedRecord.status)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Request Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.requestDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedRecord.completedDate || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Price:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{selectedRecord.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status:
                    </Typography>
                    <Chip
                      label={selectedRecord.paymentStatus}
                      color={getPaymentStatusColor(selectedRecord.paymentStatus)}
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedRecord.notes}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <ToastContainer />
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorHistory; 