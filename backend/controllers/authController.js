const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersafejwtkey123', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, dob, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name, dob, email, phone, password, role
    });

    if (user) {
      res.status(201).json({
        message: 'User registered. Please verify OTP.',
        user_id: user._id,
        simulated_otp: '1234' // Mocking OTP
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email is already registered.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { user_id, otp } = req.body;
    if (otp === '1234') { 
      const user = await User.findById(user_id);
      if(user) {
          user.verification_status = 'Verified';
          await user.save();
          res.json({ message: 'OTP Verified successfully', token: generateToken(user._id) });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verification_status: user.verification_status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate with Google OAuth
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { tokenId, role } = req.body;
    
    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, sub } = ticket.getPayload();
    let user = await User.findOne({ email });

    // If user not exists, create user in MongoDB automatically based on requested role
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        role: role || 'customer', // Store role (Admin, Delivery, Customer)
        verification_status: 'Verified'
      });
    } else {
        // Ensure googleId is synced if they previously logged in via standard email
        if (!user.googleId) {
            user.googleId = sub;
            await user.save();
        }
    }

    // Generate JWT token after mapping
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verification_status: user.verification_status,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401).json({ message: 'Google Authentication Failed', error: error.message });
  }
};

module.exports = { registerUser, verifyOTP, loginUser, googleLogin };
