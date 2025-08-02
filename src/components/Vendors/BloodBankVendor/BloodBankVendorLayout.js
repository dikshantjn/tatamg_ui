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
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  History,
  Person,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  LocalHospital,
  Bloodtype,
  Schedule,
  Assessment
} from '@mui/icons-material';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const BloodBankVendorLayoutContent = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useVendorTheme();
  
  // State management
  const [vendorData, setVendorData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigationLoading, setNavigationLoading] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Close drawer on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [location.pathname, isMobile]);

  const checkAuthentication = () => {
    const authData = vendorAuthService.getVendorAuthData();
    if (!authData || authData.userType !== 'vendor') {
      console.log('Vendor not authenticated, redirecting to login');
      navigate('/');
      return;
    }

    setVendorData(authData.vendorData);
    setLoading(false);
    console.log('Blood bank vendor authenticated:', authData.vendorData);
  };

  // Show loading only for initial authentication check
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: theme.palette.background.default
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
            Loading Blood Bank Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Shared loading component for child components
  const SharedLoadingComponent = ({ message = "Loading..." }) => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      backgroundColor: theme.palette.background.default
    }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );

  const handleLogout = async () => {
    try {
      const authData = vendorAuthService.getVendorAuthData();
      if (authData && authData.vendorData && authData.vendorData.vendorId) {
        await vendorAuthService.vendorLogout(authData.vendorData.vendorId);
        console.log('Blood bank vendor logged out successfully from server');
      }
    } catch (error) {
      console.error('Error calling logout API:', error);
    } finally {
      vendorAuthService.clearVendorAuthData();
      setAnchorEl(null);
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

  // Navigation menu items
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/blood-bank/dashboard' },
    { text: 'Blood Availability', icon: <Bloodtype />, path: '/vendor/blood-bank/availability' },
    { text: 'Booking Requests', icon: <Schedule />, path: '/vendor/blood-bank/requests' },
    { text: 'Booking History', icon: <History />, path: '/vendor/blood-bank/history' },
    { text: 'Analytics', icon: <Assessment />, path: '/vendor/blood-bank/analytics' },
    { text: 'Profile', icon: <Person />, path: '/vendor/blood-bank/profile' },
    { text: 'Settings', icon: <Settings />, path: '/vendor/blood-bank/settings' },
  ];

  const handleNavigation = (path) => {
    setNavigationLoading(true);
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
    // Reset navigation loading after a short delay
    setTimeout(() => {
      setNavigationLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading blood bank dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1, 
          backgroundColor: theme.palette.background.header, 
          color: theme.palette.text.primary,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LocalHospital sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="div">
              Blood Bank Management
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
              sx={{ textTransform: 'none' }}
            >
              {vendorData?.email?.split('@')[0] || 'Blood Bank'}
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
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
            backgroundColor: theme.palette.background.sidebar,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem 
                  button 
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: isActive ? (isDarkMode ? 'rgba(139, 104, 255, 0.2)' : 'rgba(108, 71, 255, 0.1)') : 'transparent',
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.15)' : 'rgba(108, 71, 255, 0.08)',
                      color: theme.palette.primary.main
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? theme.palette.primary.main : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontWeight: isActive ? 600 : 400 
                      } 
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          marginTop: '64px', 
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {children}
        
        {/* Navigation Loading Overlay */}
        {navigationLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                Loading...
              </Typography>
            </Box>
          </Box>
        )}
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
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/vendor/blood-bank/profile'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/vendor/blood-bank/settings'); }}>
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

const BloodBankVendorLayout = ({ children }) => {
  return (
    <VendorThemeProvider>
      <BloodBankVendorLayoutContent>
        {children}
      </BloodBankVendorLayoutContent>
    </VendorThemeProvider>
  );
};

export default BloodBankVendorLayout; 