const mongoose = require('mongoose');
const Room = require('./models/Room');

require('dotenv').config();
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_management';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const tentTypes = [
  { type: 'Dome Tent', theme: 'Minimalist Stargazer Dome', category: 'Tent', price_per_hour: 400, image: 'https://images.unsplash.com/photo-1536881779344-9fbb3dbbbf1f?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Cabin Tent', theme: 'Rustic Wilderness Cabin', category: 'Tent', price_per_hour: 500, image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Glamping Tent', theme: 'Luxury Glamping Suite', category: 'Tent', price_per_hour: 800, image: 'https://images.unsplash.com/photo-1627027150531-158d6b88950d?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Romantic Tent', theme: 'Couple\'s Romantic Harbor', category: 'Tent', price_per_hour: 900, image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Tree Tent', theme: 'Suspended Treehouse Tent', category: 'Tent', price_per_hour: 600, image: 'https://images.unsplash.com/photo-1631589578160-59fdbb430da4?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Floating Tent', theme: 'Aqua Floating Paradise', category: 'Tent', price_per_hour: 700, image: 'https://images.unsplash.com/photo-1582269438706-056b26af47e1?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Family Tent', theme: 'Spacious Multi-Room Tent', category: 'Tent', price_per_hour: 850, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Safari Tent', theme: 'Wild Safari Expedition Base', category: 'Tent', price_per_hour: 750, image: 'https://images.unsplash.com/photo-1534063688126-dfdf42c3eb2f?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Geodesic Tent', theme: 'Geometric Geodesic Dome', category: 'Tent', price_per_hour: 650, image: 'https://images.unsplash.com/photo-1549643444-2458a2d1031c?auto=format&fit=crop&q=80', is_available: true },
  { type: 'Wellness Tent', theme: 'Zen Meditation Retreat Tent', category: 'Tent', price_per_hour: 550, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', is_available: true }
];

const seedDB = async () => {
    try {
        await Room.deleteMany({ category: 'Tent' });
        await Room.insertMany(tentTypes);
        console.log('Successfully seeded 10 distinct Tent Variations!');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
