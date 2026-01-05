const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Counter = require('../models/counter');
const auth = require('../middleware/auth'); // I-import ang auth middleware nga imong gihimo

// 1. ROUTE PARA MAG-ADD OG CUSTOMER (Gidugangan og 'auth')
router.post('/add', auth, async (req, res) =>
{
    try {
        // 1. Kuha og sequence para sa customerId
        const counter = await Counter.findOneAndUpdate(
            { id: 'customerId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // 2. Isagol ang customerId ug ang createdById gikan sa token
        const newCustomer = new Customer({
            ...req.body,
            customerId: counter.seq,
            createdById: req.user.userId // Ang userId nakuha nato gikan sa decoded token
        });

        // 3. I-save sa database
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);

    } catch (err) {
        console.error("SAVE ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// 2. ROUTE PARA MAKUHA ANG TANANG CUSTOMERS (Gidugangan og 'auth')
router.get('/all', auth, async (req, res) =>
{
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. ROUTE PARA MAG-UPDATE OG CUSTOMER (Gidugangan og 'auth')
router.put('/update/:id', auth, async (req, res) =>
{
    try {
        // I-attach nato ang updatedById para mahibaloan kinsa ang last nag-edit
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

// 4. ROUTE PARA MAG-DELETE (Gidugangan og 'auth')
router.delete('/delete/:id', auth, async (req, res) =>
{
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer successfully deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// MIGRATION (Temporaryo gihapon, pwede nimo butangan og 'auth' para Admin ra maka-run)
router.get('/migrate-ids', auth, async (req, res) =>
{
    try {
        const customers = await Customer.find({ customerId: { $exists: false } });
        let lastCounter = await Counter.findOne({ id: 'customerId' });
        let currentSeq = lastCounter ? lastCounter.seq : 0;

        for (let cust of customers) {
            currentSeq++;
            cust.customerId = currentSeq;
            await cust.save();
        }

        await Counter.findOneAndUpdate(
            { id: 'customerId' },
            { seq: currentSeq },
            { upsert: true }
        );

        res.json({ message: "Migration successful!", count: customers.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint para sa Dashboard Statistics
router.get('/stats', auth, async (req, res) =>
{
    try {
        // 1. Total Customers - Ihap sa tanan nga anaa sa 'customers' table
        const totalCustomers = await Customer.countDocuments({});

        // 2. New Customers Today - Ihap sa tanan nga na-add karong adlawa (global)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Sugod sa 12:00 AM karong adlawa

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