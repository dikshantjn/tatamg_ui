# Payment Integration - Razorpay

This directory contains the payment integration services for Vedika Healthcare application using Razorpay payment gateway.

## Files

- `product-order-payment.service.js` - Main payment service for processing product orders
- `README.md` - This documentation file

## Setup

### 1. Environment Variables

Create a `.env` file in your project root and add the following variables:

```env
# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_uMMypIJ2X2bn1N
REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# API Configuration
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

### 2. Backend API Endpoints Required

The payment service expects the following backend endpoints:

#### Create Order
```
POST /api/orders/create
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "amount": 21000, // Amount in paise
  "currency": "INR",
  "receipt": "ORD-2024-001",
  "notes": {
    "orderId": "ORD-2024-001",
    "deliveryAddress": "...",
    "items": "..."
  }
}
```

#### Verify Payment
```
POST /api/payments/verify
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx",
  "orderId": "ORD-2024-001",
  "amount": 210.00
}
```

#### Update Order Status
```
PUT /api/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "status": "PAID",
  "paymentId": "pay_xxx",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Usage

### Basic Payment Processing

```javascript
import { ProductOrderPaymentService } from '../services/payment/product-order-payment.service';

const orderData = {
  orderId: 'ORD-2024-001',
  total: 210.00,
  items: [...],
  deliveryAddress: {...}
};

// Process payment
await ProductOrderPaymentService.processPayment(
  orderData,
  // Success callback
  (paymentResult) => {
    console.log('Payment successful:', paymentResult);
  },
  // Failure callback
  (errorMessage) => {
    console.error('Payment failed:', errorMessage);
  }
);
```

### Payment History

```javascript
// Get payment history
const history = await ProductOrderPaymentService.getPaymentHistory();

// Get specific payment details
const paymentDetails = await ProductOrderPaymentService.getPaymentDetails('pay_xxx');
```

## Features

- ✅ Secure API key management
- ✅ Automatic Razorpay SDK loading
- ✅ Payment validation and error handling
- ✅ Order creation and verification
- ✅ Payment history tracking
- ✅ User profile integration
- ✅ Responsive payment modal
- ✅ Loading states and notifications

## Security Notes

1. **Never expose your Razorpay secret key in frontend code**
2. **Always verify payments on your backend**
3. **Use HTTPS in production**
4. **Implement proper authentication**
5. **Validate all payment data**

## Error Handling

The service includes comprehensive error handling for:
- Network errors
- Invalid amounts
- Payment failures
- Order creation failures
- Payment verification failures
- User cancellations
- Timeouts

## Testing

For testing, use Razorpay's test mode with test cards:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

## Production Checklist

- [ ] Set up environment variables
- [ ] Configure backend API endpoints
- [ ] Implement webhook handling
- [ ] Set up proper error logging
- [ ] Test payment flow end-to-end
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerts 