import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Slide,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const PermissionRequestBanner = ({ onClose, onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState(Notification?.permission || 'default');
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show banner if permission is default and notifications are supported
    if (permissionStatus === 'default' && 'Notification' in window) {
      setShow(true);
    }
  }, [permissionStatus]);

  const handleRequestPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        
        if (permission === 'granted') {
          onPermissionGranted?.();
          // Auto close after successful permission
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!show || permissionStatus !== 'default') return null;

  return (
    <Slide direction="down" in={show} mountOnEnter unmountOnExit>
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10001,
          borderRadius: 0,
          borderBottom: '3px solid #FF9800',
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationIcon sx={{ color: '#FF9800', fontSize: 24 }} />
              <Typography variant="subtitle1" fontWeight={600} color="#1A365D">
                Enable Notifications
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ 
                color: '#6B7280',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="body2" color="#4B5563" sx={{ mb: 2 }}>
            Stay updated with important healthcare notifications, appointment reminders, and service updates.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            justifyContent: 'flex-end'
          }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                borderColor: '#6B7280',
                color: '#6B7280',
                '&:hover': {
                  bgcolor: 'rgba(107, 114, 128, 0.1)'
                }
              }}
            >
              Not Now
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<NotificationIcon />}
              onClick={handleRequestPermission}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                bgcolor: '#FF9800',
                '&:hover': {
                  bgcolor: '#F57C00'
                }
              }}
            >
              Allow Notifications
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export default PermissionRequestBanner;
