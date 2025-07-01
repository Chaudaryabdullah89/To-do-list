const mongoose = require('mongoose');
const express = require('express');
const Task = require('../Models/Task');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


Router.use(cookieParser());


function isAuthenticated(req, res, next) {
    // Use cookie-parser to access cookies
    const token = req.cookies && req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'User not authenticated: token missing' });
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = { _id: decoded.userId };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'User not authenticated: invalid token' });
    }
}

Router.post('/createtask', isAuthenticated, async (req, res) => {
    const { task ,description } = req.body;
    console.log(req.body);

    
    const userId = req.user._id;

    try {
        const newTask = new Task({
            title: task,
            userId: userId,
            description: description,
        });
        await newTask.save();
        console.log('New task created:', newTask);
        res.redirect('/');
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

Router.post('/status', isAuthenticated, async (req, res) => {
    let { taskId, status } = req.body;
    
    if (Array.isArray(status)) {
        status = status[status.length - 1];
    }
    try {
        await Task.findByIdAndUpdate(taskId, { status: status });
        res.redirect('/');
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

Router.get('/status', isAuthenticated, async (req, res) => {
    const { taskId } = req.query;
    if (!taskId) {
        return res.status(400).json({ message: 'taskId query parameter is required' });
    }
    try {
        const task = await Task.findOne({ _id: taskId, userId: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.redirect('/');
        console.log('Task status updated:', task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

Router.post('/edittask',async (req, res) => {
    console.log(req.body)

    const oldtask = await Task.findByIdAndUpdate(req.body.taskId, {title :req.body.title})
    // let userid = req.body.userId;
    // console.log('User ID:', userid);
    // let newtask = new Task({
    //     title: req.body.title,
    //     status: req.body.status,
    //     userId: userid,
    // })
    // newtask.save().then(() => {
    //     console.log('Task updated successfully');
    // }).catch((err) => {
    //     console.error('Error updating task:', err.message);
    // });
        
    res.redirect('/');
})

Router.post('/delect', isAuthenticated, async (req, res) => {
    const { taskId } = req.body;
    if (!taskId) {
        return res.status(400).json({ message: 'taskId is required' });
    }
    try {
        await Task.findByIdAndDelete(taskId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = Router;