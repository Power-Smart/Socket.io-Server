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

    // console.log(socket.id);

    socket.on('send-message', (message) => {
        console.log(message);

        const parsedMsg = message;
        // console.log(parsedMsg);
        const sId = message.senderID+"";
        // console.log("sid", sId);




        if(parsedMsg.hasOwnProperty("flag") && parsedMsg.flag === "I"){
            socketClientArr = {[sId]: socket.id};
            console.log("New client connected\n", sId,"\n", socket.id);
        }else if((parsedMsg.hasOwnProperty("flag") && parsedMsg.flag === "M")){
            
            const rId = parsedMsg.receiverID+"";

            console.log("Reciever ID: ", rId);
            console.log(socketClientArr)

            if(Object.keys(socketClientArr).includes(sId)){
                // io.to(socketClientArr[sId]).emit('recieve-message', parsedMsg.message);
            
                io.to(2).emit('recieve-message', parsedMsg.message);

                // io.emit('recieve-message', "Hello everyone!");
                console.log("Message sent to reciever");
            }else{
                const notSentAlert = {
                    "flag": "N",
                    "senderId": sId,
                    "recieverId": rId,
                    "timestamp": new Date()
                };
                console.log("Reciever not found. msg has not been sent");
                if(Object.values(socketClientArr).includes(socket.id)){
                    io.to(socketClientArr[sId]).emit('recieve-message', notSentAlert);
                }

            }
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
