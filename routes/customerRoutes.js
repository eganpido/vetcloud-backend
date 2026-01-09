const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Counter = require('../models/counter');
const auth = require('../middleware/auth');

// 1. ROUTE PARA MAG-ADD OG CUSTOMER
router.post('/save', auth, async (req, res) =>
{
    try {
        const counter = await Counter.findOneAndUpdate(
            { id: 'customerId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newCustomer = new Customer({
            ...req.body,
            customerId: counter.seq,
            createdById: req.user.userId,
            isLocked: false // Sigurohon nato nga false ang default sa bag-o
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        console.error("SAVE ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// Lock Record
router.put('/lock/:customerId', auth, async (req, res) =>
{
    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId: req.params.customerId }, // Pangitaa pinaagi sa imong custom customerId
            { $set: { isLocked: true } },
            { new: true } // I-return ang updated nga data
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(updatedCustomer);
    } catch (err) {
        console.error("LOCK ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Unlock Record
router.put('/unlock/:customerId', auth, async (req, res) =>
{
    try {
        const unlocked = await Customer.findOneAndUpdate(
            { customerId: req.params.customerId }, // Pangitaon niya ang record gamit ang 'customerId' field
            { $set: { isLocked: false } },
            { new: true }
        );

        if (!unlocked) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(unlocked);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. ROUTE PARA MAKUHA ANG TANANG CUSTOMERS
router.get('/all', auth, async (req, res) =>
{
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. ROUTE PARA MAG-UPDATE OG CUSTOMER
router.put('/update/:customerId', auth, async (req, res) =>
{
    try {
        const updateData = {
            ...req.body,
            updatedById: req.user.userId,
            updatedDateTime: Date.now()
        };

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. ROUTE PARA MAG-DELETE
router.delete('/delete/:customerId', auth, async (req, res) =>
{
    try {
        const id = req.params.customerId;

        // findOneAndDelete ang gamiton kay "customerId" (custom field) man ang atong pangitaon
        const deletedCustomer = await Customer.findOneAndDelete({
            customerId: Number(id) // Importante: I-convert ang string ngadto sa Number
        });

        if (!deletedCustomer) {
            console.log(`Customer with Id ${id} not found.`);
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer successfully deleted!" });
    } catch (err) {
        console.error("DELETE ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// 5. STATS ENDPOINT
router.get('/stats', auth, async (req, res) =>
{
    try {
        const totalCustomers = await Customer.countDocuments({});
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCount = await Customer.countDocuments({
            createdDateTime: { $gte: today }
        });

        res.json({
            totalCustomers: totalCustomers,
            todayCount: todayCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;