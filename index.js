const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


const users = [];
io.on('connection', (socket) => {
    // console.log(`user connected: #${socket.id}`);   

    socket.on('join', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('joined', username);
    })


    socket.on('send', (username, message) => {
        socket.broadcast.emit('recive', username, message);
    })

    socket.on('disconnect', (message) => {
        socket.broadcast.emit('left', users[socket.id]);
    })
})

server.listen(port, () => console.log(`my stupid code listening on ${port}`));