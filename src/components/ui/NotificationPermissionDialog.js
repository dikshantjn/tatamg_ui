import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Fade
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  Close,
  Settings,
  CheckCircle,
  Warning,
  Info,
  Schedule,
  LocalPharmacy,
  Science,
  Emergency,
  Lightbulb,
  Lock
} from '@mui/icons-material';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../../firebase/config';

const NotificationPermissionDialog = ({ open, onClose, onPermissionGranted }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted and DOM is ready
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open && isMounted) {
      const status = getNotificationPermissionStatus();
      setPermissionStatus(status);
    }
  }, [open, isMounted]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      console.log('🔔 NotificationPermissionDialog: Requesting permission...');
      const granted = await requestNotificationPermission();
      
      if (granted) {
        console.log('✅ NotificationPermissionDialog: Permission granted!');
        setPermissionStatus('granted');
        onPermissionGranted();
        onClose();
      } else {
        console.log('❌ NotificationPermissionDialog: Permission denied');
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error('❌ NotificationPermissionDialog: Error requesting permission:', error);
      setPermissionStatus('denied');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleOpenSettings = () => {
    // Try to open browser settings (this works in some browsers)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'notifications' }).then((result) => {
        console.log('🔔 Current notification permission:', result.state);
      });
    }
    
    // Show instructions for manual enablement
    alert(`To enable notifications manually:
1. Click the lock icon in your browser's address bar
2. Select "Allow" for notifications
3. Refresh this page

Or go to your browser settings and enable notifications for this site.`);
  };

  const getPermissionMessage = () => {
    switch (permissionStatus) {
      case 'granted':
        return {
          title: 'Notifications Enabled!',
          message: 'You will now receive important updates and notifications.',
          severity: 'success',
          icon: <CheckCircle sx={{ color: '#4CAF50' }} />
        };
      case 'denied':
        return {
          title: 'Notifications Blocked',
          message: 'Notifications are currently blocked. You can enable them manually in your browser settings.',
          severity: 'error',
          icon: <Warning sx={{ color: '#F44336' }} />
        };
      default:
        return {
          title: 'Enable Notifications',
          message: 'Stay updated with important information, appointment reminders, and health tips.',
          severity: 'info',
          icon: <Info sx={{ color: '#2196F3' }} />
        };
    }
  };

  const permissionInfo = getPermissionMessage();

  const benefits = [
    { icon: <Schedule sx={{ fontSize: 20 }} />, text: 'Appointment reminders and updates' },
    { icon: <LocalPharmacy sx={{ fontSize: 20 }} />, text: 'Medicine delivery notifications' },
    { icon: <Science sx={{ fontSize: 20 }} />, text: 'Lab test results and reports' },
    { icon: <Emergency sx={{ fontSize: 20 }} />, text: 'Emergency health alerts' },
    { icon: <Lightbulb sx={{ fontSize: 20 }} />, text: 'Health tips and wellness updates' }
  ];

  const steps = [
    { icon: <Lock sx={{ fontSize: 20 }} />, text: 'Click the lock icon in your browser\'s address bar' },
    { icon: <CheckCircle sx={{ fontSize: 20 }} />, text: 'Select "Allow" for notifications' },
    { icon: <Settings sx={{ fontSize: 20 }} />, text: 'Refresh this page' }
  ];

  if (!isMounted) return null;

  return (
    <Dialog
      open={open && isMounted}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          m: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '90vh',
          overflow: 'hidden',
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }
      }}
    >
        {/* Header */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${permissionInfo.severity === 'success' ? '#4CAF50' : permissionInfo.severity === 'error' ? '#F44336' : '#2196F3'}15, transparent)`,
          p: 2,
          borderBottom: `2px solid ${permissionInfo.severity === 'success' ? '#4CAF50' : permissionInfo.severity === 'error' ? '#F44336' : '#2196F3'}20`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {permissionInfo.icon}
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                {permissionInfo.title}
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <DialogContent sx={{ p: 3, pt: 2 }}>
          {/* Status Message */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${permissionInfo.severity === 'success' ? '#4CAF50' : permissionInfo.severity === 'error' ? '#F44336' : '#2196F3'}30`,
              bgcolor: `${permissionInfo.severity === 'success' ? '#4CAF50' : permissionInfo.severity === 'error' ? '#F44336' : '#2196F3'}08`
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
              {permissionInfo.message}
            </Typography>
          </Paper>

          {/* Benefits Section */}
          {permissionStatus === 'default' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Benefits of enabling notifications:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      color: '#2196F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 24
                    }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.8 }}>
                      {benefit.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Manual Steps Section */}
          {permissionStatus === 'denied' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                To enable notifications manually:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {steps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip 
                      label={index + 1} 
                      size="small" 
                      sx={{ 
                        minWidth: 24, 
                        height: 24, 
                        fontSize: '0.75rem',
                        bgcolor: '#F44336',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                    <Box sx={{ 
                      color: '#F44336',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 24
                    }}>
                      {step.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.8 }}>
                      {step.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ 
          p: 3, 
          pt: 1,
          gap: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          '& > *': {
            flex: 1,
            minWidth: 0
          }
        }}>
          {permissionStatus === 'denied' && (
            <Button
              onClick={handleOpenSettings}
              startIcon={<Settings />}
              variant="outlined"
              sx={{ 
                textTransform: 'none',
                borderColor: '#F44336',
                color: '#F44336',
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                px: isMobile ? 1.5 : 3,
                py: 1,
                '&:hover': {
                  borderColor: '#F44336',
                  bgcolor: 'rgba(244, 67, 54, 0.1)'
                }
              }}
            >
              {isMobile ? 'Settings' : 'Open Settings'}
            </Button>
          )}
          
          {permissionStatus === 'default' && (
            <Button
              onClick={handleRequestPermission}
              variant="contained"
              disabled={isRequesting}
              startIcon={<Notifications />}
              sx={{ 
                textTransform: 'none',
                bgcolor: '#2196F3',
                borderRadius: 2,
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                px: isMobile ? 1.5 : 3,
                py: 1,
                '&:hover': {
                  bgcolor: '#1976D2'
                }
              }}
            >
              {isRequesting ? 'Requesting...' : (isMobile ? 'Enable' : 'Enable Notifications')}
            </Button>
          )}

          <Button
            onClick={onClose}
            variant={permissionStatus === 'default' ? 'outlined' : 'contained'}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              fontSize: isMobile ? '0.8rem' : '0.875rem',
              px: isMobile ? 1.5 : 3,
              py: 1,
              ...(permissionStatus === 'default' ? {
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#333',
                  bgcolor: 'rgba(0,0,0,0.05)'
                }
              } : {
                bgcolor: permissionStatus === 'granted' ? '#4CAF50' : '#F44336',
                '&:hover': {
                  bgcolor: permissionStatus === 'granted' ? '#45A049' : '#D32F2F'
                }
              })
            }}
          >
            {permissionStatus === 'granted' ? 'Done' : (isMobile ? 'Later' : 'Maybe Later')}
          </Button>
        </DialogActions>
    </Dialog>
  );
};

export default NotificationPermissionDialog;
