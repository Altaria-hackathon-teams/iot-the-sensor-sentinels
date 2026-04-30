const axios = require('axios');

const BACKEND_URL = 'http://localhost:4000/api/sensors/data';

console.log('🚀 Sakhi-Agri Data Simulator Starting...');
console.log('📡 Sending random sensor data every 3 seconds...');

function sendRandomData() {
    const data = {
        soil: Math.floor(Math.random() * (80 - 40) + 40), // 40-80%
        distance: Math.floor(Math.random() * (30 - 5) + 5), // 5-30 cm
        flow: (Math.random() * (5 - 1) + 1).toFixed(2), // 1-5 L/min
        temp: Math.floor(Math.random() * (30 - 20) + 20), // 20-30°C
        pH: (Math.random() * (8 - 6) + 6).toFixed(1), // 6.0-8.0
        phosphorus: Math.floor(Math.random() * (60 - 30) + 30), // 30-60 ppm
        nitrogen: Math.floor(Math.random() * (70 - 40) + 40), // 40-70 ppm
        humidity: Math.floor(Math.random() * (90 - 30) + 30), // 30-90%
    };

    axios.post(BACKEND_URL, data)
        .then(res => {
            console.log(`✅ Sent: Soil ${data.soil}%, Temp ${data.temp}°C, pH ${data.pH}, Phos ${data.phosphorus}ppm, Dist ${data.distance}cm | Response: ${res.statusText}`);
        })
        .catch(err => {
            console.error('❌ Error sending data:', err.message);
        });
}

// Send data every 3 seconds
setInterval(sendRandomData, 3000);

// Send initial data
sendRandomData();
