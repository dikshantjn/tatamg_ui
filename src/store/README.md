# Redux Implementation Guide

This document explains the Redux implementation in your healthcare application and how to use it effectively.

## Overview

Redux has been implemented using Redux Toolkit (RTK) for better developer experience and reduced boilerplate code. The store is organized into logical slices that manage different parts of your application state.

## Store Structure

```
src/store/
├── index.js                 # Main store configuration
├── slices/
│   ├── authSlice.js         # Authentication state
│   ├── userSlice.js         # User profile and preferences
│   ├── cartSlice.js         # Shopping cart functionality
│   ├── productSlice.js      # Product catalog and filtering
│   ├── appointmentSlice.js  # Appointment booking and management
│   └── searchSlice.js       # Search functionality and history
└── README.md               # This file
```

## Available Slices

### 1. Auth Slice (`authSlice.js`)
Manages user authentication state including login, logout, and authentication status.

**State:**
- `user`: Current user object
- `isAuthenticated`: Boolean indicating if user is logged in
- `loading`: Loading state for auth operations
- `error`: Error messages
- `uid`: User ID
- `email`: User email

**Actions:**
- `signInUser(credentials)`: Sign in with email/password
- `signOutUser()`: Sign out user
- `checkAuthState()`: Check current authentication state
- `clearError()`: Clear error messages

**Usage:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { signInUser, signOutUser } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const handleLogin = () => {
    dispatch(signInUser({ email: 'user@example.com', password: 'password' }));
  };

  const handleLogout = () => {
    dispatch(signOutUser());
  };
};
```

### 2. User Slice (`userSlice.js`)
Manages user profile data, preferences, and medical history.

**State:**
- `profile`: User profile information
- `loading`: Loading state
- `error`: Error messages
- `isProfileComplete`: Boolean indicating if profile is complete

**Actions:**
- `fetchUserProfile(userId)`: Fetch user profile from API
- `updateUserProfile({ userId, profileData })`: Update user profile
- `setUserProfile(profileData)`: Set profile data directly
- `updateProfileField({ field, value })`: Update specific profile field
- `addMedicalHistory(historyItem)`: Add medical history item
- `removeMedicalHistory(index)`: Remove medical history item

### 3. Cart Slice (`cartSlice.js`)
Manages shopping cart functionality including adding/removing items and calculating totals.

**State:**
- `items`: Array of cart items
- `total`: Total cart value
- `itemCount`: Total number of items
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `addToCart(item)`: Add item to cart
- `removeFromCart(itemId)`: Remove item from cart
- `updateQuantity({ id, quantity })`: Update item quantity
- `clearCart()`: Clear all items from cart

**Selectors:**
- `selectCartItems`: Get all cart items
- `selectCartTotal`: Get cart total
- `selectCartItemCount`: Get total item count
- `selectCartItemById(itemId)`: Get specific cart item

### 4. Product Slice (`productSlice.js`)
Manages product catalog, filtering, and pagination.

**State:**
- `products`: Array of all products
- `categories`: Available product categories
- `currentProduct`: Currently selected product
- `filteredProducts`: Products after applying filters
- `filters`: Current filter settings
- `pagination`: Pagination information

**Actions:**
- `fetchProducts()`: Fetch all products
- `fetchProductById(productId)`: Fetch specific product
- `fetchProductsByCategory(category)`: Fetch products by category
- `setFilter({ key, value })`: Set filter value
- `clearFilters()`: Clear all filters
- `applyFilters()`: Apply current filters
- `setPage(pageNumber)`: Set current page

### 5. Appointment Slice (`appointmentSlice.js`)
Manages appointment booking, scheduling, and management.

**State:**
- `appointments`: Array of user appointments
- `currentAppointment`: Currently selected appointment
- `availableSlots`: Available time slots
- `selectedDate/Time/Doctor`: Booking form data
- `bookingSuccess`: Boolean indicating successful booking

**Actions:**
- `bookAppointment(appointmentData)`: Book new appointment
- `fetchUserAppointments(userId)`: Fetch user appointments
- `cancelAppointment(appointmentId)`: Cancel appointment
- `rescheduleAppointment({ appointmentId, newDateTime })`: Reschedule appointment
- `setSelectedDate(date)`: Set selected date
- `setSelectedTime(time)`: Set selected time
- `setSelectedDoctor(doctor)`: Set selected doctor

### 6. Search Slice (`searchSlice.js`)
Manages search functionality, history, and suggestions.

**State:**
- `query`: Current search query
- `results`: Search results
- `suggestions`: Search suggestions
- `searchHistory`: Previous search terms
- `recentSearches`: Recent search data
- `filters`: Search filters

**Actions:**
- `performSearch({ query, filters })`: Perform search
- `fetchSearchSuggestions(query)`: Get search suggestions
- `setQuery(query)`: Set search query
- `clearResults()`: Clear search results
- `addToSearchHistory(term)`: Add term to search history

## Usage Patterns

### 1. Basic Component with Redux
```javascript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { someAction } from '../store/slices/someSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const someData = useSelector(state => state.someSlice.someData);

  const handleAction = () => {
    dispatch(someAction(payload));
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

### 2. Using Selectors
```javascript
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

const CartComponent = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  return (
    <div>
      <p>Total: ${cartTotal}</p>
      {cartItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### 3. Async Actions with Loading States
```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProductLoading, selectProductError } from '../store/slices/productSlice';

