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
  useMediaQuery
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  Close,
  Settings
} from '@mui/icons-material';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../../firebase/config';

const NotificationPermissionDialog = ({ open, onClose, onPermissionGranted }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (open) {
      const status = getNotificationPermissionStatus();
      setPermissionStatus(status);
    }
  }, [open]);

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
          title: '✅ Notifications Enabled!',
          message: 'You will now receive important updates and notifications.',
          severity: 'success'
        };
      case 'denied':
        return {
          title: '❌ Notifications Blocked',
          message: 'Notifications are currently blocked. You can enable them manually in your browser settings.',
          severity: 'error'
        };
      default:
        return {
          title: '🔔 Enable Notifications',
          message: 'Stay updated with important information, appointment reminders, and health tips.',
          severity: 'info'
        };
    }
  };

  const permissionInfo = getPermissionMessage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {permissionStatus === 'granted' ? (
            <Notifications color="success" />
          ) : permissionStatus === 'denied' ? (
            <NotificationsOff color="error" />
          ) : (
            <Notifications color="primary" />
          )}
          <Typography variant="h6" component="div">
            {permissionInfo.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Alert severity={permissionInfo.severity} sx={{ mb: 3 }}>
          {permissionInfo.message}
        </Alert>

        {permissionStatus === 'default' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Benefits of enabling notifications:</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                📅 Appointment reminders and updates
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                💊 Medicine delivery notifications
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                🏥 Lab test results and reports
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                🚨 Emergency health alerts
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                💡 Health tips and wellness updates
              </Typography>
            </Box>
          </Box>
        )}

        {permissionStatus === 'denied' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>To enable notifications manually:</strong>
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Click the lock icon (🔒) in your browser's address bar
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Select "Allow" for notifications
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Refresh this page
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {permissionStatus === 'denied' && (
          <Button
            onClick={handleOpenSettings}
            startIcon={<Settings />}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Open Settings
          </Button>
        )}
        
        {permissionStatus === 'default' && (
          <Button
            onClick={handleRequestPermission}
            variant="contained"
            disabled={isRequesting}
            startIcon={<Notifications />}
            sx={{ textTransform: 'none' }}
          >
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
          </Button>
        )}

        <Button
          onClick={onClose}
          variant={permissionStatus === 'default' ? 'outlined' : 'contained'}
          sx={{ textTransform: 'none' }}
        >
          {permissionStatus === 'granted' ? 'Done' : 'Maybe Later'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationPermissionDialog;
