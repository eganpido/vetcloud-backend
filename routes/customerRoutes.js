const express = require('express');
const router = express.Router();
const Customer = require('../models/customer'); // Siguraduha nga sakto ang path sa imong model
const Counter = require('../models/counter');

// 1. ROUTE PARA MAG-ADD OG CUSTOMER (POST)
router.post('/add', async (req, res) =>
{
    try {
        // 1. Kuha og counter
        const counter = await Counter.findOneAndUpdate(
            { id: 'customerId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        console.log("Next ID is:", counter.seq);

        // 2. Isagol ang customerId sa data gikan sa req.body
        const newCustomer = new Customer({
            ...req.body,
            customerId: counter.seq
        });

        // 3. I-save
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);

    } catch (err) {
        console.error("SAVE ERROR:", err.message); // Makita nimo sa terminal ang rason sa failure
        res.status(400).json({ message: err.message });
    }
});

// 2. ROUTE PARA MAKUHA ANG TANANG CUSTOMERS (GET)
router.get('/all', async (req, res) =>
{
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. ROUTE PARA MAG-UPDATE OG CUSTOMER (PUT)
router.put('/update/:id', async (req, res) =>
{
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Para i-return ang updated nga data imbes nga ang karaan
        );
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. ROUTE PARA MAG-DELETE OG CUSTOMER (DELETE)
router.delete('/delete/:id', async (req, res) =>
{
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer successfully deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/migrate-ids', async (req, res) =>
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

module.exports = router;