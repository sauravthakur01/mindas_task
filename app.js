const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
const sio = require('./socket/socket')

app.use(bodyParser.json({extended:false}))

app.use(express.json())
app.use(cors());


mongoose.connect('mongodb+srv://midas:midas@cluster0.araizto.mongodb.net/?retryWrites=true&w=majority')

let server = app.listen(3000 , (req,res)=>{
    console.log('running')
})

sio.init(server)

const userRouter = require('./routes/user');
const taskRouter =require('./routes/task');

app.use(function(err, req, res, next) {
 
     return res.send(err)
    
 });
app.use('/user' , userRouter )
app.use('/task' , taskRouter )
    

