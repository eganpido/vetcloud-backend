const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    branchId: { type: Number, unique: true }, // Auto-increment gihapon ni
    branchCode: { type: String, required: true },
    branchName: { type: String, required: true },
    branchAddress: { type: String, required: true },
    contactNumber: { type: String },
    isActive: { type: Boolean, default: true },
    createdById: Number,
    createdDateTime: { type: Date, default: Date.now },
    updatedById: Number,
    updatedDateTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Branch', BranchSchema);