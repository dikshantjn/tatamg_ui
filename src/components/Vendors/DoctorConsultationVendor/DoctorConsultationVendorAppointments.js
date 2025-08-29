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
  ListItemButton
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
  MoneyOff
} from '@mui/icons-material';

const DoctorConsultationVendorAppointments = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedAppointmentForMenu, setSelectedAppointmentForMenu] = useState(null);

  // Sample appointments data
  const onlineAppointments = [
    {
      id: 1,
      srNo: 1,
      patientName: 'Sarah Johnson',
      mobileNo: '+91 98765 43210',
      appointmentType: 'Virtual',
      dateTime: '2024-01-15 14:30',
      paidAmount: 1500,
      status: 'confirmed',
      patientEmail: 'sarah.johnson@email.com',
      symptoms: 'Chest pain, shortness of breath',
      notes: 'Patient has history of heart conditions'
    },
    {
      id: 2,
      srNo: 2,
      patientName: 'John Davis',
      mobileNo: '+91 87654 32109',
      appointmentType: 'Virtual',
      dateTime: '2024-01-15 16:15',
      paidAmount: 1200,
      status: 'pending',
      patientEmail: 'john.davis@email.com',
      symptoms: 'Skin rash, itching',
      notes: 'New patient consultation'
    },
    {
      id: 3,
      srNo: 3,
      patientName: 'Maria Garcia',
      mobileNo: '+91 76543 21098',
      appointmentType: 'Virtual',
      dateTime: '2024-01-16 10:00',
      paidAmount: 2000,
      status: 'confirmed',
      patientEmail: 'maria.garcia@email.com',
      symptoms: 'Headaches, dizziness',
      notes: 'Follow-up consultation'
    }
  ];

  const offlineAppointments = [
    {
      id: 4,
      srNo: 1,
      patientName: 'David Wilson',
      mobileNo: '+91 65432 10987',
      appointmentType: 'In Clinic',
      dateTime: '2024-01-15 11:00',
      paidAmount: 800,
      status: 'confirmed',
      patientEmail: 'david.wilson@email.com',
      symptoms: 'Fever, cough',
      notes: 'Child consultation'
    },
    {
      id: 5,
      srNo: 2,
      patientName: 'Emily Brown',
      mobileNo: '+91 54321 09876',
      appointmentType: 'In Clinic',
      dateTime: '2024-01-16 15:30',
      paidAmount: 1000,
      status: 'pending',
      patientEmail: 'emily.brown@email.com',
      symptoms: 'Back pain, muscle stiffness',
      notes: 'Physical examination required'
    },
    {
      id: 6,
      srNo: 3,
      patientName: 'Michael Chen',
      mobileNo: '+91 43210 98765',
      appointmentType: 'In Clinic',
      dateTime: '2024-01-17 09:00',
      paidAmount: 1200,
      status: 'confirmed',
      patientEmail: 'michael.chen@email.com',
      symptoms: 'Joint pain, swelling',
      notes: 'Rheumatology consultation'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      case 'completed': return <Schedule />;
      default: return <Schedule />;
    }
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

  const handleAction = (action) => {
    if (selectedAppointmentForMenu) {
      console.log(`${action} appointment ${selectedAppointmentForMenu.id}`);
      // Handle different actions here
      switch (action) {
        case 'view':
          handleAppointmentClick(selectedAppointmentForMenu);
          break;
        case 'complete':
          console.log('Complete appointment');
          break;
        case 'postpone':
          console.log('Postpone appointment');
          break;
        case 'cancel':
          console.log('Cancel appointment');
          break;
        case 'notify':
          console.log('Notify patient');
          break;
        case 'refund':
          console.log('Process refund');
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const currentAppointments = selectedTab === 0 ? onlineAppointments : offlineAppointments;

  return (
    <Box sx={{ 
      width: '100%', 
      px: { xs: 2, sm: 3 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          Appointments Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all consultation appointments
        </Typography>
      </Box>

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
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAppointments.map((appointment) => (
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
            ))}
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
        <MenuItem onClick={() => handleAction('complete')}>
          <ListItemIcon>
            <CheckCircle fontSize="small" />
          </ListItemIcon>
          Complete
        </MenuItem>
        <MenuItem onClick={() => handleAction('postpone')}>
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          Postpone
        </MenuItem>
        <MenuItem onClick={() => handleAction('cancel')}>
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>
          Cancel
        </MenuItem>
        <MenuItem onClick={() => handleAction('notify')}>
          <ListItemIcon>
            <NotificationsActive fontSize="small" />
          </ListItemIcon>
          Notify
        </MenuItem>
        <MenuItem onClick={() => handleAction('refund')}>
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
    </Box>
  );
};

export default DoctorConsultationVendorAppointments; 