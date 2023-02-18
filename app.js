const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

app.use(bodyParser.json({extended:false}))

app.use(express.json())
app.use(cors());

let server 

mongoose.connect('mongodb+srv://midas:midas@cluster0.araizto.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    server = app.listen(3000 , (req,res)=>{
        console.log('running')
    })
})

const sio = require('./socket/socket')
sio.init(server)

const userRouter = require('./routes/user');
const taskRouter =require('./routes/task');

app.use('/user' , userRouter )
app.use('/task' , taskRouter )
    

