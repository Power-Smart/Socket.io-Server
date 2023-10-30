const express = require('express');
const app = express();
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const FRONTEND = process.env.FRONTEND_SERVER || 'http://localhost:5173';
const BACKEND = process.env.BACKEND_SERVER || 'http://localhost:3002';


const io = new Server(server, {
    cors: {
        origin: [FRONTEND, BACKEND],
    }
});


var users = {};

app.post('/notify', (req, res) => {
    try {
        console.log(req.body);
        const { receiverID } = req.body;
        if (receiverID) {
            io.to(receiverID).emit('receiveNotifications', req.body);
        } else {
            console.log('Receiver not found:', data.receiverID);
        }
        res.status(200).json({ message: 'notification sent' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
    console.log('notifyRoute');
});

io.on('connection', (socket) => {
    console.log('A user connected');
    // console.log(socket);


    socket.on('joinRoom', (roomID) => {
        socket.join(roomID);
        console.log('user joined room', roomID);
    });

    socket.on('sendEvent', (data) => {
        console.log(data);
        const receiverID = data.receiverID;
        if (receiverID) {
            io.to(receiverID).emit('receiveEvent', data);
        } else {
            console.log('Receiver not found:', data.receiverID);
        }
    });

    socket.on('joinNotifications', (data) => {
        socket.join(data.user);
        console.log(data.user, 'joined notifications');
    });

    // Remove the user from the users object when they disconnect
    socket.on('disconnect', () => {
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

module.exports = io;