const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;

// In-memory store for latest sensor data
let latestSensorData = {
  flex: [0, 0, 0],
  gyro: { x: 0, y: 0, z: 0 }
};

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint from ESP32
app.post('/api/sensor', (req, res) => {
  const sensorData = req.body;
  console.log('Received Sensor Data:', sensorData);
  latestSensorData = sensorData;
  res.send(`Received Sensor Data: ${JSON.stringify(sensorData)}`);
});

// GET endpoint for frontend polling
app.get('/api/sensor', (req, res) => {
  res.json(latestSensorData);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

