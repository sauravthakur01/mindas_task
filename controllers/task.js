const Task = require('../models/task');
const User = require('../models/user')

const io = require('../socket/socket').getIO()
const onlineUsers = require('../socket/socket') ;

exports.postTask  =  async (req,res,next)=>{
    const {title, description, dueDate} = req.body ;
    try {
        if(!title || !description || !dueDate){
            return res.status(400).json({message:'add all fields'})
        }

        const data = await Task.create({title, description, dueDate , userId:req.user._id , createdBy:req.user._id })

        // io.emit('taskCreated', data);
        return res.status(201).json({data ,  message:'sucessfully added Task'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

exports.postAssignTask  =  async (req,res,next)=>{
    const {title, description, dueDate , email} = req.body ;

    try {
        if(!title || !description || !dueDate || !email){
            return res.status(400).json({message:'add all fields'})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:'unable to find User'})
        }
        const data = await Task.create({title, description, dueDate , userId:user._id , createdBy:req.user._id})
        
        io.on('taskAssigned' , (email) =>{
            const senderSocket = getSocketIdByEmailId(email)

            if (senderSocket) {
                io.to(senderSocket).emit('taskReceived', data);
              }
        })
        res.status(201).json({data ,  message:'sucessfully added Task'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

async function getSocketIdByEmailId(emailId) {
    
    const user = await User.findOne({email});
    if(!user){
        return null
    }
    return onlineUsers.get(user._id)
}


exports.getTasks = async(req,res,next)=>{

    let page = req.query.pageno || 1
    let limit_items = +(req.query.itemsPerPage) || 5 ;
    
    let getTaskType = req.query.task || "all"

    let totalItems 

    try {
        const { dueDate, status, sort } = req.query;

        // Build the filter object based on the query parameters
        const filters = {};
        if (dueDate) {
          filters.dueDate = new Date(dueDate);
        }
        if (status) {
          filters.status = status;
        }

        const sortOptions = {};
        if (sort === "asc") {
            sortOptions.dueDate = 1;
        } else{
            sortOptions.dueDate = -1;
        }

        let data

        if(getTaskType == "all"){
            
        let count = await Task.find({ ...filters , userId:req.user._id}).count()
        totalItems = count ; 

        data = await Task.find({ ...filters , userId: req.user._id}).sort(sortOptions).skip((page-1)*limit_items).limit(limit_items)
        }
        else if(getTaskType == "others"){
        
            let count = await Task.find({ ...filters, userId:req.user._id , createdBy: { $ne: req.user._id }}).count()
        totalItems = count ; 

        data = await Task.find({  ...filters, userId:req.user._id , createdBy: { $ne: req.user._id }}).sort(sortOptions).skip((page-1)*limit_items).limit(limit_items)
        }
        else if(getTaskType == "my"){
        
        let count = await Task.find({ ...filters , userId:req.user._id , createdBy:req.user._id }).count()
        totalItems = count ; 

        data = await Task.find({ ...filters , userId:req.user._id , createdBy:req.user._id }).sort(sortOptions).skip((page-1)*limit_items).limit(limit_items)
        }

        res.status(200).json({data ,
            info: {
              currentPage: page,
              hasNextPage: totalItems > page * limit_items,
              hasPreviousPage: page > 1,
              nextPage: +page + 1,
              previousPage: +page - 1,
              lastPage: Math.ceil(totalItems / limit_items),
            }})
    } catch (error) {
        res.status(500).json({message:error})
    }
    
}


exports.getTask = async(req,res,next)=>{

    try {
        const { id } = req.params
        const task = await Task.findById(id)
        
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
          } 
          res.status(200).json(task )
    } catch (error) {
        res.status(500).json({message:error})
    }
    
}

exports.updateTask = async(req,res,next)=>{
    try {
        const taskId = req.params.id ;
        let task = await Task.findById(taskId)
        if(!task){
            return res.status(404).json({message:'Task not found'})
        }

        Task.findByIdAndUpdate(taskId, req.body, { new: true }, (err, task) => {
            if (err) {
            return res.status(500).json({ error: err.message });
            } 
            if (!task) {
            return res.status(404).json({ error: 'Task not found' });
            }

            // if(task.createdBy == req.user._id || task.userId == req.user._id){
            //     let socketId = getSocketById(task.userId)
            //     io.to(socketId).emit('messageUpdated', task);
            // }

            return res.status(200).json(task);
        })

        
    } catch (error) {
        res.status(500).json({message:error})
    }
}

exports.deleteTask = async(req,res,next)=>{
    try {
        const TaskId = req.params.id ;

        let Task = await Task.findById(TaskId)
      
        if(!Task){
            return res.status(404).json({message:'Task not found'})
        }
        if(Task.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json("Not Allowed");
        }
        
       
            // let socketId = getSocketById(task.userId)
            // io.to(socketId).emit('taskDeleted', TaskId);
        
        await Task.findByIdAndRemove(TaskId)
        
        res.status(200).json({message:'deleted sucessfully'})
        
    } catch (error) {
        res.status(500).json({message:error})
    }
}

async function getSocketById(id){
    return onlineUsers.get(id)
}