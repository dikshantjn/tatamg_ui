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
  PhoneInTalk,
  CheckCircle,
  Cancel,
  AccessTime
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { VendorThemeProvider, useVendorTheme } from '../../../contexts/VendorThemeContext';
import { AllVendorsService } from '../../../services/Vendors/AllVendors.service';

// Layout content component that uses the vendor theme
const DoctorConsultationVendorLayoutContent = ({ children, title = "Doctor Consultation Service" }) => {
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
  const [isActive, setIsActive] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const authData = vendorAuthService.getVendorAuthData();
    if (!authData || authData.userType !== 'vendor') {
      console.log('Vendor not authenticated, redirecting to login');
      navigate('/');
      return;
    }

    setVendorData(authData.vendorData);
    
    // Fetch vendor status
    try {
      const statusData = await AllVendorsService.getVendorStatus(authData.vendorData.vendorId);
      setIsActive(statusData.isActive || false);
      console.log('Vendor status fetched:', statusData);
    } catch (error) {
      console.error('Error fetching vendor status:', error);
      // Keep default state if API fails
    }
    
    setLoading(false);
    console.log('Doctor consultation vendor authenticated:', authData.vendorData);
  };

  const handleLogout = async () => {
    try {
      const authData = vendorAuthService.getVendorAuthData();
      if (authData && authData.vendorData && authData.vendorData.vendorId) {
        await vendorAuthService.vendorLogout(authData.vendorData.vendorId);
        console.log('Doctor consultation vendor logged out successfully from server');
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

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!vendorData?.vendorId || statusLoading) return;
    
    setStatusLoading(true);
    const newStatus = !isActive;
    
    try {
      const response = await AllVendorsService.toggleVendorStatus(vendorData.vendorId, newStatus);
      setIsActive(newStatus);
      console.log('Vendor status updated:', response);
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      // Revert the state if API call fails
      setIsActive(!newStatus);
    } finally {
      setStatusLoading(false);
    }
  };

  // Navigation menu items
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/doctor-consultation/dashboard' },
    { text: 'Appointments', icon: <Schedule />, path: '/vendor/doctor-consultation/appointments' },
    { text: 'Time Slots', icon: <AccessTime />, path: '/vendor/doctor-consultation/timeslots' },
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
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: theme.palette.background.header,
          boxShadow: isDarkMode ? '0 1px 8px 0 rgba(0,0,0,0.3)' : '0 1px 8px 0 rgba(16,30,54,0.04)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: '72px',
          borderRadius: 0,
          left: 0,
          right: 0,
          color: theme.palette.text.primary,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Toolbar sx={{ 
          height: '100%', 
          px: { xs: 2, sm: 4 },
          minHeight: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1440,
          mx: 'auto'
        }}>
          {/* Left: Hamburger Menu (mobile) + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 1, 
                display: { md: 'none' },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideoCall sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.1rem', sm: '1.35rem' }
                }}
              >
                Doctor Consultation
              </Typography>
            </Box>
          </Box>

          {/* Center: Page Title */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.1rem', sm: '1.35rem' },
              display: { xs: 'none', md: 'block' }
            }}
          >
            {title}
          </Typography>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Active/Inactive Status Toggle */}
            <Tooltip title={`Currently ${isActive ? 'Active' : 'Inactive'}`}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleStatusToggle}
                startIcon={isActive ? <CheckCircle /> : <Cancel />}
                sx={{
                  borderColor: isActive ? 'success.main' : 'error.main',
                  color: isActive ? 'success.main' : 'error.main',
                  borderRadius: '20px',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    borderColor: isActive ? 'success.dark' : 'error.dark',
                    backgroundColor: isActive ? 'success.main' : 'error.main',
                    color: 'white',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Button>
            </Tooltip>

            {/* Dark/Light Mode Toggle */}
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <IconButton
                color="inherit"
                onClick={toggleDarkMode}
                sx={{
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                  }
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                  }
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Profile">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    backgroundColor: 'primary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  {vendorData?.email?.charAt(0)?.toUpperCase() || 'D'}
                </Avatar>
              </IconButton>
            </Tooltip>
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
            border: 'none',
            boxShadow: 'none',
            marginTop: '72px',
            height: 'calc(100vh - 72px)',
            top: 0,
            background: theme.palette.background.paper,
            position: 'fixed',
            left: 0,
            zIndex: 1200,
          }
        }}
      >
        <Box sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          paddingTop: '16px',
          background: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}>
          {/* Navigation Menu */}
          <Box sx={{ flexGrow: 1 }}>
            <List sx={{ p: 0 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem 
                    button 
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: isActive ? 
                        (isDarkMode ? 'rgba(139, 104, 255, 0.2)' : '#F3F0FF') : 
                        'transparent',
                      color: isActive ? 
                        theme.palette.primary.main : 
                        theme.palette.text.primary,
                      fontWeight: isActive ? 700 : 500,
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(139, 104, 255, 0.2)' : '#F3F0FF',
                        color: theme.palette.primary.main
                      },
                      px: 2,
                      py: 1.2
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive ? 
                        theme.palette.primary.main : 
                        theme.palette.text.secondary, 
                      minWidth: 36 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {isActive && (
                      <ChevronRight sx={{ fontSize: '1.2rem', color: theme.palette.primary.main }} />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Logout Button */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: 'error.main',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                  color: 'error.main'
                },
                px: 2,
                py: 1.2
              }}
            >
              <ListItemIcon sx={{ 
                color: 'error.main', 
                minWidth: 36 
              }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 3 },
          marginTop: '72px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 72px)',
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
        PaperProps={{
          sx: {
            width: 200,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        {/* Profile Header */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                backgroundColor: 'primary.main',
                mr: 1.5
              }}
            >
              {vendorData?.email?.charAt(0)?.toUpperCase() || 'D'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {vendorData?.email?.split('@')[0] || 'Doctor'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {vendorData?.email || 'doctor@example.com'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Doctor Consultation Vendor" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={() => { handleMenuClose(); handleNavigation('/vendor/doctor-consultation/profile'); }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem 
          onClick={() => { handleMenuClose(); handleNavigation('/vendor/doctor-consultation/settings'); }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Main layout wrapper with VendorThemeProvider
const DoctorConsultationVendorLayout = ({ children, title = "Doctor Consultation Service" }) => {
  return (
    <VendorThemeProvider>
      <DoctorConsultationVendorLayoutContent title={title}>
        {children}
      </DoctorConsultationVendorLayoutContent>
    </VendorThemeProvider>
  );
};

export default DoctorConsultationVendorLayout; 