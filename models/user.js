const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true }, // Auto-increment ID
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'staff' },
    createdDateTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);