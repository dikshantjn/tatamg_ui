import React, { useState } from 'react';
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
  ListItemButton
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
  LocalHospital
} from '@mui/icons-material';

const DoctorConsultationVendorHistory = () => {
  const theme = useTheme();
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedConsultationForMenu, setSelectedConsultationForMenu] = useState(null);

  // Sample completed consultation history data
  const completedConsultations = [
    {
      id: 1,
      srNo: 1,
      patientName: 'Sarah Johnson',
      patientEmail: 'sarah.johnson@email.com',
      patientPhone: '+91 98765 43210',
      doctorName: 'Dr. Michael Smith',
      doctorSpecialty: 'Cardiology',
      date: '2024-01-10',
      time: '14:30',
      duration: 30,
      type: 'video',
      status: 'completed',
      symptoms: 'Chest pain, shortness of breath',
      diagnosis: 'Angina pectoris',
      prescription: 'Nitroglycerin, Aspirin',
      rating: 5,
      consultationFee: 1500,
      paymentStatus: 'paid',
      notes: 'Patient responded well to treatment'
    },
    {
      id: 2,
      srNo: 2,
      patientName: 'John Davis',
      patientEmail: 'john.davis@email.com',
      patientPhone: '+91 87654 32109',
      doctorName: 'Dr. Emily Wilson',
      doctorSpecialty: 'Dermatology',
      date: '2024-01-09',
      time: '16:15',
      duration: 45,
      type: 'voice',
      status: 'completed',
      symptoms: 'Skin rash, itching',
      diagnosis: 'Contact dermatitis',
      prescription: 'Hydrocortisone cream',
      rating: 4,
      consultationFee: 1200,
      paymentStatus: 'paid',
      notes: 'Allergic reaction to new soap'
    },
    {
      id: 3,
      srNo: 3,
      patientName: 'Maria Garcia',
      patientEmail: 'maria.garcia@email.com',
      patientPhone: '+91 76543 21098',
      doctorName: 'Dr. Robert Brown',
      doctorSpecialty: 'Neurology',
      date: '2024-01-08',
      time: '10:00',
      duration: 60,
      type: 'video',
      status: 'completed',
      symptoms: 'Headaches, dizziness',
      diagnosis: 'Migraine',
      prescription: 'Sumatriptan, Propranolol',
      rating: 5,
      consultationFee: 2000,
      paymentStatus: 'paid',
      notes: 'Chronic migraine patient'
    },
    {
      id: 4,
      srNo: 4,
      patientName: 'David Wilson',
      patientEmail: 'david.wilson@email.com',
      patientPhone: '+91 65432 10987',
      doctorName: 'Dr. Lisa Anderson',
      doctorSpecialty: 'Pediatrics',
      date: '2024-01-07',
      time: '11:00',
      duration: 30,
      type: 'chat',
      status: 'completed',
      symptoms: 'Fever, cough',
      diagnosis: 'Upper respiratory infection',
      prescription: 'Acetaminophen, Cough syrup',
      rating: 4,
      consultationFee: 800,
      paymentStatus: 'paid',
      notes: 'Child consultation'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Computer />;
      case 'voice': return <PhoneInTalk />;
      case 'chat': return <Message />;
      default: return <VideoCall />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'primary';
      case 'voice': return 'secondary';
      case 'chat': return 'info';
      default: return 'default';
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
          console.log('Download invoice');
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  return (
    <Box sx={{ 
      width: '100%', 
      px: { xs: 2, sm: 3 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          Consultation History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View completed consultation records and download invoices
        </Typography>
      </Box>

      {/* Consultations Table */}
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
              <TableCell sx={{ fontWeight: 600 }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Consultation Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {completedConsultations.map((consultation) => (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {consultation.patientName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {consultation.patientName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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
                  {consultation.rating ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {consultation.rating}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    ₹{consultation.consultationFee}
                  </Typography>
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
                  label="Completed"
                  color="success"
                  icon={<CheckCircle />}
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
                      {selectedConsultation.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2">
                            <strong>Rating:</strong> {selectedConsultation.rating}/5
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                {/* Medical Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Medical Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Symptoms:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConsultation.symptoms}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Diagnosis:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConsultation.diagnosis}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Prescription:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConsultation.prescription}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Notes:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConsultation.notes}
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
                  console.log('Download invoice', selectedConsultation.id);
                }}
              >
                Download Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DoctorConsultationVendorHistory; 