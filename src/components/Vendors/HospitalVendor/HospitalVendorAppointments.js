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
  Paper
} from '@mui/material';
import {
  Schedule,
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
  Notifications
} from '@mui/icons-material';
import HospitalVendorLayout from './HospitalVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { hospitalVendorService } from '../../../services/Vendors/HospitalVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HospitalVendorAppointments = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [acceptingAppointment, setAcceptingAppointment] = useState(null);
  const [notifyingPayment, setNotifyingPayment] = useState(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Fetch appointments data from API
          const vendorId = authData.vendorData.vendorId;
          const appointmentsResponse = await hospitalVendorService.getHospitalAppointments(vendorId);
          
          if (appointmentsResponse && appointmentsResponse.bookings) {
            // Transform API data to match component structure
            const transformedAppointments = appointmentsResponse.bookings.map(booking => ({
              id: booking.bedBookingId,
              patientName: booking.user?.name || 'N/A',
              patientPhone: booking.user?.phone_number || 'N/A',
              patientEmail: booking.user?.emailId || 'N/A',
              patientGender: booking.user?.gender || 'N/A',
              patientPhoto: booking.user?.photo || null,
              wardType: booking.bedType,
              bedNumber: booking.wardId, // Using wardId as bed number for now
              admissionDate: booking.bookingDate,
              timeSlot: booking.timeSlot,
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
              updatedAt: booking.updatedAt
            }));
            
            setAppointments(transformedAppointments);
          } else {
            setAppointments([]);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load appointments data');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleAcceptAppointment = async (appointment) => {
    try {
      setAcceptingAppointment(appointment.id);
      
      const response = await hospitalVendorService.acceptHospitalAppointment(appointment.id);
      
      if (response.message) {
        // Update the appointment status in the local state based on API response
        setAppointments(appointments.map(app => 
          app.id === appointment.id ? { ...app, status: response.booking?.status || 'accepted' } : app
        ));
        toast.success(response.message);
      } else {
        toast.error('Failed to accept appointment');
      }
    } catch (error) {
      console.error('Error accepting appointment:', error);
      toast.error('Failed to accept appointment. Please try again.');
    } finally {
      setAcceptingAppointment(null);
    }
  };

  const handleNotifyPayment = async (appointment) => {
    try {
      setNotifyingPayment(appointment.id);
      
      const response = await hospitalVendorService.notifyPayment(appointment.id);
      
      if (response.message) {
        toast.success(response.message);
      } else {
        toast.error('Failed to notify payment');
      }
    } catch (error) {
      console.error('Error notifying payment:', error);
      toast.error('Failed to notify payment. Please try again.');
    } finally {
      setNotifyingPayment(null);
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId ? { ...app, status: newStatus } : app
    ));
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'error';
      case 'urgent': return 'warning';
      case 'normal': return 'info';
      default: return 'default';
    }
  };



  const stats = [
    { title: 'Total Appointments', value: appointments.length, icon: <Schedule />, color: 'primary' },
    { title: 'Confirmed', value: appointments.filter(app => app.status === 'confirmed').length, icon: <CheckCircle />, color: 'success' },
    { title: 'Pending', value: appointments.filter(app => app.status === 'pending').length, icon: <Warning />, color: 'warning' },
    { title: 'Revenue (₹)', value: appointments.reduce((sum, app) => sum + app.amount, 0).toLocaleString(), icon: <Payment />, color: 'secondary' },
  ];

  // Skeleton loading component
  const AppointmentsSkeleton = () => (
    <HospitalVendorLayout title="Appointments Management">
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
    return <AppointmentsSkeleton />;
  }



  return (
    <HospitalVendorLayout title="Appointments Management">
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Appointments & Bookings
          </Typography>
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

        

        {/* Appointments Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Patient</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ward Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Booking Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Payment</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                                                  <TableBody>
                   {appointments.length > 0 ? (
                     appointments.map((appointment) => (
                       <TableRow key={appointment.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                         <TableCell>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Avatar 
                               src={appointment.patientPhoto}
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
                                 {appointment.patientName}
                               </Typography>
                               <Typography variant="body2" color="text.secondary">
                                 {appointment.patientPhone}
                               </Typography>
                             </Box>
                           </Box>
                         </TableCell>
                         <TableCell>
                           <Chip 
                             label={appointment.status} 
                             size="small" 
                             color={getStatusColor(appointment.status)}
                             sx={{ textTransform: 'capitalize' }}
                           />
                         </TableCell>
                         <TableCell>
                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
                             {appointment.wardType}
                           </Typography>
                         </TableCell>
                         <TableCell>
                           <Box>
                             <Typography variant="body2" sx={{ fontWeight: 500 }}>
                               {new Date(appointment.admissionDate).toLocaleDateString()}
                             </Typography>
                             <Typography variant="body2" color="text.secondary">
                               {appointment.timeSlot}
                             </Typography>
                           </Box>
                         </TableCell>
                         <TableCell>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>
                             ₹{appointment.amount.toLocaleString()}
                           </Typography>
                         </TableCell>
                         <TableCell>
                           <Chip 
                             label={appointment.paymentStatus} 
                             size="small" 
                             color={appointment.paymentStatus === 'pending' ? 'warning' : 'success'}
                             sx={{ textTransform: 'capitalize' }}
                           />
                         </TableCell>
                         <TableCell>
                           <Box sx={{ display: 'flex', gap: 1 }}>
                             {appointment.status === 'pending' ? (
                               <Tooltip title="Accept Request">
                                 <Button
                                   variant="contained"
                                   size="small"
                                   color="success"
                                   disabled={acceptingAppointment === appointment.id}
                                   onClick={() => handleAcceptAppointment(appointment)}
                                   startIcon={
                                     acceptingAppointment === appointment.id ? (
                                       <CircularProgress size={16} color="inherit" />
                                     ) : (
                                       <CheckCircle sx={{ fontSize: '1rem' }} />
                                     )
                                   }
                                   sx={{ 
                                     textTransform: 'none',
                                     fontSize: '0.75rem',
                                     px: 1.5,
                                     py: 0.5
                                   }}
                                 >
                                   {acceptingAppointment === appointment.id ? 'Accepting...' : 'Accept'}
                                 </Button>
                               </Tooltip>
                             ) : appointment.status === 'Accepted' || appointment.status === 'WaitingForPayment' ? (
                               <Tooltip title="Notify Payment">
                                 <Button
                                   variant="contained"
                                   size="small"
                                   color="primary"
                                   disabled={notifyingPayment === appointment.id}
                                   onClick={() => handleNotifyPayment(appointment)}
                                   startIcon={
                                     notifyingPayment === appointment.id ? (
                                       <CircularProgress size={16} color="inherit" />
                                     ) : (
                                       <Notifications sx={{ fontSize: '1rem' }} />
                                     )
                                   }
                                   sx={{ 
                                     textTransform: 'none',
                                     fontSize: '0.75rem',
                                     px: 1.5,
                                     py: 0.5
                                   }}
                                 >
                                   {notifyingPayment === appointment.id ? 'Notifying...' : 'Notify Payment'}
                                 </Button>
                               </Tooltip>
                             ) : (
                               <Tooltip title="View Details">
                                 <IconButton 
                                   size="small" 
                                   onClick={() => handleViewAppointment(appointment)}
                                   sx={{ 
                                     color: 'info.main',
                                     '&:hover': { backgroundColor: 'info.light' }
                                   }}
                                 >
                                   <Visibility sx={{ fontSize: '1.1rem' }} />
                                 </IconButton>
                               </Tooltip>
                             )}
                           </Box>
                         </TableCell>
                       </TableRow>
                     ))
                   ) : (
                     <TableRow>
                       <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                           <Assignment sx={{ fontSize: 48, color: 'text.secondary' }} />
                           <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                             No Appointments Found
                           </Typography>
                           <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                             There are no appointments to display at the moment.
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

      {/* Appointment Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Appointment Details' : 'New Appointment'}
        </DialogTitle>
        <DialogContent>
          {selectedAppointment ? (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Patient Information</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.patientName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.patientPhone}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.patientEmail}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.patientGender}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Booking Details</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Ward Type</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.wardType}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Ward ID</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.bedNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Booking Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(selectedAppointment.admissionDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Time Slot</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.timeSlot}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                      ₹{selectedAppointment.amount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                    <Chip 
                      label={selectedAppointment.paymentStatus} 
                      size="small" 
                      color={selectedAppointment.paymentStatus === 'pending' ? 'warning' : 'success'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Hospital Information</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Hospital Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.hospitalName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.hospitalAddress}, {selectedAppointment.hospitalCity}, {selectedAppointment.hospitalState}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Contact</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.hospitalContact}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAppointment.hospitalEmail}
                    </Typography>
                  </Box>
                </Grid>
                
              </Grid>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" color="text.secondary">
                New appointment form will be implemented here.
              </Typography>
            </Box>
          )}
        </DialogContent>
                 <DialogActions>
           <Button onClick={() => setOpenDialog(false)}>Close</Button>
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

export default HospitalVendorAppointments; 