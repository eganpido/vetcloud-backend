const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. I-IMPORT ANG MGA ROUTE FILES
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/auth'); // Gidugang kini para sa User/Auth

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 2. I-USE ANG MGA ROUTES
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes); // Gidugang kini para sa /api/auth/register ug /api/auth/login

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vetcloud_db')
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Error connecting to DB:", err));

// Sample Route
app.get('/', (req, res) =>
{
    res.send("VETCloud API is running...");
});

// Port (Hinumdomi: 5000 ang imong gamit)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));