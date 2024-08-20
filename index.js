const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'frontend')));

const buddies = new Set();

io.on('connection', (socket) => {
    socket.on('login', (user) => {
        buddies.add(user.nickname);
        io.emit('update buddies', Array.from(buddies));
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        // Remove the user from buddies list (you'll need to store the user's nickname on connection)
        buddies.delete(socket.nickname);
        io.emit('update buddies', Array.from(buddies));
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
