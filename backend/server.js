require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ["ESCROW_EMAIL", "ESCROW_API_KEY", "ESCROW_API_BASE"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Escrow.com configuration
const ESCROW_API_BASE = process.env.ESCROW_API_BASE;
const ESCROW_EMAIL = process.env.ESCROW_EMAIL;
const ESCROW_API_KEY = process.env.ESCROW_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Products database (replace with real DB in production)
const products = [
  {
    id: 1,
    name: "Premium Laptop",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    description:
      "Noise-canceling wireless headphones with 30-hour battery life",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
];

// Escrow transaction helper
async function createEscrowTransaction(productId, buyerEmail) {
  const product = products.find((p) => p.id === Number(productId));

  if (!product) {
    throw new Error("Product not found");
  }

  try {
    const payload = {
      parties: [
        {
          role: "buyer",
          customer: buyerEmail,
        },
        {
          role: "seller",
          customer: ESCROW_EMAIL,
        },
      ],
      currency: "usd",
      description: product.name,
      items: [
        {
          title: product.name,
          description: product.description,
          type: "general_merchandise",
          inspection_period: 259200,
          quantity: 1,
          schedule: [
            {
              amount: product.price,
              payer_customer: buyerEmail,
              beneficiary_customer: ESCROW_EMAIL,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `${ESCROW_API_BASE}/2017-09-01/transaction`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: ESCROW_EMAIL,
          password: ESCROW_API_KEY,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Escrow API Error:", error.response?.data || error.message);

    throw new Error("Failed to create escrow transaction");
  }
}

// Routes
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  res.json(product);
});

app.post("/api/create-escrow", async (req, res) => {
  try {
    const { productId, buyerEmail } = req.body;

    if (!productId || !buyerEmail) {
      return res.status(400).json({
        error: "Product ID and buyer email are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(buyerEmail)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const escrowData = await createEscrowTransaction(productId, buyerEmail);

    const buyerParty = escrowData.parties?.find(
      (party) => party.role === "buyer",
    );

    const checkoutUrl = buyerParty?.next_step || null;

    console.log(`Escrow transaction created: ${escrowData.id}`);

    res.json({
      success: true,
      transactionId: escrowData.id,
      checkoutUrl,
      message: "Escrow transaction created successfully",
    });
  } catch (error) {
    console.error("Create escrow error:", error.message);

    res.status(500).json({
      error: "Failed to create escrow transaction",
    });
  }
});

// Escrow webhook
app.post("/api/webhook/escrow", (req, res) => {
  const event = req.body;

  console.log(`Webhook received: ${event.event_type || "unknown"}`);

  switch (event.event_type) {
    case "transaction.funded":
      console.log(`Transaction funded: ${event.transaction_id}`);
      break;

    case "transaction.shipped":
      console.log(`Transaction shipped: ${event.transaction_id}`);
      break;

    case "transaction.received":
      console.log(`Transaction received: ${event.transaction_id}`);
      break;

    case "transaction.completed":
      console.log(`Transaction completed: ${event.transaction_id}`);
      break;

    default:
      console.log("Unhandled webhook event");
  }

  res.status(200).json({
    received: true,
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
