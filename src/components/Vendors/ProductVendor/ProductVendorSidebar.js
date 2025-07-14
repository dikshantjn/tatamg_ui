import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  Assessment,
  Person,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';

// Sidebar Component
const ProductVendorSidebar = ({ 
  open, 
  onToggle, 
  vendorData, 
  sidebarActive, 
  setSidebarActive 
}) => {
  const theme = useTheme();
  const { isDarkMode } = useVendorTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/product-partner/dashboard' },
    { text: 'Products', icon: <Inventory />, path: '/vendor/product-partner/products' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/vendor/product-partner/orders' },
    { text: 'Reports', icon: <Assessment />, path: '/vendor/product-partner/reports' },
    { text: 'Profile', icon: <Person />, path: '/vendor/product-partner/profile' },
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
      <List sx={{ flexGrow: 1, mt: 1 }}>
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
            </ListItem>
          );
        })}
      </List>
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

export default ProductVendorSidebar; 