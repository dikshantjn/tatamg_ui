import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Paper,
  Skeleton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  NotificationsOutlined as NotificationsIcon,
  MarkEmailReadOutlined as MarkReadIcon,
  DeleteOutlined as DeleteIcon,
  FilterListOutlined as FilterIcon,
  CheckCircleOutlined as CheckCircleIcon,
  ScheduleOutlined as ScheduleIcon,
  CancelOutlined as CancelIcon,
  LocalShippingOutlined as DeliveryIcon,
  PaymentOutlined as PaymentIcon,
  ScienceOutlined as LabIcon,
  LocalHospitalOutlined as HospitalIcon,
  BloodtypeOutlined as BloodIcon,
  StarOutlined as StarIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { notificationService } from '../../../services/User/Notifications/notification.service';
import { getUserId } from '../../../services/User/Auth/auth.utils';
import { colors } from '../../../styles/colors';

const Notifications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [swipedNotificationId, setSwipedNotificationId] = useState(null);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [swipeCurrentX, setSwipeCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Notifications', icon: <NotificationsIcon /> },
    { value: 'unread', label: 'Unread Only', icon: <MarkReadIcon /> },
    { value: 'CLINIC_APPOINTMENT_ORDER_HISTORY', label: 'Appointments', icon: <HospitalIcon /> },
    { value: 'appointment_postponed', label: 'Appointment Updates', icon: <ScheduleIcon /> },
    { value: 'order_confirmed', label: 'Orders', icon: <DeliveryIcon /> },
    { value: 'payment_success', label: 'Payments', icon: <PaymentIcon /> },
    { value: 'lab_test_completed', label: 'Lab Tests', icon: <LabIcon /> },
    { value: 'ambulance_assigned', label: 'Ambulance', icon: <HospitalIcon /> },
    { value: 'blood_bank_confirmed', label: 'Blood Bank', icon: <BloodIcon /> },
    { value: 'membership_activated', label: 'Membership', icon: <StarIcon /> },
  ];

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      const response = await notificationService.getNotifications(userId);
      
      if (response.data && response.data.success) {
        const formattedNotifications = response.data.notifications.map(notification => 
          notificationService.formatNotification(notification)
        );
        
        // Sort by creation date (newest first)
        formattedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setNotifications(formattedNotifications);
        
        // Calculate unread count
        const unread = formattedNotifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      setSuccessMessage('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const userId = getUserId();
      await notificationService.markAllAsRead(userId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      setSuccessMessage('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };


  // Handle filter change
  const handleFilterChange = (filterValue) => {
    setFilterType(filterValue);
    setFilterMenuAnchor(null);
  };

  // Swipe functionality
  const handleTouchStart = (e, notificationId) => {
    setSwipeStartX(e.touches[0].clientX);
    setSwipeCurrentX(e.touches[0].clientX);
    setIsSwiping(true);
    setSwipedNotificationId(notificationId);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    setSwipeCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = swipeStartX - swipeCurrentX;
    
    if (swipeDistance > 100) {
      // Swipe left - show delete option
      setSwipedNotificationId(swipedNotificationId);
    } else {
      // Reset swipe
      setSwipedNotificationId(null);
    }
    
    setIsSwiping(false);
  };

  // Mouse events for desktop
  const handleMouseDown = (e, notificationId) => {
    setSwipeStartX(e.clientX);
    setSwipeCurrentX(e.clientX);
    setIsSwiping(true);
    setSwipedNotificationId(notificationId);
  };

  const handleMouseMove = (e) => {
    if (!isSwiping) return;
    setSwipeCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    const swipeDistance = swipeStartX - swipeCurrentX;
    
    if (swipeDistance > 100) {
      // Swipe left - show delete option
      setSwipedNotificationId(swipedNotificationId);
    } else {
      // Reset swipe
      setSwipedNotificationId(null);
    }
    
    setIsSwiping(false);
  };

  const handleDeleteClick = async (notification) => {
    try {
      await notificationService.deleteNotification(notification.id);
      
      // Update local state
      setNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
      
      // Update unread count if notification was unread
      if (!notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setSwipedNotificationId(null);
      setSuccessMessage('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err.message || 'Failed to delete notification');
    }
  };

  const resetSwipe = () => {
    setSwipedNotificationId(null);
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    if (filterType === 'all') {
      return notifications;
    } else if (filterType === 'unread') {
      return notifications.filter(n => !n.isRead);
    } else {
      return notifications.filter(n => n.type === filterType);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    const iconMap = {
      'CLINIC_APPOINTMENT_ORDER_HISTORY': <HospitalIcon />,
      'appointment_postponed': <ScheduleIcon />,
      'appointment_confirmed': <CheckCircleIcon />,
      'appointment_cancelled': <CancelIcon />,
      'order_confirmed': <DeliveryIcon />,
      'order_delivered': <DeliveryIcon />,
      'order_cancelled': <CancelIcon />,
      'payment_success': <PaymentIcon />,
      'payment_failed': <PaymentIcon />,
      'lab_test_completed': <LabIcon />,
      'ambulance_assigned': <HospitalIcon />,
      'blood_bank_confirmed': <BloodIcon />,
      'membership_activated': <StarIcon />,
      'general': <InfoIcon />
    };
    
    return iconMap[type] || <NotificationsIcon />;
  };

  // Get notification color
  const getNotificationColor = (type) => {
    const colorMap = {
      'CLINIC_APPOINTMENT_ORDER_HISTORY': '#4CAF50',
      'appointment_postponed': '#FF9800',
      'appointment_confirmed': '#4CAF50',
      'appointment_cancelled': '#F44336',
      'order_confirmed': '#2196F3',
      'order_delivered': '#4CAF50',
      'order_cancelled': '#F44336',
      'payment_success': '#4CAF50',
      'payment_failed': '#F44336',
      'lab_test_completed': '#9C27B0',
      'ambulance_assigned': '#FF5722',
      'blood_bank_confirmed': '#E91E63',
      'membership_activated': '#FF9800',
      'general': '#607D8B'
    };
    
    return colorMap[type] || '#607D8B';
  };

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return notificationDate.toLocaleDateString();
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box sx={{ px: 2 }}>
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: 'white',
          borderRadius: 2,
          border: '1px solid #E2E8F0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Simple Header */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
         <Box sx={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'space-between',
           mb: 3,
           px: { xs: 2, sm: 0 },
           flexWrap: 'nowrap',
           minHeight: 40
         }}>
           <Box sx={{ 
             display: 'flex', 
             alignItems: 'center', 
             minWidth: 0,
             flex: '0 0 auto'
           }}>
             <Typography 
               variant="h4" 
               fontWeight={700} 
               sx={{ 
                 color: '#1A365D',
                 fontSize: { xs: '1.25rem', sm: '2rem' },
                 whiteSpace: 'nowrap'
               }}
             >
               Notifications
             </Typography>
           </Box>
           
           <Box sx={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: { xs: 0.5, sm: 1.5 },
             flexWrap: 'nowrap',
             minWidth: 0,
             flex: '0 0 auto'
           }}>
             {/* Mark All Read Button */}
             {unreadCount > 0 && (
               <Button
                 variant="outlined"
                 size="small"
                 startIcon={<MarkReadIcon />}
                 onClick={handleMarkAllAsRead}
                 sx={{
                   borderColor: colors.primary,
                   color: colors.primary,
                   textTransform: 'none',
                   fontSize: { xs: '0.7rem', sm: '0.875rem' },
                   px: { xs: 1, sm: 2 },
                   py: { xs: 0.25, sm: 0.75 },
                   minWidth: 'auto',
                   whiteSpace: 'nowrap',
                   height: { xs: 28, sm: 32 },
                   '&:hover': {
                     bgcolor: 'rgba(56, 163, 165, 0.1)'
                   }
                 }}
               >
                 Mark All Read
               </Button>
             )}
             
             {/* Filter Button */}
             <Tooltip title="Filter notifications">
               <IconButton 
                 onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                 sx={{ 
                   color: colors.primary,
                   p: { xs: 0.5, sm: 1 },
                   width: { xs: 28, sm: 40 },
                   height: { xs: 28, sm: 40 }
                 }}
               >
                 <FilterIcon fontSize="small" />
               </IconButton>
             </Tooltip>
           </Box>
         </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          sx: {
            minWidth: 200,
            maxHeight: 400,
            mt: 1
          }
        }}
      >
        {filterOptions.map((option) => (
          <MenuItem 
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            selected={filterType === option.value}
            sx={{ py: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {option.icon}
              <Typography variant="body2">{option.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

        {/* Main Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={fetchNotifications}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        ) : getFilteredNotifications().length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid #E2E8F0',
            mx: 2
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#E2E8F0', 
              mx: 'auto', 
              mb: 2 
            }}>
              <NotificationsIcon sx={{ fontSize: 40, color: '#94A3B8' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {filterType === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filterType === 'unread' 
                ? 'You\'re all caught up!' 
                : 'You\'ll see notifications here when they arrive'
              }
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 2 }}>
            {getFilteredNotifications().map((notification) => (
              <Box
                key={notification.id}
                sx={{
                  position: 'relative',
                  mb: 2,
                  overflow: 'hidden',
                  borderRadius: 2,
                  bgcolor: notification.isRead ? 'white' : '#F0F9FF',
                  border: notification.isRead ? '1px solid #E2E8F0' : `1px solid ${colors.primary}`,
                  transition: 'all 0.3s ease',
                  transform: swipedNotificationId === notification.id ? 'translateX(-80px)' : 'translateX(0)',
                  '&:hover': {
                    bgcolor: notification.isRead ? '#FAFAFA' : '#E0F2FE',
                    borderColor: colors.primary
                  }
                }}
                onTouchStart={(e) => handleTouchStart(e, notification.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={(e) => handleMouseDown(e, notification.id)}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={resetSwipe}
              >
                {/* Main Notification Content */}
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Notification Icon */}
                    <Avatar 
                      sx={{ 
                        bgcolor: getNotificationColor(notification.type),
                        width: 44,
                        height: 44,
                        mt: 0.5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                    
                    {/* Notification Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight={notification.isRead ? 500 : 600}
                          sx={{ 
                            color: '#1A365D',
                            lineHeight: 1.3,
                            fontSize: '1rem'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        
                        {!notification.isRead && (
                          <Box sx={{ 
                            width: 10, 
                            height: 10, 
                            bgcolor: colors.primary, 
                            borderRadius: '50%',
                            ml: 1,
                            mt: 0.5,
                            boxShadow: '0 0 0 2px rgba(56, 163, 165, 0.2)'
                          }} />
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          fontSize: '0.9rem'
                        }}
                      >
                        {notification.body}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <Chip 
                          label={notification.type.replace(/_/g, ' ').toLowerCase()}
                          size="small"
                          sx={{ 
                            bgcolor: `${getNotificationColor(notification.type)}15`,
                            color: getNotificationColor(notification.type),
                            fontSize: '0.75rem',
                            height: 22,
                            fontWeight: 500,
                            border: `1px solid ${getNotificationColor(notification.type)}30`
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Action Buttons */}
                  {!notification.isRead && (
                    <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #E2E8F0' }}>
                      <Button
                        size="small"
                        startIcon={<MarkReadIcon />}
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{
                          color: colors.primary,
                          textTransform: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          px: 2,
                          py: 0.5,
                          borderRadius: 1.5,
                          '&:hover': {
                            bgcolor: 'rgba(56, 163, 165, 0.1)'
                          }
                        }}
                      >
                        Mark as Read
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Swipe Delete Action */}
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 80,
                    bgcolor: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: swipedNotificationId === notification.id ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 1,
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  <IconButton
                    onClick={() => handleDeleteClick(notification)}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {/* Swipe Indicator */}
                {!swipedNotificationId && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      opacity: 0.3,
                      color: '#94A3B8',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      pointerEvents: 'none'
                    }}
                  >
                    ← Swipe to delete
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Container>


      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;
