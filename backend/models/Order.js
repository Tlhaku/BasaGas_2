const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup_address: { type: String, required: true },
    dropoff_address: { type: String, required: true },
    cylinder_size: { type: Number, enum: [2, 3, 5, 7], required: true },
    manufacturer: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Assigned', 'En-route', 'Delivered'],
      default: 'Pending',
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Order', orderSchema);
