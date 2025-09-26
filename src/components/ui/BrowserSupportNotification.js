import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Chip,
  Button,
  Paper,
  Fade
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Notifications as NotificationIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';

const BrowserSupportNotification = ({ browserSupport, onClose }) => {
  const [permissionStatus, setPermissionStatus] = React.useState(Notification?.permission || 'default');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // Ensure component is mounted and DOM is ready
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleRequestPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        console.log('Permission result:', permission);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  if (!browserSupport || !isMounted) return null;

  const getStatusConfig = () => {
    if (browserSupport.supported) {
      return {
        icon: <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />,
        title: 'Notifications Ready',
        subtitle: 'Your browser supports push notifications',
        bgColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: '#4CAF50'
      };
    } else {
      return {
        icon: <WarningIcon sx={{ color: '#FF9800', fontSize: 20 }} />,
        title: 'Enable Notifications',
        subtitle: 'Click the notification icon above to enable',
        bgColor: 'rgba(255, 152, 0, 0.1)',
        borderColor: '#FF9800'
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80, // Position below notification bar
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        maxWidth: 320,
        width: '90%',
        opacity: isMounted ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
        {/* Arrow pointing up to notification bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1
          }}
        >
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: `12px solid ${statusConfig.borderColor}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -6,
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '10px solid white'
              }
            }}
          />
        </Box>

        {/* Dashed line */}
        <Box
          sx={{
            height: 2,
            background: `repeating-linear-gradient(
              to right,
              ${statusConfig.borderColor} 0px,
              ${statusConfig.borderColor} 8px,
              transparent 8px,
              transparent 16px
            )`,
            mb: 1
          }}
        />

        {/* Main dialog */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            border: `2px solid ${statusConfig.borderColor}`,
            backgroundColor: statusConfig.bgColor,
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {statusConfig.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {statusConfig.title}
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={onClose}
                sx={{ 
                  color: 'inherit',
                  minWidth: 'auto',
                  p: 0.5,
                  opacity: 0.7,
                  '&:hover': { opacity: 1 }
                }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </Box>

            {/* Content */}
            <Typography variant="body2" sx={{ mb: 1.5, opacity: 0.8, fontSize: '0.8rem' }}>
              {statusConfig.subtitle}
            </Typography>

            {/* Browser info chips */}
            {browserSupport.browserInfo && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                <Chip
                  label={`${browserSupport.browserInfo.browserName}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 20,
                    borderColor: statusConfig.borderColor,
                    color: statusConfig.borderColor
                  }}
                />
                {browserSupport.browserInfo.isMobile && (
                  <Chip
                    label="Mobile"
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem',
                      height: 20,
                      borderColor: statusConfig.borderColor,
                      color: statusConfig.borderColor
                    }}
                  />
                )}
              </Box>
            )}

            {/* Action button for unsupported browsers */}
            {!browserSupport.supported && permissionStatus === 'default' && (
              <Button
                size="small"
                variant="contained"
                startIcon={<NotificationIcon />}
                onClick={handleRequestPermission}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  backgroundColor: statusConfig.borderColor,
                  color: 'white',
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: statusConfig.borderColor,
                    opacity: 0.9
                  }
                }}
              >
                Enable Now
              </Button>
            )}

            {/* Status indicators */}
            {!browserSupport.supported && (
              <Box sx={{ mt: 1 }}>
                {permissionStatus === 'granted' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 500 }}>
                      Notifications enabled
                    </Typography>
                  </Box>
                )}
                
                {permissionStatus === 'denied' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WarningIcon sx={{ color: '#F44336', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#F44336', fontWeight: 500 }}>
                      Notifications blocked
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
    </Box>
  );
};

export default BrowserSupportNotification;
