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
  Switch,
  Button,
  useTheme,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart,
  Inventory,
  TrendingUp,
  LocalShipping,
  Visibility,
  CheckCircle,
  Cancel,
  Payment,
  Assignment,
  Store,
  Download,
  Refresh,
  OnlinePrediction,
  Notifications,
  Timeline,
  PieChart,
  BarChart,
  Circle
} from '@mui/icons-material';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { VendorThemeProvider } from '../../../contexts/VendorThemeContext';
import MedicalStoreVendorLayout from './MedicalStoreVendorLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMedicalStoreVendorProfile } from '../../../services/Vendors/MedicalStoreVendor.service';
import { getVendorStatus, toggleVendorStatus } from '../../../services/Vendors/AllVendors.service';

const MedicalStoreVendorDashboardContent = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorStatus, setVendorStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  // TODO: Replace with actual vendorId from auth context or props
  const vendorId = 'c29e0298-b239-48df-9f11-4e21c8727f93';

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getMedicalStoreVendorProfile(vendorId);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [vendorId]);

  useEffect(() => {
    const fetchVendorStatus = async () => {
      setStatusLoading(true);
      try {
        const statusData = await getVendorStatus(vendorId);
        setVendorStatus(statusData);
      } catch (error) {
        console.error('Error fetching vendor status:', error);
        setVendorStatus(null);
      } finally {
        setStatusLoading(false);
      }
    };
    fetchVendorStatus();
  }, [vendorId]);

  // Get vendor data from profile
  const medicalStoreName = profile?.name || 'Loading...';
  const vendorEmail = profile?.emailId || 'Loading...';

  // Top KPIs Data (removed Service Status)
  const kpiData = [
    { 
      title: 'New Order Requests', 
      value: '23', 
      icon: <ShoppingCart />, 
      color: 'primary',
      subtitle: 'Pending prescriptions'
    },
    { 
      title: 'Orders Accepted Today', 
      value: '18', 
      icon: <CheckCircle />, 
      color: 'success',
      subtitle: 'Orders processed'
    },
    { 
      title: 'Revenue Today', 
      value: '₹12,450', 
      icon: <Payment />, 
      color: 'info',
      subtitle: 'Total earned today'
    },
    { 
      title: 'Return Requests Today', 
      value: '3', 
      icon: <Cancel />, 
      color: 'warning',
      subtitle: 'Refund requests'
    },
    { 
      title: 'Avg. Response Time', 
      value: '8 min', 
      icon: <Timeline />, 
      color: 'secondary',
      subtitle: 'Response speed'
    },
  ];

  // Activity Feed Data
  const activityFeed = [
    { 
      id: 1, 
      type: 'new_order', 
      message: 'New prescription request received', 
      time: '2 min ago',
      orderId: '#ORD-2024-001',
      status: 'pending'
    },
    { 
      id: 2, 
      type: 'order_accepted', 
      message: 'Order accepted and processing', 
      time: '15 min ago',
      orderId: '#ORD-2024-002',
      status: 'accepted'
    },
    { 
      id: 3, 
      type: 'payment_success', 
      message: 'Payment received successfully', 
      time: '1 hour ago',
      orderId: '#ORD-2024-003',
      status: 'paid'
    },
    { 
      id: 4, 
      type: 'delivery_update', 
      message: 'Order out for delivery', 
      time: '2 hours ago',
      orderId: '#ORD-2024-004',
      status: 'shipped'
    },
    { 
      id: 5, 
      type: 'return_initiated', 
      message: 'Return request initiated', 
      time: '3 hours ago',
      orderId: '#ORD-2024-005',
      status: 'return'
    }
  ];

  // Today's Snapshot Data
  const todaySnapshot = {
    totalRequests: 45,
    ordersAccepted: 32,
    ordersRejected: 8,
    ordersReturned: 5,
    avgOrderValue: 2750,
    mostRequested: [
      { name: 'Paracetamol 500mg', count: 15 },
      { name: 'Vitamin C Tablets', count: 12 },
      { name: 'First Aid Kit', count: 8 },
      { name: 'Cough Syrup', count: 6 },
      { name: 'Antibiotics', count: 4 }
    ]
  };

  // Order Trends Data for Chart
  const orderTrendsData = [
    { day: 'Mon', orders: 45 },
    { day: 'Tue', orders: 52 },
    { day: 'Wed', orders: 38 },
    { day: 'Thu', orders: 67 },
    { day: 'Fri', orders: 58 },
    { day: 'Sat', orders: 72 },
    { day: 'Sun', orders: 65 }
  ];

  // Revenue Distribution Data for Chart
  const revenueDistributionData = [
    { name: 'Prescriptions', value: 40, color: theme.palette.primary.main },
    { name: 'OTC', value: 35, color: theme.palette.secondary.main },
    { name: 'Supplies', value: 25, color: theme.palette.success.main }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'new_order': return <ShoppingCart color="primary" />;
      case 'order_accepted': return <CheckCircle color="success" />;
      case 'payment_success': return <Payment color="info" />;
      case 'delivery_update': return <LocalShipping color="warning" />;
      case 'return_initiated': return <Cancel color="error" />;
      default: return <Notifications color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'paid': return 'info';
      case 'shipped': return 'primary';
      case 'return': return 'error';
      default: return 'default';
    }
  };

  const handleToggleActive = async () => {
    try {
      const response = await toggleVendorStatus(vendorId);
      setVendorStatus(response);
      toast.success(`Store is now ${response.isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      toast.error('Failed to update store status. Please try again.');
    }
  };

  return (
    <MedicalStoreVendorLayout>
      {/* Dashboard Content */}
      <Box sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 } }}>
        {/* Welcome Card */}
        <Card 
        sx={{
            mb: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[8]
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
                    medicalStoreName
                  )}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {loading ? 'Loading...' : vendorEmail}
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

        {/* A. Top KPIs */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
          Top KPIs
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {kpiData.map((kpi, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Card 
                sx={{
                  height: '100%',
                  minHeight: { xs: 120, sm: 130, md: 140 },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mb: { xs: 1, sm: 1.5, md: 2 },
                    flex: 1
                  }}>
                    <Box sx={{ 
                      p: { xs: 1, sm: 1.2, md: 1.5 }, 
                      borderRadius: 2, 
                      backgroundColor: `${kpi.color}.light`,
                      color: `${kpi.color}.contrastText`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: 36, sm: 40, md: 48 },
                      minHeight: { xs: 36, sm: 40, md: 48 }
                    }}>
                      {kpi.icon}
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '1.8rem' } }}>
                      {kpi.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
                      {kpi.title}
                    </Typography>
                    {kpi.subtitle && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                        {kpi.subtitle}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* C. Quick Actions (Moved Above Activity Feed) */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: 120,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Inventory sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  View Inventory
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your product catalog
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: 120,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Store sx={{ fontSize: 40, mb: 2, color: 'secondary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Update Store Info
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modify store details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: 120,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Download sx={{ fontSize: 40, mb: 2, color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Export Orders CSV
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download order data
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* B. Order Alerts / Activity Feed */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
          Order Alerts / Activity Feed
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4, width: '100%', mx: 0 }}>
          <Grid item xs={12} sx={{ width: '100%', px: { xs: 0 } }}>
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
                    Real-time Activity Timeline
                </Typography>
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Box>
                <List sx={{ p: 0 }}>
                  {activityFeed.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={`${activity.orderId} • ${activity.time}`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' }
                          },
                          '& .MuiListItemText-secondary': {
                            fontSize: { xs: '0.75rem', md: '0.875rem' }
                          }
                        }}
                      />
                      <Chip 
                        label={activity.status} 
                        size="small" 
                        color={getStatusColor(activity.status)}
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* D. Today's Snapshot */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
          Today's Snapshot
        </Typography>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {/* Summary Cards */}
          <Grid item xs={12} lg={6}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: 300,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.contrastText', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        {todaySnapshot.totalRequests}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'primary.contrastText', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        Total Requests
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.contrastText', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        {todaySnapshot.ordersAccepted}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'success.contrastText', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        Orders Accepted
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'error.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.contrastText', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        {todaySnapshot.ordersRejected}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'error.contrastText', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        Orders Rejected
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.contrastText', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        {todaySnapshot.ordersReturned}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'warning.contrastText', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        Orders Returned
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center', color: 'info.contrastText', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Avg. Order Value: ₹{todaySnapshot.avgOrderValue}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Most Requested Medicines */}
          <Grid item xs={12} lg={6}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: 300,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Most Requested Medicines
                </Typography>
                <List sx={{ p: 0 }}>
                  {todaySnapshot.mostRequested.map((medicine, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Inventory color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={medicine.name}
                        secondary={`${medicine.count} requests today`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' }
                          },
                          '& .MuiListItemText-secondary': {
                            fontSize: { xs: '0.75rem', md: '0.875rem' }
                          }
                        }}
                      />
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
            Analytics & Charts
          </Typography>
          <Grid container spacing={3} sx={{ width: '100%', mx: 0 }}>
            <Grid item xs={12} md={6} sx={{ width: '100%', px: { xs: 0 } }}>
              <Card 
                sx={{ 
                  height: { xs: 300, md: 400 },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BarChart sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Order Trends (Last 7 Days)
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    height: 300, 
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    borderRadius: 2,
                    p: 2
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={orderTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <YAxis 
                          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <RechartsTooltip
                          contentStyle={{ 
                            background: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 8, 
                            color: theme.palette.text.primary 
                          }}
                          labelStyle={{ color: theme.palette.text.secondary }}
                          formatter={(value) => [`${value} orders`, 'Orders']}
                        />
                        <Bar 
                          dataKey="orders" 
                          fill="url(#colorOrders)" 
                          radius={[4, 4, 0, 0]}
                          stroke={theme.palette.primary.main}
                          strokeWidth={1}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ width: '100%', px: { xs: 0 } }}>
              <Card 
                sx={{ 
                  height: { xs: 300, md: 400 },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PieChart sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Revenue Distribution
                    </Typography>
      </Box>
                  <Box sx={{ 
                    height: 300, 
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    borderRadius: 2,
                    p: 2,
                    position: 'relative'
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={revenueDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {revenueDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ 
                            background: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 8, 
                            color: theme.palette.text.primary 
                          }}
                          labelStyle={{ color: theme.palette.text.secondary }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    
                    {/* Center Total */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none'
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        ₹45K
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Total Revenue
                      </Typography>
                    </Box>

                    {/* Legend */}
                    <Box sx={{ 
                      position: 'absolute', 
                      right: 20, 
                      top: 20,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 2,
                      p: 2,
                      boxShadow: theme.shadows[2]
                    }}>
                      {revenueDistributionData.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: index < revenueDistributionData.length - 1 ? 1 : 0 }}>
                          <Box sx={{ 
                            width: 12, 
                            height: 12, 
                            backgroundColor: item.color, 
                            borderRadius: 1, 
                            mr: 1 
                          }} />
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {item.name} ({item.value}%)
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />
    </MedicalStoreVendorLayout>
  );
};

const MedicalStoreVendorDashboard = () => {
  return (
    <VendorThemeProvider>
      <MedicalStoreVendorDashboardContent />
    </VendorThemeProvider>
  );
};

export default MedicalStoreVendorDashboard; 