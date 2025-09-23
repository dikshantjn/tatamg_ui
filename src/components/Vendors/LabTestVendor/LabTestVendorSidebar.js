import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  Science,
  Schedule,
  Assessment,
  People,
  Settings,
  Logout,
  TrendingUp
} from '@mui/icons-material';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';

const LabTestVendorSidebar = ({ 
  open, 
  onToggle, 
  vendorData, 
  sidebarActive, 
  setSidebarActive 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDarkMode } = useVendorTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation menu items
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/vendor/lab-test/dashboard',
      badge: null
    },
    { 
      text: 'Bookings', 
      icon: <Schedule />, 
      path: '/vendor/lab-test/bookings',
      badge: '5'
    },
    { 
      text: 'Insights', 
      icon: <TrendingUp />, 
      path: '/vendor/lab-test/insights',
      badge: null
    },
    { 
      text: 'Profile', 
      icon: <People />, 
      path: '/vendor/lab-test/profile',
      badge: null
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/vendor/lab-test/settings',
      badge: null
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // Call logout API if vendor data exists
      if (vendorData && vendorData.vendorId) {
        const { vendorAuthService } = await import('../../../services/Vendors/VendorAuth/vendor-auth.service');
        await vendorAuthService.vendorLogout(vendorData.vendorId);
      }
    } catch (error) {
      console.error('Error calling logout API:', error);
    } finally {
      // Clear local auth data
      const { vendorAuthService } = await import('../../../services/Vendors/VendorAuth/vendor-auth.service');
      vendorAuthService.clearVendorAuthData();
      window.location.href = '/';
    }
  };

  const drawerContent = (
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
                {item.badge && (
                  <Chip 
                    label={item.badge} 
                    size="small" 
                    color="error"
                    sx={{ 
                      minWidth: 20,
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
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
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onToggle}
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
      {drawerContent}
    </Drawer>
  );
};

export default LabTestVendorSidebar;
