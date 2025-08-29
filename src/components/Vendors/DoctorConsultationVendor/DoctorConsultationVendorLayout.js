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
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  VideoCall,
  Schedule,
  History,
  People,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ChevronRight,
  Message,
  PhoneInTalk
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';

const DoctorConsultationVendorLayout = ({ children, title = "Doctor Consultation Service" }) => {
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
  const [notifications, setNotifications] = useState([]);

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
    console.log('Doctor consultation vendor authenticated:', authData.vendorData);
  };

  const handleLogout = async () => {
    try {
      // Get vendor data for logout API call
      const authData = vendorAuthService.getVendorAuthData();
      if (authData && authData.vendorData && authData.vendorData.vendorId) {
        // Call logout API to remove session from database
        await vendorAuthService.vendorLogout(authData.vendorData.vendorId);
        console.log('Doctor consultation vendor logged out successfully from server');
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

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Navigation menu items
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/doctor-consultation/dashboard' },
    { text: 'Appointments', icon: <Schedule />, path: '/vendor/doctor-consultation/appointments' },
    { text: 'History', icon: <History />, path: '/vendor/doctor-consultation/history' },
    { text: 'Profile', icon: <People />, path: '/vendor/doctor-consultation/profile' },
    { text: 'Settings', icon: <Settings />, path: '/vendor/doctor-consultation/settings' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading doctor consultation dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.header,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1]
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
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Dark/Light Mode Toggle */}
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                sx={{ 
                  backgroundColor: theme.palette.action.hover,
                  '&:hover': {
                    backgroundColor: theme.palette.action.selected
                  }
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Profile Menu */}
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {vendorData?.email?.split('@')[0] || 'Doctor'}
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
            borderRight: `1px solid ${theme.palette.divider}`,
            overflowX: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Navigation Menu */}
          <List sx={{ p: 0 }}>
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
                    backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                    color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: isActive 
                        ? theme.palette.primary.dark 
                        : theme.palette.action.hover
                    },
                    transition: 'all 0.2s ease-in-out',
                    px: 2,
                    py: 1.5
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'inherit',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                  {isActive && (
                    <ChevronRight sx={{ fontSize: '1.2rem' }} />
                  )}
                </ListItem>
              );
            })}
          </List>

          {/* Logout Section */}
          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.error.contrastText
                },
                transition: 'all 0.2s ease-in-out',
                px: 2,
                py: 1.5
              }}
            >
              <ListItemIcon sx={{ 
                color: 'inherit',
                minWidth: 40
              }}>
                <Logout />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }
                }}
              />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          marginTop: '64px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
          overflowX: 'hidden'
        }}
      >
        {children}
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
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); handleNavigation('/vendor/doctor-consultation/profile'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleNavigation('/vendor/doctor-consultation/settings'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DoctorConsultationVendorLayout; 