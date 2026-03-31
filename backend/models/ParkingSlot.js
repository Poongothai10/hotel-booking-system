const mongoose = require('mongoose');

const parkingSlotSchema = mongoose.Schema({
  slot_number: {
    type: Number,
    required: true,
    unique: true,
  },
  is_occupied: {
    type: Boolean,
    default: false,
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  }
}, {
  timestamps: true,
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

module.exports = ParkingSlot;
