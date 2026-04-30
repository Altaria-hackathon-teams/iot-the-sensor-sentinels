const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// CONFIGURATION
const SERIAL_PORT = 'COM6'; // Change this to your Arduino's COM port (e.g., 'COM3')
const BACKEND_URL = 'http://localhost:4000/api/sensors/data';

console.log('🚀 Sakhi-Agri Bridge Starting...');
console.log(`📡 Monitoring port: ${SERIAL_PORT}`);

const port = new SerialPort({
    path: SERIAL_PORT,
    baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', async (line) => {
    try {
        console.log(`📥 Serial Data: ${line}`);
        
        // Parse the JSON data from Arduino
        const sensorData = JSON.parse(line);
        
        // Send to Backend
        const response = await axios.post(BACKEND_URL, sensorData);
        console.log('📤 Sent to Backend:', response.statusText);
        
    } catch (err) {
        if (err.response) {
            console.error('❌ Backend Error:', err.response.data);
        } else if (err.name === 'SyntaxError') {
            console.log('⚠️ Skipping non-JSON data:', line);
        } else {
            console.error('❌ Error:', err.message);
        }
    }
});

port.on('error', (err) => {
    console.error('❌ Port Error:', err.message);
    process.exit(1);
});

port.on('open', () => {
    console.log('✅ Serial Port Opened Successfully');
});
