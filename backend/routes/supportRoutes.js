const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');

// @route POST /api/support/complaint
router.post('/complaint', protect, async (req, res) => {
  try {
    const complaint = await Complaint.create({
      user_id: req.user._id,
      message: req.body.message
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/support/feedback
router.post('/feedback', protect, async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user_id: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
