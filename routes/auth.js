const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Counter = require('../models/counter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Gamit og usa ka variable para sa Secret Key para dili magkalahi
const JWT_SECRET = 'imong_secret_key_123';

// REGISTER ROUTE
router.post('/register', async (req, res) =>
{
    try {
        const counter = await Counter.findOneAndUpdate(
            { id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            userId: counter.seq,
            username: req.body.username,
            password: hashedPassword,
            fullname: req.body.fullname,
            role: req.body.role
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            message: "User created successfully!",
            userId: savedUser.userId,
            username: savedUser.username
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) =>
{
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        // I-apil ang mahinungdanon nga data sa token
        const token = jwt.sign(
            { id: user._id, userId: user.userId, role: user.role },
            JWT_SECRET, // <--- Importante: Kinahanglan parehas ni sa middleware
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                userId: user.userId,
                username: user.username,
                fullname: user.fullname,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;