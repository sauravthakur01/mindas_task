const socketio = require('socket.io');

let io;

let onlineUsers = new Map() ;

module.exports = {
   init: function(server) {
       io = socketio(server);
       
       io.on('connection' , (socket)=>{
        console.log('user is connected ' , socket.id)
        socket.on('addUser' , (id)=>{
            onlineUsers.set(id, socket.id)
        })
       })
       return io;
   },
   getIO: function() {
       if (!io) {
          throw new Error("Can't get io instance before calling .init()");
       }
       return io;
   },
   onlineUsers 
}