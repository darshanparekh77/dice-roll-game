const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use('/api/auth', authRoutes); // Auth routes

// Set up Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for simplicity; adjust as necessary
        methods: ['GET', 'POST'],
    },
});

// Game logic
const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', ({ username }) => {
        users[socket.id] = username;
        io.emit('updatePlayers', users);
    });

    socket.on('startGame', (opponentId) => {
        io.to(opponentId).emit('gameStart', { opponent: users[socket.id] });
    });

    socket.on('rollDice', () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        socket.emit('diceRoll', roll);
        socket.broadcast.emit('opponentRoll', roll);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete users[socket.id];
        io.emit('updatePlayers', users);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});