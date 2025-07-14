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

// Sidebar Component
const ProductVendorSidebar = ({ 
  open, 
  onToggle, 
  vendorData, 
  sidebarActive, 
  setSidebarActive 
}) => {
  const theme = useTheme();
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
      background: '#fff',
      borderRight: '1px solid #F0F1F3',
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
                backgroundColor: isActive ? '#F3F0FF' : 'transparent',
                color: isActive ? '#6C47FF' : '#222',
                fontWeight: isActive ? 700 : 500,
                '&:hover': {
                  backgroundColor: '#F3F0FF',
                  color: '#6C47FF'
                },
                px: 2,
                py: 1.2
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#6C47FF' : '#B0B3B9', minWidth: 36 }}>
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
          background: '#fff',
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