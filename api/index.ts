const express = require('express');
const { Noco } = require("nocodb");
const http = require('http'); // Required for creating HTTP server
const { Server } = require("socket.io"); // Socket.IO
const { Pool } = require('pg'); // PostgreSQL connection pool

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Attach Socket.IO to the HTTP server

(async () => {
    try {
        const port = process.env.PORT || 8080; // Define the port to use

        // Set up PostgreSQL connection
        const pool = new Pool({
           // connectionString: process.env.DATABASE_URL, // Ensure this includes sslmode=require
            connectionString: 'postgresql://default:FZ0qtf4AwaDH@ep-blue-violet-a4jl22ki.us-east-1.aws.neon.tech:5432/verceldb?sslmode=prefer',

            ssl: {
                rejectUnauthorized: false // This should be set according to your SSL cert status
            }
        });

        // Attempt to initialize NocoDB with the provided database connection
        const noco = await Noco.init({
            config: {
                dbs: [{
                    type: 'pg',
                    name: 'vercelPg',
                    client: pool // Assuming NocoDB can accept a client directly; check documentation or support for confirmation
                }]
            }
        }, null, app);

        app.use(noco);

        // Optionally add more routes or middleware if needed
        app.get('/api', (req, res) => res.send('API Endpoint works!'));

        // Handle Socket.IO connections
        io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        // Start the HTTP and WebSocket server
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (e) {
        console.error('Failed to start the server:', e);
    }
})();
