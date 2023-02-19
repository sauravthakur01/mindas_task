const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task');
const middleware = require('../middleware/auth');

// add own task
router.post('/add-task' , middleware.authentication, taskController.postTask );

// assign task to other
router.post('/assign-task', middleware.authentication, taskController.postAssignTask);

//get tasks by changing query to all,my,others byDefault it is set to all
router.get('/all' , middleware.authentication,  taskController.getTasks)

//get task by id
router.get('/:id', middleware.authentication, taskController.getTask);

//delete task by id
router.delete('/remove/:id', middleware.authentication, taskController.deleteTask )

// update task by id
router.put('/:id', middleware.authentication, taskController.updateTask);


module.exports = router ;