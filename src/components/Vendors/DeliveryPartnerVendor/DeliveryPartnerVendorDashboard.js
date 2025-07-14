import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  LocalShipping,
  DirectionsBike,
  People,
  Assessment,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  TrendingUp,
  Schedule,
  Payment,
  Store,
  Visibility,
  LocationOn,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import { useNavigate } from 'react-router-dom';

const DeliveryPartnerVendorDashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useVendorTheme();
  
  // State management
  const [vendorData, setVendorData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authData = vendorAuthService.getVendorAuthData();
    if (!authData || authData.userType !== 'vendor') {
      console.log('Vendor not authenticated, redirecting to login');
      navigate('/');
      return;
    }

    setVendorData(authData.vendorData);
    setLoading(false);
    console.log('Delivery partner vendor authenticated:', authData.vendorData);
  };

  const handleLogout = async () => {
    try {
      // Get vendor data for logout API call
      const authData = vendorAuthService.getVendorAuthData();
      if (authData && authData.vendorData && authData.vendorData.vendorId) {
        // Call logout API to remove session from database
        await vendorAuthService.vendorLogout(authData.vendorData.vendorId);
        console.log('Delivery partner vendor logged out successfully from server');
      }
    } catch (error) {
      console.error('Error calling logout API:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local auth data
      vendorAuthService.clearVendorAuthData();
      setAnchorEl(null);
      // Navigate to home page after logout
      window.location.href = '/';
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Dashboard menu items
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/delivery/dashboard' },
    { text: 'Riders', icon: <DirectionsBike />, path: '/vendor/delivery/riders' },
    { text: 'Orders', icon: <Schedule />, path: '/vendor/delivery/orders' },
    { text: 'Customers', icon: <People />, path: '/vendor/delivery/customers' },
    { text: 'Analytics', icon: <Assessment />, path: '/vendor/delivery/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/vendor/delivery/settings' },
  ];

  // Sample dashboard data
  const dashboardStats = [
    { title: 'Total Riders', value: '25', icon: <DirectionsBike />, color: 'primary' },
    { title: 'Active Orders', value: '18', icon: <Schedule />, color: 'secondary' },
    { title: 'Revenue (₹)', value: '15,230', icon: <TrendingUp />, color: 'success' },
    { title: 'Deliveries Today', value: '45', icon: <LocalShipping />, color: 'info' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading delivery partner dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Delivery Partner Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
              endIcon={<AccountCircle />}
            >
              {vendorData?.email?.split('@')[0] || 'Delivery Partner'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px',
            height: 'calc(100vh - 64px)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <LocalShipping />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {vendorData?.generatedId || 'Delivery Partner'}
              </Typography>
              <Chip 
                label="Delivery Partner" 
                color="primary" 
                size="small" 
                variant="outlined"
              />
            </CardContent>
          </Card>

          <List>
            {menuItems.map((item, index) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => {
                  // Handle navigation here
                  console.log('Navigate to:', item.path);
                }}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {vendorData?.email?.split('@')[0] || 'Delivery Partner'}!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Here's what's happening with your delivery service today.
        </Typography>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      backgroundColor: `${stat.color}.light`,
                      color: `${stat.color}.contrastText`,
                      mr: 2
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Schedule color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Order #${1000 + item}`}
                        secondary={`Medicine • 2.5 km away`}
                      />
                      <Chip label="In Transit" size="small" color="warning" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Riders
                </Typography>
                <List>
                  {['Rider John', 'Rider Sarah', 'Rider Mike'].map((rider, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <DirectionsBike color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={rider}
                        secondary={`${5 + index * 2} deliveries today`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {4.5 + index * 0.5}★
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

const DeliveryPartnerVendorDashboard = () => {
  return (
    <VendorThemeProvider>
      <DeliveryPartnerVendorDashboardContent />
    </VendorThemeProvider>
  );
};

export default DeliveryPartnerVendorDashboard; 