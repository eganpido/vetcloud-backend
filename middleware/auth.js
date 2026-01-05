const jwt = require('jsonwebtoken');

module.exports = function (req, res, next)
{
    // 1. Kuhaon ang Authorization header
    const authHeader = req.header('Authorization');
    const branchId = req.header('x-branch-id');

    // 2. I-check kon naay token
    if (!authHeader) {
        return res.status(401).json({ message: "No token, denied" });
    }

    // 3. Siguroha nga makuha ang token bisan naay "Bearer " prefix
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    try {
        // 4. IMPORTANT: Kinahanglan parehas ni sa secret key sa imong login route
        // Sa imong auth route, 'imong_secret_key_123' ang imong gigamit
        const secret = process.env.JWT_SECRET || 'imong_secret_key_123';

        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        req.branchId = branchId; // I-attach ang branchId para sa database queries

        next();
    } catch (err) {
        console.error("JWT Auth Error:", err.message);
        res.status(401).json({ message: "Token invalid or expired" });
    }
};