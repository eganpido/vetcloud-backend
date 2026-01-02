const express = require('express');
const router = express.Router();
const Customer = require('../models/customer'); // Siguraduha nga sakto ang path sa imong model

// 1. ROUTE PARA MAG-ADD OG CUSTOMER (POST)
router.post('/add', async (req, res) =>
{
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
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
        res.json({ message: "Customer successfully deletedfsdf!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;