const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateLocation, getSmartSuggestions } = require('../controllers/deliveryController');

router.put('/location', protect, updateLocation);
router.get('/suggest', getSmartSuggestions); // Admin route to find nearest best agent

module.exports = router;
