const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');

dotenv.config();

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for Mega Seeding...');

    // Delete existing to allow clean rebuild
    await User.deleteMany({ email: { $in: ['admin@hotel.com', 'security@hotel.com', 'user@hotel.com'] } });
    await Room.deleteMany({});

    // 1. RE-SEED USERS
    const users = [
      { name: 'Super Admin', email: 'admin@hotel.com', phone: '1234567890', password: 'password123', role: 'admin', verification_status: 'Verified' },
      { name: 'Security Officer', email: 'security@hotel.com', phone: '1234567891', password: 'password123', role: 'security', verification_status: 'Verified' },
      { name: 'Standard Guest', email: 'user@hotel.com', phone: '1234567892', password: 'password123', role: 'user', verification_status: 'Verified' }
    ];

    for (const u of users) {
        const user = new User(u);
        await user.save();
    }
    console.log('Users Authenticated');

    // 2. RE-SEED ROOMS (Massive Database Architecture Update - INR prices)
    const rooms = [
      { type: 'Luxury Camp', theme: 'Glamping Pine Tent', category: 'Tent', price_per_hour: 1200, image: '/tent_room.png' },
      { type: 'Couples Suite', theme: 'Romantic Jacuzzi Skyline', category: 'Couple', price_per_hour: 3200, image: '/couple_room.png' },
      { type: 'Family Estate', theme: 'Spacious Multi-Bed Sunlight', category: 'Family', price_per_hour: 2000, image: '/family_room.png' },
      { type: 'Accessible Standard', theme: 'Elder Friendly Comfort', category: 'Elder', price_per_hour: 1600, image: '/elder_room.png' },
      { type: 'Transit Pod', theme: 'Traveller Minimalist Hub', category: 'Traveller', price_per_hour: 400, image: '/traveller_room.png' },
      { type: 'Grand Ballroom', theme: 'Event Hall Marriage Floor', category: 'EventHall', price_per_hour: 40000, image: '/event_hall.png' }
    ];

    await Room.insertMany(rooms);
    console.log('Rooms Indexed and Categorized');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAll();
