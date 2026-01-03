const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Kuhaon ang token gikan sa Header (Authorization: Bearer <token>)
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, 'imong_secret_key_123');
        req.user = decoded; // I-attach ang user info (lakip ang userId) sa request
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};