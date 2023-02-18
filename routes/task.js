const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task');
const middleware = require('../middleware/auth');

// add own task
router.post('/add-task' , middleware.authentication, taskController.postTask );

// assign task to other
router.post('/assign-task', middleware.authentication, taskController.postAssignTask);

// get task assigned by others
router.get('/assigned-by-other' , middleware.authentication,  taskController.othersTasks)

// get my own task
router.get('/mytasks' , middleware.authentication,  taskController.myTasks)

//get all tasks
router.get('/all' , middleware.authentication,  taskController.getTasks)

//get task by id
router.get('/:id', middleware.authentication, taskController.getTask);

//delete task by id
router.delete('/remove/:id', middleware.authentication, taskController.deleteTask )

// update task by id
router.put('/:id', middleware.authentication, taskController.updateTask);


module.exports = router ;