const Booking = require('../models/Booking');
const Room = require('../models/Room');
const CleaningTask = require('../models/CleaningTask');
const ParkingSlot = require('../models/ParkingSlot');

// Seed parking slots if empty (runs on startup)
const checkAndSeedParking = async () => {
    try {
        const count = await ParkingSlot.countDocuments();
        if (count === 0) {
            let slots = [];
            for (let i = 1; i <= 50; i++) {
                slots.push({ slot_number: i, is_occupied: false });
            }
            await ParkingSlot.insertMany(slots);
            console.log("CRITICAL: Initialized 50 empty physical Parking Slots into Database.");
        }
    } catch(err) { console.error("Parking Init Error:", err); }
};
checkAndSeedParking();

const getParkingAvailability = async (req, res) => {
    try {
        const slotsCount = await ParkingSlot.countDocuments({ is_occupied: false });
        res.json({ available_slots: slotsCount, total_capacity: 50 });
    } catch (err) {
        res.status(500).json({ message: "Parking Reader Error" });
    }
};

const createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out, addons, event_details, room_config, family_addons, tour_addons, couple_addons, parking_details } = req.body;
    
    // Strict Verification
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ message: 'Room not found in Catalog' });

    // Mathematical Hourly Calculation Strategy
    const start = new Date(check_in);
    const end = new Date(check_out);
    const diffMs = end - start;
    if (diffMs <= 0) return res.status(400).json({ message: 'Check-out time must be chronologically after the Check-in time.' });
    
    // Convert ms to absolute hours (rounded up)
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); 

    // Compute Base Line + Dynamic Addons (In Rupees)
    let total_amount = room.price_per_hour * diffHours;
    if (addons?.tv) total_amount += 800;
    if (addons?.wifi) total_amount += 400;
    if (addons?.dj_party) total_amount += 16000;
    if (addons?.firecamp) total_amount += 4000;
    if (addons?.food) total_amount += 7200;

    // Shared/Global Modifiers
    if (room_config?.air_conditioning) total_amount += (50 * diffHours); // AC = ₹50/hr
    if (room_config?.smart_ac_automation) total_amount += (100 * diffHours); // Smart IoT AC = ₹100/hr
    if (room_config?.bed_type === 'Double') total_amount += 200; // Flat Double Upcharge
    
    // Global Tourism & Park Features (Available to all)
    if (tour_addons?.park_facilities) total_amount += 500;
    if (tour_addons?.guide) {
        let guideDays = Number(tour_addons.guide_days) || 1;
        total_amount += (guideDays * 1500); 
    }

    // Specific Demographics Check
    if (room.category === 'Family') {
        if (family_addons?.extra_bed_children) total_amount += 300;
        if (family_addons?.extra_bed_elders) total_amount += 300;
    }

    if (room.category === 'Couple') {
        if (couple_addons?.candle_light_dinner) total_amount += 2000;
        if (couple_addons?.proposal_setup) total_amount += 5000;
        if (couple_addons?.midnight_surprise) total_amount += 1500;
        if (couple_addons?.spa_access) total_amount += 4000;
        if (couple_addons?.decoration) total_amount += 1000;
        if (couple_addons?.music_system) total_amount += 500;
        if (couple_addons?.indoor_dining) total_amount += 1200;
        if (couple_addons?.couple_games) total_amount += 800;
    }

    if (room.category === 'EventHall') {
        let sitting = Number(event_details?.sitting_arrangement) || 0;
        if (event_details?.food_catering_tier === 'Basic Menu') total_amount += (sitting * 200);
        if (event_details?.food_catering_tier === 'Gold Menu') total_amount += (sitting * 500);
        if (event_details?.food_catering_tier === 'Diamond Buffet') total_amount += (sitting * 1200);
    }

    // Parking Hardware Allocation Verification
    let assignedSlot = null;
    if (parking_details?.required) {
        assignedSlot = await ParkingSlot.findOne({ is_occupied: false });
        if (!assignedSlot) {
            return res.status(400).json({ message: 'Parking is completely full. Please utilize external municipal slots near the facility.' });
        }
        total_amount += 200; // IoT Tracking fee
    }
    
    const booking = new Booking({
      user_id: req.user._id,
      room_id,
      check_in: start,
      check_out: end,
      addons: addons || {},
      event_details: room.category === 'EventHall' ? event_details : undefined,
      room_config: room_config || { bed_type: 'None', air_conditioning: false, smart_ac_automation: false },
      family_addons: room.category === 'Family' ? family_addons : undefined,
      couple_addons: room.category === 'Couple' ? couple_addons : undefined,
      tour_addons: tour_addons || undefined,
      parking_details: { required: parking_details?.required || false, assigned_slot: null },
      total_amount,
      status: 'Booked'
    });
    
    await booking.save();

    // Lock the hardware slot securely to the booking ID after generation
    if (assignedSlot) {
        assignedSlot.is_occupied = true;
        assignedSlot.booking_id = booking._id;
        await assignedSlot.save();
        
        booking.parking_details.assigned_slot = assignedSlot.slot_number;
        await booking.save();
    }
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user_id', 'name email').populate('room_id', 'theme type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // STRICT FLOW CAPTURE
    const cleaningTask = await CleaningTask.findOne({ room_id: booking.room_id }).sort({ created_at: -1 });
    if (!cleaningTask || cleaningTask.status !== 'Completed') {
        return res.status(400).json({ message: 'Check-in blocked: Room cleaning has not been documented as Completed by staff.' });
    }

    if (booking.status !== 'Verified') {
        return res.status(403).json({ message: 'Check-in blocked: Security role has not structurally verified the ID proof for this booking yet.' });
    }

    booking.status = 'Checked-in';
    await booking.save();
    
    await Room.findByIdAndUpdate(booking.room_id, { is_available: false });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = 'Checked-out';
    await booking.save();

    await Room.findByIdAndUpdate(booking.room_id, { is_available: true });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, checkIn, checkOut, getParkingAvailability };
