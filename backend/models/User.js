const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: { type: String }, // Optional for Google OAuth users
  password: { type: String }, // Optional for Google Auth
  googleId: { type: String }, // For Google OAuth tracking
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'delivery', 'security'], 
    default: 'customer' 
  },
  // Delivery Feature Enhancements (Extra Marks)
  total_deliveries: { type: Number, default: 0 },
  average_rating: { type: Number, default: 0 },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  id_proof: { type: String },
  verification_status: { 
    type: String, 
    enum: ['Pending', 'Verified'], 
    default: 'Pending' 
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
