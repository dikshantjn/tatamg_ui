import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  DirectionsCar,
  Schedule,
  TrendingUp,
  Emergency,
  Visibility,
  LocalShipping,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  Circle,
  Refresh
} from '@mui/icons-material';
import AmbulanceVendorLayout from './AmbulanceVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AmbulanceVendorDashboard = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorStatus, setVendorStatus] = useState({ isActive: true });
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const authData = vendorAuthService.getVendorAuthData();
    if (authData && authData.vendorData) {
      setVendorData(authData.vendorData);
    }
    setLoading(false);
  }, []);

  const handleToggleActive = async () => {
    try {
      setStatusLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendorStatus(prev => ({ isActive: !prev.isActive }));
      toast.success(`Ambulance service is now ${!vendorStatus.isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      toast.error('Failed to update service status. Please try again.');
    } finally {
      setStatusLoading(false);
    }
  };

  // Sample dashboard data
  const dashboardStats = [
    { 
      title: 'Total Ambulances', 
      value: '12', 
      icon: <DirectionsCar />, 
      color: 'primary',
      progress: 85,
      change: '+2 this month'
    },
    { 
      title: 'Active Requests', 
      value: '8', 
      icon: <Assignment />, 
      color: 'secondary',
      progress: 65,
      change: '+3 today'
    },
    { 
      title: 'Revenue (₹)', 
      value: '23,450', 
      icon: <TrendingUp />, 
      color: 'success',
      progress: 92,
      change: '+12% this week'
    },
    { 
      title: 'Emergency Calls', 
      value: '3', 
      icon: <Emergency />, 
      color: 'error',
      progress: 45,
      change: '-1 from yesterday'
    },
  ];

  const recentRequests = [
    {
      id: 'REQ001',
      patient: 'John Doe',
      type: 'Emergency',
      status: 'In Progress',
      time: '15 mins ago',
      location: 'Mumbai Central',
      ambulance: 'A1'
    },
    {
      id: 'REQ002',
      patient: 'Jane Smith',
      type: 'Non-Emergency',
      status: 'Completed',
      time: '1 hour ago',
      location: 'Andheri West',
      ambulance: 'A3'
    },
    {
      id: 'REQ003',
      patient: 'Mike Johnson',
      type: 'Emergency',
      status: 'Pending',
      time: '2 hours ago',
      location: 'Bandra East',
      ambulance: 'A2'
    }
  ];

  const availableAmbulances = [
    {
      id: 'A1',
      driver: 'Rajesh Kumar',
      status: 'Available',
      rating: 4.8,
      location: 'Mumbai Central'
    },
    {
      id: 'A2',
      driver: 'Amit Patel',
      status: 'Available',
      rating: 4.6,
      location: 'Andheri West'
    },
    {
      id: 'A3',
      driver: 'Suresh Singh',
      status: 'On Call',
      rating: 4.9,
      location: 'Bandra East'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'info';
      case 'Available':
        return 'success';
      case 'On Call':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle fontSize="small" />;
      case 'In Progress':
        return <Warning fontSize="small" />;
      case 'Pending':
        return <Schedule fontSize="small" />;
      case 'Available':
        return <CheckCircle fontSize="small" />;
      case 'On Call':
        return <Emergency fontSize="small" />;
      default:
        return <Error fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <AmbulanceVendorLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </AmbulanceVendorLayout>
    );
  }

  return (
    <AmbulanceVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>

        {/* Welcome Card */}
        <Card 
          sx={{
            mb: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[8],
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  Welcome back,
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      Loading...
                    </Box>
                  ) : (
                    vendorData?.email?.split('@')[0] || 'Ambulance Service'
                  )}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {loading ? 'Loading...' : vendorData?.email || 'ambulance@example.com'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleToggleActive}
                disabled={statusLoading}
                startIcon={
                  statusLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Circle sx={{ 
                      color: vendorStatus?.isActive ? 'success.main' : 'error.main', 
                      fontSize: '1.2rem' 
                    }} />
                  )
                }
                sx={{
                  borderRadius: 20,
                  borderColor: vendorStatus?.isActive ? 'success.main' : 'error.main',
                  color: vendorStatus?.isActive ? 'success.main' : 'error.main',
                  fontWeight: 500,
                  textTransform: 'none',
                  minWidth: 110,
                  px: 2,
                  '&:hover': {
                    borderColor: vendorStatus?.isActive ? 'success.dark' : 'error.dark',
                    backgroundColor: vendorStatus?.isActive ? 'success.lighter' : 'error.lighter',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {statusLoading ? 'Loading...' : (vendorStatus?.isActive ? 'Active' : 'Inactive')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Dashboard Stats */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          Service Overview
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
          {dashboardStats.map((stat, index) => (
            <Card 
              key={index}
              sx={{
                height: '100%',
                minHeight: { xs: 140, sm: 150, md: 160 },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
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
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Recent Activity */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          Recent Activity
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: { xs: 300, md: 400 },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Requests
                  </Typography>
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Box>
                <List sx={{ p: 0 }}>
                  {recentRequests.map((request) => (
                    <ListItem key={request.id} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: theme.palette[getStatusColor(request.status)].main 
                        }}>
                          {getStatusIcon(request.status)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              {request.patient}
                            </Typography>
                            <Chip 
                              label={request.type} 
                              size="small" 
                              color={request.type === 'Emergency' ? 'error' : 'default'}
                              variant="outlined"
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              {request.location} • {request.time}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              Ambulance: {request.ambulance}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip 
                        label={request.status} 
                        size="small" 
                        color={getStatusColor(request.status)}
                        icon={getStatusIcon(request.status)}
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: { xs: 300, md: 400 },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Available Ambulances
                  </Typography>
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Box>
                <List sx={{ p: 0 }}>
                  {availableAmbulances.map((ambulance) => (
                    <ListItem key={ambulance.id} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: theme.palette[getStatusColor(ambulance.status)].main 
                        }}>
                          <DirectionsCar />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              Ambulance {ambulance.id}
                            </Typography>
                            <Chip 
                              label={ambulance.status} 
                              size="small" 
                              color={getStatusColor(ambulance.status)}
                              icon={getStatusIcon(ambulance.status)}
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              Driver: {ambulance.driver}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              Location: {ambulance.location}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Rating">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              ⭐ {ambulance.rating}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="colored"
      />
    </AmbulanceVendorLayout>
  );
};

export default AmbulanceVendorDashboard; 