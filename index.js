const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});


io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('send-message', (message) => {
        console.log(message);
        socket.broadcast.emit('receive-message', message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

});


server.listen(3010, () => {
    console.log('listening on :3010');
});
