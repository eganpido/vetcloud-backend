const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. I-IMPORT ANG IMONG ROUTE FILE (ADDED THIS)
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 2. I-USE ANG ROUTE (ADDED THIS)
// Ang tanang URL sa customer magsugod na sa /api/customers
app.use('/api/customers', customerRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vetcloud_db')
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Error connecting to DB:", err));

// Sample Route
app.get('/', (req, res) => {
    res.send("VETCloud API is running...");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));