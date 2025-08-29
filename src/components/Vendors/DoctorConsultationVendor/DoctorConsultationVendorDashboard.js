import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  VideoCall,
  Event,
  Person,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  Star,
  Message,
  CalendarToday,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Notifications,
  AccountCircle,
  Videocam,
  PhoneInTalk,
  Chat,
  People,
  Assessment,
  Timeline,
  BarChart
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { doctorConsultationVendorService } from '../../../services/Vendors/DoctorConsultationVendor.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';

const DoctorConsultationVendorDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch vendor profile on component mount
  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        setProfileLoading(true);
        const authData = vendorAuthService.getVendorAuthData();
        
        if (!authData?.vendorData?.vendorId) {
          console.error('No vendor ID found in auth data');
          return;
        }

        const profileData = await doctorConsultationVendorService.getVendorProfile(authData.vendorData.vendorId);
        setVendorProfile(profileData);
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
        // Set default data if API fails
        setVendorProfile({
          doctorName: 'Dr. Michael Smith',
          email: 'michael.smith@healthcare.com',
          profilePicture: ''
        });
      } finally {
        setProfileLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  // Sample vendor data (fallback)
  const vendorData = {
    name: vendorProfile?.doctorName || 'Dr. Michael Smith',
    email: vendorProfile?.email || 'michael.smith@healthcare.com',
    specialty: 'Cardiology',
    avatar: vendorProfile?.doctorName ? vendorProfile.doctorName.split(' ').map(n => n[0]).join('') : 'MS',
    profilePicture: vendorProfile?.profilePicture || ''
  };

  // Booking overview data
  const bookingOverview = [
    { title: 'Today', count: 8, color: 'primary', icon: <CalendarToday /> },
    { title: 'Upcoming', count: 23, color: 'secondary', icon: <Schedule /> },
    { title: 'Past', count: 156, color: 'info', icon: <Event /> }
  ];

  // Statistics data
  const statistics = [
    { title: 'Total Patients', value: '1,234', icon: <People />, color: 'primary' },
    { title: 'Total Appointments', value: '2,456', icon: <Schedule />, color: 'secondary' },
    { title: 'Average Rating', value: '4.8', icon: <Star />, color: 'warning' },
    { title: 'Completion Rate', value: '94%', icon: <CheckCircle />, color: 'success' }
  ];

  // Visit trends data
  const visitTrendsData = [
    { month: 'Jan', highest: 45, average: 32, lowest: 18 },
    { month: 'Feb', highest: 52, average: 38, lowest: 22 },
    { month: 'Mar', highest: 48, average: 35, lowest: 20 },
    { month: 'Apr', highest: 61, average: 42, lowest: 25 },
    { month: 'May', highest: 58, average: 40, lowest: 23 },
    { month: 'Jun', highest: 65, average: 45, lowest: 28 },
  ];

  // Analytics data
  const analyticsData = [
    { name: 'Video Call', value: 65, color: '#6C47FF' },
    { name: 'Voice Call', value: 25, color: '#2196F3' },
    { name: 'Chat', value: 10, color: '#10B981' },
  ];

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      time: '2:30 PM',
      date: 'Today',
      type: 'Video Call',
      status: 'confirmed',
      specialty: 'Cardiology',
      patientId: 'PAT001'
    },
    {
      id: 2,
      patientName: 'John Davis',
      time: '4:15 PM',
      date: 'Today',
      type: 'Voice Call',
      status: 'pending',
      specialty: 'Dermatology',
      patientId: 'PAT002'
    },
    {
      id: 3,
      patientName: 'Maria Garcia',
      time: '10:00 AM',
      date: 'Tomorrow',
      type: 'Video Call',
      status: 'confirmed',
      specialty: 'Neurology',
      patientId: 'PAT003'
    },
    {
      id: 4,
      patientName: 'David Wilson',
      time: '11:30 AM',
      date: 'Tomorrow',
      type: 'Chat',
      status: 'confirmed',
      specialty: 'Pediatrics',
      patientId: 'PAT004'
    },
    {
      id: 5,
      patientName: 'Emily Brown',
      time: '3:45 PM',
      date: 'Tomorrow',
      type: 'Video Call',
      status: 'pending',
      specialty: 'Orthopedics',
      patientId: 'PAT005'
    },
    {
      id: 6,
      patientName: 'Michael Chen',
      time: '9:00 AM',
      date: 'Day After',
      type: 'Voice Call',
      status: 'confirmed',
      specialty: 'Cardiology',
      patientId: 'PAT006'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video Call': return <Videocam />;
      case 'Voice Call': return <PhoneInTalk />;
      case 'Chat': return <Chat />;
      default: return <VideoCall />;
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      px: { xs: 2, sm: 3 }
    }}>
      {/* Welcome Card */}
      <Card 
        sx={{
          mb: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.card,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {profileLoading ? (
                <CircularProgress size={60} />
              ) : (
                <Avatar
                  src={vendorData.profilePicture}
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }}
                >
                  {vendorData.avatar}
                </Avatar>
              )}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  Welcome back,
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {profileLoading ? 'Loading...' : vendorData.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {profileLoading ? 'Loading...' : vendorData.email}
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'success.main',
                      '& + .MuiSwitch-track': {
                        backgroundColor: 'success.main',
                      },
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                  {isActive ? 'Active' : 'Inactive'}
                </Typography>
              }
            />
          </Box>
        </CardContent>
      </Card>

      {/* Booking Overview */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
        Booking Overview
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        justifyContent: 'center',
        maxWidth: '1400px',
        mx: 'auto',
        mb: 4
      }}>
        {bookingOverview.map((item, index) => (
          <Card 
            key={index}
            sx={{
              height: '100%',
              minHeight: { xs: 140, sm: 150, md: 160 },
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: { xs: 1.5, sm: 2, md: 2.5 },
                flex: 1
              }}>
                <Box sx={{ 
                  p: { xs: 1.5, sm: 1.8, md: 2 }, 
                  borderRadius: 3, 
                  backgroundColor: `${item.color}.light`,
                  color: `${item.color}.contrastText`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: { xs: 48, sm: 56, md: 64 },
                  minHeight: { xs: 48, sm: 56, md: 64 }
                }}>
                  {item.icon}
                </Box>
              </Box>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem', lg: '2rem' } }}>
                  {item.count}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' } }}>
                  {item.title}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Statistics */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
        Your Statistics
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        justifyContent: 'center',
        maxWidth: '1400px',
        mx: 'auto',
        mb: 4
      }}>
        {statistics.map((stat, index) => (
          <Card 
            key={index}
            sx={{
              height: '100%',
              minHeight: { xs: 140, sm: 150, md: 160 },
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: { xs: 1.5, sm: 2, md: 2.5 },
                flex: 1
              }}>
                <Box sx={{ 
                  p: { xs: 1.5, sm: 1.8, md: 2 }, 
                  borderRadius: 3, 
                  backgroundColor: `${stat.color}.light`,
                  color: `${stat.color}.contrastText`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: { xs: 48, sm: 56, md: 64 },
                  minHeight: { xs: 48, sm: 56, md: 64 }
                }}>
                  {stat.icon}
                </Box>
              </Box>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem', lg: '2rem' } }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' } }}>
                  {stat.title}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Visit Trends and Analytics */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
        Visit Trends & Analytics
      </Typography>
      
      {/* Visit Trends Chart - Full Width */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', mb: 4 }}>
        <Card sx={{ 
          height: '100%',
          minHeight: 400,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Visit Trends
            </Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="highest" 
                    stroke={theme.palette.success.main} 
                    strokeWidth={3}
                    name="Highest"
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={3}
                    name="Average"
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lowest" 
                    stroke={theme.palette.warning.main} 
                    strokeWidth={3}
                    name="Lowest"
                    dot={{ fill: theme.palette.warning.main, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Analytics Chart - Full Width */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', mb: 4 }}>
        <Card sx={{ 
          height: '100%',
          minHeight: 400,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Consultation Types
            </Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 3 }}>
              {analyticsData.map((type, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    backgroundColor: type.color,
                    mr: 2
                  }} />
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {type.name}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {type.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming Appointments - Table Format */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
        Upcoming Appointments
      </Typography>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Card sx={{ 
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Bookings
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                    <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Patient ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Specialty</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow 
                      key={appointment.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme.palette.action.hover 
                        }
                      }}
                    >
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
                        <Typography variant="body2" color="text.secondary">
                          {appointment.patientId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {appointment.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(appointment.type)}
                          <Typography variant="body2">
                            {appointment.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={appointment.specialty} 
                          size="small" 
                          variant="outlined"
                        />
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Start Consultation">
                            <IconButton size="small" color="success">
                              <VideoCall />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DoctorConsultationVendorDashboard; 