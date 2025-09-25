import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slide,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const NotificationPopup = ({ notification, onClose, onAction }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notification) {
      setShow(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for slide animation
  };

  const handleAction = (action) => {
    onAction(action);
    handleClose();
  };

  if (!notification) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'error':
      case 'failed':
        return <ErrorIcon sx={{ color: '#F44336' }} />;
      case 'warning':
      case 'postponed':
        return <WarningIcon sx={{ color: '#FF9800' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196F3' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
      case 'completed':
        return '#4CAF50';
      case 'error':
      case 'failed':
        return '#F44336';
      case 'warning':
      case 'postponed':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  return (
    <Slide direction="left" in={show} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          width: { xs: 'calc(100vw - 40px)', sm: 400 },
          maxWidth: 400,
          zIndex: 9999,
          borderRadius: 2,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: `2px solid ${getNotificationColor(notification.type)}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: getNotificationColor(notification.type),
                  color: 'white'
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
              <Typography variant="subtitle2" fontWeight={600} color="#1A365D">
                {notification.title || 'Notification'}
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

          {/* Body */}
          <Typography 
            variant="body2" 
            color="#4B5563"
            sx={{ 
              mb: 2,
              lineHeight: 1.5,
              fontSize: '0.875rem'
            }}
          >
            {notification.body || notification.message}
          </Typography>

          {/* Type Badge */}
          {notification.type && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={notification.type.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: `${getNotificationColor(notification.type)}20`,
                  color: getNotificationColor(notification.type),
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24
                }}
              />
            </Box>
          )}

          {/* Actions */}
          {notification.data && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'flex-end',
              mt: 1
            }}>
              {notification.data.actionUrl && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleAction('view')}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    px: 2,
                    py: 0.5,
                    borderColor: getNotificationColor(notification.type),
                    color: getNotificationColor(notification.type),
                    '&:hover': {
                      bgcolor: `${getNotificationColor(notification.type)}10`
                    }
                  }}
                >
                  View Details
                </Button>
              )}
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAction('dismiss')}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.5,
                  bgcolor: getNotificationColor(notification.type),
                  '&:hover': {
                    bgcolor: getNotificationColor(notification.type),
                    opacity: 0.9
                  }
                }}
              >
                Dismiss
              </Button>
            </Box>
          )}
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            bgcolor: getNotificationColor(notification.type),
            animation: 'shrink 5s linear forwards',
            '@keyframes shrink': {
              from: { width: '100%' },
              to: { width: '0%' }
            }
          }}
        />
      </Paper>
    </Slide>
  );
};

export default NotificationPopup;
