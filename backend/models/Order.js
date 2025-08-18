const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  cylinderSize: { type: Number, required: true },
  quantity: { type: Number, required: true },
  returnTime: { type: Date, required: true },
  paymentType: { type: String, enum: ['subscription', 'pay-per-refill'], required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
