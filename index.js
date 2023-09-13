const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const server = http.createServer(app);

let socketClientArr = {};

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});


io.on('connection', (socket) => {

    console.log(socket.id);

    socket.on('send-message', (message) => {
        console.log(message);

        const parsedMsg = JSON.stringify(message);

        if(parsedMsg.hasOwnProperty("flag") && parsedMsg.flag === "I"){

            const sId = parsedMsg.senderId.toString();

            socketClientArr.sId = socket.id;
        }else if((parsedMsg.hasOwnProperty("flag") && parsedMsg.flag === "F")){
            
            const rId = parsedMsg.recieverId.toString();

            io.to(rId).emit('recieve-message', parsedMsg.message);

        }

    });

    socket.on('disconnect', () => {
        if(Object.values(socketClientArr).includes(socket.id)){

            Object.keys(socketClientArr).forEach((key, value) => {
                if (socketClientArr[value] === socket.id) {
                    delete socketClientArr[key];
                }
            });
        }
        console.log('user disconnected', socket.id);
    });

});

server.listen(3010, () => {
    console.log('listening on :3010');
});
