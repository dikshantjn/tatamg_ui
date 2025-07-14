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
  DirectionsCar,
  People,
  Assessment,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  TrendingUp,
  Emergency,
  Payment,
  Store,
  Visibility,
  Schedule,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import { useNavigate } from 'react-router-dom';

const AmbulanceVendorDashboardContent = () => {
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
    console.log('Ambulance vendor authenticated:', authData.vendorData);
  };

  const handleLogout = async () => {
    try {
      // Get vendor data for logout API call
      const authData = vendorAuthService.getVendorAuthData();
      if (authData && authData.vendorData && authData.vendorData.vendorId) {
        // Call logout API to remove session from database
        await vendorAuthService.vendorLogout(authData.vendorData.vendorId);
        console.log('Ambulance vendor logged out successfully from server');
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
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/ambulance/dashboard' },
    { text: 'Fleet', icon: <DirectionsCar />, path: '/vendor/ambulance/fleet' },
    { text: 'Bookings', icon: <Schedule />, path: '/vendor/ambulance/bookings' },
    { text: 'Drivers', icon: <People />, path: '/vendor/ambulance/drivers' },
    { text: 'Analytics', icon: <Assessment />, path: '/vendor/ambulance/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/vendor/ambulance/settings' },
  ];

  // Sample dashboard data
  const dashboardStats = [
    { title: 'Total Ambulances', value: '12', icon: <DirectionsCar />, color: 'primary' },
    { title: 'Active Bookings', value: '8', icon: <Schedule />, color: 'secondary' },
    { title: 'Revenue (₹)', value: '23,450', icon: <TrendingUp />, color: 'success' },
    { title: 'Emergency Calls', value: '3', icon: <Emergency />, color: 'error' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading ambulance dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: theme.palette.background.header, color: theme.palette.text.primary }}>
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
            Ambulance Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            
            {/* Dark Mode Toggle */}
            <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
              endIcon={<AccountCircle />}
            >
              {vendorData?.email?.split('@')[0] || 'Ambulance'}
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
            height: 'calc(100vh - 64px)',
            backgroundColor: theme.palette.background.sidebar,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
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
                {vendorData?.generatedId || 'Ambulance'}
              </Typography>
              <Chip 
                label="Ambulance Agency" 
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
                    backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.2)' : 'rgba(108, 71, 255, 0.08)',
                    color: theme.palette.primary.main
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', backgroundColor: theme.palette.background.default }}>
        <Typography variant="h4" gutterBottom color={theme.palette.text.primary}>
          Welcome back, {vendorData?.email?.split('@')[0] || 'Ambulance'}!
        </Typography>
        
        <Typography variant="body1" color={theme.palette.text.secondary} sx={{ mb: 4 }}>
          Here's what's happening with your ambulance service today.
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
                  Recent Bookings
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem key={item} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Schedule color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Booking #${1000 + item}`}
                        secondary={`Emergency • 15 mins ago`}
                      />
                      <Chip label="In Progress" size="small" color="warning" />
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
                  Available Ambulances
                </Typography>
                <List>
                  {['Ambulance A1', 'Ambulance A2', 'Ambulance A3'].map((ambulance, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <DirectionsCar color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={ambulance}
                        secondary={`Driver: John Doe • Available`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Visibility fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {5 + index * 2}
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

const AmbulanceVendorDashboard = () => {
  return (
    <VendorThemeProvider>
      <AmbulanceVendorDashboardContent />
    </VendorThemeProvider>
  );
};

export default AmbulanceVendorDashboard; 