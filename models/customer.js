const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    code: { type: String, required: true },
    customerName: { type: String, required: true },
    customerAdress: { type: String, required: true },
    contactNumber: String,
    createdById: Number,
    createdDateTime: { type: Date, default: Date.now },
    updatedById: Number,
    updatedDateTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);