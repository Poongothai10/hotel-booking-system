const express = require('express');
const router = express.Router();
const { 
  addUser, 
  deleteUser, 
  assignCleaner, 
  completeCleaning, 
  triggerEmergency, 
  getAllOrders, 
  getAllAgents 
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Protect all admin routes
router.use(protect, authorizeRoles('admin'));

router.post('/add-user', addUser); // offline booking init
router.delete('/user/:id', deleteUser);

router.post('/assign-cleaner', assignCleaner);
router.put('/complete-cleaning/:taskId', completeCleaning); // Could be split out for specific cleaner role later

router.post('/emergency', triggerEmergency); // Trigger global event

// VIVA Advanced Features Tracking
router.get('/orders', getAllOrders);
router.get('/agents', getAllAgents);

module.exports = router;
