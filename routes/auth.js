const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Counter = require('../models/counter'); // Gamita ang parehas nga counter model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER ROUTE
router.post('/register', async (req, res) =>
{
    try {
        // 1. Kuha og UserId sequence
        const counter = await Counter.findOneAndUpdate(
            { id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // 2. I-hash ang password (security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 3. I-save ang User uban ang userId
        const newUser = new User({
            userId: counter.seq,
            username: req.body.username,
            password: hashedPassword,
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
        // 1. Pangitaon ang user base sa username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        // 2. I-compare ang gi-type nga password sa encrypted password sa DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        // 3. Kon match, paghimo og JWT Token
        // I-apil nato ang userId ug role sa sulod sa token
        const token = jwt.sign(
            { id: user._id, userId: user.userId, role: user.role },
            'imong_secret_key_123', // Usba ni og mas secure nga string puhon
            { expiresIn: '8h' } // Mo-expire ang login human sa 8 ka oras
        );

        // 4. I-send balik sa Frontend ang token ug user info
        res.json({
            token,
            user: {
                userId: user.userId,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;