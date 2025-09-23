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
  useTheme,
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
  Snackbar
} from '@mui/material';
import {
  VideoCall,
  Phone,
  CalendarToday,
  AccessTime,
  Person,
  CheckCircle,
  Star,
  Message,
  PhoneInTalk,
  Videocam,
  MoreVert,
  Visibility,
  Receipt,
  Payment,
  Computer,
  LocalHospital,
  Refresh,
  Cancel,
  Schedule,
  CheckCircleOutline,
  ErrorOutline
} from '@mui/icons-material';
import { doctorConsultationVendorService } from '../../../services/Vendors/DoctorConsultationVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';

const DoctorConsultationVendorHistory = () => {
  const theme = useTheme();
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedConsultationForMenu, setSelectedConsultationForMenu] = useState(null);

  // API state
  const [completedConsultations, setCompletedConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [vendorId, setVendorId] = useState(null);

  // Get vendor ID from auth service
  useEffect(() => {
    const authData = vendorAuthService.getVendorAuthData();
    console.log('History: Auth data:', authData);
    
    if (authData?.vendorData?.vendorId) {
      setVendorId(authData.vendorData.vendorId);
    } else if (authData?.vendorData?.id) {
      setVendorId(authData.vendorData.id);
    } else if (authData?.vendorData?.doctorId) {
      setVendorId(authData.vendorData.doctorId);
    } else if (authData?.vendorId) {
      setVendorId(authData.vendorId);
    } else {
      console.error('History: No vendor ID found in auth data');
      setError('Unable to identify vendor. Please login again.');
      setLoading(false);
    }
  }, []);

  // Fetch completed appointments when vendorId is available
  useEffect(() => {
    if (vendorId) {
      fetchCompletedAppointments();
    }
  }, [vendorId]);

  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('History: Fetching completed appointments for vendor:', vendorId);
      
      const appointments = await doctorConsultationVendorService.getCompletedAppointments(vendorId);
      console.log('History: Fetched appointments:', appointments);
      
      setCompletedConsultations(appointments);
    } catch (error) {
      console.error('History: Error fetching completed appointments:', error);
      setError('Failed to load consultation history. Please try again.');
      setSnackbarMessage('Failed to load consultation history');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCompletedAppointments();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Computer />;
      case 'voice': return <PhoneInTalk />;
      case 'chat': return <Message />;
      case 'offline': return <LocalHospital />;
      default: return <VideoCall />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'primary';
      case 'voice': return 'secondary';
      case 'chat': return 'info';
      case 'offline': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'postponed': return 'secondary';
      case 'rescheduled': return 'primary';
      case 'no_call': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleOutline />;
      case 'cancelled': return <Cancel />;
      case 'pending': return <Schedule />;
      case 'confirmed': return <CheckCircle />;
      case 'postponed': return <Schedule />;
      case 'rescheduled': return <Schedule />;
      case 'no_call': return <ErrorOutline />;
      default: return <Schedule />;
    }
  };

  const handleMenuOpen = (event, consultation) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedConsultationForMenu(consultation);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedConsultationForMenu(null);
  };

  const handleConsultationClick = (consultation) => {
    setSelectedConsultation(consultation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedConsultation(null);
  };

  const handleAction = (action) => {
    if (selectedConsultationForMenu) {
      console.log(`${action} consultation ${selectedConsultationForMenu.id}`);
      switch (action) {
        case 'view':
          handleConsultationClick(selectedConsultationForMenu);
          break;
        case 'download':
          handleDownloadInvoice(selectedConsultationForMenu);
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const handleDownloadInvoice = async (consultation) => {
    try {
      console.log('History: Downloading invoice for consultation:', consultation.id);
      setSnackbarMessage('Downloading invoice...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      
      await doctorConsultationVendorService.downloadInvoice(consultation.clinicAppointmentId);
      
      setSnackbarMessage('Invoice downloaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('History: Error downloading invoice:', error);
      setSnackbarMessage('Failed to download invoice. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

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
          Consultation History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View completed consultation records and download invoices
        </Typography>
          </Box>
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[500],
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading consultation history...
          </Typography>
        </Box>
      ) : (
        /* Consultations Table */
        <Box sx={{ width: '100%' }}>
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
              padding: '12px 8px'
            }
          }}>
          <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme.palette.background.default,
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Sr No</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Consultation Type</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Fee</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {completedConsultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No consultation history found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                completedConsultations.map((consultation) => (
              <TableRow 
                key={consultation.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.action.hover 
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {consultation.srNo}
                  </Typography>
                </TableCell>
                <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                        <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.primary.main, flexShrink: 0 }}>
                      {consultation.patientName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {consultation.patientName}
                      </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {consultation.patientEmail}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={consultation.type.toUpperCase()}
                    size="small"
                    color={getTypeColor(consultation.type)}
                    icon={getTypeIcon(consultation.type)}
                  />
                </TableCell>
                    <TableCell>
                      <Chip 
                        label={consultation.status.toUpperCase()}
                        size="small"
                        color={getStatusColor(consultation.status)}
                        icon={getStatusIcon(consultation.status)}
                      />
                    </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(consultation.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {consultation.time}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {consultation.duration} min
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    ₹{consultation.consultationFee}
                  </Typography>
                </TableCell>
                    <TableCell>
                      <Chip 
                        label={consultation.paymentStatus.toUpperCase()}
                        size="small"
                        color={consultation.paymentStatus === 'paid' ? 'success' : 'warning'}
                      />
                    </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, consultation)}
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
        {/* Scroll Indicator */}
        <Typography variant="caption" color="text.secondary" sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 1,
          opacity: 0.7
        }}>
          ← Scroll horizontally to view all columns →
        </Typography>
        </Box>
      )}

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
        <MenuItem onClick={() => handleAction('download')}>
          <ListItemIcon>
            <Receipt fontSize="small" />
          </ListItemIcon>
          Download Invoice
        </MenuItem>
      </Menu>

      {/* Consultation Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedConsultation && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Consultation Details
                </Typography>
                <Chip
                  label={selectedConsultation.status.toUpperCase()}
                  color={getStatusColor(selectedConsultation.status)}
                  icon={getStatusIcon(selectedConsultation.status)}
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
                        primary={selectedConsultation.patientName}
                        secondary="Patient Name"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Message />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedConsultation.patientEmail}
                        secondary="Email"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedConsultation.patientPhone}
                        secondary="Phone"
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Doctor Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Doctor Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedConsultation.doctorName}
                        secondary="Doctor Name"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {getTypeIcon(selectedConsultation.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedConsultation.doctorSpecialty}
                        secondary="Specialty"
                      />
                    </ListItem>
                  </List>
                </Grid>

                {/* Consultation Details */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Consultation Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          <strong>Date:</strong> {new Date(selectedConsultation.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          <strong>Time:</strong> {selectedConsultation.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getTypeIcon(selectedConsultation.type)}
                        <Typography variant="body2">
                          <strong>Type:</strong> {selectedConsultation.type.toUpperCase()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Duration:</strong> {selectedConsultation.duration} minutes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Payment sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          <strong>Fee:</strong> ₹{selectedConsultation.consultationFee}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Payment Status:</strong> 
                          <Chip 
                            label={selectedConsultation.paymentStatus.toUpperCase()}
                            size="small"
                            color={selectedConsultation.paymentStatus === 'paid' ? 'success' : 'warning'}
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                      </Box>
                      {selectedConsultation.meetingUrl && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2">
                            <strong>Meeting URL:</strong> {selectedConsultation.meetingUrl}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                {/* Medical Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Notes:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConsultation.notes}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Created At:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(selectedConsultation.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Last Updated:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(selectedConsultation.updatedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="outlined"
                startIcon={<Receipt />}
                onClick={() => {
                  handleDownloadInvoice(selectedConsultation);
                }}
              >
                Download Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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

export default DoctorConsultationVendorHistory; 