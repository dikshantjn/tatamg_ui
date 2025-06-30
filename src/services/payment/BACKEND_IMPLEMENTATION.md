# Backend Implementation for Razorpay Integration

## Required Backend Endpoints

### 1. Create Razorpay Order Endpoint

**Route:** `POST /api/payments/create-razorpay-order`

**Request Body:**
```json
{
  "userId": "GOrt7AWP82dMYs8tVejjLyvdPyy2",
  "amount": 608335,
  "currency": "INR",
  "receipt": "receipt_1234567890",
  "notes": {
    "deliveryAddress": "{\"address\":\"123 Main Street\",\"locality\":\"Downtown\",\"city\":\"Mumbai\",\"state\":\"Maharashtra\",\"pincode\":\"400001\"}",
    "items": "[{\"id\":1,\"name\":\"Paracetamol 500mg\",\"quantity\":2,\"price\":15.00}]"
  }
}
```

**Response:**
```json
{
  "id": "order_razorpay_generated_id",
  "amount": 608335,
  "currency": "INR",
  "receipt": "receipt_1234567890",
  "notes": {
    "userId": "GOrt7AWP82dMYs8tVejjLyvdPyy2",
    "deliveryAddress": "...",
    "items": "..."
  }
}
```

### 2. Backend Implementation (Node.js/Express)

```javascript
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_uMMypIJ2X2bn1N',
  key_secret: 'your_razorpay_secret_key_here'
});

// Create Razorpay Order Endpoint
app.post('/api/payments/create-razorpay-order', async (req, res) => {
  try {
    const { userId, amount, currency, receipt, notes } = req.body;

    // Validate required fields
    if (!userId || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, amount, currency'
      });
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: receipt,
      notes: {
        userId: userId,
        ...notes
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
});

// Verify Payment Endpoint
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId, amount } = req.body;

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', 'your_razorpay_secret_key_here')
      .update(text)
      .digest('hex');

    if (signature === razorpay_signature) {
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});
```

### 3. Required Dependencies

```bash
npm install razorpay crypto
```

### 4. Environment Variables

```env
RAZORPAY_KEY_ID=rzp_test_uMMypIJ2X2bn1N
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
```

## Current Status

✅ **Frontend Implementation**: Complete with fallback for testing
✅ **Mock Payment Flow**: Working for testing without backend
⏳ **Backend Endpoints**: Need to be implemented
⏳ **Real Razorpay Integration**: Will work once backend is ready

## Testing Flow

1. **Current**: Uses mock order and simulates payment success
2. **With Backend**: Will use real Razorpay orders and payments

## Next Steps

1. Implement the backend endpoints above
2. Add your Razorpay secret key to backend environment
3. Test with real Razorpay integration
4. Remove mock payment simulation

The frontend is ready and will automatically switch to real Razorpay integration once the backend endpoints are implemented! 