const ProductsComponent = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Products display */}
    </div>
  );
};
```

### 4. Form Handling with Redux
```javascript
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileField } from '../store/slices/userSlice';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);
  const [formData, setFormData] = useState(profile);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    dispatch(updateProfileField({ field, value }));
  };

  return (
    <form>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
      />
      {/* More form fields */}
    </form>
  );
};
```

## Best Practices

### 1. Use Selectors
Always use selectors to access state instead of accessing state directly:
```javascript
// ✅ Good
const cartItems = useSelector(selectCartItems);

// ❌ Bad
const cartItems = useSelector(state => state.cart.items);
```

### 2. Handle Loading States
Always handle loading and error states in your components:
```javascript
const { loading, error, data } = useSelector(state => state.someSlice);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 3. Use Async Thunks for API Calls
Use async thunks for all API calls to handle loading states and errors properly:
```javascript
// ✅ Good - Using async thunk
dispatch(fetchProducts());

// ❌ Bad - Direct API call in component
const fetchData = async () => {
  const response = await fetch('/api/products');
  // Handle response
};
```

### 4. Optimize Re-renders
Use specific selectors to avoid unnecessary re-renders:
```javascript
// ✅ Good - Specific selector
const cartTotal = useSelector(selectCartTotal);

// ❌ Bad - Selects entire cart state
const cart = useSelector(state => state.cart);
```

### 5. Clear Errors
Always clear errors when appropriate:
```javascript
useEffect(() => {
  dispatch(clearError());
}, [dispatch]);
```

## Debugging

### Redux DevTools
Install Redux DevTools browser extension to debug your Redux state and actions.

### State Logging
You can log the current state in any component:
```javascript
const state = useSelector(state => state);
console.log('Current Redux State:', state);
```

### Action Logging
Add middleware to log all actions:
```javascript
// In store/index.js
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  return result;
};
```

## Migration Guide

### From Local State to Redux
1. Identify state that needs to be shared across components
2. Create appropriate slice for the state
3. Replace `useState` with Redux selectors and actions
4. Update components to use `useDispatch` and `useSelector`

### Example Migration
```javascript
// Before - Local state
const [cartItems, setCartItems] = useState([]);

// After - Redux state
const cartItems = useSelector(selectCartItems);
const dispatch = useDispatch();

const addToCart = (item) => {
  dispatch(addToCart(item));
};
```

## Testing

### Testing Redux Components
```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MyComponent from './MyComponent';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      // Add other reducers as needed
    },
    preloadedState: initialState,
  });
};

test('renders component with Redux', () => {
  const store = createTestStore({
    auth: { isAuthenticated: true, user: { email: 'test@example.com' } }
  });

  render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );

  expect(screen.getByText('test@example.com')).toBeInTheDocument();
});
```

## Common Patterns

### 1. Conditional Rendering Based on Auth
```javascript
const { isAuthenticated } = useSelector(state => state.auth);

return (
  <div>
    {isAuthenticated ? <AuthenticatedContent /> : <SignInPrompt />}
  </div>
);
```

### 2. Loading States
```javascript
const { loading, error, data } = useSelector(state => state.someSlice);

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <DataDisplay data={data} />;
```

### 3. Optimistic Updates
```javascript
const handleAddToCart = (product) => {
  // Optimistically add to cart
  dispatch(addToCart(product));
  
  // Then sync with server
  dispatch(syncCartWithServer());
};
```

This Redux implementation provides a solid foundation for state management in your healthcare application. Follow these patterns and best practices to maintain clean, predictable, and scalable code. 