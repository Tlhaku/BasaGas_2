const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const Order = require('./models/Order');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'basagas-secret',
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = process.env.PORT || 5000;
const DELIVERY_FEE = 45;
const BASE_PRICES = { 2: 70, 3: 104, 5: 184, 7: 250 };

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/basagas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Authentication
const USER = { email: 'customer@example.com', password: 'password123' };

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === USER.email && password === USER.password) {
    req.session.user = { email };
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login.html');
}

app.get('/tracking.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tracking.html'));
});

app.get('/api/tracking', requireAuth, (req, res) => {
  res.json({
    cylinders: [
      { id: 'CYL-001', status: 'Awaiting Pickup' },
      { id: 'CYL-002', status: 'In Transit' },
    ],
    driver: { lat: -26.2041, lng: 28.0473 },
  });
});

app.post('/api/orders', async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, cylinderSize, quantity, returnTime, paymentType } = req.body;

    const base = BASE_PRICES[cylinderSize] * quantity + DELIVERY_FEE;
    const price = paymentType === 'subscription' ? base * 0.9 : base;

    const order = await Order.create({
      pickupAddress,
      dropoffAddress,
      cylinderSize,
      quantity,
      returnTime,
      paymentType,
      price,
    });

    res.status(201).json({ id: order._id, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
