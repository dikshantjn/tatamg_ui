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
            width: { xs: '100%', sm: 480 },
            backgroundColor: theme.palette.background.paper,
            border: 'none',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            marginTop: '72px', // Add margin to account for the header
            height: 'calc(100vh - 72px)', // Adjust height
            top: 0,
            zIndex: 1200
          }
        }}
      >
        {/* Minimalistic Header */}
        <Box sx={{ 
          p: 3, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
            opacity: 0.6
          }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                {sidebarType === 'view' ? <Visibility sx={{ fontSize: 20 }} /> : <Settings sx={{ fontSize: 20 }} />}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.text.primary,
                  fontSize: '1.1rem',
                  mb: 0.5
                }}>
                  {sidebarType === 'add' ? 'New Time Slot' : 
                   sidebarType === 'edit' ? 'Edit Time Slot' : 'Time Slot Details'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {sidebarType === 'view' ? 'View consultation schedule details' : 
                   sidebarType === 'edit' ? 'Modify your consultation schedule' : 'Set up your consultation schedule'}
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setSidebarOpen(false)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ 
          height: 'calc(100% - 100px)', 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[300],
            borderRadius: 3,
            '&:hover': {
              backgroundColor: theme.palette.grey[400],
            },
          },
        }}>
          {sidebarType === 'view' ? (
            // View Content - Ultra Compact Design
            <Box sx={{ p: 2 }}>
              {viewingTimeslot && (
                <Box>
                  {/* Schedule Details - Compact Single Row */}
                  <Box sx={{ 
                    mb: 2,
                    p: 1.5,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700, 
                        color: theme.palette.text.primary,
                        fontSize: '0.9rem'
                      }}>
                        Schedule Details
                      </Typography>
                      {/* Active Status on Right */}
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: '8px',
                        backgroundColor: viewingTimeslot.isActive ? theme.palette.success.main : theme.palette.error.main,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        boxShadow: `0 2px 6px ${viewingTimeslot.isActive ? theme.palette.success.main : theme.palette.error.main}30`
                      }}>
                        {getStatusIcon(viewingTimeslot.isActive)}
                        {viewingTimeslot.isActive ? 'Active' : 'Inactive'}
                      </Box>
                    </Box>
                    
                    {/* Edit Button directly below Active Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                      <Button 
                        variant="contained"
                        size="small"
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
                          borderRadius: '6px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                    
                    {/* All Details in One Row */}
                    <Grid container spacing={1}>
                      <Grid item xs={2.4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                            Day
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.75rem' }}>
                            {viewingTimeslot.day.slice(0, 3)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                            Slots
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.75rem' }}>
                            {viewingTimeslot.generatedSlots.length}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                            Start
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.75rem' }}>
                            {viewingTimeslot.startTime}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                            End
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.75rem' }}>
                            {viewingTimeslot.endTime}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                            Duration
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.75rem' }}>
                            {viewingTimeslot.intervalMinutes}m
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Time Slots Grid */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 700, 
                      mb: 1.5, 
                      color: theme.palette.text.primary,
                      fontSize: '0.9rem'
                    }}>
                      Available Time Slots
                    </Typography>
                    <Box sx={{ 
                      maxHeight: 200, 
                      overflow: 'auto',
                      borderRadius: '8px',
                      p: 1.5,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      '&::-webkit-scrollbar': {
                        width: 4,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[300],
                        borderRadius: 2,
                      },
                    }}>
                      <Grid container spacing={0.5}>
                        {viewingTimeslot.generatedSlots.map((slot, index) => (
                          <Grid item xs={6} sm={4} key={index}>
                            <Box sx={{
                              p: 1,
                              borderRadius: '6px',
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }
                            }}>
                              {slot}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            // Add/Edit Form Content - Compact Minimalistic Design
            <Box sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                '& .MuiFormControl-root': {
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '0.85rem'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: theme.palette.background.paper,
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
                  <Box sx={{ 
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <CalendarToday sx={{ fontSize: 14 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Select Day
                      </Typography>
                    </Box>
                    <FormControl fullWidth size="small">
                      <InputLabel>Day of Week</InputLabel>
                      <Select
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        label="Day of Week"
                      >
                        {daysOfWeek.map((day) => (
                          <MenuItem key={day} value={day}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                              {day}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                
                {/* Time Range - Compact Single Row */}
                <Box>
                  <Box sx={{ 
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.primary.main}08 100%)`,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: theme.palette.secondary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <AccessTime sx={{ fontSize: 14 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Time Range
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="Start Time"
                            value={formData.startTime}
                            onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small',
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
                                size: 'small',
                                InputLabelProps: { shrink: true }
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                
                {/* Interval Duration */}
                <Box>
                  <Box sx={{ 
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}08 0%, ${theme.palette.warning.main}08 100%)`,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: theme.palette.success.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Timer sx={{ fontSize: 14 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Duration per Slot
                      </Typography>
                    </Box>
                    <FormControl fullWidth size="small">
                      <InputLabel>Interval Duration</InputLabel>
                      <Select
                        value={formData.intervalMinutes}
                        onChange={(e) => setFormData({ ...formData, intervalMinutes: e.target.value })}
                        label="Interval Duration"
                      >
                        {intervalOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Timer sx={{ fontSize: 14, color: theme.palette.success.main }} />
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                
                {/* Status Toggle */}
                <Box>
                  <Box sx={{ 
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.palette.info.main}08 0%, ${theme.palette.error.main}08 100%)`,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: theme.palette.info.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Settings sx={{ fontSize: 14 }} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Availability Status
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: '6px', 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formData.isActive ? 
                          <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 16 }} /> : 
                          <Cancel sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                        }
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.8rem' }}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                      </Box>
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.palette.success.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.palette.success.main,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                      {formData.isActive ? 'Available for bookings' : 'Not accepting bookings'}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
                  <Button 
                    onClick={() => setSidebarOpen(false)}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      flex: 1,
                      backgroundColor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                      fontSize: '0.85rem',
                      '&:hover': {
                        backgroundColor: theme.palette.grey[200],
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={handleSaveTimeslot}
                    disabled={actionLoading || !formData.day || !formData.startTime || !formData.endTime}
                    startIcon={actionLoading ? <CircularProgress size={14} /> : <Save />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      flex: 2,
                      fontSize: '0.85rem',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[500],
                        transform: 'none',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {editingTimeslot ? 'Update' : 'Create'}
                  </Button>
                </Box>
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
