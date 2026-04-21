# Quick Start Guide

## Get Up and Running in 5 Minutes

### 1. Get Escrow.com API Access

**Option A: Sandbox (Recommended for Testing)**
- Visit: https://www.escrow.com/developers
- Sign up for a developer account
- Get your sandbox API key
- No real money involved

**Option B: Production**
- Complete Escrow.com verification
- Get production API credentials
- Real transactions

### 2. Install Dependencies

```bash
# Run the setup script
chmod +x setup.sh
./setup.sh

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Backend

Edit `backend/.env`:
```env
ESCROW_EMAIL=your-email@example.com
ESCROW_API_KEY=your-api-key-here
PORT=5000
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Test It Out

1. Open http://localhost:3000
2. Click "Buy with Escrow" on any product
3. Enter your email address
4. Click "Proceed to Escrow"
5. You'll be redirected to Escrow.com checkout

## API Testing with cURL

Test the backend directly:

```bash
# Get all products
curl http://localhost:5000/api/products

# Create escrow transaction
curl -X POST http://localhost:5000/api/create-escrow \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "buyerEmail": "test@example.com"
  }'
```

## What Happens During a Purchase?

1. **User clicks "Buy with Escrow"**
   - Email form appears

2. **User enters email and submits**
   - Frontend sends request to backend
   - Loading spinner shows

3. **Backend creates Escrow transaction**
   - Calls Escrow.com API
   - Transaction record created
   - Checkout URL generated

4. **User redirected to Escrow.com**
   - New tab opens with Escrow checkout
   - User completes payment
   - Funds held in escrow

5. **Seller ships item**
   - Buyer receives item
   - Inspection period begins (3 days)

6. **Buyer accepts or rejects**
   - If accepted: Funds released to seller
   - If rejected: Dispute process starts

## Customizing Products

Edit `backend/server.js` to add/modify products:

```javascript
const products = [
  {
    id: 1,
    name: 'Your Product Name',
    description: 'Product description',
    price: 99.99,
    image: 'https://your-image-url.com/image.jpg'
  },
  // Add more products...
];
```

## Troubleshooting

**Problem: Frontend can't connect to backend**
- Solution: Ensure backend is running on port 5000

**Problem: Escrow API returns 401**
- Solution: Check your API credentials in .env

**Problem: Email validation fails**
- Solution: Use valid email format (user@domain.com)

**Problem: CORS errors**
- Solution: Backend has CORS enabled, check if it's running

## Next Steps

- [ ] Set up webhook endpoint for production
- [ ] Add database for order tracking
- [ ] Implement user authentication
- [ ] Add more products
- [ ] Customize styling
- [ ] Deploy to production

## Support

- Escrow.com API Docs: https://www.escrow.com/developers
- API Support: developers@escrow.com
