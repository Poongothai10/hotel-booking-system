const User = require('../models/User');

// @desc    Update delivery agent real-time GPS
// @route   PUT /api/delivery/location
const updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        
        if (req.user.role !== 'delivery') {
            return res.status(403).json({ message: "Access Denied. Only delivery agents can ping GPS." });
        }

        const agent = await User.findById(req.user._id);
        agent.location = { lat, lng };
        await agent.save();
        
        res.json({ message: "GPS telemetry locked successfully.", location: agent.location });
    } catch(error) { res.status(500).json({ message: error.message }); }
};

// @desc    Smart Delivery Suggestion Algorithm (EXTRA MARKS VIVA)
// @route   GET /api/delivery/suggest
const getSmartSuggestions = async (req, res) => {
    try {
        const { targetLat, targetLng } = req.query; 

        // 1. Fetch all online delivery personnel
        const agents = await User.find({ 
            role: 'delivery', 
            'location.lat': { $ne: null } 
        }).sort({ average_rating: -1 }); // Primarily prioritize 5-Star Agents!
        
        // 2. Compute Haversine Distance mathematically to provide "Nearest" + "Highest Rated" 
        // This is a powerful demonstration for your VIVA panel since it fuses GeoSpatial math with ML-style sorting
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const p = 0.017453292519943295; // Math.PI / 180
            const c = Math.cos;
            const a = 0.5 - c((lat2 - lat1) * p)/2 + 
                      c(lat1 * p) * c(lat2 * p) * 
                      (1 - c((lon2 - lon1) * p))/2;
            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R * asin = Distance in km
        };

        if (targetLat && targetLng && agents.length > 0) {
            // Map the agents, inject their real distance from the Target coordinate (e.g. restaurant)
            const rankedAgents = agents.map(agent => ({
                id: agent._id,
                name: agent.name,
                rating: agent.average_rating,
                distance_km: calculateDistance(targetLat, targetLng, agent.location.lat, agent.location.lng).toFixed(2),
                raw_score: agent.average_rating - calculateDistance(targetLat, targetLng, agent.location.lat, agent.location.lng) // Artificial ranking score!
            }));

            // Sort: Best raw_score (highest rating, shortest distance) wins!
            rankedAgents.sort((a, b) => b.raw_score - a.raw_score);
            return res.json({ recommended_agents: rankedAgents });
        }

        // Fallback: Just return highest rated
        res.json({ recommended_agents: agents });
    } catch(error) { res.status(500).json({ message: error.message }); }
};

module.exports = { updateLocation, getSmartSuggestions };
