const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
io = socketio();

const socketApi = {
    io
};

//libs
const Users = require('./lib/Users')
const Rooms = require('./lib/Rooms')
const Messages = require('./lib/Messages')


//socket authorization
io.use(socketAuthorization);

//redis adapter

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ 
    host: process.env.REDIS_URI, 
    port: process.env.REDIS_PORT 
}));    
let control=false;
 io.on('connection', socket =>{

    if(control==true)
    {
        console.log("User Login:" + socket.request.user.name + socket.request.user.surname);
        Users.upsert(socket.request.googleId, socket.request.user);

        Users.list(users => {
            io.emit('onlineList', (users));
        });
        Rooms.list(rooms => {
            io.emit('roomList', (rooms));
        });

        socket.on('newMessage', (data) => {
            const messageData = {
                ...data,
                userId: socket.request.user._id,
                username: socket.request.user.name,
                surname: socket.request.user.surname,
            };
            Messages.upsert(messageData);
            socket.broadcast.emit('receiveMessage', messageData);
        });
        
        socket.on('newRoom', (roomName) => {
            console.log(roomName);
        
            Rooms.upsert(roomName);
            
            Rooms.list(rooms => {
                io.emit('roomList', (rooms));
            });
        });
        
        socket.on('disconnect', () => {
            Users.remove(socket.request.user._id)
        
            Users.list(users => {
                io.emit('onlineList', (users));
            });
        });
        control=false;

    }
    else{
        control=  true;
    }
   
});

module.exports = socketApi;

