const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, deliveryAddress, paymentMethod } = req.body;
    const order = new Order({
      customer: req.user._id,
      items, totalPrice, deliveryAddress, paymentMethod
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch(error) { res.status(500).json({message: error.message}); }
};

// @desc    Admin assigns order to multiple agents
// @route   PUT /api/orders/:id/assign
const assignOrder = async (req, res) => {
  try {
    const { agentIds } = req.body; // Array of User IDs with 'delivery' role
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({message: "Order not found"});
    if (order.status !== 'pending') return res.status(400).json({message: "Order already accepted or delivered"});
    
    order.assignedAgents = agentIds;
    await order.save();
    res.json(order);
  } catch(error) { res.status(500).json({message: error.message}); }
};

// @desc    Agent accepts order 
// @route   PUT /api/orders/:id/accept
const acceptOrder = async (req, res) => {
  try {
    const agentId = req.user._id;
    // Atomic update to prevent race conditions!
    const order = await Order.findOneAndUpdate(
       { _id: req.params.id, status: 'pending', assignedAgents: { $in: [agentId] } },
       { $set: { status: 'accepted', acceptedBy: agentId } },
       { new: true }
    );
    if (!order) {
        return res.status(400).json({message: "Order is no longer available, was already accepted, or you weren't assigned."});
    }
    res.json({ message: "Order Successfully Accepted!", order });
  } catch(error) { res.status(500).json({message: error.message}); }
};

// @desc    Mark order delivered
// @route   PUT /api/orders/:id/deliver
const markDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.acceptedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Not authorized to deliver this order."});
        }
        order.status = 'delivered';
        await order.save();

        // Increment delivery agent total deliveries
        await User.findByIdAndUpdate(req.user._id, { $inc: { total_deliveries: 1 } });
        res.json(order);
    } catch(error) { res.status(500).json({message: error.message}); }
};

// @desc    Rate Delivery Agent
// @route   POST /api/orders/:id/rate
const rateAgent = async (req, res) => {
    try {
        const { rating } = req.body; // 1 to 5
        if (rating < 1 || rating > 5) return res.status(400).json({message: "Invalid rating value"});
        
        const order = await Order.findById(req.params.id).populate('acceptedBy');
        if (!order || order.status !== 'delivered' || order.customer.toString() !== req.user._id.toString()) {
            return res.status(400).json({message: "Can only rate your own completed orders."});
        }
        if (order.rating_given) return res.status(400).json({message: "Already rated. "});

        order.rating_given = rating;
        await order.save();

        // Calculate moving average
        const agent = await User.findById(order.acceptedBy._id);
        const deliveriesTriggered = agent.total_deliveries || 1;
        const currentAvg = agent.average_rating || 0;
        
        // Simple incremental average math
        agent.average_rating = ((currentAvg * (deliveriesTriggered - 1)) + rating) / deliveriesTriggered;
        await agent.save();

        res.json({ message: "Agent properly rated", new_average: agent.average_rating });
    } catch(error) { res.status(500).json({message: error.message}); }
};

// @desc    Create GPay URL
// @route   GET /api/orders/:id/payment-qr
const generateGPayQR = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({message: "Order not found"});
        // Generate Standard UPI string format
        const upiString = `upi://pay?pa=restaurant@okaxis&pn=DeliveryApp&am=${order.totalPrice}&cu=INR&tn=Order_${order._id}`;
        res.json({ upiString, message: "Use any QR generator library strictly pointing to this string." });
    } catch(error) { res.status(500).json({message: error.message}); }
};

// @desc    Mark as paid (simulated webhook/callback)
// @route   PUT /api/orders/:id/pay
const confirmPayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.paymentStatus = 'paid';
        await order.save();
        res.json({ message: "Payment verified natively." , order });
    } catch(error) { res.status(500).json({message: error.message}); }
};

module.exports = { createOrder, assignOrder, acceptOrder, markDelivered, rateAgent, generateGPayQR, confirmPayment };
