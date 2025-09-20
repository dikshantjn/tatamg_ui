# NewMedicineOrder Component

A modern, mobile-responsive React component for displaying medical stores and handling prescription uploads.

## Features

- **Simple Medical Store List**: Clean list view showing store names with call and upload options
- **Call Functionality**: Direct calling capability for each store
- **Prescription Upload**: Upload multiple prescription images or PDFs with add more option
- **Order Details**: Text area for describing order requirements
- **Navigation Buttons**: Quick access to Track Order and My Orders pages
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Material-UI Design**: Modern, accessible UI components
- **Real-time Feedback**: Loading states, error handling, and success notifications

## API Integration

The component integrates with the following API endpoints:

- `GET /api/medicine-delivery/medicalstores` - Fetch all medical stores
- `POST /api/medicine-delivery/send` - Send prescription with order details
- `POST /api/prescription/upload-prescription` - Upload prescription files (legacy)

## Usage

### Basic Implementation

```jsx
import NewMedicineOrder from './components/User/NewMedicineOrder';

function App() {
  return (
    <div>
      <NewMedicineOrder />
    </div>
  );
}
```

### With Routing

```jsx
import { Route } from 'react-router-dom';
import NewMedicineOrder from './components/User/NewMedicineOrder';

<Route path="/new-medicine-order" element={<NewMedicineOrder />} />
```

## Component Structure

```
NewMedicineOrder/
├── NewMedicineOrder.js      # Main component
├── NewMedicineOrder.css     # Custom styles
├── index.js                 # Export file
└── README.md               # Documentation
```

## Props

The component doesn't require any props as it manages its own state and API calls.

## Features Breakdown

### Medical Store List
- Simple card layout with store name
- Call and Upload buttons for each store
- Clean, minimal design

### Actions
- **Call Store**: Opens phone dialer with store contact number
- **Upload Prescription**: Opens dialog for file upload

### Upload Dialog
- File selection (images and PDFs)
- Add more files option after initial selection
- Order General Product text area (always visible)
- Quantity Preference text area (shown only when files are selected)
- Skip Notes text field (shown only when files are selected)
- Upload progress indication with spinner
- Success/error notifications

## Styling

The component uses Material-UI theming and includes custom CSS for:
- Card hover effects
- Gradient backgrounds
- Mobile responsiveness
- Loading animations
- Custom scrollbars

## Navigation Buttons

The component includes two navigation buttons in the header section:

- **Track Order** (Contained Button): Navigates to `/track-order` route
  - Blue gradient background with hover effects
  - TrackChanges icon
  - Primary action styling

- **My Orders** (Outlined Button): Navigates to `/orders` route
  - Outlined style with primary color
  - History icon
  - Secondary action styling

Both buttons are:
- Responsive (stack vertically on mobile, side-by-side on desktop)
- Touch-friendly with proper sizing
- Include smooth hover animations
- Use appropriate Material-UI icons

## Mobile Responsiveness

- **Adaptive Layout**: Different layouts for mobile and desktop
  - Mobile: Vertical card layout with full-width buttons
  - Desktop: Horizontal layout with compact buttons
- **Touch-Friendly Interface**: Larger buttons and touch targets on mobile
- **Full-Screen Dialogs**: Dialogs take full screen on mobile devices
- **Optimized Typography**: Responsive font sizes and line heights
- **Smart Text Wrapping**: Store names and dialog titles wrap properly
- **Improved Spacing**: Reduced padding and margins for better mobile experience
- **Stacked Actions**: Dialog buttons stack vertically on mobile

## API Request Format

The send prescription API expects the following multipart/form-data:

```
vendorId: "12345"
userId: "authenticated_user_id_from_localStorage"
quantityPreference: "General Products: toothpaste, soap, vitamins

Prescription Details: 1 box of Paracetamol, 2 strips of Amoxicillin"
skipNotes: "Skip the expensive brand, use generic version"
files: [prescription1.png, prescription2.pdf]
```

**Note**: The `userId` is automatically retrieved from the authenticated user's session using `getUserId()` from auth utils.

## Authentication

- Component requires user authentication
- Automatically retrieves `userId` from localStorage using `getUserId()` from auth utils
- Shows authentication error if user is not logged in
- Prevents API calls if user is not authenticated

## Error Handling

- API error states with retry functionality
- Authentication error handling
- File upload validation (multiple files supported)
- Form validation (quantity preference required)
- User-friendly error messages
- Loading states with spinner for better UX

## Dependencies

- React
- Material-UI (MUI)
- Axios (for API calls)
- React Router (for navigation)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes
