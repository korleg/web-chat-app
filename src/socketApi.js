const socketio = require('socket.io');

io = socketio();

const socketApi = {
    io
};

io.on('connection', socket =>{
console.log('User Login');
});

module.exports = socketApi;