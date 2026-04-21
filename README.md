# Escrow Shop - E-Commerce Platform with Escrow.com Integration

A full-stack e-commerce application with secure escrow payment integration using Escrow.com API.

![Dashboard Preview](https://res.cloudinary.com/dhyo79gy1/image/upload/v1776769465/escrow_xmosxw.jpg)

## 🏗️ Architecture

- **Frontend**: React with Bootstrap 5
- **Backend**: Node.js with Express
- **Payment**: Escrow.com API integration
- **Styling**: Bootstrap 5 + Bootstrap Icons

## 📋 Features

- ✅ Two-product storefront with responsive design
- ✅ Real Escrow.com API integration
- ✅ Secure payment flow with buyer protection
- ✅ Email-based transaction initiation
- ✅ Webhook support for payment status updates
- ✅ Bootstrap UI with modern design

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Escrow.com API credentials (see setup below)

### 1. Get Escrow.com API Credentials

1. Visit [Escrow.com Developers](https://www.escrow.com/developers)
2. Sign up for a developer account
3. Create an application to get your API key
4. Use sandbox mode for testing

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your credentials
# ESCROW_EMAIL=your-email@example.com
# ESCROW_API_KEY=your-api-key-here

# Start the server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
escrow-shop/
├── backend/
│   ├── server.js          # Express server with Escrow API integration
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment variables template
│   └── .env              # Your credentials (create this)
├── frontend/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.js  # Product card component
│   │   ├── App.js        # Main application component
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles
│   └── package.json      # Frontend dependencies
└── README.md
```

## 🔌 API Endpoints

### Backend API

#### GET `/api/products`
Get all products
```json
[
  {
    "id": 1,
    "name": "Premium Laptop",
    "description": "High-performance laptop...",
    "price": 1299.99,
    "image": "https://..."
  }
]
```

#### GET `/api/products/:id`
Get single product by ID

#### POST `/api/create-escrow`
Create escrow transaction
```json
{
  "productId": 1,
  "buyerEmail": "buyer@example.com"
}
```

Response:
```json
{
  "success": true,
  "transactionId": "12345",
  "checkoutUrl": "https://escrow.com/checkout/...",
  "message": "Escrow transaction created successfully"
}
```

#### POST `/api/webhook/escrow`
Webhook endpoint for Escrow.com notifications

## 🔐 Escrow.com Integration Details

### How It Works

1. **User initiates purchase**: Clicks "Buy with Escrow" and enters email
2. **Backend creates transaction**: Calls Escrow.com API to create transaction
3. **User redirected**: Opens Escrow.com checkout page in new tab
4. **Payment process**: User completes payment on Escrow.com
5. **Funds held**: Money held securely by Escrow.com
6. **Seller ships**: Item is shipped to buyer
7. **Buyer approves**: After receiving item, buyer approves transaction
8. **Funds released**: Escrow.com releases payment to seller

### Transaction Flow

```
┌─────────┐      ┌─────────┐      ┌─────────────┐      ┌────────┐
│  Buyer  │─────▶│  React  │─────▶│   Node.js   │─────▶│Escrow  │
│         │      │   App   │      │   Backend   │      │  API   │
└─────────┘      └─────────┘      └─────────────┘      └────────┘
    │                                      │                  │
    │           Redirect to checkout       │                  │
    │◀─────────────────────────────────────┤                  │
    │                                      │                  │
    │         Complete payment             │                  │
    ├─────────────────────────────────────────────────────────▶│
    │                                      │                  │
    │                Webhook notifications │                  │
    │                                      │◀─────────────────│
```

### API Configuration

The integration uses:
- **API Base URL**: `https://api.escrow.com`
- **API Version**: `2017-09-01`
- **Authentication**: HTTP Basic Auth (email + API key)
- **Currency**: USD
- **Inspection Period**: 3 days (259200 seconds)

## 🎨 Frontend Features

### Components

**ProductCard**
- Displays product information
- Email form for buyer identification
- Loading states during transaction creation
- Bootstrap styling with hover effects

**App**
- Product listing
- Notification system
- Loading states
- How-it-works information banner
- Responsive layout

### Styling
- Bootstrap 5 for responsive design
- Bootstrap Icons for UI elements
- Custom hover animations
- Mobile-friendly layout

## 🔧 Configuration

### Environment Variables (Backend)

Create `backend/.env`:
```env
ESCROW_EMAIL=your-email@example.com
ESCROW_API_KEY=your-api-key-here
PORT=5000
NODE_ENV=development
```

### Proxy Configuration

The frontend is configured to proxy API requests to the backend via `package.json`:
```json
"proxy": "http://localhost:5000"
```

## 🧪 Testing

### Sandbox Mode
Use Escrow.com's sandbox environment for testing:
- No real money transactions
- Full API functionality
- Webhook testing support

### Test the Flow
1. Start both backend and frontend
2. Click "Buy with Escrow" on any product
3. Enter a test email address
4. Verify transaction created in backend logs
5. Check if checkout URL is generated

## 🚢 Deployment

### Backend
- Deploy to Heroku, AWS, DigitalOcean, or similar
- Set environment variables in hosting platform
- Configure webhook URL in Escrow.com dashboard

### Frontend
- Build: `npm run build`
- Deploy to Netlify, Vercel, or similar
- Update API endpoint from localhost to production URL

## 📝 Important Notes

### Security
- Never commit `.env` file
- Use environment variables for all credentials
- Implement rate limiting in production
- Add input validation and sanitization
- Use HTTPS in production

### Escrow.com Requirements
- Email validation is required
- All transactions must specify inspection period
- Webhook URL must be publicly accessible
- API credentials are sensitive - keep secure

### Production Considerations
- Implement proper database (MongoDB, PostgreSQL)
- Add user authentication
- Implement proper error logging
- Add transaction tracking
- Set up webhook signature verification
- Implement retry logic for API calls

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 5000 is available
- Verify Node.js is installed
- Run `npm install` in backend directory

**Frontend won't connect to backend**
- Ensure backend is running on port 5000
- Check proxy configuration in `package.json`
- Clear browser cache

**Escrow API errors**
- Verify API credentials in `.env`
- Check if using correct API endpoint
- Ensure email format is valid
- Check Escrow.com API status

## 📚 Resources

- [Escrow.com API Documentation](https://www.escrow.com/developers)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [Bootstrap Documentation](https://getbootstrap.com)

## 📄 License

MIT License - Feel free to use this for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This is a demonstration application. Before using in production:
- Implement proper security measures
- Add comprehensive error handling
- Set up proper logging and monitoring
- Review and comply with Escrow.com terms of service
- Implement proper data protection measures
