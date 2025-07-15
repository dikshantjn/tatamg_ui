import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Person,
  Store,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  NotificationsActive
} from '@mui/icons-material';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { useNavigate, useLocation } from 'react-router-dom';

const MedicalStoreVendorHeader = ({ 
  title = "Dashboard", 
  onMenuClick,
  vendorData,
  onLogout,
  onProfileClick,
  notificationCount = 0,
  sidebarActive = true,
  setSidebarActive = () => {},
  onStatusUpdate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useVendorTheme();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    if (vendorData && vendorData.vendorId) {
      try {
        await vendorAuthService.vendorLogout(vendorData.vendorId);
      } catch (e) {
        // ignore error, still clear local data
      }
    }
    vendorAuthService.clearVendorAuthData();
    if (onLogout) onLogout();
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/vendor/pharmacy/profile');
    if (onProfileClick) onProfileClick();
  };

  // Get current page title based on location
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/inventory')) return 'Inventory';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/returns')) return 'Returns';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/analysis')) return 'Analysis';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  // Sample notifications data
  const notifications = [
    { id: 1, message: 'New order #1234 received', time: '2 min ago', read: false },
    { id: 2, message: 'Inventory low: Paracetamol 500mg', time: '15 min ago', read: false },
    { id: 3, message: 'Payment received for order #1230', time: '1 hour ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: 1200, 
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
            onClick={onMenuClick}
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
            <Store sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.1rem', sm: '1.35rem' }
              }}
            >
              Medical Store Dashboard
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
          {getCurrentPageTitle()}
        </Typography>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              onClick={handleNotificationMenuOpen}
              sx={{
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                }
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Profile">
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
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
                {vendorData?.email?.charAt(0)?.toUpperCase() || 'M'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
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
            width: 320,
            maxHeight: 400,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                <NotificationsActive 
                  sx={{ 
                    mr: 1.5, 
                    mt: 0.5,
                    color: notification.read ? 'text.secondary' : 'primary.main',
                    fontSize: '1.2rem'
                  }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: notification.read ? 400 : 600,
                      color: notification.read ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {notification.time}
                  </Typography>
                </Box>
                {!notification.read && (
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: 'primary.main',
                      ml: 1
                    }} 
                  />
                )}
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
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
              {vendorData?.email?.charAt(0)?.toUpperCase() || 'M'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {vendorData?.email?.split('@')[0] || 'Medical Store'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {vendorData?.email || 'vendor@example.com'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Medical Store Vendor" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={handleProfileClick}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem 
          onClick={handleProfileMenuClose}
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
    </AppBar>
  );
};

export default MedicalStoreVendorHeader; 