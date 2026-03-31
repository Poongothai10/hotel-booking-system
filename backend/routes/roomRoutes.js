const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getRooms);
router.post('/', protect, authorizeRoles('admin'), createRoom);
router.put('/:id', protect, authorizeRoles('admin'), updateRoom);
router.delete('/:id', protect, authorizeRoles('admin'), deleteRoom);

module.exports = router;
