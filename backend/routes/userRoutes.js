const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Configure Multer: Accept PDF, JPG, PNG
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images and PDFs only!'));
    }
  }
}).single('id_proof');

// @route   POST /api/users/upload-id
router.post('/upload-id', protect, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Update User Document with ID Proof Path
    try {
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ message: 'User not found' });

        user.id_proof = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ message: 'File Uploaded Successfully', path: user.id_proof });
    } catch(dbErr) {
        res.status(500).json({ message: dbErr.message });
    }
  });
});

module.exports = router;
