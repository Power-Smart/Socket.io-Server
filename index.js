const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

var users = {}; // Use an object to store user data

io.on('connection', (socket) => {
    console.log('A user connected');


    // socket.on('', (userID) => {
    //     users[userID] = socket.id;
    // });

    socket.on('joinRoom', (roomID) => {
        socket.join(roomID);
        console.log('user joined room', roomID);
    });

    socket.on('sendEvent', (data) => {
        console.log(data);
        // users[data.senderID] = socket.id;
        const receiverID = data.receiverID;
        if (receiverID) {
            io.to(receiverID).emit('receiveEvent', data);
        } else {
            console.log('Receiver not found:', data.receiverID);
        }
    });

    socket.on('disconnect', () => {
        // Remove the user from the users object when they disconnect
        for (const userID in users) {
            if (users[userID] === socket.id) {
                delete users[userID];
                break;
            }
        }
        console.log('user disconnected', socket.id);
    });
});

server.listen(3010, () => {
    console.log('listening on :3010');
});
