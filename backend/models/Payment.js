const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
