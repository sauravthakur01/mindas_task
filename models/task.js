const mongoose = require('mongoose');

const Schema = mongoose.Schema

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    status:{
        type: String,
        enum : ['pending','completed'],
        default: 'pending'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Task' , taskSchema)