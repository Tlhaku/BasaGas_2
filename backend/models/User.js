const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    role: { type: String, enum: ['customer', 'deliverer'], required: true },
    cylinder_manufacturer: { type: String },
    usual_pickup_address: { type: String },
    usual_dropoff_address: { type: String },
    starting_point: { type: String },
    password: { type: String, required: true },
    is_active_broadcast: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('User', userSchema);
