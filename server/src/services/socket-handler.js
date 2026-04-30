const WebSocket = require('ws');

let wss;
let clients = new Set();

/**
 * Initializes the WebSocket server and attaches it to the existing HTTP server.
 * @param {http.Server} server - The HTTP server instance.
 */
function initWebSocket(server) {
    wss = new WebSocket.Server({ server });

    console.log('🔌 WebSocket Server initialized');

    wss.on('connection', (ws) => {
        console.log('✅ New hardware/client connected');
        clients.add(ws);

        ws.send(JSON.stringify({ type: 'STATUS', message: 'CONNECTED_TO_SAKHI_GATEWAY' }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                console.log('📥 Received data:', data);

                // If data comes from hardware, broadcast it to all other clients (like Next.js)
                broadcast(data, ws);
            } catch (err) {
                console.error('❌ Error parsing WebSocket message:', err.message);
            }
        });

        ws.on('close', () => {
            console.log('❌ Connection closed');
            clients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
            clients.delete(ws);
        });
    });
}

/**
 * Broadcasts data to all connected clients.
 * @param {Object} data - The data to broadcast.
 * @param {WebSocket} sender - The client who sent the data (optional).
 */
function broadcast(data, sender = null) {
    if (!wss) return;

    const payload = JSON.stringify(data);
    clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

module.exports = {
    initWebSocket,
    broadcast
};
