const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createOrder, 
  assignOrder, 
  acceptOrder, 
  markDelivered, 
  rateAgent, 
  generateGPayQR, 
  confirmPayment 
} = require('../controllers/orderController');

// Standard
router.post('/', protect, createOrder);

// Assignment flow
router.put('/:id/assign', protect, assignOrder);   // Add admin protect locally or securely here
router.put('/:id/accept', protect, acceptOrder);
router.put('/:id/deliver', protect, markDelivered);

// Payment & Ratings
router.post('/:id/rate', protect, rateAgent);
router.get('/:id/payment-qr', protect, generateGPayQR);
router.put('/:id/pay', protect, confirmPayment);

module.exports = router;
