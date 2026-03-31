const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  addons: {
    tv: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    dj_party: { type: Boolean, default: false },
    firecamp: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    luggage_assistant: { type: Boolean, default: false },
    swimming_pool: { type: Boolean, default: false },
    medical_support: { type: Boolean, default: false },
    parlor: { type: Boolean, default: false },
    saloon: { type: Boolean, default: false },
    food_court: { type: Boolean, default: false },
    tourist_guides: { type: Boolean, default: false },
    meditation_session: { type: Boolean, default: false }
  },
  event_details: {
    guests: { type: Number },
    type: { type: String, enum: ['Party', 'Marriage', 'Corporate', 'Birthday', 'Lecture', 'Decoration', 'Other'] },
    sitting_arrangement: { type: Number, default: 0 },
    food_catering_tier: { type: String, enum: ['None', 'Basic Menu', 'Gold Menu', 'Diamond Buffet'], default: 'None' }
  },
  room_config: {
    bed_type: { type: String, enum: ['Single', 'Double', 'None'], default: 'None' },
    air_conditioning: { type: Boolean, default: false },
    smart_ac_automation: { type: Boolean, default: false },
    heater: { type: Boolean, default: false },
    automatic_adjustable_ac: { type: Boolean, default: false },
    voice_control: { type: Boolean, default: false },
    elevator_access: { type: Boolean, default: false }
  },
  couple_addons: {
    decoration: { type: Boolean, default: false },
    candle_light_dinner: { type: Boolean, default: false },
    music_system: { type: Boolean, default: false },
    proposal_setup: { type: Boolean, default: false },
    midnight_surprise: { type: Boolean, default: false },
    indoor_dining: { type: Boolean, default: false },
    spa_access: { type: Boolean, default: false },
    couple_games: { type: Boolean, default: false }
  },
  family_addons: {
    extra_bed_children: { type: Boolean, default: false },
    extra_bed_elders: { type: Boolean, default: false },
    baby_sitting: { type: Boolean, default: false },
    indoor_games: { type: Boolean, default: false },
    outdoor_games: { type: Boolean, default: false }
  },
  tour_addons: {
    guide: { type: Boolean, default: false },
    guide_days: { type: Number, default: 0 },
    park_facilities: { type: Boolean, default: false }
  },
  elder_addons: {
    wheelchair: { type: Boolean, default: false }
  },
  tent_addons: {
    stargazing: { type: Boolean, default: false }
  },
  parking_details: {
    required: { type: Boolean, default: false },
    assigned_slot: { type: Number, default: null }
  },
  total_amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Booked', 'Checked-in', 'Checked-out', 'Verified'], 
    default: 'Booked' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
