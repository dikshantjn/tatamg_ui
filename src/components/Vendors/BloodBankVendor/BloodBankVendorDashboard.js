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
  Avatar,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Bloodtype,
  Schedule,
  Emergency,
  Circle,
  Refresh,
  People,
  Payment
} from '@mui/icons-material';
import BloodBankVendorLayout from './BloodBankVendorLayout';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { getVendorStatus, toggleVendorStatus } from '../../../services/Vendors/AllVendors.service';
import { bloodBankVendorService } from '../../../services/Vendors/BloodBankVendor.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodBankVendorDashboard = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorStatus, setVendorStatus] = useState({ isActive: false });
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const authData = vendorAuthService.getVendorAuthData();
        if (authData && authData.vendorData) {
          setVendorData(authData.vendorData);
          
          // Fetch current vendor status from API using vendorId from stored data
          const vendorId = authData.vendorData.vendorId || authData.vendorData.id;
          if (vendorId) {
            console.log('Fetching status for blood bank vendor ID:', vendorId);
            
            // Fetch vendor status
            const statusData = await getVendorStatus(vendorId);
            setVendorStatus({ isActive: statusData.isActive || false });
            
            // Fetch profile data from API
            try {
              const apiResponse = await bloodBankVendorService.getBloodBankProfile(vendorId);
              const transformedData = bloodBankVendorService.transformProfileData(apiResponse);
              if (transformedData) {
                setProfileData(transformedData);
              }
            } catch (profileError) {
              console.error('Error fetching profile data:', profileError);
              // Don't show error toast for profile fetch, use fallback data
            }
          } else {
            console.warn('Vendor ID not found in stored data:', authData.vendorData);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleToggleActive = async () => {
    setStatusLoading(true);
    try {
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId || authData?.vendorData?.id;
      
      if (!vendorId) {
        toast.error('Vendor ID not found');
        return;
      }

      const newStatus = !vendorStatus.isActive;
      await toggleVendorStatus(vendorId, newStatus);
      setVendorStatus({ isActive: newStatus });
      
      toast.success(`Blood bank ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      toast.error('Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const refreshVendorStatus = async () => {
    setStatusLoading(true);
    try {
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId || authData?.vendorData?.id;
      
      if (vendorId) {
        const statusData = await getVendorStatus(vendorId);
        setVendorStatus({ isActive: statusData.isActive || false });
        toast.success('Status refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing vendor status:', error);
      toast.error('Failed to refresh status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Sample dashboard data
  const dashboardStats = [
    { title: 'Total Blood Units', value: '1,245', icon: <Bloodtype />, color: 'primary', trend: '+12%' },
    { title: 'Emergency Requests', value: '8', icon: <Emergency />, color: 'error', trend: '-3%' },
    { title: 'Revenue (₹)', value: '34,230', icon: <Payment />, color: 'success', trend: '+8%' },
    { title: 'Active Donors', value: '156', icon: <People />, color: 'secondary', trend: '+5%' },
  ];

  const recentRequests = [
    { id: 'BB001', bloodType: 'A+', units: 2, status: 'Processing', priority: 'Emergency' },
    { id: 'BB002', bloodType: 'O-', units: 1, status: 'Completed', priority: 'Normal' },
    { id: 'BB003', bloodType: 'B+', units: 3, status: 'Pending', priority: 'Urgent' },
  ];

  const bloodStockStatus = [
    { type: 'A+', available: 250, critical: 50 },
    { type: 'A-', available: 180, critical: 30 },
    { type: 'B+', available: 320, critical: 60 },
    { type: 'B-', available: 150, critical: 25 },
    { type: 'O+', available: 400, critical: 80 },
    { type: 'O-', available: 120, critical: 20 },
    { type: 'AB+', available: 80, critical: 15 },
    { type: 'AB-', available: 45, critical: 10 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency': return 'error';
      case 'Urgent': return 'warning';
      case 'Normal': return 'info';
      default: return 'default';
    }
  };

  // Skeleton loading component
  const DashboardSkeleton = () => (
    <BloodBankVendorLayout>
      <Box sx={{ 
        width: '100%', 
        px: { xs: 2, sm: 3 }
      }}>
        {/* Welcome Card Skeleton */}
        <Card sx={{ mb: 4, borderRadius: 3, maxWidth: '1200px', mx: 'auto' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="50%" height={24} />
              </Box>
              <Skeleton variant="rectangular" width={110} height={36} sx={{ borderRadius: 20 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          <Skeleton variant="text" width="200px" height={32} sx={{ mx: 'auto' }} />
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4
        }}>
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} sx={{ height: '100%', minHeight: { xs: 140, sm: 150, md: 160 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={64} height={64} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Activity Skeleton */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          <Skeleton variant="text" width="150px" height={32} sx={{ mx: 'auto' }} />
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', minHeight: { xs: 300, md: 400 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Skeleton variant="text" width="120px" height={24} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
                {[1, 2, 3].map((index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="70%" height={20} />
                        <Skeleton variant="text" width="50%" height={16} />
                      </Box>
                      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', minHeight: { xs: 300, md: 400 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Skeleton variant="text" width="140px" height={24} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
                {[1, 2, 3, 4].map((index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </BloodBankVendorLayout>
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <BloodBankVendorLayout>
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
                    profileData?.agencyName || vendorData?.email?.split('@')[0] || 'Blood Bank'
                  )}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {loading ? 'Loading...' : profileData?.email || vendorData?.email || 'bloodbank@example.com'}
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
          Blood Bank Overview
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
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                    {stat.trend}
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
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Requests
                  </Typography>
                  <IconButton size="small" onClick={refreshVendorStatus} title="Refresh Status">
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
                          <Bloodtype />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              Request {request.id}
                            </Typography>
                            <Chip 
                              label={request.priority} 
                              size="small" 
                              color={getPriorityColor(request.priority)}
                              variant="outlined"
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              {request.bloodType} • {request.units} units
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              Status: {request.status}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip 
                        label={request.status} 
                        size="small" 
                        color={getStatusColor(request.status)}
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
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Blood Stock Status
                  </Typography>
                  <IconButton size="small" onClick={refreshVendorStatus} title="Refresh Status">
                    <Refresh />
                  </IconButton>
                </Box>
                <List sx={{ p: 0 }}>
                  {bloodStockStatus.map((stock, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: stock.available <= stock.critical ? 'error.main' : 'success.main'
                        }}>
                          <Bloodtype />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              Blood Type {stock.type}
                            </Typography>
                            <Chip 
                              label={stock.available <= stock.critical ? 'Critical' : 'Available'} 
                              size="small" 
                              color={stock.available <= stock.critical ? 'error' : 'success'}
                              variant="outlined"
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              {stock.available} units available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              Critical level: {stock.critical} units
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Available Units">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              {stock.available}
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

        {/* Quick Actions */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<Bloodtype />} sx={{ borderRadius: 2 }}>
              Update Stock
            </Button>
            <Button variant="outlined" startIcon={<Schedule />} sx={{ borderRadius: 2 }}>
              View Requests
            </Button>
            <Button variant="outlined" startIcon={<People />} sx={{ borderRadius: 2 }}>
              Manage Donors
            </Button>
          </Box>
        </Box>
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
    </BloodBankVendorLayout>
  );
};

export default BloodBankVendorDashboard; 