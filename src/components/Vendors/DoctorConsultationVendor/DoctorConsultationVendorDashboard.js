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
  Divider,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Stack
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
  BarChart,
  PlayArrow,
  Stop
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
      px: { xs: 2, sm: 3 },
      maxWidth: '1400px',
      mx: 'auto'
    }}>
      {/* Welcome Card */}
      <Card 
        sx={{
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {profileLoading ? (
                <CircularProgress size={80} thickness={4} />
              ) : (
                <Avatar
                  src={vendorData.profilePicture}
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                >
                  {vendorData.avatar}
                </Avatar>
              )}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
                  Welcome back,
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                  {profileLoading ? 'Loading...' : vendorData.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7, color: theme.palette.text.secondary }}>
                  {profileLoading ? 'Loading...' : vendorData.email}
                </Typography>
                <Chip 
                  label={vendorData.specialty} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              </Box>
            </Box>
            
          </Box>
        </CardContent>
      </Card>

      {/* Booking Overview */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4, color: theme.palette.text.primary }}>
        📅 Booking Overview
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 6
      }}>
        {bookingOverview.map((item, index) => (
          <Card 
            key={index}
            sx={{
              height: '100%',
              minHeight: 160,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette[item.color].main}10 0%, ${theme.palette[item.color].main}05 100%)`,
              border: `1px solid ${theme.palette[item.color].main}20`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: `${item.color}.main`,
                color: `${item.color}.contrastText`,
                mb: 2,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}>
                {item.icon}
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                {item.count}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.secondary, textAlign: 'center' }}>
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Statistics */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4, color: theme.palette.text.primary }}>
        📊 Your Statistics
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 6
      }}>
        {statistics.map((stat, index) => (
          <Card 
            key={index}
            sx={{
              height: '100%',
              minHeight: 160,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette[stat.color].main}10 0%, ${theme.palette[stat.color].main}05 100%)`,
              border: `1px solid ${theme.palette[stat.color].main}20`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 3, 
                backgroundColor: `${stat.color}.main`,
                color: `${stat.color}.contrastText`,
                mb: 2,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}>
                {stat.icon}
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.secondary, textAlign: 'center' }}>
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Visit Trends and Analytics */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4, color: theme.palette.text.primary }}>
        📈 Visit Trends & Analytics
      </Typography>
      
      {/* Visit Trends Chart - Full Width */}
      <Box sx={{ mb: 4 }}>
        <Card sx={{ 
          height: '100%',
          minHeight: 400,
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}>
              📊 Visit Trends
            </Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="highest" 
                    stroke={theme.palette.success.main} 
                    strokeWidth={3}
                    name="Highest"
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={3}
                    name="Average"
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lowest" 
                    stroke={theme.palette.warning.main} 
                    strokeWidth={3}
                    name="Lowest"
                    dot={{ fill: theme.palette.warning.main, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Analytics Chart - Full Width */}
      <Box sx={{ mb: 4 }}>
        <Card sx={{ 
          height: '100%',
          minHeight: 400,
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}>
              🎯 Consultation Types
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
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 3 }}>
              {analyticsData.map((type, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                  <Box sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    backgroundColor: type.color,
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} />
                  <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    {type.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    {type.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming Appointments - Table Format */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4, color: theme.palette.text.primary }}>
        📋 Upcoming Appointments
      </Typography>
      <Box>
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
                📅 Recent Bookings
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
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
                View All
              </Button>
            </Box>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none', 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Patient ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Specialty</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow 
                      key={appointment.id}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 36, 
                            height: 36,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            color: 'white',
                            fontWeight: 600
                          }}>
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {appointment.patientName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {appointment.patientId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {appointment.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {appointment.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(appointment.type)}
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {appointment.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={appointment.specialty} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={appointment.status} 
                          size="small" 
                          color={getStatusColor(appointment.status)}
                          icon={getStatusIcon(appointment.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.primary.light,
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Start Consultation">
                            <IconButton 
                              size="small" 
                              sx={{
                                color: theme.palette.success.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.success.light,
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
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