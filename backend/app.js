const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware (VIVA Requirements)
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(xss());           // Prevent XSS Attacks
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('Hotel Booking API is running...');
});

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');

// 🚀 VIVA Delivery Subsystem Integrations
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);

// Smart Delivery Features Routing!
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);

app.get('/', (req, res) => {
  res.send('Hotel Booking API is running...');
});

module.exports = app;
