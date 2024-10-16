const express = require('express');
const connectDB = require('../db');
const dataRoute = require('../routes/dataroutes');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
let users = []; 

// Use the MongoDB connection for all requests
let mongoClient;

connectDB().then(({ client, db }) => {
    mongoClient = client; // Store the client for later use
    console.log('Connected to MongoDB');

    app.use("/", dataRoute(io, db)); // Pass the `io` instance and `db` here

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Fetch users when a new user connects
        fetchAndEmitUsers(db);
        
        // Optional: Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    // Start server
    server.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Fetch users from the database and emit to clients
async function fetchAndEmitUsers(db) {
    try {
        const users = await db.collection('yourCollectionName').find({}).toArray();
        io.emit('userListUpdate', users.map(user => ({
            firstName: user.firstName,
            email: user.email,
            socketID: user.socketId // Ensure socketId is stored in the database
        })));
    } catch (err) {
        console.error('Error fetching user list:', err);
    }
}
