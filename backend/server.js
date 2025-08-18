const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DELIVERY_FEE = 45;
const BASE_PRICES = { 2: 70, 3: 104, 5: 184, 7: 250 };

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/basagas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

app.get('/', (req, res) => {
  res.send('BasaGas API running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
