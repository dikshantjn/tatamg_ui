import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Chip,
  Button,
  Collapse
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';

const BrowserSupportNotification = ({ browserSupport, onClose }) => {
  const [permissionStatus, setPermissionStatus] = React.useState(Notification?.permission || 'default');

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

  if (!browserSupport) return null;

  const getAlertProps = () => {
    if (browserSupport.supported) {
      return {
        severity: 'success',
        icon: <CheckCircleIcon />,
        title: 'Push Notifications Supported',
        color: '#4CAF50'
      };
    } else {
      return {
        severity: 'warning',
        icon: <WarningIcon />,
        title: 'Push Notifications Limited',
        color: '#FF9800'
      };
    }
  };

  const alertProps = getAlertProps();

  return (
    <Alert
      severity={alertProps.severity}
      icon={alertProps.icon}
      sx={{
        position: 'fixed',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10000,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: 500,
        mx: 'auto'
      }}
      action={
        <Button
          size="small"
          onClick={onClose}
          sx={{ 
            color: 'inherit',
            minWidth: 'auto',
            p: 0.5
          }}
        >
          <CloseIcon fontSize="small" />
        </Button>
      }
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        {alertProps.title}
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        {browserSupport.reason}
      </Typography>
      
      {browserSupport.browserInfo && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          <Chip
            label={`${browserSupport.browserInfo.browserName} ${browserSupport.browserInfo.browserVersion}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
          {browserSupport.browserInfo.isMobile && (
            <Chip
              label="Mobile"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
          {browserSupport.browserInfo.isTablet && (
            <Chip
              label="Tablet"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
      )}
      
      {!browserSupport.supported && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            You can still receive notifications through the app's notification center.
          </Typography>
          
          {permissionStatus === 'default' && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<NotificationIcon />}
              onClick={handleRequestPermission}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                borderColor: '#FF9800',
                color: '#FF9800',
                '&:hover': {
                  bgcolor: 'rgba(255, 152, 0, 0.1)'
                }
              }}
            >
              Enable Notifications
            </Button>
          )}
          
          {permissionStatus === 'granted' && (
            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500 }}>
              ✅ Notifications enabled
            </Typography>
          )}
          
          {permissionStatus === 'denied' && (
            <Typography variant="body2" sx={{ color: '#F44336', fontWeight: 500 }}>
              ❌ Notifications blocked
            </Typography>
          )}
        </Box>
      )}
    </Alert>
  );
};

export default BrowserSupportNotification;
