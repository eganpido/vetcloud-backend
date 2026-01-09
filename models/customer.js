const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    // I-add kini nga field
    customerId: { type: Number },
    code: { type: String, required: true },
    customerName: { type: String, required: true },
    customerAdress: { type: String, required: true },
    contactNumber: String,
    isLocked: { type: Boolean, default: false },
    createdById: Number,
    createdDateTime: { type: Date, default: Date.now },
    updatedById: Number,
    updatedDateTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);