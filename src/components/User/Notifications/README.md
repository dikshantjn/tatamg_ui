# Notifications Component

This component provides a comprehensive notification system for the Vedika Healthcare application.

## Features

- **Real-time Notifications**: Fetches notifications from the API and displays them in real-time
- **Unread Count**: Shows unread notification count in header and navigation
- **Filtering**: Filter notifications by type (appointments, orders, payments, etc.)
- **Mark as Read**: Individual and bulk mark-as-read functionality
- **Delete Notifications**: Remove unwanted notifications
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Clean UI**: Modern Material-UI design with smooth animations

## Components

### Notifications.js
Main notification page component with:
- Notification list display
- Filtering and search functionality
- Mark as read/delete actions
- Loading states and error handling
- Mobile-responsive design

### notification.service.js
Service layer for API interactions:
- `getNotifications(userId)` - Fetch all notifications for a user
- `markAsRead(notificationId)` - Mark a specific notification as read
- `markAllAsRead(userId)` - Mark all notifications as read
- `deleteNotification(notificationId)` - Delete a notification
- `getUnreadCount(userId)` - Get count of unread notifications

## API Integration

The component integrates with the following API endpoints:
- `GET /api/notifications?userId={userId}` - Fetch notifications
- `PUT /api/notifications/{notificationId}/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/{notificationId}` - Delete notification

## Notification Types

The system supports various notification types with appropriate icons and colors:
- `CLINIC_APPOINTMENT_ORDER_HISTORY` - Hospital appointments
- `appointment_postponed` - Appointment updates
- `order_confirmed` - Order confirmations
- `payment_success` - Payment notifications
- `lab_test_completed` - Lab test results
- `ambulance_assigned` - Ambulance services
- `blood_bank_confirmed` - Blood bank services
- `membership_activated` - Membership updates

## Header Integration

The notification system is integrated into the header with:
- Notification bell icon with unread count badge
- Profile dropdown menu item with badge
- Mobile drawer menu item with badge
- Real-time count updates every 30 seconds

## Usage

```jsx
import Notifications from './components/User/Notifications/Notifications';

// In your routing
<Route path="/notifications" element={<Notifications />} />
```

## Styling

The component uses Material-UI components with custom styling:
- Clean card-based layout
- Color-coded notification types
- Smooth hover animations
- Responsive design for mobile devices
- Loading skeletons for better UX

## Error Handling

- API error handling with user-friendly messages
- Loading states with skeleton components
- Retry functionality for failed requests
- Graceful fallbacks for missing data
