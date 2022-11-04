const tasksModel= require('../models/tasksModel');

const getAll = async (request, response) => {
    const taks = await tasksModel.getAll();
    return response.status(200).json(tasks);
};

module.exports = {
    getAll
}