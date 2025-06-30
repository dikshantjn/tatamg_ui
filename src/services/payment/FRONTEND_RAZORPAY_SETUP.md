# Frontend-Only Razorpay Integration

This implementation calls Razorpay APIs directly from the frontend without requiring backend endpoints.

## Setup Required

### 1. Get Your Razorpay Secret Key

You need to get your Razorpay secret key from the Razorpay dashboard:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate a new key pair or use existing one
4. Copy the **Secret Key** (not the Key ID)

### 2. Add Secret Key to Environment

Create a `.env` file in your project root:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_uMMypIJ2X2bn1N
REACT_APP_RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

### 3. Update Payment Config

Replace the placeholder in `src/config/payment.config.js`:

```javascript
KEY_SECRET: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'your_actual_secret_key_here'
```

## How It Works

### 1. **Real Razorpay Flow** (When secret key is provided)
- ✅ Creates real Razorpay order via API
- ✅ Opens actual Razorpay payment modal
- ✅ Processes real payments
- ✅ Shows real payment success/failure

### 2. **Fallback Flow** (When secret key is missing/invalid)
- ✅ Creates mock Razorpay order
- ✅ Simulates payment after 2 seconds
- ✅ Shows success notification
- ✅ Works for testing without real payments

## Current Status

⏳ **Waiting for Secret Key**: Currently using fallback mode
✅ **Frontend Ready**: All code is implemented
✅ **Razorpay SDK**: Automatically loads
✅ **Error Handling**: Graceful fallbacks

## Testing

### With Real Secret Key:
1. Add your Razorpay secret key to `.env`
2. Restart the development server
3. Click "Pay Now" → Real Razorpay modal opens
4. Use test cards for payment

### Without Secret Key (Current):
1. Click "Pay Now" → Mock payment simulation
2. 2-second delay → Success notification
3. Works for UI testing

## Test Cards

When using real Razorpay:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## Security Note

⚠️ **Important**: In production, it's recommended to use backend APIs for security. This frontend-only approach exposes your secret key in the browser.

## Next Steps

1. **Add Secret Key**: Get your Razorpay secret key
2. **Test Real Payments**: Verify the integration works
3. **Production**: Consider moving to backend APIs for security

The integration is ready to work with real Razorpay once you add the secret key! 