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
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DatePicker
} from '@mui/material';
import {
  History,
  TrendingUp,
  Emergency,
  Visibility,
  LocalHospital,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  Circle,
  Refresh,
  People,
  Payment,
  Add,
  Edit,
  Delete,
  Person,
  Bed,
  CalendarToday,
  AccessTime,
  LocationOn,
  Phone,
  Download,
  FilterList
} from '@mui/icons-material';
import HospitalVendorLayout from './HospitalVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { hospitalVendorService } from '../../../services/Vendors/HospitalVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HospitalVendorHistory = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Fetch completed appointments data from API
          const vendorId = authData.vendorData.vendorId;
          const completedResponse = await hospitalVendorService.getCompletedAppointments(vendorId);
          
          if (completedResponse && completedResponse.bookings) {
            // Transform API data to match component structure
            const transformedHistory = completedResponse.bookings.map(booking => ({
              id: booking.bedBookingId,
              patientName: booking.user?.name || 'N/A',
              patientPhone: booking.user?.phone_number || 'N/A',
              patientEmail: booking.user?.emailId || 'N/A',
              patientGender: booking.user?.gender || 'N/A',
              patientPhoto: booking.user?.photo || null,
              wardType: booking.bedType,
              bedNumber: booking.bedNumber || 'N/A', // Using actual bed number if available
              admissionDate: booking.bookingDate,
              dischargeDate: booking.updatedAt, // Using updatedAt as discharge date
              status: booking.status,
              amount: booking.price,
              paidAmount: booking.paidAmount,
              paymentStatus: booking.paymentStatus,
              hospitalName: booking.hospital?.name || 'N/A',
              hospitalAddress: booking.hospital?.address || 'N/A',
              hospitalCity: booking.hospital?.city || 'N/A',
              hospitalState: booking.hospital?.state || 'N/A',
              hospitalContact: booking.hospital?.contactNumber || 'N/A',
              hospitalEmail: booking.hospital?.email || 'N/A',
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt,
              // Calculate duration in days
              duration: Math.ceil((new Date(booking.updatedAt) - new Date(booking.bookingDate)) / (1000 * 60 * 60 * 24)) || 1
            }));
            
            setHistoryData(transformedHistory);
          } else {
            setHistoryData([]);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load history data');
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleExportData = () => {
    toast.success('Exporting data...');
    // Implement export functionality
  };

  const handleDownloadInvoice = (record) => {
    toast.success('Downloading invoice...');
    // Implement invoice download functionality
    console.log('Downloading invoice for record:', record.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'discharged': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'error';
      default: return 'default';
    }
  };

  const getFilteredHistory = () => {
    return historyData;
  };

  const stats = [
    { title: 'Total Records', value: historyData.length, icon: <History />, color: 'primary' },
    { title: 'Completed', value: historyData.filter(record => record.status === 'completed').length, icon: <CheckCircle />, color: 'success' },
    { title: 'Cancelled', value: historyData.filter(record => record.status === 'cancelled').length, icon: <Error />, color: 'error' },
    { title: 'Total Revenue', value: historyData.reduce((sum, record) => sum + record.amount, 0).toLocaleString(), icon: <Payment />, color: 'secondary' },
  ];

  // Skeleton loading component
  const HistorySkeleton = () => (
    <HospitalVendorLayout title="History">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="text" width="200px" height={32} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Stats Skeleton */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs Skeleton */}
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1, mb: 3 }} />

        {/* Table Skeleton */}
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Box>
    </HospitalVendorLayout>
  );

  if (loading) {
    return <HistorySkeleton />;
  }

  const filteredHistory = getFilteredHistory();

  return (
    <HospitalVendorLayout title="History">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Historical Records
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ borderRadius: 2 }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExportData}
              sx={{ borderRadius: 2 }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5
                  }}>
                    <Box sx={{ 
                      p: { xs: 1, sm: 1.5, md: 1.8 }, 
                      borderRadius: 3, 
                      backgroundColor: `${stat.color}.light`,
                      color: `${stat.color}.contrastText`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: 40, sm: 48, md: 56 },
                      minHeight: { xs: 40, sm: 48, md: 56 }
                    }}>
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' } }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>



        {/* History Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Patient</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ward Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Dates</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Duration</TableCell>

                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Payment</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.length > 0 ? (
                    historyData.map((record) => (
                    <TableRow key={record.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                                              <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar 
                              src={record.patientPhoto}
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: theme.palette.primary.main,
                                fontSize: '0.875rem'
                              }}
                            >
                              <Person sx={{ fontSize: '1rem' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {record.patientName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {record.patientPhone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.wardType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {new Date(record.admissionDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            to {new Date(record.dischargeDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {record.duration} days
                        </Typography>
                      </TableCell>
                                              
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          size="small" 
                          color={getStatusColor(record.status)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.paymentStatus} 
                          size="small" 
                          color={getPaymentStatusColor(record.paymentStatus)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{record.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewRecord(record)}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Report">
                            <IconButton 
                              size="small"
                              sx={{ color: theme.palette.info.main }}
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <History sx={{ fontSize: 48, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                          No Completed Records Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          There are no completed appointments to display at the moment.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

             {/* Record Details Dialog */}
       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
         <DialogTitle>
           <Typography variant="h6">Appointment Details</Typography>
         </DialogTitle>
                 <DialogContent>
           {selectedRecord && (
             <Box sx={{ pt: 1 }}>
               <Card>
                 <CardContent>
                   <Grid container spacing={3}>
                     {/* Patient Information Section */}
                     <Grid item xs={12}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                         <Avatar 
                           src={selectedRecord.patientPhoto}
                           sx={{ width: 80, height: 80 }}
                         >
                           <Person sx={{ fontSize: 40 }} />
                         </Avatar>
                         <Box sx={{ flex: 1 }}>
                           <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                             {selectedRecord.patientName}
                           </Typography>
                           <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                             {selectedRecord.patientGender} • {selectedRecord.patientPhone}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                             {selectedRecord.patientEmail}
                           </Typography>
                         </Box>
                         <Box sx={{ textAlign: 'right' }}>
                           <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                           <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                             #{selectedRecord.id}
                           </Typography>
                         </Box>
                       </Box>
                     </Grid>

                     {/* Hospital Information */}
                     <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 3 }}>
                         <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: theme.palette.primary.main }}>
                           <LocalHospital />
                           Hospital Information
                         </Typography>
                         <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" color="text.secondary">Hospital Name</Typography>
                           <Typography variant="body1" sx={{ fontWeight: 600 }}>
                             {selectedRecord.hospitalName}
                           </Typography>
                         </Box>
                         <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" color="text.secondary">Address</Typography>
                           <Typography variant="body1" sx={{ fontWeight: 500 }}>
                             {selectedRecord.hospitalAddress}, {selectedRecord.hospitalCity}, {selectedRecord.hospitalState}
                           </Typography>
                         </Box>
                         <Box sx={{ mb: 2 }}>
                           <Typography variant="body2" color="text.secondary">Contact</Typography>
                           <Typography variant="body1" sx={{ fontWeight: 500 }}>
                             {selectedRecord.hospitalContact}
                           </Typography>
                         </Box>
                         <Box>
                           <Typography variant="body2" color="text.secondary">Email</Typography>
                           <Typography variant="body1" sx={{ fontWeight: 500 }}>
                             {selectedRecord.hospitalEmail}
                           </Typography>
                         </Box>
                       </Box>
                     </Grid>

                     {/* Hospitalization Details */}
                     <Grid item xs={12} md={6}>
                       <Box sx={{ mb: 3 }}>
                         <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: theme.palette.primary.main }}>
                           <Bed />
                           Hospitalization Details
                         </Typography>
                         <Grid container spacing={2}>
                           <Grid item xs={6}>
                             <Typography variant="body2" color="text.secondary">Ward Type</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 600 }}>
                               {selectedRecord.wardType}
                             </Typography>
                           </Grid>
                           <Grid item xs={6}>
                             <Typography variant="body2" color="text.secondary">Bed Number</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 600 }}>
                               {selectedRecord.bedNumber}
                             </Typography>
                           </Grid>
                           <Grid item xs={6}>
                             <Typography variant="body2" color="text.secondary">Admission Date</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {new Date(selectedRecord.admissionDate).toLocaleDateString()}
                             </Typography>
                           </Grid>
                           <Grid item xs={6}>
                             <Typography variant="body2" color="text.secondary">Discharge Date</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {new Date(selectedRecord.dischargeDate).toLocaleDateString()}
                             </Typography>
                           </Grid>
                           <Grid item xs={12}>
                             <Typography variant="body2" color="text.secondary">Duration</Typography>
                             <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                               {selectedRecord.duration} days
                             </Typography>
                           </Grid>
                         </Grid>
                       </Box>
                     </Grid>

                     {/* Financial Information */}
                     <Grid item xs={12}>
                       <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                         <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: theme.palette.primary.main }}>
                           <Payment />
                           Financial Information
                         </Typography>
                         <Grid container spacing={3}>
                           <Grid item xs={12} md={3}>
                             <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                               <Typography variant="body2">Total Amount</Typography>
                               <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                 ₹{selectedRecord.amount.toLocaleString()}
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} md={3}>
                             <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                               <Typography variant="body2">Paid Amount</Typography>
                               <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                 ₹{selectedRecord.paidAmount?.toLocaleString() || '0'}
                               </Typography>
                             </Box>
                           </Grid>
                           <Grid item xs={12} md={3}>
                             <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'grey.100' }}>
                               <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                               <Chip 
                                 label={selectedRecord.paymentStatus} 
                                 size="small" 
                                 color={getPaymentStatusColor(selectedRecord.paymentStatus)}
                                 sx={{ textTransform: 'capitalize', mt: 1 }}
                               />
                             </Box>
                           </Grid>
                           <Grid item xs={12} md={3}>
                             <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'grey.100' }}>
                               <Typography variant="body2" color="text.secondary">Record Status</Typography>
                               <Chip 
                                 label={selectedRecord.status} 
                                 size="small" 
                                 color={getStatusColor(selectedRecord.status)}
                                 sx={{ textTransform: 'capitalize', mt: 1 }}
                               />
                             </Box>
                           </Grid>
                         </Grid>
                       </Box>
                     </Grid>

                     {/* Additional Information */}
                     <Grid item xs={12}>
                       <Box>
                         <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: theme.palette.primary.main }}>
                           <Assignment />
                           Additional Information
                         </Typography>
                         <Grid container spacing={2}>
                           <Grid item xs={6} md={3}>
                             <Typography variant="body2" color="text.secondary">Created On</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {new Date(selectedRecord.createdAt).toLocaleDateString()}
                             </Typography>
                           </Grid>
                           <Grid item xs={6} md={3}>
                             <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {new Date(selectedRecord.updatedAt).toLocaleDateString()}
                             </Typography>
                           </Grid>
                           <Grid item xs={6} md={3}>
                             <Typography variant="body2" color="text.secondary">Duration</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {selectedRecord.duration} days
                             </Typography>
                           </Grid>
                           <Grid item xs={6} md={3}>
                             <Typography variant="body2" color="text.secondary">Ward Type</Typography>
                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
                               {selectedRecord.wardType}
                             </Typography>
                           </Grid>
                         </Grid>
                       </Box>
                     </Grid>
                   </Grid>
                 </CardContent>
               </Card>
             </Box>
           )}
         </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={() => handleDownloadInvoice(selectedRecord)}
          >
            Download Invoice
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
      />
    </HospitalVendorLayout>
  );
};

export default HospitalVendorHistory; 