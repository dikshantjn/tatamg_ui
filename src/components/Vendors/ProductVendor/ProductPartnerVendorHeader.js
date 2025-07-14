import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { vendorAuthService } from '../../../services/Vendors/VendorAuth/vendor-auth.service';
import { useVendorTheme } from '../../../contexts/VendorThemeContext';
import Logo from '../../ui/Logo';
import { useNavigate } from 'react-router-dom';
import { getVendorStatus, toggleVendorStatus } from '../../../services/Vendors/AllVendors.service';
import { toast } from 'react-toastify';

const ProductPartnerVendorHeader = ({ 
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [vendorStatus, setVendorStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useVendorTheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
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
    handleMenuClose();
    navigate('/vendor/product-partner/profile');
    if (onProfileClick) onProfileClick();
  };

  // Fetch vendor status
  const fetchVendorStatus = async () => {
    if (!vendorData?.vendorId) return;
    
    try {
      const response = await getVendorStatus(vendorData.vendorId);
      setVendorStatus(response.isActive);
    } catch (error) {
      console.error('Error fetching vendor status:', error);
      // Set default to active if API fails
      setVendorStatus(true);
    }
  };

  // Toggle vendor status
  const handleStatusToggle = async () => {
    if (!vendorData?.vendorId || statusLoading) return;
    
    setStatusLoading(true);
    try {
      const response = await toggleVendorStatus(vendorData.vendorId);
      setVendorStatus(response.isActive);
      
      // Show success toast
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Update parent component if callback provided
      if (setSidebarActive) {
        setSidebarActive(response.isActive);
      }
      
      // Notify parent component about status change
      if (onStatusUpdate) {
        onStatusUpdate(response.isActive);
      }
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      
      // Show error toast
      toast.error('Failed to update status. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setStatusLoading(false);
    }
  };

  // Fetch status on component mount
  React.useEffect(() => {
    fetchVendorStatus();
  }, [vendorData?.vendorId]);

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
          <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
            <Logo size="small" />
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
            textAlign: 'left',
            flexGrow: 1,
            letterSpacing: 0.2,
            ml: { xs: 0, md: 2 }
          }}
        >
          {title}
        </Typography>

        {/* Right: Action Icons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          ml: 2
        }}>
          {/* Active/Inactive Button */}
          <Button
            size="small"
            variant="outlined"
            onClick={handleStatusToggle}
            disabled={statusLoading || vendorStatus === null}
            sx={{
              borderColor: vendorStatus ? '#10B981' : '#EF4444',
              color: vendorStatus ? '#10B981' : '#EF4444',
              borderRadius: 99,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 2,
              py: 0.2,
              minWidth: 0,
              backgroundColor: 'transparent',
              '&:hover': { 
                backgroundColor: vendorStatus ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                borderColor: vendorStatus ? '#059669' : '#B91C1C',
                color: vendorStatus ? '#059669' : '#B91C1C'
              },
              '&:disabled': {
                opacity: 0.6,
                cursor: 'not-allowed'
              }
            }}
          >
            {statusLoading ? 'Updating...' : (vendorStatus ? 'Active' : 'Inactive')}
          </Button>
          {/* Notifications */}
          <Tooltip title="Notifications" arrow>
            <IconButton 
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                }
              }}
            >
              <Badge 
                badgeContent={notificationCount} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: '18px',
                    minWidth: '18px',
                    background: '#6C47FF',
                    color: '#fff',
                    boxShadow: '0 1px 4px 0 rgba(108,71,255,0.08)'
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Dark Mode Toggle */}
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
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
          {/* User Profile */}
          <Tooltip title="Profile" arrow>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                ml: 1,
                p: 0.5,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(16,30,54,0.06)'
                }
              }}
            >
              {vendorData?.profileImage ? (
                <Avatar src={vendorData.profileImage} sx={{ width: 36, height: 36 }} />
              ) : (
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#F0F1F3', color: '#6C47FF', fontWeight: 700 }}>
                  {vendorData?.companyName?.[0]?.toUpperCase() || <AccountCircle />}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ProductPartnerVendorHeader; 