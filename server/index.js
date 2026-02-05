/**
 * GumboBall Server
 * Express + Socket.io server for real-time game state management
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const GameState = require('./gameState');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

// Initialize game state
const gameState = new GameState();

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/manager.html'));
});

app.get('/tally', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/tally.html'));
});

app.get('/manager', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/manager.html'));
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current game state to newly connected client
    socket.emit('STATE_UPDATE', gameState.getState());

    // Handle start new game
    socket.on('START_GAME', () => {
        console.log('Starting new game');
        gameState.reset();
        io.emit('STATE_UPDATE', gameState.getState());
    });

    // Handle end game
    socket.on('END_GAME', () => {
        console.log('Ending game');
        gameState.endGame();
        io.emit('STATE_UPDATE', gameState.getState());
    });

    // Handle dice submission
    socket.on('SUBMIT_DICE', (data) => {
        try {
            const { die1, die2 } = data;
            console.log(`Dice submitted: ${die1}, ${die2}`);

            const result = gameState.processDiceRoll(die1, die2);

            // Send confirmation to submitter
            socket.emit('DICE_ACCEPTED', {
                die1,
                die2,
                sum: result.sum,
                rolledSeven: result.rolledSeven
            });

            // Broadcast updated state to all clients
            io.emit('STATE_UPDATE', result.state);

        } catch (error) {
            console.error('Error processing dice:', error.message);
            socket.emit('ERROR', { message: error.message });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`GumboBall server running on port ${PORT}`);
    console.log(`Tally page: http://localhost:${PORT}/tally`);
    console.log(`Manager page: http://localhost:${PORT}/manager`);
});
