const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  theme: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Tent', 'Couple', 'Family', 'Traveller', 'Elder', 'EventHall', 'Standard'], 
    default: 'Standard' 
  },
  price_per_hour: { type: Number, required: true },
  image: { type: String, required: true },
  is_available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
