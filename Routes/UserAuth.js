const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../Models/User');
const Task = require('../Models/Task');
const router = express.Router();


router.post('/register', async (req, res) => {
const {email,username,password} = req.body
// console.log(req.body)

try {
    const existinguser = await User.findOne({ email });
    console.log(existinguser);
    if(existinguser) {
       return res.status(400).json({ message: 'User already exists' });
     }
    const hashedpass = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        username,
        password: hashedpass
    });
    await newUser.save();
    const token = jwt.sign(
        { userId: newUser._id },
        'your_jwt_secret',
        { expiresIn: '1h' }
    );
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1 hour
    });
    console.log(token);
    console.log('new user register', newUser);
    res.redirect('/');
} catch (error) {
    res.status(500).json({ message: 'Server error', error: err.message });
}

})

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(400).json({ message: 'User not found' });
        } else {
            console.log(`User found: ${user.username} (ID: ${user._id})`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Invalid password attempt for user: ${user.username} (ID: ${user._id})`);
            return res.status(400).json({ message: 'Invalid credentials' });
        } else {
            console.log(`Password matched for user: ${user.username} (ID: ${user._id})`);
        }

        const token = jwt.sign(
            { userId: user._id },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        console.log(`JWT token generated for user: ${user.username} (ID: ${user._id})`);
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})
router.post('/logout',(req,res)=>{
    res.clearCookie('token');
    console.log('User logged out and token cleared');
    res.redirect('/login');
})

module.exports = router;