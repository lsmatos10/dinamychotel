const express = require('express');
const taskController = require('./controllers/tasksController');

const router = express.Router();

router.get('/tasks', taskController.getAll);

module.exports = router;