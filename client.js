const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

// // when user is logged in and we have the userid 
// socket.emit('addUser' , userId)


// //when we are assigning task to others
// socket.emit('taskAssigned' , emailOfUser)

// ///after the url is hit 
// socket.on('taskReceived' , (data)=>{

// })

// // Listen for the messageUpdated event from the server
// socket.on('messageUpdated', function(task) {

//     var taskEl = document.querySelector(`"${task._id}`);
//     if (taskEl) {
//        taskEl.textContent = task.text;
//     }
//  });

//  socket.on('taskDeleted', function(taskId) {
    
//     var messageEl = document.querySelector(`${taskId}`);
//     if (messageEl) {
//        messageEl.textContent = message.text;
//     }
//  });