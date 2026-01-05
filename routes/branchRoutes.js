const express = require('express');
const router = express.Router();
const Branch = require('../models/branch');
const Counter = require('../models/counter');
const auth = require('../middleware/auth'); // Magsiguro nga logged-in ang user

// 1. ADD NEW BRANCH (POST)
router.post('/add', auth, async (req, res) =>
{
    try {
        // Kuha og sunod nga sequence para sa branchId
        const counter = await Counter.findOneAndUpdate(
            { id: 'branchId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newBranch = new Branch({
            ...req.body,
            branchId: counter.seq,
            createdById: req.user.userId // Nakuha gikan sa JWT token via auth middleware
        });

        const savedBranch = await newBranch.save();
        res.status(201).json(savedBranch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. GET ALL BRANCHES (GET)
router.get('/all', async (req, res) =>
{
    try {
        const branches = await Branch.find({ isActive: true });
        res.json(branches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. UPDATE BRANCH (PUT)
router.put('/update/:id', auth, async (req, res) =>
{
    try {
        const updateData = {
            ...req.body,
            updatedById: req.user.userId,
            updatedDateTime: Date.now()
        };

        const updatedBranch = await Branch.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.json(updatedBranch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. DELETE/DEACTIVATE BRANCH (DELETE)
// Kasagaran sa business logic, dili nato i-delete gyud, i-deactivate ra (isActive: false)
router.delete('/delete/:id', auth, async (req, res) =>
{
    try {
        await Branch.findByIdAndDelete(req.params.id);
        res.json({ message: "Branch successfully deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;