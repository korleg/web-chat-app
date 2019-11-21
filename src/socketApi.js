const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
io = socketio();

const socketApi = {
    io
};

//socket authorization
io.use(socketAuthorization);

//redis adapter

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ 
    host: process.env.REDIS_URI, 
    port: process.env.REDIS_PORT 
}));

io.on('connection', socket =>{
console.log('User Login:'+socket.request.user.name + ' ' + socket.request.user.surname);
});

module.exports = socketApi;