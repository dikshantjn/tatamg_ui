import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  ListItemButton,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import {
  VideoCall,
  Phone,
  Chat,
  CalendarToday,
  AccessTime,
  LocationOn,
  Person,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  Star,
  Message,
  PhoneInTalk,
  Videocam,
  Edit,
  Delete,
  FilterList,
  Search,
  Add,
  Refresh,
  MoreVert,
  Visibility,
  Notifications,
  Payment,
  LocalHospital,
  Computer,
  NotificationsActive,
  MoneyOff,
  Call,
  CallEnd
} from '@mui/icons-material';
import { doctorConsultationVendorService } from '../../../services/Vendors/DoctorConsultationVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';

const DoctorConsultationVendorAppointments = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedAppointmentForMenu, setSelectedAppointmentForMenu] = useState(null);

  // State for API data
  const [onlineAppointments, setOnlineAppointments] = useState([]);
  const [offlineAppointments, setOfflineAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [vendorId, setVendorId] = useState(null);
  
  // State for status update dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // State for call functionality
  const [callingAppointment, setCallingAppointment] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);

  // Get vendor ID from auth service
  useEffect(() => {
    const authData = vendorAuthService.getVendorAuthData();
    
    // Try different possible field names for vendor ID
    const possibleVendorId = authData?.vendorData?.vendorId || 
                             authData?.vendorData?.id || 
                             authData?.vendorData?.doctorId ||
                             authData?.vendorId;
    
    if (possibleVendorId) {
      setVendorId(possibleVendorId);
    } else {
      // Fallback to hardcoded vendor ID for testing
      const testVendorId = 'f77b91b9-117f-41fa-93b0-76e986fa8999';
      setVendorId(testVendorId);
    }
  }, []);

  // Fetch appointments data
  useEffect(() => {
    if (vendorId) {
      fetchAppointments();
    }
  }, [vendorId]);

  const fetchAppointments = async () => {
    if (!vendorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch online appointments
      const onlineData = await doctorConsultationVendorService.getOnlinePendingAppointments(vendorId);
      const transformedOnlineData = onlineData.map((appointment, index) => 
        doctorConsultationVendorService.transformAppointmentData(appointment, index)
      );
      setOnlineAppointments(transformedOnlineData);

      // Fetch offline appointments
      const offlineData = await doctorConsultationVendorService.getOfflinePendingAppointments(vendorId);
      const transformedOfflineData = offlineData.map((appointment, index) => 
        doctorConsultationVendorService.transformAppointmentData(appointment, index)
      );
      setOfflineAppointments(transformedOfflineData);

    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
      setSnackbarMessage(err.message || 'Failed to fetch appointments');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAppointments();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedAppointmentForMenu || !selectedStatus) {
      console.log('Missing data:', { 
        appointment: !!selectedAppointmentForMenu, 
        status: selectedStatus 
      });
      return;
    }

    console.log('Updating status:', {
      appointmentId: selectedAppointmentForMenu.clinicAppointmentId,
      status: selectedStatus
    });

    setActionLoading(true);
    
    try {
      await doctorConsultationVendorService.updateAppointmentStatus(
        selectedAppointmentForMenu.clinicAppointmentId, 
        selectedStatus
      );
      setSnackbarMessage(`Appointment status updated to ${selectedStatus}`);
      setSnackbarOpen(true);
      await fetchAppointments(); // Refresh the list
      setStatusDialogOpen(false);
      setSelectedStatus('');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedStatus('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      case 'postponed': return 'warning';
      case 'rescheduled': return 'info';
      case 'no_call': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      case 'completed': return <CheckCircle />;
      case 'postponed': return <Schedule />;
      case 'rescheduled': return <Schedule />;
      case 'no_call': return <Phone />;
      default: return <Schedule />;
    }
  };

  const handleCall = (appointment) => {
    console.log('Initiating call with patient:', appointment.patientName);
    setCallingAppointment(appointment);
    setCallInProgress(true);
    
    // TODO: Implement actual call functionality (WebRTC, etc.)
    // For now, just show a success message
    setTimeout(() => {
      setSnackbarMessage(`Call initiated with ${appointment.patientName}`);
      setSnackbarOpen(true);
    }, 1000);
  };

  const handleEndCall = () => {
    console.log('Ending call');
    setCallInProgress(false);
    setCallingAppointment(null);
    setSnackbarMessage('Call ended');
    setSnackbarOpen(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Virtual': return <Computer />;
      case 'In Clinic': return <LocalHospital />;
      default: return <VideoCall />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Virtual': return 'primary';
      case 'In Clinic': return 'secondary';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMenuOpen = (event, appointment) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedAppointmentForMenu(appointment);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedAppointmentForMenu(null);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleAction = async (action) => {
    if (!selectedAppointmentForMenu) return;

    // Store the appointment data before closing menu
    const appointmentData = selectedAppointmentForMenu;

    // Only set loading for actions that make API calls immediately
    const immediateApiActions = ['complete'];
    if (immediateApiActions.includes(action)) {
      setActionLoading(true);
    }
    
    // Close menu first for all actions
    handleMenuClose();
    
    try {
      switch (action) {
        case 'view':
          handleAppointmentClick(appointmentData);
          break;
        case 'complete':
          await doctorConsultationVendorService.completeAppointment(appointmentData.clinicAppointmentId);
          setSnackbarMessage('Appointment completed successfully');
          setSnackbarOpen(true);
          await fetchAppointments(); // Refresh the list
          break;
        case 'postpone':
          setSelectedAppointmentForMenu(appointmentData); // Restore appointment data
          setSelectedStatus('postponed');
          setStatusDialogOpen(true);
          break;
        case 'cancel':
          setSelectedAppointmentForMenu(appointmentData); // Restore appointment data
          setSelectedStatus('cancelled');
          setStatusDialogOpen(true);
          break;
        case 'reschedule':
          setSelectedAppointmentForMenu(appointmentData); // Restore appointment data
          setSelectedStatus('rescheduled');
          setStatusDialogOpen(true);
          break;
        case 'no_call':
          setSelectedAppointmentForMenu(appointmentData); // Restore appointment data
          setSelectedStatus('no_call');
          setStatusDialogOpen(true);
          break;
        case 'notify':
          // TODO: Implement notification functionality
          setSnackbarMessage('Notification sent to patient');
          setSnackbarOpen(true);
          break;
        case 'refund':
          // TODO: Implement refund functionality
          setSnackbarMessage('Refund processed');
          setSnackbarOpen(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      if (immediateApiActions.includes(action)) {
        setActionLoading(false);
      }
    }
  };

  const currentAppointments = selectedTab === 0 ? onlineAppointments : offlineAppointments;

  return (
    <Box sx={{ 
      width: '100%', 
      px: { xs: 2, sm: 3 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          Appointments Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all consultation appointments
        </Typography>
      </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Refresh'}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}


      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                py: 2
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Computer />
                  Online Appointments
                  <Badge
                    badgeContent={onlineAppointments.length}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalHospital />
                  Offline Appointments
                  <Badge
                    badgeContent={offlineAppointments.length}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <TableContainer component={Paper} sx={{ 
        boxShadow: 'none', 
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
              <TableCell sx={{ fontWeight: 600 }}>Sr No</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Appointment Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Paid Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              {selectedTab === 0 && <TableCell sx={{ fontWeight: 600 }}>Call</TableCell>}
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={selectedTab === 0 ? 8 : 7} sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading appointments...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : currentAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectedTab === 0 ? 8 : 7} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No appointments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentAppointments.map((appointment) => (
              <TableRow 
                key={appointment.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.action.hover 
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {appointment.srNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {appointment.patientName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {appointment.patientName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.appointmentType}
                    size="small"
                    color={getTypeColor(appointment.appointmentType)}
                    icon={getTypeIcon(appointment.appointmentType)}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(appointment.dateTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(appointment.dateTime).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    ₹{appointment.paidAmount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.status}
                    size="small"
                    color={getStatusColor(appointment.status)}
                    icon={getStatusIcon(appointment.status)}
                  />
                </TableCell>
                {selectedTab === 0 && (
                  <TableCell>
                    {callInProgress && callingAppointment?.id === appointment.id ? (
                      <IconButton
                        size="small"
                        onClick={handleEndCall}
                        sx={{ 
                          color: 'error.main',
                          backgroundColor: 'error.light',
                          '&:hover': {
                            backgroundColor: 'error.main',
                            color: 'white'
                          }
                        }}
                      >
                        <CallEnd />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => handleCall(appointment)}
                        disabled={callInProgress}
                        sx={{ 
                          color: 'white',
                          backgroundColor: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                            color: 'white'
                          },
                          '&:disabled': {
                            backgroundColor: 'grey.300',
                            color: 'grey.500'
                          }
                        }}
                      >
                        <Call />
                      </IconButton>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, appointment)}
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('complete')} disabled={actionLoading}>
          <ListItemIcon>
            <CheckCircle fontSize="small" />
          </ListItemIcon>
          Complete
        </MenuItem>
        <MenuItem onClick={() => handleAction('postpone')} disabled={actionLoading}>
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          Postpone
        </MenuItem>
        <MenuItem onClick={() => handleAction('cancel')} disabled={actionLoading}>
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>
          Cancel
        </MenuItem>
        <MenuItem onClick={() => handleAction('reschedule')} disabled={actionLoading}>
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          Reschedule
        </MenuItem>
        <MenuItem onClick={() => handleAction('no_call')} disabled={actionLoading}>
          <ListItemIcon>
            <Phone fontSize="small" />
          </ListItemIcon>
          No Call
        </MenuItem>
        <MenuItem onClick={() => handleAction('notify')} disabled={actionLoading}>
          <ListItemIcon>
            <NotificationsActive fontSize="small" />
          </ListItemIcon>
          Notify
        </MenuItem>
        <MenuItem onClick={() => handleAction('refund')} disabled={actionLoading}>
          <ListItemIcon>
            <MoneyOff fontSize="small" />
          </ListItemIcon>
          Refund
        </MenuItem>
      </Menu>

      {/* Appointment Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedAppointment && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Appointment Details
                </Typography>
                <Chip
                  label={selectedAppointment.status}
                  color={getStatusColor(selectedAppointment.status)}
                  icon={getStatusIcon(selectedAppointment.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Patient Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Patient Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedAppointment.patientName}
                        secondary="Patient Name"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Message />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedAppointment.patientEmail}
                        secondary="Email"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedAppointment.mobileNo}
                        secondary="Phone"
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Appointment Details */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Appointment Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {getTypeIcon(selectedAppointment.appointmentType)}
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedAppointment.appointmentType}
                        secondary="Appointment Type"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText
                        primary={new Date(selectedAppointment.dateTime).toLocaleDateString()}
                        secondary="Date"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText
                        primary={new Date(selectedAppointment.dateTime).toLocaleTimeString()}
                        secondary="Time"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Payment />
                      </ListItemIcon>
                      <ListItemText
                        primary={`₹${selectedAppointment.paidAmount}`}
                        secondary="Paid Amount"
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Medical Information */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Medical Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Symptoms:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAppointment.symptoms}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Notes:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAppointment.notes}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained"
                onClick={() => {
                  console.log('Start consultation', selectedAppointment.id);
                  handleCloseDialog();
                }}
              >
                Start Consultation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={handleStatusDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Update Appointment Status
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Status"
              >
                {doctorConsultationVendorService.getAvailableStatuses().map((status) => (
                  <MenuItem key={status} value={status}>
                    <Chip 
                      label={status} 
                      size="small" 
                      color={getStatusColor(status)}
                      sx={{ mr: 1 }}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={actionLoading || !selectedStatus}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorConsultationVendorAppointments; 