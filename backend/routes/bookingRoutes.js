const express = require('express');
const router = express.Router();
const { createBooking, getBookings, checkIn, checkOut, getParkingAvailability } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/parking/slots', protect, getParkingAvailability);
router.post('/', protect, createBooking);
router.get('/', protect, authorizeRoles('admin', 'security'), getBookings);
router.put('/check-in/:id', protect, checkIn);
router.put('/check-out/:id', protect, checkOut);

module.exports = router;
