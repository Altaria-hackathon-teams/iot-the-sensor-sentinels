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
        
        // The Arduino is currently sending data like: "Soil: 549 | Distance: 9 cm | Flow: 0.00 L/min"
        // We need to parse this string instead of expecting JSON.
        let sensorData;
        if (line.includes('Soil:') && line.includes('Distance:')) {
            const soilMatch = line.match(/Soil:\s*(\d+)/);
            const distMatch = line.match(/Distance:\s*(\d+)/);
            const flowMatch = line.match(/Flow:\s*([\d.]+)/);

            if (soilMatch && distMatch) {
                // Convert raw soil reading (e.g. 549) to percentage. Typically 1023 is dry (0%), 0 is wet (100%)
                const rawSoil = parseInt(soilMatch[1], 10);
                // Simple mapping: 1023 -> 0%, 0 -> 100%
                let soilPercent = 100 - Math.round((rawSoil / 1023) * 100);
                if (soilPercent < 0) soilPercent = 0;
                if (soilPercent > 100) soilPercent = 100;

                sensorData = {
                    soil: soilPercent,
                    distance: parseInt(distMatch[1], 10),
                    flow: flowMatch ? parseFloat(flowMatch[1]) : 0
                };
            } else {
                throw new Error("Could not extract values from string");
            }
        } else if (line.startsWith('{')) {
            // Fallback in case Arduino code is updated to send JSON
            sensorData = JSON.parse(line);
        } else {
            throw new SyntaxError("Not sensor data string");
        }
        
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
