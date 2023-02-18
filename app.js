const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
const socketIo = require('socket.io');
const http = require('http')

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user has connected');
});

const userRouter = require('./routes/user');
const taskRouter =require('./routes/task');

app.use(express.json())
app.use(cors());

app.use(bodyParser.json({extended:false}))

app.use('/user' , userRouter )
app.use('/task' , taskRouter )
    
mongoose.connect('mongodb+srv://midas:midas@cluster0.araizto.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    app.listen(3000 , (req,res)=>{
        console.log('running')
    })
})
