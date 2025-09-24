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
  ErrorOutline,
  History
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}>
                  <History sx={{ fontSize: 24 }} />
                </Box>
                Consultation History
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View completed consultation records and download invoices
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
              },
              '&:disabled': {
                background: theme.palette.grey[300],
                color: theme.palette.grey[500],
                transform: 'none',
                boxShadow: 'none'
              }
            }}
          >
            Refresh
          </Button>
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Loading State */}
      {loading ? (
        <Card sx={{ 
          textAlign: 'center', 
          py: 8,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
          border: `2px dashed ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <CircularProgress size={60} sx={{ mb: 3, color: theme.palette.primary.main }} />
            <Typography variant="h6" gutterBottom color="text.secondary" sx={{ fontWeight: 600 }}>
              Loading Consultation History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we fetch your consultation records...
            </Typography>
          </CardContent>
        </Card>
      ) : completedConsultations.length === 0 ? (
        /* Empty State */
        <Card sx={{ 
          textAlign: 'center', 
          py: 8,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
          border: `2px dashed ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <History sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
            <Typography variant="h5" gutterBottom color="text.secondary" sx={{ fontWeight: 600 }}>
              No Consultation History Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              You haven't completed any consultations yet. Your consultation history will appear here once you start seeing patients.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        /* Consultations Table */
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
                  <History sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                  Consultation Records
                </Box>
              </Typography>
              <Chip 
                label={`${completedConsultations.length} Total Consultations`} 
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
                    <TableCell sx={{ fontWeight: 700, minWidth: 80 }}>Sr No</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>Patient Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Consultation Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Payment</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 80 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedConsultations.map((consultation) => (
                    <TableRow 
                      key={consultation.id}
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
                          <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '6px',
                            backgroundColor: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {consultation.srNo}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                          <Avatar sx={{ 
                            width: 36, 
                            height: 36, 
                            backgroundColor: theme.palette.primary.main, 
                            flexShrink: 0,
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {consultation.patientName.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={consultation.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(consultation.status)}
                          icon={getStatusIcon(consultation.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {new Date(consultation.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {consultation.time}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {consultation.duration} min
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                          ₹{consultation.consultationFee}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={consultation.paymentStatus.toUpperCase()}
                          size="small"
                          color={consultation.paymentStatus === 'paid' ? 'success' : 'warning'}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, consultation)}
                          sx={{ 
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              color: theme.palette.primary.main
                            }
                          }}
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
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        {selectedConsultation && (
          <>
            <DialogTitle sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              overflow: 'hidden',
              py: 2
            }}>
              {/* Background Pattern */}
              <Box sx={{
                position: 'absolute',
                top: -15,
                right: -15,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
                opacity: 0.5
              }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                  }}>
                    <VideoCall sx={{ fontSize: 16 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                      Consultation Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Complete consultation information
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={selectedConsultation.status.toUpperCase()}
                  color={getStatusColor(selectedConsultation.status)}
                  icon={getStatusIcon(selectedConsultation.status)}
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
              {/* Single Card with All Details */}
              <Card sx={{ 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative Background */}
                <Box sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                  opacity: 0.6
                }} />
                
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  {/* Key-Value Pairs Grid */}
                  <Grid container spacing={4}>
                    {/* Patient Information */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                          Patient Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Name
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.patientName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Email
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.patientEmail}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Phone
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.patientPhone}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Doctor Information */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                          Doctor Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Name
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.doctorName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Specialty
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.doctorSpecialty}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Consultation Details */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 18, color: theme.palette.success.main }} />
                          Consultation Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Date
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {new Date(selectedConsultation.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Time
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Type
                            </Typography>
                            <Chip 
                              label={selectedConsultation.type.toUpperCase()}
                              size="small"
                              color={getTypeColor(selectedConsultation.type)}
                              icon={getTypeIcon(selectedConsultation.type)}
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Duration
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedConsultation.duration} minutes
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Payment & Status */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Payment sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                          Payment & Status
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Fee
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                              ₹{selectedConsultation.consultationFee}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Payment Status
                            </Typography>
                            <Chip 
                              label={selectedConsultation.paymentStatus.toUpperCase()}
                              size="small"
                              color={selectedConsultation.paymentStatus === 'paid' ? 'success' : 'warning'}
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Status
                            </Typography>
                            <Chip 
                              label={selectedConsultation.status.toUpperCase()}
                              size="small"
                              color={getStatusColor(selectedConsultation.status)}
                              icon={getStatusIcon(selectedConsultation.status)}
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          {selectedConsultation.meetingUrl && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Meeting URL
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>
                                {selectedConsultation.meetingUrl}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Additional Information */}
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Message sx={{ fontSize: 18, color: theme.palette.info.main }} />
                          Additional Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Notes
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                              {selectedConsultation.notes || 'No notes available for this consultation.'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Created At
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {new Date(selectedConsultation.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Last Updated
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {new Date(selectedConsultation.updatedAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions sx={{ 
              p: 2, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
              borderTop: `1px solid ${theme.palette.divider}`,
              gap: 1.5
            }}>
              <Button 
                onClick={handleCloseDialog}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
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
                Close
              </Button>
              <Button 
                variant="contained"
                size="small"
                startIcon={<Receipt />}
                onClick={() => {
                  handleDownloadInvoice(selectedConsultation);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  fontSize: '0.85rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.2s ease'
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