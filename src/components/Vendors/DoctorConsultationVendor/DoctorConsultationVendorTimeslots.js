import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem as MenuItemComponent,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  Drawer,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  AccessTime,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility,
  CalendarToday,
  Timer,
  Settings,
  Close,
  Save,
  Info
} from '@mui/icons-material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { doctorConsultationService } from '../../../services/User/DoctorConsultation/doctor-consultation.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';

const DoctorConsultationVendorTimeslots = () => {
  const theme = useTheme();
  
  // State management
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [vendorId, setVendorId] = useState(null);
  
  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState('add'); // 'add', 'edit', 'view'
  const [editingTimeslot, setEditingTimeslot] = useState(null);
  const [viewingTimeslot, setViewingTimeslot] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    day: '',
    startTime: null,
    endTime: null,
    intervalMinutes: 30,
    isActive: true
  });
  
  // Menu states
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Days of the week
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Interval options
  const intervalOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' }
  ];

  // Get vendor ID from auth service
  useEffect(() => {
    const authData = vendorAuthService.getVendorAuthData();
    console.log('Timeslots: Auth data:', authData);
    
    if (authData?.vendorData?.vendorId) {
      setVendorId(authData.vendorData.vendorId);
    } else if (authData?.vendorData?.id) {
      setVendorId(authData.vendorData.id);
    } else if (authData?.vendorData?.doctorId) {
      setVendorId(authData.vendorData.doctorId);
    } else if (authData?.vendorId) {
      setVendorId(authData.vendorId);
    } else {
      console.error('Timeslots: No vendor ID found in auth data');
      setError('Unable to identify vendor. Please login again.');
      setLoading(false);
    }
  }, []);

  // Fetch timeslots when vendorId is available
  useEffect(() => {
    if (vendorId) {
      fetchTimeslots();
    }
  }, [vendorId]);

  const fetchTimeslots = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Timeslots: Fetching timeslots for vendor:', vendorId);
      
      const data = await doctorConsultationService.getAllTimeslots(vendorId);
      console.log('Timeslots: Fetched timeslots:', data);
      
      setTimeslots(data);
    } catch (error) {
      console.error('Timeslots: Error fetching timeslots:', error);
      setError('Failed to load timeslots. Please try again.');
      setSnackbarMessage('Failed to load timeslots');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTimeslots();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddTimeslot = () => {
    setEditingTimeslot(null);
    setFormData({
      day: '',
      startTime: null,
      endTime: null,
      intervalMinutes: 30,
      isActive: true
    });
    setSidebarType('add');
    setSidebarOpen(true);
  };

  const handleEditTimeslot = (timeslot) => {
    setEditingTimeslot(timeslot);
    setFormData({
      day: timeslot.day,
      startTime: dayjs(timeslot.startTime, 'HH:mm'),
      endTime: dayjs(timeslot.endTime, 'HH:mm'),
      intervalMinutes: timeslot.intervalMinutes,
      isActive: timeslot.isActive
    });
    setSidebarType('edit');
    setSidebarOpen(true);
  };

  const handleViewTimeslot = (timeslot) => {
    setViewingTimeslot(timeslot);
    setSidebarType('view');
    setSidebarOpen(true);
  };

  const handleDeleteTimeslot = async (timeslot) => {
    try {
      setActionLoading(true);
      console.log('Timeslots: Deleting timeslot:', timeslot.timeSlotID);
      
      await doctorConsultationService.deleteTimeslot(timeslot.timeSlotID);
      
      setSnackbarMessage('Timeslot deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      fetchTimeslots();
    } catch (error) {
      console.error('Timeslots: Error deleting timeslot:', error);
      setSnackbarMessage('Failed to delete timeslot. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleSaveTimeslot = async () => {
    try {
      setActionLoading(true);
      
      const timeslotData = {
        vendorId: vendorId,
        day: formData.day,
        startTime: formData.startTime ? formData.startTime.format('HH:mm') : '',
        endTime: formData.endTime ? formData.endTime.format('HH:mm') : '',
        intervalMinutes: formData.intervalMinutes,
        isActive: formData.isActive
      };

      if (editingTimeslot) {
        console.log('Timeslots: Updating timeslot:', editingTimeslot.timeSlotID);
        await doctorConsultationService.updateTimeslot(editingTimeslot.timeSlotID, timeslotData);
        setSnackbarMessage('Timeslot updated successfully!');
      } else {
        console.log('Timeslots: Creating new timeslot');
        await doctorConsultationService.createTimeslot(timeslotData);
        setSnackbarMessage('Timeslot created successfully!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSidebarOpen(false);
      fetchTimeslots();
    } catch (error) {
      console.error('Timeslots: Error saving timeslot:', error);
      setSnackbarMessage('Failed to save timeslot. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMenuOpen = (event, timeslot) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTimeslot(timeslot);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedTimeslot(null);
  };

  const handleAction = (action) => {
    if (selectedTimeslot) {
      switch (action) {
        case 'view':
          handleViewTimeslot(selectedTimeslot);
          break;
        case 'edit':
          handleEditTimeslot(selectedTimeslot);
          break;
        case 'delete':
          handleDeleteTimeslot(selectedTimeslot);
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': 'primary',
      'Tuesday': 'secondary',
      'Wednesday': 'success',
      'Thursday': 'warning',
      'Friday': 'info',
      'Saturday': 'error',
      'Sunday': 'default'
    };
    return colors[day] || 'default';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle /> : <Cancel />;
  };

  // Group timeslots by day
  const groupedTimeslots = timeslots.reduce((acc, timeslot) => {
    if (!acc[timeslot.day]) {
      acc[timeslot.day] = [];
    }
    acc[timeslot.day].push(timeslot);
    return acc;
  }, {});

  // Sort days according to week order
  const sortedDays = daysOfWeek.filter(day => groupedTimeslots[day]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading timeslots...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      px: { xs: 2, sm: 3 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTime sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                Time Slots Management
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your consultation time slots for each day of the week
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddTimeslot}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
              }
            }}
          >
            Add Time Slot
          </Button>
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Timeslots Table */}
      {timeslots.length === 0 ? (
        <Card sx={{ 
          textAlign: 'center', 
          py: 8,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
          border: `2px dashed ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <AccessTime sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
            <Typography variant="h5" gutterBottom color="text.secondary" sx={{ fontWeight: 600 }}>
              No Time Slots Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Start by adding your first time slot to manage your consultation schedule and provide better service to your patients
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddTimeslot}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                }
              }}
            >
              Add Your First Time Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                  Time Slots Overview
                </Box>
              </Typography>
              <Chip 
                label={`${timeslots.length} Total Slots`} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none', 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: '100%',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[400],
                  borderRadius: 4,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[600],
                  },
                },
              }}
            >
              <Table sx={{ 
                minWidth: 800,
                '& .MuiTableCell-root': {
                  whiteSpace: 'nowrap',
                  padding: '16px 12px'
                }
              }}>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: theme.palette.background.default,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                  }}>
                    <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>Time Range</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Interval</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Total Slots</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 80 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeslots.map((timeslot) => (
                    <TableRow 
                      key={timeslot.timeSlotID}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme.palette.action.hover 
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: theme.palette.background.paper
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {timeslot.day}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {timeslot.startTime} - {timeslot.endTime}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${timeslot.intervalMinutes} min`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {timeslot.generatedSlots.length}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={timeslot.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={getStatusColor(timeslot.isActive)}
                          icon={getStatusIcon(timeslot.isActive)}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {new Date(timeslot.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, timeslot)}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Scroll Indicator */}
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 2,
              opacity: 0.7
            }}>
              ← Scroll horizontally to view all columns →
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Sidebar for Add/Edit/View */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 500 },
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <AppBar position="static" elevation={0} sx={{ backgroundColor: theme.palette.background.paper }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}>
                {sidebarType === 'view' ? <Visibility /> : <Settings />}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  {sidebarType === 'add' ? 'Add New Time Slot' : 
                   sidebarType === 'edit' ? 'Edit Time Slot' : 'View Time Slot'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sidebarType === 'view' ? 'View timeslot details' : 
                   sidebarType === 'edit' ? 'Update your consultation schedule' : 'Create a new consultation schedule'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
          {sidebarType === 'view' ? (
            // View Content
            <Box>
              {viewingTimeslot && (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={viewingTimeslot.isActive ? 'Active' : 'Inactive'}
                      color={getStatusColor(viewingTimeslot.isActive)}
                      icon={getStatusIcon(viewingTimeslot.isActive)}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                          Schedule Information
                        </Box>
                      </Typography>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                      }}>
                        <List>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <CalendarToday sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Day of Week"
                              secondary={viewingTimeslot.day}
                              primaryTypographyProps={{ fontWeight: 600 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <AccessTime sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Time Range"
                              secondary={`${viewingTimeslot.startTime} - ${viewingTimeslot.endTime}`}
                              primaryTypographyProps={{ fontWeight: 600 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Timer sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Interval Duration"
                              secondary={`${viewingTimeslot.intervalMinutes} minutes`}
                              primaryTypographyProps={{ fontWeight: 600 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Schedule sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Total Slots"
                              secondary={viewingTimeslot.generatedSlots.length}
                              primaryTypographyProps={{ fontWeight: 600 }}
                            />
                          </ListItem>
                        </List>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                          Available Time Slots
                        </Box>
                      </Typography>
                      <Box sx={{ 
                        maxHeight: 300, 
                        overflow: 'auto',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                      }}>
                        <Grid container spacing={1}>
                          {viewingTimeslot.generatedSlots.map((slot, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                              <Box sx={{
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }
                              }}>
                                {slot}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => {
                        setSidebarType('edit');
                        setFormData({
                          day: viewingTimeslot.day,
                          startTime: dayjs(viewingTimeslot.startTime, 'HH:mm'),
                          endTime: dayjs(viewingTimeslot.endTime, 'HH:mm'),
                          intervalMinutes: viewingTimeslot.intervalMinutes,
                          isActive: viewingTimeslot.isActive
                        });
                        setEditingTimeslot(viewingTimeslot);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Edit Time Slot
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            // Add/Edit Form Content
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              '& .MuiFormControl-root': {
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                  color: theme.palette.text.primary
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  }
                }
              }
            }}>
              {/* Day Selection */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    Select Day of Week
                  </Box>
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    label="Day of Week"
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 18 }} />
                          {day}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Time Range */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    Set Time Range
                  </Box>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Start Time"
                        value={formData.startTime}
                        onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            InputLabelProps: { shrink: true }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="End Time"
                        value={formData.endTime}
                        onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            InputLabelProps: { shrink: true }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Interval Duration */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timer sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    Consultation Duration
                  </Box>
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Interval Duration</InputLabel>
                  <Select
                    value={formData.intervalMinutes}
                    onChange={(e) => setFormData({ ...formData, intervalMinutes: e.target.value })}
                    label="Interval Duration"
                  >
                    {intervalOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Timer sx={{ fontSize: 18 }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Status Toggle */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    Availability Status
                  </Box>
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.palette.success.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.palette.success.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formData.isActive ? <CheckCircle sx={{ color: 'success.main' }} /> : <Cancel sx={{ color: 'error.main' }} />}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formData.isActive ? 'Active - Available for bookings' : 'Inactive - Not accepting bookings'}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Box>
              
              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button 
                  onClick={() => setSidebarOpen(false)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveTimeslot}
                  disabled={actionLoading || !formData.day || !formData.startTime || !formData.endTime}
                  startIcon={actionLoading ? <CircularProgress size={16} /> : <Save />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                    },
                    '&:disabled': {
                      background: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                    }
                  }}
                >
                  {editingTimeslot ? 'Update Time Slot' : 'Create Time Slot'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>


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
        <MenuItemComponent onClick={() => handleAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleAction('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItemComponent>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorConsultationVendorTimeslots;
