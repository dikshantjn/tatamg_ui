import React, { useState, useEffect } from 'react';
// Vendor Dashboard Component - Updated
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  IconButton,
  Paper,
  Stack,
  Select,
  FormControl,
  InputLabel,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Logout,
  AccountCircle,
  TrendingUp,
  Store,
  Add,
  BarChart,
  Person,
  Warning,
  CheckCircle,
  Schedule,
  Cancel,
  LocalShipping,
  Visibility,
  TrendingDown,
  AttachMoney,
  ArrowUpward,
  ArrowDownward,
  NotificationsNone,
  ShoppingBag,
  Analytics,
  Inventory2,
  Assignment,
  Inventory,
  ShoppingCart
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import ProductVendorLayout from './ProductVendorLayout';
import { getProductPartnerProfile, getVendorStatus } from '../../../services/Vendors/AllVendors.service';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';


                                                
// Enhanced Welcome Card Component
const WelcomeCard = ({ profileData, loading, vendorStatus }) => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Card sx={{ 
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      mb: 3,
      borderRadius: 3,
      boxShadow: 'none',
      border: `1px solid ${theme.palette.divider}`,
      position: 'relative',
      overflow: 'hidden',
      px: { xs: 2, sm: 3 },
      py: { xs: 2, sm: 3 }
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        {/* Avatar */}
        <Avatar sx={{ 
          width: { xs: 48, sm: 56 }, 
          height: { xs: 48, sm: 56 },
          backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.2)' : '#F0F1F3',
          color: theme.palette.primary.main,
          fontWeight: 700,
          fontSize: 28
        }}>
          {loading ? (
            <Store sx={{ fontSize: { xs: 24, sm: 30 } }} />
          ) : (
            profileData?.brandName?.[0] || <Store sx={{ fontSize: { xs: 24, sm: 30 } }} />
          )}
        </Avatar>
        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Welcome back, {loading ? 'Loading...' : (profileData?.brandName || 'Vendor')}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 2, color: theme.palette.text.secondary }}>
            {loading ? 'Loading...' : (profileData?.companyLegalName || 'Company')} • <Box component="span" sx={{ fontWeight: 600, color: vendorStatus ? '#10B981' : '#EF4444', display: 'inline' }}>{vendorStatus ? 'Active' : 'Inactive'}</Box> Status
          </Typography>
          {profileData?.email && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
              {profileData.email}
            </Typography>
          )}
          {/* Quick Notice */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F7F8FA',
            borderRadius: 2,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            mt: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsNone sx={{ fontSize: 20, color: theme.palette.primary.main }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                You have <strong>8 pending orders</strong> to process
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                borderColor: '#6C47FF',
                color: '#6C47FF',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                '&:hover': { 
                  backgroundColor: '#F3F0FF',
                  borderColor: '#6C47FF',
                  color: '#6C47FF'
                }
              }}
            >
              View Orders
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

// Enhanced Statistic Cards Component
const StatisticCards = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const stats = [
    { 
      title: 'Total Products', 
      value: '156', 
      change: '+12%',
      changeType: 'increase',
      icon: <Inventory2 />, 
      color: '#6C47FF', 
      bgColor: '#F3F0FF' 
    },
    { 
      title: "Today's Revenue", 
      value: '$1,250.75', 
      change: '+8.2%',
      changeType: 'increase',
      icon: <AttachMoney />, 
      color: '#10B981', 
      bgColor: '#E6FAF5' 
    },
    { 
      title: 'Pending Orders', 
      value: '8', 
      change: '-2',
      changeType: 'decrease',
      icon: <Schedule />, 
      color: '#F59E0B', 
      bgColor: '#FFF7E6' 
    },
    { 
      title: 'Low Stock Items', 
      value: '12', 
      change: '+3',
      changeType: 'increase',
      icon: <Warning />, 
      color: '#EF4444', 
      bgColor: '#FEECEC' 
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} lg={2.5} key={index}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 3,
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            transition: 'all 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-2px)',
              boxShadow: '0 2px 8px rgba(108,71,255,0.06)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: stat.bgColor,
                  color: stat.color,
                }}>
                  {stat.icon}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpward sx={{ fontSize: 16, color: '#10B981' }} />
                  ) : (
                    <ArrowDownward sx={{ fontSize: 16, color: '#EF4444' }} />
                  )}
                  <Typography variant="caption" sx={{ 
                    color: stat.changeType === 'increase' ? '#10B981' : '#EF4444',
                    fontWeight: 600
                  }}>
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Enhanced Quick Actions Component
const QuickActions = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const actions = [
    { title: 'Add Product', icon: <Add />, color: '#6C47FF', bgColor: '#F3F0FF' },
    { title: 'Manage Inventory', icon: <Inventory />, color: '#10B981', bgColor: '#E6FAF5' },
    { title: 'View Orders', icon: <ShoppingCart />, color: '#F59E0B', bgColor: '#FFF7E6' },
    { title: 'Generate Reports', icon: <Analytics />, color: '#8B5CF6', bgColor: '#F3F0FF' },
  ];

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {actions.map((action, index) => (
            <Grid item xs={6} sm={3} md={2.5} key={index}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: action.color,
                  color: action.color,
                  backgroundColor: action.bgColor,
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 56,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: action.color,
                    color: 'white',
                    borderColor: action.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${action.color}40`
                  }
                }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Enhanced Performance Chart Component
const PerformanceChart = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const [period, setPeriod] = useState('weekly');
  
  const weeklyData = [
    { day: 'Mon', revenue: 1200, orders: 15 },
    { day: 'Tue', revenue: 1890, orders: 22 },
    { day: 'Wed', revenue: 1560, orders: 18 },
    { day: 'Thu', revenue: 2100, orders: 28 },
    { day: 'Fri', revenue: 1750, orders: 20 },
    { day: 'Sat', revenue: 2400, orders: 35 },
    { day: 'Sun', revenue: 1980, orders: 25 },
  ];

  return (
    <Grid item xs={12}>
      <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Sales Performance
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C47FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6C47FF" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6C47FF"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  dot={{ fill: '#6C47FF', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#6C47FF', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

// Enhanced Recent Orders Component
const RecentOrders = () => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const orders = [
    { id: '#12344', customer: 'John Doe', status: 'Shipped', time: '2 hours ago', amount: '$89.50', statusColor: 'success' },
    { id: '#12345', customer: 'Sarah Wilson', status: 'Pending', time: '4 hours ago', amount: '$156.75', statusColor: 'warning' },
    { id: '#12346', customer: 'Mike Johnson', status: 'Cancelled', time: '6 hours ago', amount: '$67.20', statusColor: 'error' },
    { id: '#12347', customer: 'Emily Davis', status: 'Confirmed', time: '8 hours ago', amount: '$234.90', statusColor: 'info' },
    { id: '#12348', customer: 'David Brown', status: 'Shipped', time: '1 day ago', amount: '$45.30', statusColor: 'success' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped': return <LocalShipping />;
      case 'Confirmed': return <CheckCircle />;
      case 'Pending': return <Schedule />;
      case 'Cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  return (
    <Grid item xs={12}>
      <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Recent Orders
            </Typography>
            <Button 
              size="small" 
              variant="outlined"
              sx={{ 
                color: '#6C47FF', 
                fontWeight: 600,
                borderColor: '#6C47FF',
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                '&:hover': {
                  backgroundColor: '#F3F0FF',
                  color: '#6C47FF',
                  borderColor: '#6C47FF'
                }
              }}
            >
              View All
            </Button>
          </Box>
          
          {/* Grid Layout for Orders */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
            maxWidth: '100%',
          }}>
            {orders.map((order, index) => (
              <Box key={index} sx={{ 
                p: 2, 
                borderRadius: 2, 
                border: `1px solid ${theme.palette.divider}`,
                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F7F8FA',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minHeight: 120,
                height: '100%',
                justifyContent: 'space-between',
                '&:hover': { 
                  boxShadow: '0 2px 8px rgba(108,71,255,0.06)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: order.statusColor === 'success' ? '#10B981' : 
                                     order.statusColor === 'warning' ? '#F59E0B' :
                                     order.statusColor === 'error' ? '#EF4444' : '#6C47FF' }}>
                      {getStatusIcon(order.status)}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      {order.id}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {order.amount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {order.customer}
                  </Typography>
                  <Chip 
                    label={order.status} 
                    size="small" 
                    color={order.statusColor}
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {order.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

// Main Dashboard Component
const ProductVendorDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [vendorStatus, setVendorStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authData = vendorAuthService.getVendorAuthData();
      const vendorId = authData?.vendorData?.vendorId;
      if (vendorId) {
        // Fetch both profile and status data
        const [profileResponse, statusResponse] = await Promise.all([
          getProductPartnerProfile(vendorId),
          getVendorStatus(vendorId)
        ]);
        
        setProfileData(profileResponse);
        setVendorStatus(statusResponse.isActive);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Callback to update status when changed in header
  const handleStatusUpdate = (newStatus) => {
    setVendorStatus(newStatus);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VendorThemeProvider>
      <ProductVendorLayout title="Dashboard" notificationCount={3} onStatusUpdate={handleStatusUpdate}>
        <Box sx={{ width: '100%', p: { xs: 1, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Enhanced Welcome Card */}
          <WelcomeCard profileData={profileData} loading={loading} vendorStatus={vendorStatus} />

          {/* Enhanced Statistic Cards */}
          <StatisticCards />

          {/* Enhanced Quick Actions */}
          <QuickActions />

          {/* Performance Chart */}
          <PerformanceChart />

          {/* Recent Orders */}
          <Box sx={{ mt: 4 }}>
            <RecentOrders />
          </Box>
        </Box>
      </ProductVendorLayout>
    </VendorThemeProvider>
  );
};

export default ProductVendorDashboard; 