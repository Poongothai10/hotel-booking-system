const express = require('express');
const router = express.Router();
const { registerUser, verifyOTP, loginUser, googleLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/google', googleLogin);

module.exports = router;
