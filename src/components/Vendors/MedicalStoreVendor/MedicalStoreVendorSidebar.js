import React, { useEffect } from 'react';
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
  LocalPharmacy,
  Inventory,
  ShoppingCart,
  People,
  Assessment,
  Settings,
  TrendingUp,
  LocalShipping,
  ListAlt
} from '@mui/icons-material';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';

const MedicalStoreVendorSidebar = ({ 
  open, 
  onToggle, 
  vendorData, 
  sidebarActive, 
  setSidebarActive,
  prescriptionCount = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDarkMode } = useVendorTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug prescription count
  console.log('🎯 Sidebar received prescriptionCount:', prescriptionCount);

  // Track prescription count changes
  useEffect(() => {
    console.log('🔄 Prescription count updated in sidebar:', prescriptionCount);
  }, [prescriptionCount]);

  // Debug badge calculation
  const ordersBadge = prescriptionCount > 0 ? prescriptionCount.toString() : null;
  console.log('🏷️ Orders badge calculated:', ordersBadge, 'from count:', prescriptionCount);

  // Navigation menu items
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/vendor/pharmacy/dashboard',
      badge: null
    },
    { 
      text: 'Orders', 
      icon: <ShoppingCart />, 
      path: '/vendor/pharmacy/orders',
      badge: ordersBadge
    },
    { 
      text: 'Products', 
      icon: <Inventory />, 
      path: '/vendor/pharmacy/products',
      badge: null
    },
    { 
      text: 'Returns', 
      icon: <LocalShipping />, 
      path: '/vendor/pharmacy/returns',
      badge: null
    },
    { 
      text: 'Profile', 
      icon: <People />, 
      path: '/vendor/pharmacy/profile',
      badge: null
    },
    { 
      text: 'Reports', 
      icon: <Assessment />, 
      path: '/vendor/pharmacy/reports',
      badge: null
    },
    { 
      text: 'Analysis', 
      icon: <TrendingUp />, 
      path: '/vendor/pharmacy/analysis',
      badge: null
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/vendor/pharmacy/settings',
      badge: null
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
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

export default MedicalStoreVendorSidebar; 