const WebSocket = require('ws');

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8080 }); // Use any available port

// Event listener for WebSocket connection
wss.on('connection', function connection(ws) {
    console.log('New client connected.');

    // Event listener for incoming messages
    ws.on('message', function incoming(message) {
        console.log('Received message:', message);

        // Broadcast the received message to all clients except the sender
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
