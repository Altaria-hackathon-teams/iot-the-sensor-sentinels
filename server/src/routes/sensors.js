const express = require('express');
const router = express.Router();
const { broadcast } = require('../services/socket-handler');
const aiService = require('../services/ai-service');

// --- @route   POST /api/sensors/data ---
// Endpoint for hardware to send sensor data via HTTP POST
router.post('/data', (req, res) => {
    try {
        const { soil, distance, flow, temp, pH, phosphorus, nitrogen, humidity } = req.body;
        
        // Generate AI insights based on the incoming data
        const insights = aiService.generateInsights(req.body);

        const sensorData = {
            type: 'SENSOR_UPDATE',
            data: {
                soil,
                distance,
                flow,
                temp,
                pH,
                phosphorus,
                nitrogen,
                humidity,
                insights,
                timestamp: new Date().toISOString()
            }
        };

        console.log('📡 Received sensor data via HTTP:', sensorData.data);

        // Broadcast to all connected WebSocket clients (React frontend)
        broadcast(sensorData);

        res.status(200).json({ status: 'success', message: 'Data received and broadcasted' });
    } catch (err) {
        console.error('❌ Error processing sensor data:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
