require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Escrow.com API configuration
const ESCROW_API_BASE = 'https://api.escrow-sandbox.com';
const ESCROW_EMAIL = process.env.ESCROW_EMAIL || 'oscarollie366@gmail.com';
const ESCROW_API_KEY = process.env.ESCROW_API_KEY || '5039_vyUSIgyPbObrUZzMiqfexmP6HnMOVPJ1yjpnDbQfXWRMGc2k8ZyTDyy15xEbVCtP';

// Products database (in production, use a real database)
const products = [
  {
    id: 1,
    name: 'Premium Laptop',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Noise-canceling wireless headphones with 30-hour battery life',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
  }
];

// Helper function to create escrow transaction
async function createEscrowTransaction(productId, buyerEmail) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }

  try {
    // Escrow.com API endpoint for creating transactions
    const response = await axios.post(
      `${ESCROW_API_BASE}/2017-09-01/transaction`,
      {
        parties: [
          {
            role: 'buyer',
            customer: buyerEmail
          },
          {
            role: 'seller',
            customer: ESCROW_EMAIL
          }
        ],
        currency: 'usd',
        description: product.name,
        items: [
          {
            title: product.name,
            description: product.description,
            type: 'general_merchandise',
            inspection_period: 259200, // 3 days in seconds
            quantity: 1,
            schedule: [
              {
                amount: product.price,
                payer_customer: buyerEmail,
                beneficiary_customer: ESCROW_EMAIL
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: ESCROW_EMAIL,
          password: ESCROW_API_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Escrow API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/create-escrow', async (req, res) => {
  try {
    const { productId, buyerEmail } = req.body;

    if (!productId || !buyerEmail) {
      return res.status(400).json({ 
        error: 'Product ID and buyer email are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    const escrowData = await createEscrowTransaction(productId, buyerEmail);
    
    // Extract the buyer's checkout URL from the parties array
    const buyerParty = escrowData.parties.find(p => p.role === 'buyer');
    const checkoutUrl = buyerParty?.next_step || null;
    
    // Log the full response for debugging
    console.log('✅ Escrow transaction created successfully!');
    console.log('Transaction ID:', escrowData.id);
    console.log('Checkout URL:', checkoutUrl);
    console.log('Full response:', JSON.stringify(escrowData, null, 2));

    res.json({
      success: true,
      transactionId: escrowData.id,
      checkoutUrl: checkoutUrl,
      message: 'Escrow transaction created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating escrow:', error);
    console.error('Error details:', error.response?.data);
    res.status(500).json({ 
      error: 'Failed to create escrow transaction',
      details: error.response?.data?.errors || error.message
    });
  }
});

// Webhook endpoint for Escrow.com notifications
app.post('/api/webhook/escrow', (req, res) => {
  const event = req.body;
  console.log('Escrow webhook received:', event);
  
  // Handle different event types
  switch(event.event_type) {
    case 'transaction.funded':
      console.log('Transaction funded:', event.transaction_id);
      break;
    case 'transaction.shipped':
      console.log('Item shipped:', event.transaction_id);
      break;
    case 'transaction.received':
      console.log('Item received:', event.transaction_id);
      break;
    case 'transaction.completed':
      console.log('Transaction completed:', event.transaction_id);
      break;
    default:
      console.log('Unhandled event type:', event.event_type);
  }

  res.status(200).json({ received: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
