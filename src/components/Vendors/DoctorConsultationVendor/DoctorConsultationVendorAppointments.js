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
  CallEnd,
  Description as DescriptionIcon,
  ChevronLeft,
  ChevronRight,
  Note,
  AttachFile,
  Upload
} from '@mui/icons-material';
import { doctorConsultationVendorService } from '../../../services/Vendors/DoctorConsultationVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';

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
  
  // State for health records
  const [healthRecordsDialogOpen, setHealthRecordsDialogOpen] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // State for reschedule functionality
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [loadingTimeslots, setLoadingTimeslots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  
  // State for horizontal date picker
  const [currentDateRange, setCurrentDateRange] = useState(new Date());
  const [dateOptions, setDateOptions] = useState([]);
  
  // State for note dialog
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  
  // State for file upload dialog
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

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

  const fetchHealthRecords = async (appointmentId) => {
    setLoadingHealthRecords(true);
    try {
      console.log('Fetching health records for appointment:', appointmentId);
      
      const response = await doctorConsultationService.getAppointmentHealthRecords(appointmentId);
      
      console.log('Health records API response:', response);
      
      if (response.success) {
        const healthRecordsData = response.healthRecords || [];
        console.log('Health records data:', healthRecordsData);
        
        setHealthRecords(healthRecordsData);
        setHealthRecordsDialogOpen(true);
        
        if (healthRecordsData.length === 0) {
          setSnackbarMessage('No health records found for this appointment');
          setSnackbarOpen(true);
        }
      } else {
        console.error('API response error:', response);
        setSnackbarMessage('Failed to fetch health records');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      
      // More specific error messages
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setSnackbarMessage('Network error: Please check your internet connection');
      } else if (error.response?.status === 404) {
        setSnackbarMessage('No health records found for this appointment');
      } else if (error.response?.status === 500) {
        setSnackbarMessage('Server error: Please try again later');
      } else {
        setSnackbarMessage(`Error fetching health records: ${error.message}`);
      }
      
      setSnackbarOpen(true);
    } finally {
      setLoadingHealthRecords(false);
    }
  };

  const handleHealthRecordClick = (record) => {
    setSelectedHealthRecord(record);
    setPreviewDialogOpen(true);
  };

  const handleCloseHealthRecordsDialog = () => {
    setHealthRecordsDialogOpen(false);
    setHealthRecords([]);
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialogOpen(false);
    setSelectedHealthRecord(null);
  };

  const fetchTimeslots = async (date) => {
    if (!vendorId || !date) return;
    
    setLoadingTimeslots(true);
    try {
      console.log('Fetching timeslots for date:', date, 'vendorId:', vendorId);
      
      const response = await doctorConsultationService.getTimeslots(vendorId, date);
      console.log('Timeslots response:', response);
      
      if (response.availableSlots && Array.isArray(response.availableSlots)) {
        // Get booked times and normalize format (remove seconds if present)
        const bookedTimes = response.bookedSlots ? response.bookedSlots.map(slot => {
          const time = slot.time;
          return time.includes(':') && time.split(':').length === 3 
            ? time.substring(0, 5) // Remove seconds from "10:00:00" format
            : time; // Keep as is if already in "10:00" format
        }) : [];
        
        // Get all available slots
        const availableTimes = response.availableSlots || [];
        
        // Combine available and booked times to get all possible timeslots
        const allTimes = [...new Set([...availableTimes, ...bookedTimes])].sort();
        
        // Transform all timeslots into the expected format
        const timeslots = allTimes.map((time, index) => ({
          id: `slot_${index}`,
          time: time,
          available: availableTimes.includes(time) && !bookedTimes.includes(time),
          booked: bookedTimes.includes(time)
        }));
        
        setAvailableTimeslots(timeslots);
      } else {
        setAvailableTimeslots([]);
      }
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      setSnackbarMessage('Error fetching available timeslots');
      setSnackbarOpen(true);
      setAvailableTimeslots([]);
    } finally {
      setLoadingTimeslots(false);
    }
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointmentForMenu(appointment);
    setRescheduleDialogOpen(true);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimeslots([]);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    if (date) {
      fetchTimeslots(date);
    } else {
      setAvailableTimeslots([]);
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointmentForMenu || !selectedDate || !selectedTime) {
      setSnackbarMessage('Please select both date and time');
      setSnackbarOpen(true);
      return;
    }

    setRescheduleLoading(true);
    try {
      const rescheduleData = {
        date: selectedDate,
        time: selectedTime,
        by: "doctor"
      };

      console.log('Rescheduling appointment with data:', rescheduleData);
      
      await doctorConsultationService.rescheduleAppointment(
        selectedAppointmentForMenu.clinicAppointmentId, 
        rescheduleData
      );
      
      setSnackbarMessage('Appointment rescheduled successfully');
      setSnackbarOpen(true);
      setRescheduleDialogOpen(false);
      setSelectedDate('');
      setSelectedTime('');
      setAvailableTimeslots([]);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setSnackbarMessage(`Error rescheduling appointment: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCloseRescheduleDialog = () => {
    setRescheduleDialogOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimeslots([]);
  };

  // Note dialog handlers
  const handleNoteClick = (appointment) => {
    setSelectedAppointmentForMenu(appointment);
    setNoteText(appointment.notes || '');
    setNoteDialogOpen(true);
  };

  const handleCloseNoteDialog = () => {
    setNoteDialogOpen(false);
    setNoteText('');
    setSelectedAppointmentForMenu(null);
  };

  const handleSaveNote = async () => {
    if (!selectedAppointmentForMenu || !noteText.trim()) {
      setSnackbarMessage('Please enter a note');
      setSnackbarOpen(true);
      return;
    }

    setNoteLoading(true);
    try {
      await doctorConsultationService.updateAppointmentNote(
        selectedAppointmentForMenu.clinicAppointmentId,
        { note: noteText.trim() }
      );
      
      setSnackbarMessage('Note updated successfully');
      setSnackbarOpen(true);
      setNoteDialogOpen(false);
      setNoteText('');
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating note:', error);
      setSnackbarMessage(`Error updating note: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setNoteLoading(false);
    }
  };

  // File upload dialog handlers
  const handleFileUploadClick = (appointment) => {
    setSelectedAppointmentForMenu(appointment);
    setSelectedFiles([]);
    setFileUploadDialogOpen(true);
  };

  const handleCloseFileUploadDialog = () => {
    setFileUploadDialogOpen(false);
    setSelectedFiles([]);
    setSelectedAppointmentForMenu(null);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUploadFiles = async () => {
    if (!selectedAppointmentForMenu || selectedFiles.length === 0) {
      setSnackbarMessage('Please select files to upload');
      setSnackbarOpen(true);
      return;
    }

    setFileUploadLoading(true);
    try {
      await doctorConsultationService.uploadAppointmentFiles(
        selectedAppointmentForMenu.clinicAppointmentId,
        selectedFiles
      );
      
      setSnackbarMessage('Files uploaded successfully');
      setSnackbarOpen(true);
      setFileUploadDialogOpen(false);
      setSelectedFiles([]);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error uploading files:', error);
      setSnackbarMessage(`Error uploading files: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setFileUploadLoading(false);
    }
  };

  // Generate date options for horizontal picker
  const generateDateOptions = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear()
      });
    }
    return dates;
  };

  // Initialize date options when reschedule dialog opens
  useEffect(() => {
    if (rescheduleDialogOpen) {
      const today = new Date();
      const options = generateDateOptions(today);
      setDateOptions(options);
      setCurrentDateRange(today);
    }
  }, [rescheduleDialogOpen]);

  // Navigate date range
  const navigateDateRange = (direction) => {
    const newDate = new Date(currentDateRange);
    newDate.setDate(currentDateRange.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDateRange(newDate);
    const options = generateDateOptions(newDate);
    setDateOptions(options);
  };

  // Handle date selection from horizontal picker
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setSelectedTime(''); // Reset time when date changes
    fetchTimeslots(dateString);
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
        case 'update_status':
          setSelectedAppointmentForMenu(appointmentData); // Restore appointment data
          setStatusDialogOpen(true);
          break;
        case 'view_health_records':
          await fetchHealthRecords(appointmentData.clinicAppointmentId);
          break;
        case 'reschedule':
          handleRescheduleClick(appointmentData);
          break;
        case 'add_note':
          handleNoteClick(appointmentData);
          break;
        case 'upload_files':
          handleFileUploadClick(appointmentData);
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
        <MenuItem onClick={() => handleAction('update_status')} disabled={actionLoading}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Update Status
        </MenuItem>
         <MenuItem onClick={() => handleAction('view_health_records')} disabled={loadingHealthRecords}>
           <ListItemIcon>
             <DescriptionIcon fontSize="small" />
           </ListItemIcon>
           View Health Records
         </MenuItem>
         <MenuItem onClick={() => handleAction('reschedule')}>
           <ListItemIcon>
             <Schedule fontSize="small" />
           </ListItemIcon>
           Reschedule
         </MenuItem>
         <MenuItem onClick={() => handleAction('add_note')}>
           <ListItemIcon>
             <Note fontSize="small" />
           </ListItemIcon>
           Add Note
         </MenuItem>
         <MenuItem onClick={() => handleAction('upload_files')}>
           <ListItemIcon>
             <AttachFile fontSize="small" />
           </ListItemIcon>
           Upload Files
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

      {/* Health Records Dialog */}
      <Dialog 
        open={healthRecordsDialogOpen} 
        onClose={handleCloseHealthRecordsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Patient Health Records
            </Typography>
            <Chip
              label={`${healthRecords.length} Records`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {loadingHealthRecords ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading health records...
              </Typography>
            </Box>
           ) : healthRecords.length === 0 ? (
             <Box sx={{ textAlign: 'center', py: 4 }}>
               <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
               <Typography variant="h6" gutterBottom>
                 No Health Records
               </Typography>
               <Typography variant="body2" color="text.secondary" mb={2}>
                 No health records were shared for this appointment.
               </Typography>
               <Button 
                 variant="outlined" 
                 onClick={() => fetchHealthRecords(selectedAppointmentForMenu?.clinicAppointmentId)}
                 startIcon={<Refresh />}
               >
                 Retry
               </Button>
             </Box>
          ) : (
            <Grid container spacing={2}>
              {healthRecords.map((record) => (
                <Grid item xs={12} sm={6} md={4} key={record.healthRecordId}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => handleHealthRecordClick(record)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <DescriptionIcon color="primary" />
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                          {record.name}
                        </Typography>
                      </Box>
                      <Chip 
                        label={record.type.replace('_', ' ').toUpperCase()} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(record.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseHealthRecordsDialog}>Close</Button>
           {healthRecords.length === 0 && (
             <Button 
               variant="outlined" 
               onClick={() => fetchHealthRecords(selectedAppointmentForMenu?.clinicAppointmentId)}
               startIcon={<Refresh />}
             >
               Retry
             </Button>
           )}
         </DialogActions>
      </Dialog>

      {/* Health Record Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={handleClosePreviewDialog}
        maxWidth="lg"
        fullWidth
      >
        {selectedHealthRecord && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DescriptionIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedHealthRecord.name}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedHealthRecord.type.replace('_', ' ').toUpperCase()} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Upload Date:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(selectedHealthRecord.uploadedAt).toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  File Preview:
                </Typography>
                <Box 
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    p: 2, 
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.50'
                  }}
                >
                  {selectedHealthRecord.fileUrl.includes('.pdf') ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <DescriptionIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        PDF Document
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Click the button below to view the full document
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => window.open(selectedHealthRecord.fileUrl, '_blank')}
                        startIcon={<DescriptionIcon />}
                      >
                        Open PDF
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <img 
                        src={selectedHealthRecord.fileUrl} 
                        alt={selectedHealthRecord.name}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '400px', 
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <Box sx={{ display: 'none', textAlign: 'center' }}>
                        <DescriptionIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Image Preview
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Unable to load image preview
                        </Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => window.open(selectedHealthRecord.fileUrl, '_blank')}
                          startIcon={<DescriptionIcon />}
                        >
                          Open Image
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreviewDialog}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => window.open(selectedHealthRecord.fileUrl, '_blank')}
                startIcon={<DescriptionIcon />}
              >
                Open Full Document
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

       {/* Reschedule Dialog */}
       <Dialog 
         open={rescheduleDialogOpen} 
         onClose={handleCloseRescheduleDialog}
         maxWidth="sm"
         fullWidth
       >
         <DialogTitle>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Schedule color="primary" />
             <Typography variant="h6" sx={{ fontWeight: 600 }}>
               Reschedule Appointment
             </Typography>
           </Box>
         </DialogTitle>
         <DialogContent>
           {selectedAppointmentForMenu && (
             <Box sx={{ mt: 2 }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                 Patient: {selectedAppointmentForMenu.patientName}
               </Typography>
               
               {/* Horizontal Date Picker */}
               <Box sx={{ mb: 3 }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                   Select Date:
                 </Typography>
                 
                 {/* Month-Year Header */}
                 <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
                     {dateOptions.length > 0 && `${dateOptions[0].month} ${dateOptions[0].year}`}
                   </Typography>
                 </Box>
                 
                 {/* Date Navigation */}
                 <Box sx={{ mb: 2 }}>
                   {/* Navigation Buttons Row */}
                   <Box sx={{ 
                     display: 'flex', 
                     justifyContent: 'space-between', 
                     alignItems: 'center',
                     mb: 1
                   }}>
                     <IconButton 
                       onClick={() => navigateDateRange('prev')}
                       size="small"
                       sx={{ 
                         color: 'text.primary',
                         '&:hover': { backgroundColor: 'action.hover' },
                         p: 1
                       }}
                     >
                       <ChevronLeft />
                     </IconButton>
                     
                     <IconButton 
                       onClick={() => navigateDateRange('next')}
                       size="small"
                       sx={{ 
                         color: 'text.primary',
                         '&:hover': { backgroundColor: 'action.hover' },
                         p: 1
                       }}
                     >
                       <ChevronRight />
                     </IconButton>
                   </Box>
                   
                   {/* Dates Row */}
                   <Box sx={{ 
                     display: 'flex', 
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     gap: { xs: 0.5, sm: 1 },
                     px: { xs: 0.5, sm: 1 }
                   }}>
                     {dateOptions.map((dateOption) => (
                       <Box
                         key={dateOption.date}
                         onClick={() => handleDateSelect(dateOption.date)}
                         sx={{
                           flex: 1,
                           minWidth: 0,
                           p: { xs: 0.75, sm: 1 },
                           borderRadius: 2,
                           textAlign: 'center',
                           cursor: 'pointer',
                           border: selectedDate === dateOption.date ? 2 : 1,
                           borderColor: selectedDate === dateOption.date ? 'primary.main' : 'divider',
                           backgroundColor: selectedDate === dateOption.date ? 'primary.light' : 'transparent',
                           transition: 'all 0.2s ease-in-out',
                           '&:hover': {
                             backgroundColor: selectedDate === dateOption.date ? 'primary.main' : 'action.hover',
                             color: selectedDate === dateOption.date ? 'white' : 'inherit'
                           }
                         }}
                       >
                         <Typography 
                           variant="caption" 
                           sx={{ 
                             fontWeight: 600, 
                             display: 'block',
                             fontSize: { xs: '0.6rem', sm: '0.7rem' },
                             lineHeight: 1
                           }}
                         >
                           {dateOption.day}
                         </Typography>
                         <Typography 
                           variant="h6" 
                           sx={{ 
                             fontWeight: 700,
                             fontSize: { xs: '0.9rem', sm: '1.1rem' },
                             lineHeight: 1.2
                           }}
                         >
                           {dateOption.dayNumber}
                         </Typography>
                       </Box>
                     ))}
                   </Box>
                 </Box>
               </Box>

               {selectedDate && (
                 <Box sx={{ mb: 3 }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                     Available Time Slots:
                   </Typography>
                   
                   {loadingTimeslots ? (
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                       <CircularProgress size={20} />
                       <Typography variant="body2">Loading available timeslots...</Typography>
                     </Box>
                   ) : availableTimeslots.length === 0 ? (
                     <Box sx={{ py: 2 }}>
                       <Typography variant="body2" color="text.secondary">
                         No available timeslots for this date
                       </Typography>
                     </Box>
                   ) : (
                     <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                       {availableTimeslots.map((timeslot) => (
                         <Grid item xs={6} sm={4} md={3} key={timeslot.id}>
                           <Box sx={{ position: 'relative' }}>
                             <Button
                               variant={selectedTime === timeslot.time ? "contained" : "outlined"}
                               size="small"
                               onClick={() => !timeslot.booked && setSelectedTime(timeslot.time)}
                               disabled={timeslot.booked}
                               fullWidth
                               sx={{ 
                                 minHeight: { xs: 36, sm: 40 },
                                 fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                 opacity: timeslot.booked ? 0.6 : 1,
                                 backgroundColor: timeslot.booked ? 'grey.200' : 'inherit',
                                 color: timeslot.booked ? 'text.disabled' : 'inherit',
                                 '&:disabled': {
                                   backgroundColor: 'grey.200',
                                   color: 'text.disabled'
                                 }
                               }}
                             >
                               {timeslot.time}
                             </Button>
                             {timeslot.booked && (
                               <Chip
                                 label="Booked"
                                 size="small"
                                 sx={{
                                   position: 'absolute',
                                   top: -8,
                                   right: -8,
                                   fontSize: { xs: '0.5rem', sm: '0.6rem' },
                                   height: { xs: 14, sm: 16 },
                                   backgroundColor: 'error.main',
                                   color: 'white',
                                   '& .MuiChip-label': {
                                     px: 0.5
                                   }
                                 }}
                               />
                             )}
                           </Box>
                         </Grid>
                       ))}
                     </Grid>
                   )}
                 </Box>
               )}

               {selectedDate && selectedTime && (
                 <Box sx={{ 
                   p: 2, 
                   backgroundColor: 'primary.light', 
                   borderRadius: 1,
                   border: 1,
                   borderColor: 'primary.main',
                   color: 'primary.contrastText'
                 }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.dark' }}>
                     New Appointment Details:
                   </Typography>
                   <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                     <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                   </Typography>
                   <Typography variant="body2" sx={{ color: 'primary.dark' }}>
                     <strong>Time:</strong> {selectedTime}
                   </Typography>
                 </Box>
               )}
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseRescheduleDialog} disabled={rescheduleLoading}>
             Cancel
           </Button>
           <Button 
             onClick={handleReschedule}
             variant="contained"
             disabled={rescheduleLoading || !selectedDate || !selectedTime}
             startIcon={rescheduleLoading ? <CircularProgress size={20} /> : <Schedule />}
           >
             {rescheduleLoading ? 'Rescheduling...' : 'Reschedule'}
           </Button>
         </DialogActions>
       </Dialog>

       {/* Note Dialog */}
       <Dialog 
         open={noteDialogOpen} 
         onClose={handleCloseNoteDialog}
         maxWidth="sm"
         fullWidth
       >
         <DialogTitle>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Note color="primary" />
             <Typography variant="h6" sx={{ fontWeight: 600 }}>
               Add/Update Note
             </Typography>
           </Box>
         </DialogTitle>
         <DialogContent>
           {selectedAppointmentForMenu && (
             <Box sx={{ mt: 2 }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                 Patient: {selectedAppointmentForMenu.patientName}
               </Typography>
               
               <TextField
                 fullWidth
                 multiline
                 rows={6}
                 value={noteText}
                 onChange={(e) => setNoteText(e.target.value)}
                 placeholder="Enter your notes about this appointment..."
                 variant="outlined"
                 sx={{ mt: 2 }}
               />
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseNoteDialog} disabled={noteLoading}>
             Cancel
           </Button>
           <Button 
             onClick={handleSaveNote}
             variant="contained"
             disabled={noteLoading || !noteText.trim()}
             startIcon={noteLoading ? <CircularProgress size={20} /> : <Note />}
           >
             {noteLoading ? 'Saving...' : 'Save Note'}
           </Button>
         </DialogActions>
       </Dialog>

       {/* File Upload Dialog */}
       <Dialog 
         open={fileUploadDialogOpen} 
         onClose={handleCloseFileUploadDialog}
         maxWidth="sm"
         fullWidth
       >
         <DialogTitle>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <AttachFile color="primary" />
             <Typography variant="h6" sx={{ fontWeight: 600 }}>
               Upload Files
             </Typography>
           </Box>
         </DialogTitle>
         <DialogContent>
           {selectedAppointmentForMenu && (
             <Box sx={{ mt: 2 }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                 Patient: {selectedAppointmentForMenu.patientName}
               </Typography>
               
               <Box sx={{ mt: 2 }}>
                 <input
                   accept="*/*"
                   style={{ display: 'none' }}
                   id="file-upload"
                   multiple
                   type="file"
                   onChange={handleFileSelect}
                 />
                 <label htmlFor="file-upload">
                   <Button
                     variant="outlined"
                     component="span"
                     startIcon={<Upload />}
                     sx={{ mb: 2 }}
                   >
                     Select Files
                   </Button>
                 </label>
                 
                 {selectedFiles.length > 0 && (
                   <Box sx={{ mt: 2 }}>
                     <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                       Selected Files:
                     </Typography>
                     {selectedFiles.map((file, index) => (
                       <Box key={index} sx={{ 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: 1, 
                         mb: 1,
                         p: 1,
                         border: 1,
                         borderColor: 'divider',
                         borderRadius: 1
                       }}>
                         <AttachFile fontSize="small" />
                         <Typography variant="body2" sx={{ flex: 1 }}>
                           {file.name}
                         </Typography>
                         <Typography variant="caption" color="text.secondary">
                           {(file.size / 1024 / 1024).toFixed(2)} MB
                         </Typography>
                       </Box>
                     ))}
                   </Box>
                 )}
               </Box>
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseFileUploadDialog} disabled={fileUploadLoading}>
             Cancel
           </Button>
           <Button 
             onClick={handleUploadFiles}
             variant="contained"
             disabled={fileUploadLoading || selectedFiles.length === 0}
             startIcon={fileUploadLoading ? <CircularProgress size={20} /> : <Upload />}
           >
             {fileUploadLoading ? 'Uploading...' : 'Upload Files'}
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