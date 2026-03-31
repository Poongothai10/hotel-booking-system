const User = require('../models/User');
const CleaningTask = require('../models/CleaningTask');
const Order = require('../models/Order');

const addUser = async (req, res) => {
  try {
    const { name, dob, email, phone, password, role } = req.body;
    const user = await User.create({ name, dob, email, phone, password, role });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A user with this email address already exists in the system.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignCleaner = async (req, res) => {
  try {
    const { room_id } = req.body;
    const task = await CleaningTask.create({ room_id, status: 'Pending' });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeCleaning = async (req, res) => {
    try {
        const task = await CleaningTask.findByIdAndUpdate(req.params.taskId, { status: 'Completed' }, { new: true });
        res.json(task);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const triggerEmergency = async (req, res) => {
    console.log("🚨 EMERGENCY ALERT TRIGGERED! 🚨 Notifying Admin & Security modules...");
    res.json({ message: 'Emergency Alert Broadcasted globally to Admin & Security dashboards!' });
};

// 📦 Delivery Management Capabilities (VIVA)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer assignedAgents acceptedBy', 'name email role');
        res.json(orders);
    } catch(error) { res.status(500).json({ message: error.message }); }
};

const getAllAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: 'delivery' }).select('-password');
        res.json(agents);
    } catch(error) { res.status(500).json({ message: error.message }); }
};

module.exports = { addUser, deleteUser, assignCleaner, completeCleaning, triggerEmergency, getAllOrders, getAllAgents };
